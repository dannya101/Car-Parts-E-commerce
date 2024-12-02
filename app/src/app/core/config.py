from functools import lru_cache

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from fastapi import HTTPException
import os

load_dotenv()


class Settings(BaseSettings):
    SQLALCHEMY_DATABASE_URL: str
    SECRET_KEY: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    SMTP_SERVER: str
    SMTP_PORT: str
    SENDER_EMAIL: str
    SENDER_PASSWORD: str

    ADMIN_PASS: str

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")



@lru_cache
def get_settings() -> Settings:
    return Settings()

def send_verification_email(to_email: str, verification_code: str):
    """
    Sends a verification email with the verification code.
    """
    # Get email configuration from environment variables
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = int(os.getenv("SMTP_PORT"))
    sender_email = os.getenv("SENDER_EMAIL")
    sender_password = os.getenv("SENDER_PASSWORD")

    verification_link = f"http://localhost:8000/users/verify-email?verification_code={verification_code}"

    # Create the email content
    subject = "Pitstop Performance - Verify Your Email"
    body = f"Click the link to verify your email: {verification_link}"

    # Set up the MIME
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = to_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    try:
        # Connect to the Gmail SMTP server
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()  # Secure the connection
            server.login(sender_email, sender_password)
            text = message.as_string()
            server.sendmail(sender_email, to_email, text)
        print(f"Verification email sent to {to_email}")
    except Exception as e:
        print(f"Error sending email: {e}")
        raise HTTPException(status_code=500, detail="Error sending verification email")

settings = get_settings()
