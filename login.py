from sqlalchemy.orm import Session
from models import User
from argon2 import PasswordHasher, exceptions
from fastapi.templating import Jinja2Templates
from fastapi import APIRouter, Request, Form, Depends
from fastapi.responses import HTMLResponse, JSONResponse
from database import get_db

router = APIRouter()
templates = Jinja2Templates(directory="templates")

ph = PasswordHasher()

def verify_password(plain_password: str, hashed_password: str):
    try:
        return ph.verify(hashed_password, plain_password)
    except exceptions.VerifyMismatchError:
        return False

def login_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return {"success": False, "message": "Invalid email or password"}
    if not verify_password(password, user.password):
        return {"success": False, "message": "Invalid email or password"}
    
    return {"success": True, "message": f"Welcome back, {user.name}!"}

@router.get("/login", response_class=HTMLResponse)
def login_get(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@router.post("/login")
async def login_post(
    request: Request,
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    result = login_user(db, email, password)
    if result["success"]:
        request.session["user_email"] = email
        return JSONResponse(content=result, status_code=200)
    return JSONResponse(content=result, status_code=400)