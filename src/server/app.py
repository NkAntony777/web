from flask import Flask
from flask_cors import CORS
from routes import register_routes
from config import UPLOAD_FOLDER, OUTPUT_FOLDER
import os

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Configure maximum content length for file uploads (50MB)
    app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024
    
    # Register routes
    register_routes(app)
    
    # Ensure required directories exist
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)