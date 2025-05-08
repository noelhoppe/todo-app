from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, Request, Response, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from src.core.config import settings
from src.core.security import authenticate_user, create_access_token, destroy_access_token_cookie, hash_password, set_access_token_in_cookie
from src.crud.user import get_user, insert_user

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
):
  user = authenticate_user(form_data.username, form_data.password)
  access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
  access_token = create_access_token(
    data={"sub": user.username},
    expires_delta=access_token_expires
  )
  set_access_token_in_cookie(response, access_token, access_token_expires)
  return {"message": "Login successfull"}

@router.post(
    path="/register/",
    status_code=status.HTTP_201_CREATED,
)
async def register_user(
  form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
):
  user = get_user(form_data.username)
  if user:
    raise HTTPException(
      status_code=status.HTTP_409_CONFLICT,
      detail=f"User with username {user.username} already exists. Please enter another username"
    )
  hashed_passwort = hash_password(plain_password=form_data.password)
  insert_user(username=form_data.username, hashed_password=hashed_passwort)
  return {"message": "Registration successful"}

@router.post(
  path="/logout/",
  status_code=status.HTTP_200_OK
)
async def logout_user(request: Request):
  destroy_access_token_cookie(request)
  return {"message": "Logout successfull"}