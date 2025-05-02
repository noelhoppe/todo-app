"""
Authentication and user login routes.

This module defines endpoints related to:
- user login (POST /login/)
- user logout (POST /logout)
- user registration (POST /register)
"""

from datetime import timedelta
from fastapi import APIRouter, Depends, Response, HTTPException, status
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.dependencies import DatabaseSessionDep
from app.core.config import settings
from app.core.security import authenticate_user, create_access_token, hash_password
from app.crud.user import get_user, insert_user

router = APIRouter(
  tags=["user"]
)

@router.post(
    path="/login/",
    status_code=status.HTTP_200_OK,
)
async def login_user(
  response: Response,
  form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
  db_session: DatabaseSessionDep
):
  user = authenticate_user(form_data.username, form_data.password, db_session)
  if not user:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Incorrect username or password",
      headers={"WWW-Authenticate": "Bearer"}
    )
  access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
  access_token = create_access_token(
    data={"sub": user.username},
    expires_delta=timedelta(5)
  )
  response.set_cookie(
    key="access_token",
    value=access_token,
    expires=access_token_expires * 60
  )
  return {"message": "Login successfull"}


@router.post(
    path="/register/",
    status_code=status.HTTP_201_CREATED,
)
async def register_user(
  form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
  db_session: DatabaseSessionDep
):
  user = get_user(form_data.username, db_session=db_session)
  if user:
    raise HTTPException(
      status_code=status.HTTP_409_CONFLICT,
      detail=f"User with username {user.username} already exists. Please enter another username"
    )
  hashed_passwort = hash_password(plain_password=form_data.password)
  insert_user(username=form_data.username, hashed_password=hashed_passwort, db_session=db_session)
  return {"message": "Registration successful"}