from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

router = APIRouter()
template = Jinja2Templates(directory="templates")

@router.get("/home")
async def home_get(request: Request):
    return template.TemplateResponse("home.html", {"request": request})