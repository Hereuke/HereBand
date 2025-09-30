from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from database import get_db
from models import User
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse
from fastapi.responses import RedirectResponse

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/dashboard")
def dashboard_get(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})

@router.get("/dashboard/data", response_class=JSONResponse)
def dashboard_data(request: Request, db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    return {"total_users": total_users}

@router.get("/logout")
async def logout(request: Request):
    request.session.clear()
    return RedirectResponse(url="/")
