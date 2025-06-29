# --- EXTERN IMPORTS ---
from datetime import timedelta
from typing import Annotated
from fastapi import APIRouter, Depends, Request, Response, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

# --- INTERN IMPORTS ---
from src.core.dependencies import GetCurrentUserWithRefresh
from src.core.db import DatabaseSessionDep
from src.core.config import settings
from src.core.security import authenticate_user, create_access_token, create_refresh_token, destroy_access_token_cookie, destroy_refresh_token_cookie, get_refresh_token_from_cookie, hash_password, set_access_token_in_cookie, set_refresh_token_in_cookie, validate_refresh_token
from src.crud.user import get_user, insert_user
from src.crud.refresh_token import insert_refresh_token, revoke_all_user_tokens, revoke_refresh_token
from src.models.refresh_token import RefreshToken

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

  revoke_all_user_tokens(user.id, db_session)

  # --- ACCESS TOKEN ---
  access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
  access_token = create_access_token(
    data={"sub": str(user.id)},
    expires_delta=access_token_expires
  )

  # --- REFRESH TOKEN ---
  refresh_token_expires = timedelta(days=settings.refresh_token_expire_days)
  refresh_token, jti, expires_at = create_refresh_token(
    user_id=user.id,
    expires_delta=refresh_token_expires
  )
  refresh_token_model = RefreshToken(
    jti=jti,
    expires_at=expires_at,
    user_id=user.id
  )
  insert_refresh_token(refresh_token_model, db_session)

  # --- SET COOKIES ---
  set_access_token_in_cookie(response, access_token, access_token_expires)
  set_refresh_token_in_cookie(response, refresh_token, refresh_token_expires)
  return {"message": "Login successfull"}

# @router.post(
#     path="/refresh/",
#     status_code=status.HTTP_200_OK,
# )
# async def refresh_access_token(
#   request: Request,
#   response: Response,
#   db_session: DatabaseSessionDep
# ):
#   refresh_token = get_refresh_token_from_cookie(request)
#   payload = validate_refresh_token(refresh_token, db_session)

#   user_id = int(payload["sub"])

#   # --- CREATE NEW ACCESS TOKEN ---
#   access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
#   access_token = create_access_token(
#     data={"sub": str(user_id)},
#     expires_delta=access_token_expires
#   )
#   set_access_token_in_cookie(response, access_token, access_token_expires)

#   return {"message": "Acess token refreshed successfully"}

@router.get(
    path="/is_authorized/",
    status_code=status.HTTP_200_OK
)
async def is_authorized(
  user: GetCurrentUserWithRefresh
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
async def logout_user(
  request: Request,
  response: Response,
  db_session: DatabaseSessionDep
):
  try:
    refresh_token = get_refresh_token_from_cookie(request)
    pyload = validate_refresh_token(refresh_token, db_session)
    jti = pyload["jti"]
    revoke_refresh_token(jti, db_session)
  except HTTPException:
    pass

  destroy_access_token_cookie(response)
  destroy_refresh_token_cookie(response)
  return {"message": "Logout successfull"}