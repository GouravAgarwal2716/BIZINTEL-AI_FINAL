import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from dotenv import load_dotenv

load_dotenv()

def send_email(to_email: str, subject: str, body: str):
    """
    Sends an email using SMTP if configured, otherwise logs it.
    """
    smtp_server = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    sender_email = os.getenv("SMTP_USER")
    sender_password = os.getenv("SMTP_PASSWORD")

    if not sender_email or not sender_password:
        print(f"⚠️ SMTP Not Configured. Mocking Email to {to_email}")
        print(f"Subject: {subject}")
        print(f"Body: {body[:50]}...")
        return True

    try:
        msg = MIMEMultipart()
        msg['From'] = sender_email
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'plain'))

        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        text = msg.as_string()
        server.sendmail(sender_email, to_email, text)
        server.quit()
        print(f"✅ Email Sent to {to_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send email: {e}")
        raise e # RE-RAISE to show in Dashboard
