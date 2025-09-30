from fastapi import APIRouter, Request, Form, Depends
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, JSONResponse
from argon2 import PasswordHasher
from sqlalchemy.orm import Session
from models import User
from database import get_db

router = APIRouter()
templates = Jinja2Templates(directory="templates")

ph = PasswordHasher()

@router.get("/signup", response_class=HTMLResponse)
def signup_get(request: Request):
    return templates.TemplateResponse("signup.html", {"request": request})

@router.post("/signup")
async def signup_post(db: Session = Depends(get_db), name: str = Form(...), email: str = Form(...), password: str = Form(...)):
    existing_user = db.query(User).filter(User.email == email).first()

    if name[0] == ' ' or name[-1] == ' ':
        return JSONResponse(content={"success": False, "message": "Username cannot start or end with a space"}, status_code=400)
    if len(name) < 3:
        return JSONResponse(content={"success": False, "message": "Username must be at least 3 characters long"}, status_code=400)
    if name[0].isdigit():
        return JSONResponse(content={"success": False, "message": "Username cannot start with a number"}, status_code=400)
    if existing_user:
        return JSONResponse(content={"success": False, "message": "Email already registered"}, status_code=400)
    if len(password) < 8:
        return JSONResponse(content={"success": False, "message": "Password must be at least 8 characters long"}, status_code=400)

    hashed_pw = ph.hash(password)
    new_user = User(name=name, email=email, password=hashed_pw)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return JSONResponse(content={"success": True, "message": "Account created successfully"}, status_code=200)