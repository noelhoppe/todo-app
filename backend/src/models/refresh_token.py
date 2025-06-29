# --- EXTERN IMPORTS ---
from datetime import datetime, timezone
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

# --- INTERN IMPORTS ---
from src.core import db

class RefreshToken(db.Base):
  __tablename__ = "refresh_tokens"
  id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
  jti: Mapped[str] = mapped_column(unique=True)
  expires_at: Mapped[datetime]

  created_at: Mapped[datetime] = mapped_column(default=datetime.now(timezone.utc))
  is_revoked: Mapped[bool] = mapped_column(default=False)
  
  user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))