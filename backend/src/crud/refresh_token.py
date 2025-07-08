# --- EXTERN IMPORTS ---
from sqlalchemy import select, and_
from sqlalchemy.orm import Session

# --- INTERN IMPORTS ---
from src.models.refresh_token import RefreshToken


def insert_refresh_token(refresh_token: RefreshToken, db_session: Session) -> RefreshToken:
  db_session.add(refresh_token)
  db_session.commit()
  db_session.refresh(refresh_token)
  return refresh_token

def get_refresh_token_by_jti(jti: str, db_session: Session) -> RefreshToken | None:
  sql_query = select(RefreshToken).where(RefreshToken.jti == jti)
  refresh_token = db_session.execute(sql_query).scalar()
  return refresh_token

def revoke_refresh_token(jti: str, db_session: Session) -> bool:
  refresh_token = get_refresh_token_by_jti(jti, db_session)
  if refresh_token:
    refresh_token.is_revoked = True
    db_session.commit()
    return True
  return False

def revoke_all_user_tokens(user_id: int, db_session: Session) -> None:
  sql_query = select(RefreshToken).where(
    and_(
      RefreshToken.user_id == user_id,
      RefreshToken.is_revoked == False
    )
  )
  tokens = db_session.execute(sql_query).scalars().all()
  for token in tokens:
    token.is_revoked = True
  db_session.commit()
  