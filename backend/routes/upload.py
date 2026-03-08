import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename

upload_bp = Blueprint('upload', __name__)

# Define the path to the frontend public directory
# Assuming the backend is in /backend and frontend is in /frontend
FRONTEND_PUBLIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../frontend/public'))
PROFILE_IMAGE_PATH = os.path.join(FRONTEND_PUBLIC_DIR, 'profile.jpg')

@upload_bp.route('/upload-profile', methods=['POST'])
def upload_profile():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        # We always name it profile.jpg to replace the existing one
        # Ensure the directory exists
        os.makedirs(FRONTEND_PUBLIC_DIR, exist_ok=True)
        
        file.save(PROFILE_IMAGE_PATH)
        return jsonify({
            'message': 'Profile photo updated successfully',
            'path': '/profile.jpg'
        }), 200
    
    return jsonify({'error': 'Upload failed'}), 500
