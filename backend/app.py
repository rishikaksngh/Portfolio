from flask import Flask, jsonify
from flask_cors import CORS
from routes.contact import contact_bp
from routes.upload import upload_bp
from routes.editor import editor_bp

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(contact_bp)
app.register_blueprint(upload_bp)
app.register_blueprint(editor_bp)


@app.route('/')
def index():
    """API health check endpoint."""
    return jsonify({
        'status': 'API is running',
        'endpoints': {
            'GET /': 'API status',
            'POST /contact': 'Submit contact form',
            'POST /upload-profile': 'Update profile photo',
            'POST /save-content': 'Persist portfolio changes'
        }
    })


if __name__ == '__main__':
    app.run(debug=True, port=5001)
