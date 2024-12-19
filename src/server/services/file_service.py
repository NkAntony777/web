from flask import send_file, jsonify
import os
from config import OUTPUT_FOLDER

def allowed_file(filename, allowed_extensions):
    """Check if the file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def serve_file(filename):
    """Serve a file from the outputs directory"""
    try:
        return send_file(
            os.path.join(OUTPUT_FOLDER, filename),
            as_attachment=True
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 404