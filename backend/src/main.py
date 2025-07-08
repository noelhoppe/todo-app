# --- EXTERN IMPORTS ---
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# --- INTERN IMPORTS ---
from src.core.config import settings
from src.core.db import create_tables
from src.routers.auth import router as auth
from src.routers.todo import router as todo
from src.middleware.token_refresh_middleware import TokenRefreshMiddleware

# --- ASYNC CONTEXT MANAGER FOR LIFESPAN ---
@asynccontextmanager
async def lifespan(app: FastAPI):
  create_tables()
  yield

app = FastAPI(lifespan=lifespan)

# --- CORS MIDDLEWARE ---
app.add_middleware(
  CORSMiddleware,
  allow_origins= [settings.frontend_url],
  allow_methods=['*'],
  allow_headers=['*'],
  allow_credentials=True
)

# --- TOKEN REFRESH MIDDLEWARE ---
app.add_middleware(
  TokenRefreshMiddleware
)

# --- REGISTER ROUTERS ---
app.include_router(auth)  
app.include_router(todo)