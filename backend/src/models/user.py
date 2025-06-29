# --- EXTERN IMPORTS ---
from sqlalchemy.orm import Mapped, mapped_column

# --- INTERN IMPORTS ---
from src.core import db

class User(db.Base):
  __tablename__ = "users"
  id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
  username: Mapped[str] = mapped_column(unique=True)
  hashed_password: Mapped[str] 

  def __repr__(self):
    return f"User(id={self.id}, username={self.username}, hashed_password={self.hashed_password})"