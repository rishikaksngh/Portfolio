import os
import resend

def send_contact_email(name, email, subject, message):
    """
    Sends an email using the Resend API with the portfolio contact form data.
    """
    api_key = os.getenv("RESEND_API_KEY")
    to_email = os.getenv("EMAIL_TO", "rishikaksngh@gmail.com")
    
    if not api_key:
        raise ValueError("RESEND_API_KEY is not set.")
    
    # Initialize resend with key
    resend.api_key = api_key
    
    # Prepare parameters
    subject_text = f"Portfolio Message: {subject}"
    html_content = f"""
    <h2>New message from portfolio contact form</h2>
    <p><strong>Name:</strong> {name}</p>
    <p><strong>Email:</strong> {email}</p>
    <p><strong>Subject:</strong> {subject}</p>
    <br/>
    <p><strong>Message:</strong></p>
    <p>{message}</p>
    """
    
    params = {
        "from": "Portfolio Contact <onboarding@resend.dev>",
        "to": [to_email],
        "reply_to": [email], # Allow user to reply to the sender (visitor)
        "subject": subject_text,
        "html": html_content
    }
    
    return resend.Emails.send(params)
