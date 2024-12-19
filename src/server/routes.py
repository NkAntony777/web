from flask import request, jsonify, send_file
import os
from services.style_transfer import process_style_transfer
from services.file_service import allowed_file, serve_file
from config import MODEL_PATHS, OUTPUT_FOLDER
from werkzeug.utils import secure_filename

def register_routes(app):
    @app.route('/style-transfer', methods=['POST'])
    def style_transfer():
        try:
            # Validate request
            if 'file' not in request.files:
                return jsonify({'error': 'No file provided'}), 400
            
            if 'style_model' not in request.form:
                return jsonify({'error': 'No style model specified'}), 400
            
            file = request.files['file']
            style_name = request.form['style_model']
            
            if file.filename == '':
                return jsonify({'error': 'No file selected'}), 400
            
            # Process the style transfer
            result = process_style_transfer(file, style_name)
            return jsonify(result)
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    @app.route('/outputs/<path:filename>')
    def serve_output(filename):
        """Serve processed files"""
        return serve_file(filename)

    @app.route('/styles', methods=['GET'])
    def get_available_styles():
        """Return list of available style models"""
        return jsonify({
            'styles': list(MODEL_PATHS.keys())
        })