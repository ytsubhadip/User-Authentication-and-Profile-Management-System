import smtplib
import random
import os
import asyncio

from dotenv import load_dotenv
from email.mime.text import MIMEText

load_dotenv()

sender_email = os.getenv("EMAIL")
sender_password = os.getenv("EMAIL_PASSWORD")



def generate_otp():
    otp = random.randint(100000, 999999)
    return str(otp)

def send_email(email:str, otp:str):

    receiver_email= email

    message = MIMEText(f"Your OTP is: {otp}")
    message["Subject"] = "Email Verification OTP"
    message["From"] = sender_email
    message["To"] = receiver_email

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender_email, sender_password)
        server.sendmail(
            sender_email,
            receiver_email,
            message.as_string()
        )


































