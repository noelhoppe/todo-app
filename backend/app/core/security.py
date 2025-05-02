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

from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends
from datetime import timedelta, datetime, timezone
from typing import Union, Literal
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives.asymmetric.rsa import RSAPrivateKey, RSAPublicKey
from cryptography.exceptions import InvalidSignature
import jwt
from passlib.context import CryptContext

from app.crud.user import get_user
from app.core.dependencies import get_session
from app.models.user import User
from app.core.config import settings

def generate_key_pair() -> tuple[RSAPrivateKey, RSAPublicKey]:
  public_exponent = 65537
  key_size = 2048
  private_key = rsa.generate_private_key(
    public_exponent=public_exponent,
    key_size=key_size
  )
  public_key = private_key.public_key()
  return private_key, public_key

private_key, public_key = generate_key_pair()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def sign(message: bytes, private_key: RSAPrivateKey) -> bytes:
  return private_key.sign(
    data=message, 
    padding=padding.PSS(
      mgf=padding.MGF1(hashes.SHA256()),
      salt_length=padding.PSS.MAX_LENGTH
    ),
    algorithm=hashes.SHA256
  )

def verify(signature: bytes, message: bytes, public_key: RSAPublicKey) -> bool:
  try:
    public_key.verify(
      signature=signature, 
      data=message,
      padding=padding.PSS(
        mgf=padding.MGF1(hashes.SHA256()),
        salt_length=padding.PSS.MAX_LENGTH
      )
    )
    return True
  except InvalidSignature:
    return False
  
def verify_password(plain_password: str, hashed_password: str) -> bool:
  return pwd_context.verify(
    secret=plain_password,
    hash=hashed_password,
  )

def hash_password(plain_password: str) -> str:
  return pwd_context.hash(secret=plain_password)

def authenticate_user(username: str, password: str, db_session: Annotated[Session, Depends(get_session)]) -> Union[Literal[False], User]:
  user = get_user(username=username, db_session=db_session)
  if not user:
    return False
  if not verify_password(password, user.hashed_password):
    return False
  return user

def create_access_token(data: dict, expires_delta: timedelta | None) -> str:
  to_encode = data.copy()
  if expires_delta:
    expire = datetime.now(timezone.utc) + expires_delta
  else:
    expire = datetime.now(timezone.utc) + timedelta(minutes=15)
  to_encode.update({"exp": expire})
  encoded_jwt = jwt.encode(
    payload=to_encode,
    key=private_key,
    algorithm="RS256"
  )
  return encoded_jwt