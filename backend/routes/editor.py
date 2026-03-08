import os
from flask import Blueprint, request, jsonify

editor_bp = Blueprint('editor', __name__)

# Define the path to the frontend data directory
FRONTEND_DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../frontend/src/data'))
FRONTEND_SRC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../frontend/src'))

@editor_bp.route('/save-content', methods=['POST'])
def save_content():
    data = request.json
    filename = data.get('filename') # e.g., 'Hero.jsx' or 'data/projects.js'
    content = data.get('content')
    
    if not filename or content is None:
        return jsonify({'error': 'Missing filename or content'}), 400
    
    # Security: only allow saving within the frontend/src directory
    target_path = os.path.abspath(os.path.join(FRONTEND_SRC_DIR, filename))
    if not target_path.startswith(FRONTEND_SRC_DIR):
        return jsonify({'error': 'Invalid path'}), 403
    
    try:
        os.makedirs(os.path.dirname(target_path), exist_ok=True)
        with open(target_path, 'w') as f:
            f.write(content)
        return jsonify({'message': f'Saved {filename} successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
