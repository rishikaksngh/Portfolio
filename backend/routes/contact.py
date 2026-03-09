import os
import time
from flask import Blueprint, jsonify, request
from services.email_service import send_contact_email
import re

contact_bp = Blueprint("contact", __name__)

# Basic rate limiting in memory (simpler than flask-limiter for MVP)
_rate_limits = {}

def is_rate_limited(ip):
    """
    Very basic sliding window rate limiter.
    Limit: 5 requests per 10 minutes.
    """
    now = time.time()
    # Cleanup old entries (not efficient, but OK for small memory use)
    _rate_limits[ip] = [t for t in _rate_limits.get(ip, []) if now - t < 600]
    
    if len(_rate_limits[ip]) >= 5:
        return True
    
    _rate_limits[ip].append(now)
    return False

def is_valid_email(email):
    """Simple regex for email validation."""
    return re.match(r"[^@]+@[^@]+\.[^@]+", email)

@contact_bp.route("/api/contact", methods=["POST"])
def contact_api():
    """
    Handle portfolio contact form submission.
    Accepts: { name, email, subject, message }
    """
    # Rate limiting Check
    ip = request.remote_addr
    if is_rate_limited(ip):
        return jsonify({"error": "Too many requests. Please try again later."}), 429

    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "No JSON data provided."}), 400

    name = data.get("name")
    email = data.get("email")
    subject = data.get("subject")
    message = data.get("message")

    # Validation
    if not all([name, email, subject, message]):
        return jsonify({"error": "All fields are required."}), 400
    
    if not is_valid_email(email):
        return jsonify({"error": "Please provide a valid email address."}), 400

    try:
        # Mocking check for internal dev testing (as before)
        api_key = os.getenv("RESEND_API_KEY")
        if not api_key or "your_resend_api_key" in api_key:
            # Simulation Mode (as established previously)
            print(f"--- SIMULATION MODE ---")
            print(f"To: {os.getenv('EMAIL_TO', 'rishikaksngh@gmail.com')}")
            print(f"From: {email}")
            print(f"Subject: {subject}")
            print(f"Message: {message}")
            print(f"--- END SIMULATION ---")
        else:
            # Real sending
            send_contact_email(name, email, subject, message)

        return jsonify({"success": True, "message": "Message sent successfully. I will get back to you soon."}), 200

    except Exception as e:
        print(f"Error sending email: {e}")
        return jsonify({"error": "Internal server error. Please try again later."}), 500
