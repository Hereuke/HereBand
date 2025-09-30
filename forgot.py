from fastapi import APIRouter, Request, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from database import get_db
from models import User
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/forgot", response_class=HTMLResponse)
def forgot_get(request: Request):
    return templates.TemplateResponse("forgot.html", {"request": request})

@router.post("/forgot") 
async def forgot_post(request: Request, db: Session = Depends(get_db)):
    data = await request.json()
    email = data.get("email", "").strip()
    user = db.query(User).filter(User.email == email).first()
    
    if user:
        return JSONResponse(content={"success": True}, status_code=200)
    else:
        return JSONResponse(content={"success": False}, status_code=400) 