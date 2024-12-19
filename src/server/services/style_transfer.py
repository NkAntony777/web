import torch
from torchvision.utils import save_image
from PIL import Image
import cv2
import os
from models import TransformerNet
from utils import style_transform, denormalize, deprocess, extract_frames, save_video
from config import MODEL_PATHS, OUTPUT_FOLDER, UPLOAD_FOLDER
from werkzeug.utils import secure_filename
from .file_service import allowed_file

# Setup device and models cache
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
models_cache = {}

def load_model(style_name):
    """Load and cache the model for the given style"""
    if style_name not in MODEL_PATHS:
        raise ValueError(f"Unknown style: {style_name}")
    
    model_path = MODEL_PATHS[style_name]
    if model_path not in models_cache:
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found: {model_path}")
        
        transformer = TransformerNet().to(device)
        transformer.load_state_dict(torch.load(model_path, map_location=device))
        transformer.eval()
        models_cache[model_path] = transformer
    
    return models_cache[model_path]

def process_image(image_path, transformer):
    """Process a single image with the style transfer model"""
    # Load and transform image
    image = Image.open(image_path)
    transform = style_transform()
    image_tensor = transform(image).unsqueeze(0).to(device)
    
    # Apply style transfer
    with torch.no_grad():
        stylized_tensor = transformer(image_tensor)
    
    return denormalize(stylized_tensor.cpu())[0]

def process_video(video_path, transformer):
    """Process a video with the style transfer model"""
    stylized_frames = []
    
    # Get video properties
    cap = cv2.VideoCapture(video_path)
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    frame_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    cap.release()
    
    # Process each frame
    for frame in extract_frames(video_path):
        transform = style_transform()
        frame_tensor = transform(frame).unsqueeze(0).to(device)
        
        with torch.no_grad():
            stylized_tensor = transformer(frame_tensor)
        
        stylized_frames.append(deprocess(stylized_tensor))
    
    return stylized_frames, fps, (frame_width, frame_height)

def process_style_transfer(file, style_name):
    """Main function to handle style transfer processing"""
    # Determine file type and validate
    is_video = file.filename.lower().endswith(('.mp4', '.avi', '.mov'))
    allowed_extensions = {'mp4', 'avi', 'mov'} if is_video else {'png', 'jpg', 'jpeg'}
    
    if not allowed_file(file.filename, allowed_extensions):
        raise ValueError('File type not allowed')
    
    # Save uploaded file
    filename = secure_filename(file.filename)
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    file.save(file_path)
    
    try:
        # Load model
        transformer = load_model(style_name)
        
        # Process file based on type
        output_filename = f"stylized_{filename}"
        output_path = os.path.join(OUTPUT_FOLDER, output_filename)
        
        if is_video:
            # Process video
            stylized_frames, fps, (width, height) = process_video(file_path, transformer)
            save_video(stylized_frames, output_path, fps, (width, height))
        else:
            # Process image
            stylized_tensor = process_image(file_path, transformer)
            save_image(stylized_tensor, output_path)
        
        return {
            'success': True,
            'url': f'/outputs/{output_filename}',
            'media_type': 'video' if is_video else 'image'
        }
        
    finally:
        # Clean up uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)