
from fastapi import Depends, HTTPException, Request, Response, status
from datetime import timedelta, datetime, timezone
from typing import Union, Literal
from cryptography.hazmat.primitives.asymmetric import rsa
from cryptography.hazmat.primitives.asymmetric.rsa import RSAPrivateKey, RSAPublicKey
import jwt
from passlib.context import CryptContext

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

private_key, public_key = generate_key_pair()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# TODO: Schlüssel aus Datei abrufen
# def sign(message: bytes, private_key: RSAPrivateKey) -> bytes:
#   return private_key.sign(
#     data=message, 
#     padding=padding.PSS(
#       mgf=padding.MGF1(hashes.SHA256()),
#       salt_length=padding.PSS.MAX_LENGTH
#     ),
#     algorithm=hashes.SHA256
#   )

# def verify(signature: bytes, message: bytes, public_key: RSAPublicKey) -> bool:
#   try:
#     public_key.verify(
#       signature=signature, 
#       data=message,
#       padding=padding.PSS(
#         mgf=padding.MGF1(hashes.SHA256()),
#         salt_length=padding.PSS.MAX_LENGTH
#       )
#     )
#     return True
#   except InvalidSignature:
#     return False
  
def verify_password(plain_password: str, hashed_password: str) -> bool:
  try:
    return pwd_context.verify(
      secret=plain_password,
      hash=hashed_password,
    )
  except (ValueError, TypeError):
    return False

def hash_password(plain_password: str) -> str:
  try:
    return pwd_context.hash(secret=plain_password)
  except (ValueError, TypeError) as e:
    raise HTTPException(
      status_code=status.HTTP_400_BAD_REQUEST,
      detail="Invalid passwort format"
    ) from e

def authenticate_user(username: str, password: str, db_session: DatabaseSessionDep) -> Union[Literal[False], User]:
  user = get_user(username=username, db_session=db_session)
  if not user:
    return False
  if not verify_password(password, user.hashed_password):
    return False
  return user

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
  