from typing import Annotated

import os
from fastapi import Depends, HTTPException, Request, Response, status
from datetime import timedelta, datetime, timezone
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives.asymmetric.rsa import RSAPrivateKey, RSAPublicKey
import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.crud.user import get_user
from app.models.user import User
from app.core.config import settings
from app.core.dependencies import DatabaseSessionDep

def generate_key_pair() -> tuple[RSAPrivateKey, RSAPublicKey]:
  public_exponent = 65537
  key_size = 2048
  private_key = rsa.generate_private_key(
    public_exponent=public_exponent,
    key_size=key_size
  )
  public_key = private_key.public_key()
  return private_key, public_key

def get_key_pair() -> tuple[RSAPrivateKey, RSAPublicKey]:
  try:
    private_key, public_key = load_key_pair()
  except FileNotFoundError:
    private_key, public_key = generate_key_pair()
    save_key_pair(private_key, public_key)
  return private_key, public_key

def load_key_pair() -> tuple[RSAPrivateKey, RSAPublicKey]:
  with open(settings.private_key_path, "rb") as private_key_file:
    private_key = serialization.load_pem_private_key(
      private_key_file.read(),
      password=settings.private_key_password
    )
  with open(settings.public_key_path, "rb") as public_key_file:
    public_key = serialization.load_pem_public_key(
      public_key_file.read()
    )
  return private_key, public_key

def save_key_pair(private_key: RSAPrivateKey, public_key: RSAPublicKey):
  if not os.path.exists(os.path.dirname(settings.private_key_path)):
    os.makedirs(os.path.dirname(settings.private_key_path))
  with open(settings.private_key_path, "wb") as private_key_file:
    private_key_file.write(
      private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.BestAvailableEncryption(settings.private_key_password)
      )
    )
  if not os.path.exists(os.path.dirname(settings.public_key_path)):
    os.makedirs(os.path.dirname(settings.public_key_path))
  with open(settings.public_key_path, "wb") as public_key_file:
    public_key_file.write(
      public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
      )
    )


private_key, public_key = get_key_pair()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- Password hashing 
def verify_password(plain_password: str, hashed_password: str) -> bool:
  """
  Hashing plain_password using bcrypt and comparing with hashed_password.

  :param plain_password: The password to be hashed using bcrypt
  :param hashed_password: The hashed password to compare with

  :return: True if the password is correct, False otherwise
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
  :return: The hashed password
  :raises HTTPException: If the password has an invalid type or value
  """
  try:
    return pwd_context.hash(secret=plain_password)
  except (ValueError, TypeError) as e:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Password has an invalid type or value"
    ) from e

# -- Active authentification (login)
def authenticate_user(username: str, plain_password: str, db_session: Session) -> User:
  """
  Authenticate a user by checking the provided username and password.

  :param username: The username of the user to authenticate
  :param plain_password: The password of the user to authenticate
  :param db_session: The database session to use for authentication

  :return: The authenticated user
  :raises HTTPException: If the username or password is incorrect
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

# --- JWT Access Token handling
def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=15)) -> str:
  to_encode = data.copy()
  expires = datetime.now(timezone.utc) + expires_delta
  to_encode.update({"exp": expires})
  encoded_jwt = jwt.encode(
    payload=to_encode,
    key=private_key,
    algorithm=settings.algorithm
  )
  return encoded_jwt

def validate_access_token(token: str) -> dict[str, str]:
  try:
    payload = jwt.decode(
      jwt=token,
      key=public_key,
      algorithms=settings.algorithm,
      options={
        "verify_signature": True,
        "verify_exp": "verify_signature",
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
  response.set_cookie(
    key=ACCESS_TOKEN_COOKIE_KEY,
    value=token,
    max_age=int(expire_delta.total_seconds())
  )

def get_access_token_from_cookie(request: Request) -> str:
  token = request.cookies.get(ACCESS_TOKEN_COOKIE_KEY)
  if not token:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Access token in Cookie not found"
    )
  return token

def destroy_access_token_cookie(request: Request) -> None:
  try:
    request.cookies.pop(ACCESS_TOKEN_COOKIE_KEY)
  except KeyError:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="No valid session cookie found. Please log in again"
    )
  
# -- Passive authentication (Access Token)
def get_current_user(db_session: DatabaseSessionDep, access_token: Annotated[str, Depends(get_access_token_from_cookie)]) -> User:
  payload = validate_access_token(access_token)
  username = payload["sub"]
  user = get_user(username, db_session)
  if not user:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid authentication credentials: user not found"
    )
  return user