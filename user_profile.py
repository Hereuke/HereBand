from fastapi import APIRouter, Depends, Request
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, JSONResponse
from sqlalchemy.orm import Session
from database import get_db
from models import User


router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/user_profile", response_class=HTMLResponse)
def profile_get(request: Request):
    return templates.TemplateResponse("user_profile.html", {"request": request})

@router.get("/user_profile/data", response_class=JSONResponse)
def profile_data(request: Request,db: Session = Depends(get_db)):
    users_name = db.query(User).limit(1)
    return {"UserName": users_name}