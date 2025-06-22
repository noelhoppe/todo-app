from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, Request, Response, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from src.core.dependencies import GetCurrentUser
from src.core.db import DatabaseSessionDep
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
  db_session: DatabaseSessionDep
):
  user = authenticate_user(form_data.username, form_data.password, db_session)
  access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
  access_token = create_access_token(
    data={"sub": str(user.id)},
    expires_delta=access_token_expires
  )
  set_access_token_in_cookie(response, access_token, access_token_expires)
  return {"message": "Login successfull"}

@router.get(
    path="/is_authorized/",
    status_code=status.HTTP_200_OK
)
async def is_authorized(
  user: GetCurrentUser
):
  return {"message": "User is authenticated"}


@router.post(
    path="/register/",
    status_code=status.HTTP_201_CREATED,
)
async def register_user(
  form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
  db_session: DatabaseSessionDep
):
  user = get_user(username=form_data.username, db_session=db_session)
  if user:
    raise HTTPException(
      status_code=status.HTTP_409_CONFLICT,
      detail=f"User with username {user.username} already exists. Please enter another username"
    )
  hashed_passwort = hash_password(plain_password=form_data.password)
  insert_user(username=form_data.username, hashed_password=hashed_passwort, db_session=db_session)
  return {"message": "Registration successful"}

@router.post(
  path="/logout/",
  status_code=status.HTTP_200_OK
)
async def logout_user(response: Response):
  destroy_access_token_cookie(response)
  return {"message": "Logout successfull"}