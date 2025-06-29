# --- EXTERN IMPORTS ---
from datetime import datetime, timedelta, timezone
from fastapi import Request
import jwt
from starlette.middleware.base import BaseHTTPMiddleware

# --- INTERN IMPORTS ---
from src.core.security import create_access_token, get_access_token_from_cookie, get_refresh_token_from_cookie, set_access_token_in_cookie, validate_refresh_token
from src.core.config import settings
from src.core.db import get_session


class TokenRefreshMiddleware(BaseHTTPMiddleware):
  async def dispatch(self, request: Request, call_next):
    skip_paths = ["/login/", "/register/", "/docs/", "/openapi.json"]
    if any(request.url.path.startswith(path) for path in skip_paths):
      return await call_next(request)
    
    try:
      access_token = get_access_token_from_cookie(request)
      payload = jwt.decode(
        jwt=access_token,
        key=settings.secret_key,
        algorithms=[settings.symmetric_algorithm],
        options={"verify_exp": False} 
      )
      exp_time = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
      current_time = datetime.now(timezone.utc)
      time_until_exp = (exp_time - current_time).total_seconds()
      if time_until_exp < 300: # 5 minutes
        print(f"🔄 Token läuft in {time_until_exp.total_seconds():.0f}s ab - erneuere jetzt")
        refresh_token = get_refresh_token_from_cookie(request)
        with next(get_session()) as db_session:
          refresh_payload = validate_refresh_token(
            refresh_token=refresh_token,
            db_session=db_session
          )
          user_id = int(refresh_payload["sub"])

          access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
          new_access_token = create_access_token(
            data={"sub": str(user_id)},
            expires_delta=access_token_expires
          )
          response = await call_next(request)

          set_access_token_in_cookie(response, new_access_token, access_token_expires)
          return response
    except Exception as e:
      print(f"❌ Fehler beim Erneuern des Tokens: {e}")

    return await call_next(request)