"""
Authentication and user login routes.

This module defines endpoints related to:
- user login (POST /login/)
- user logout (POST /logout)
- user registration (POST /register)
"""


from fastapi import APIRouter, Depends, Response, HTTPException, status
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm
from ..core.security import authenticate_user

router = APIRouter()

@router.post("/login/")
async def login(
  response: Response,
  form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
):
  user = authenticate_user(form_data.username, form_data.password)
  if not user:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Incorrect username or password",
      headers={"WWW-Authenticate": "Bearer"}
    )

  # response.set_cookie(key="my_cookie", value="my-value")
  pass