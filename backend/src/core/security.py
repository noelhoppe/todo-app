from typing import Annotated
import os
from fastapi import Depends, HTTPException, Request, Response, status
from datetime import timedelta, datetime, timezone
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives.asymmetric.rsa import RSAPrivateKey, RSAPublicKey
from fastapi.security import OAuth2PasswordRequestForm
import jwt
from passlib.context import CryptContext
from sqlmodel import Session

from src.core.db import DatabaseSessionDep
from src.crud.user import get_user, get_user_by_id
from src.models.user import User
from src.core.config import settings

# --- Password hashing 
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
def verify_password(plain_password: str, hashed_password: str) -> bool:
  """
  Hashing plain_password using bcrypt and comparing with hashed_password.

  :param plain_password: The password to be hashed using bcrypt.
  :param hashed_password: The hashed password to compare with.

  :return: True if the password is correct, False otherwise.
  """
  try:
    return pwd_context.verify(
      secret=plain_password,
      hash=hashed_password,
    )
  except (ValueError, TypeError):
    return False

def hash_password(plain_password: str) -> str:
  """
  Hashes a password using bcrypt.

  :param plain_password: The password to be hashed using bcrypt
  :return: The hashed password.
  :raises HTTPException: If the password has an invalid type or value.
  """
  try:
    return pwd_context.hash(secret=plain_password)
  except (ValueError, TypeError) as e:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Password has an invalid type or value"
    ) from e

# --- JWT Access Token handling
SECRET_KEY = settings.secret_key
ALGORITHM = settings.symmetric_algorithm
def create_access_token(
  data: dict | None = None, 
  expires_delta: timedelta = timedelta(minutes=15)
) -> str:
  """
  Create a JWT access token with the given data and expiration time.

  :param data: The data to include in the token payload.
  :param expires_delta: The expiration time for the token.
  """
  to_encode = data.copy() if data else {}
  expires = datetime.now(timezone.utc) + expires_delta
  to_encode.update({"exp": expires})
  encoded_jwt = jwt.encode(
    payload=to_encode,
    key=SECRET_KEY,
    algorithm=ALGORITHM
  )
  return encoded_jwt

def validate_access_token(token: str) -> dict[str, str]:
  """
  Validate the access token and return the payload.

  :param token: The JWT access token to validate.
  :return: The payload of the token.
  :raises HTTPException: If the token is invalid or expires.
  """
  try:
    payload = jwt.decode(
      jwt=token,
      key=SECRET_KEY,
      algorithms=ALGORITHM,
      options={
        "verify_signature": True,
        "verify_exp": True,
      }
    )
    return payload
  except jwt.exceptions.InvalidTokenError:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid token",
      headers={"WWW-Authenticate": "Bearer"}
    )
  except jwt.exceptions.ExpiredSignatureError:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Access token expired",
      headers={"WWW-Authenticate": "Bearer"}
    )
  except jwt.exceptions.DecodeError:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Access token cannot be decoded because it failed validation",
      headers={"WWW-Authenticate": "Bearer"}
    )
  except jwt.exceptions.InvalidSignatureError:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="The token's signature doesn't match the one provided as part of the token",
      headers={"WWW-Authenticate": "Bearer"}
    )

# --- Cookie based JWT management
ACCESS_TOKEN_COOKIE_KEY = "access_token"
def set_access_token_in_cookie(
    response: Response, 
    token: str,
    expire_delta: timedelta = timedelta(minutes=15)
) -> None:
  """
  Set the access token in a cookie.

  :param response: The response object to set the cookie in.
  :param token: The JWT access token to set in the cookie.
  :param expire_delta: The expiration time fot the cookie.
  """
  response.set_cookie(
    key=ACCESS_TOKEN_COOKIE_KEY,
    value=token,
    max_age=int(expire_delta.total_seconds())
  )

def get_access_token_from_cookie(request: Request) -> str:
  """
  Get the access token from the cookie.

  :param request: The request object to get the cookie from.
  :return: The JWT acess token from the cokkie.
  :raises HTTPException: If the access token is not found in the cookie.
  """
  token = request.cookies.get(ACCESS_TOKEN_COOKIE_KEY)
  if not token:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Access token in Cookie not found"
    )
  return token

def destroy_access_token_cookie(request: Request) -> None:
  """
  Destroy the access token cookie.

  :param request: The request object to destroy the cookie in.
  :raises HTTPException: If the access token cookie is not found.
  """
  try:
    request.cookies.pop(ACCESS_TOKEN_COOKIE_KEY)
  except KeyError:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="No valid session cookie found. Please log in again"
    )
  
# -- Active Authentication (login)
def authenticate_user(username: str, plain_password: str, db_session: Session) -> User:
  """
  Authenticate a user by checking the provided username and password.

  :param username: The username of the user to authenticate.
  :param plain_password: The plain password of the user to authenticate.
  :param db_session: The database session to use for authentication.

  :return: The authenticated user.
  :raises HTTPException: If the username or password is incorrect.
  """
  user = get_user(username=username, db_session=db_session)
  if not user or not verify_password(plain_password, user.hashed_password):
    # Never reveal whetever the username or password is incorrect separately.
    # Otherwise, an attacker could use this information to brute-force the password.
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Username or password is incorrect"
    )
  return user
  
# -- Passive authentication (Access Token)
def get_current_user(
  access_token: Annotated[str, Depends(get_access_token_from_cookie)],
  db_session: DatabaseSessionDep
) -> User:
  """
  Get the current user from the access token.

  :param access_token: The JWT access token to validate.
  :param db_session: The database session to use for authentication.
  :return: The authenticated user.
  :raises HTTPException: If the user is not found.
  """
  payload = validate_access_token(access_token)
  user_id = payload["sub"]
  user = get_user_by_id(user_id=user_id, db_session=db_session)
  if not user:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid authentication credentials: user not found"
    )
  return user