from fastapi import APIRouter, Request, Form, Depends
from fastapi.responses import JSONResponse, RedirectResponse
from sqlalchemy.orm import Session
from database import get_db
from models import User
from fastapi.templating import Jinja2Templates
from argon2 import PasswordHasher

router = APIRouter()
templates = Jinja2Templates(directory="templates")
ph = PasswordHasher()

@router.get("/new_password")
def new_password_get(request: Request):
    return templates.TemplateResponse("new_password.html", {"request": request})

from fastapi.responses import JSONResponse

@router.post("/new_password")
def new_password_post(
    db: Session = Depends(get_db),
    email: str = Form(...),
    password: str = Form(...)
):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return JSONResponse({"success": False, "message": "User not found."}, status_code=404)
    
    try:
        user.password = ph.hash(password)
        db.commit()
        db.refresh(user)
        return JSONResponse({"success": True, "message": "Password updated successfully!"}, status_code=200)
    except Exception as e:
        return JSONResponse({"success": False, "message": str(e)}, status_code=500)