from dotenv import load_dotenv
import os

# Load .env file before anything else accesses env vars
load_dotenv()

from flask import Flask, jsonify
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from routes.contact import contact_bp
from routes.editor import editor_bp
from routes.upload import upload_bp

app = Flask(__name__)

# Allow requests from the Next.js frontend
CORS(
    app,
    origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
    ],
)

# Global rate limiter — individual routes can override
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["200 per day", "60 per hour"],
    storage_uri="memory://",
)

# Register blueprints
app.register_blueprint(contact_bp)
app.register_blueprint(upload_bp)
app.register_blueprint(editor_bp)


@app.route("/")
def index():
    """API health check endpoint."""
    return jsonify(
        {
            "status": "API is running",
            "endpoints": {
                "GET /": "API status",
                "POST /api/contact": "Submit contact form (preferred)",
                "POST /contact": "Submit contact form (backwards compatible)",
                "POST /upload-profile": "Update profile photo",
                "POST /save-content": "Persist portfolio changes",
            },
        }
    )


if __name__ == "__main__":
    # Get port from environment variable or default to 5001 for local dev
    port = int(os.environ.get("PORT", 5001))
    app.run(debug=True, host="0.0.0.0", port=port)
