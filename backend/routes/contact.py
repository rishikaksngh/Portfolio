from flask import Blueprint, request, jsonify
from datetime import datetime

contact_bp = Blueprint('contact', __name__)


@contact_bp.route('/contact', methods=['POST'])
def contact():
    """Receive contact form submissions and log them."""
    data = request.get_json()

    if not data:
        return jsonify({'error': 'No data provided'}), 400

    name = data.get('name')
    email = data.get('email')
    message = data.get('message')

    if not all([name, email, message]):
        return jsonify({'error': 'Missing required fields: name, email, message'}), 400

    # Log the contact message
    timestamp = datetime.now().isoformat()
    print(f"\n{'='*50}")
    print(f"  New Contact Message - {timestamp}")
    print(f"{'='*50}")
    print(f"  Name:    {name}")
    print(f"  Email:   {email}")
    print(f"  Message: {message}")
    print(f"{'='*50}\n")

    return jsonify({
        'success': True,
        'message': 'Your message has been received! I will get back to you soon.'
    }), 200
