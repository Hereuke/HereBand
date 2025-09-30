from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from database import engine, Base
from starlette.middleware.sessions import SessionMiddleware
from home import router as home_router
from signup import router as signup_router
from login import router as login_router
from forgot import router as forgot_router
from otp import router as otp_router
from new_password import router as new_password_router
from dashboard import router as dashboard_router
from user_profile import router as profile_router

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key="supersecretkey123")
app.mount("/static", StaticFiles(directory="static"), name="static")
app.mount("/assest", StaticFiles(directory="assest"), name="assest")
templates = Jinja2Templates(directory="templates")

app.include_router(home_router)
app.include_router(signup_router)
app.include_router(login_router)
app.include_router(forgot_router)
app.include_router(otp_router)
app.include_router(new_password_router)
app.include_router(dashboard_router)
app.include_router(profile_router)