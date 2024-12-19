import os

# Base paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SERVER_DIR = os.path.join(BASE_DIR, 'src', 'server')

# Directory paths
MODELS_DIR = os.path.join(SERVER_DIR, 'models')
UPLOAD_FOLDER = os.path.join(SERVER_DIR, 'uploads')
OUTPUT_FOLDER = os.path.join(SERVER_DIR, 'outputs')

# Create necessary directories
os.makedirs(MODELS_DIR, exist_ok=True)
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

# Model paths
MODEL_PATHS = {
    'cuphead_10000.pth': os.path.join(MODELS_DIR, 'cuphead_10000.pth'),
    'starry_night_10000.pth': os.path.join(MODELS_DIR, 'starry_night_10000.pth'),
    'mosaic_10000.pth': os.path.join(MODELS_DIR, 'mosaic_10000.pth'),
}