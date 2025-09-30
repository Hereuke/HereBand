import random
import time
import smtplib
from email.mime.text import MIMEText
from fastapi import APIRouter, Request, Form, Depends, BackgroundTasks
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import get_db
from models import User
from fastapi.templating import Jinja2Templates

router = APIRouter()
templates = Jinja2Templates(directory="templates")

otp_store = {}  # {email: (otp, expiry_timestamp)}


@router.get("/otp")
def otp_get(request: Request, email: str = None):
    # If email is provided, send expiry info to frontend
    expiry = None
    if email and email in otp_store:
        _, expiry_val = otp_store[email]
        expiry = expiry_val
    return templates.TemplateResponse("otp.html", {"request": request, "expiry": expiry})

@router.get("/otp/expiry")
def otp_expiry(email: str):
    entry = otp_store.get(email)
    if not entry:
        return JSONResponse({"success": False, "expiry": None})
    _, expiry = entry
    return JSONResponse({"success": True, "expiry": expiry})


SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "probhai1845@gmail.com"  # Replace with your email
SENDER_PASSWORD = "oduo umam vvrw yjfl"  # Replace with your app password

def send_otp_email(recipient, otp):
    subject = "Your OTP Code"
    body = f"Your OTP code is: {otp}\nIt is valid for 4 minutes."
    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = SENDER_EMAIL
    msg["To"] = recipient
    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.sendmail(SENDER_EMAIL, recipient, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send OTP email: {e}")
        return False

@router.post("/otp/send")
def send_otp(request: Request, db: Session = Depends(get_db), email: str = Form(...)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return JSONResponse({"success": False, "message": "Email not found."})
    otp = str(random.randint(100000, 999999))
    expiry = int(time.time()) + 240  # 4 minutes from now
    otp_store[email] = (otp, expiry)
    sent = send_otp_email(email, otp)
    if sent:
        return JSONResponse({"success": True, "message": "OTP sent to your email.", "expiry": expiry})
    else:
        return JSONResponse({"success": False, "message": "Failed to send OTP email."})

@router.post("/otp/verify")
def verify_otp(request: Request, db: Session = Depends(get_db), email: str = Form(...), otp: str = Form(...)):
    entry = otp_store.get(email)
    if not entry:
        return JSONResponse({"success": False, "message": "No OTP sent."})
    real_otp, expiry = entry
    if int(time.time()) > expiry:
        del otp_store[email]
        return JSONResponse({"success": False, "message": "OTP expired."})
    if otp != real_otp:
        return JSONResponse({"success": False, "message": "Invalid OTP."})
    # Optionally, clear OTP after successful verification
    del otp_store[email]
    return JSONResponse({"success": True, "message": "OTP verified."})
