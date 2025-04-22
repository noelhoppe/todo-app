"""
Security utilities for authentication and authorization.

This module provides utilities for password hashing, token creation, and token validation.
It is responsible for the security mechanisms, including:
- Password hashing and verification
- JWT token creation and validation
- Managing user authentication and authorization

These utilities are used across the application for secure user authentication.

Functions:
    - verify_password: Verifies if the plain password matches the hashed password.
    - get_password_hash: Hashes the plain password using bcrypt.
    - create_access_token: Creates a JWT token for user authentication.
    - get_current_user: Extracts the current authenticated user from the JWT token.
"""

from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from typing import Literal
from datetime import timedelta, datetime, timezone
import jwt

from ..crud.user import get_user
from ..models.user import User

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def authenticate_user(username: str, password: str) -> User | Literal[False]:
  user = get_user(username)
  if not user: 
    return False
  if not pwd_context.verify(secret=password, hash=user.hashed_password):
    return False
  return user

def create_access_token(data: dict, expires_delta: timedelta | None = None):
  to_encode = data.copy()
  if expires_delta:
    expire = datetime.now(timezone.utc) + expires_delta
  else:
    expire = datetime.now(timezone.utc) + timedelta(minutes=15)
  to_encode.update({"exp": expire})
  encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
  return encoded_jwt