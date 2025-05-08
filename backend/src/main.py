from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.core.config import settings
from src.core.db import create_tables
from src.routers.auth import router as auth
from src.routers.todo import router as todo

app = FastAPI()

# Set up database
@app.on_event("startup")
async def on_startup():
  create_tables()

# CORS Middleware
app.add_middleware(
  CORSMiddleware,
  allow_origins= [settings.frontend_url],
  allow_methods=['*'],
  allow_headers=['*'],
  allow_credentials=True
)

# Register routers
app.include_router(auth)  
app.include_router(todo)