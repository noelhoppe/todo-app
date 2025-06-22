# --- EXTERN IMPORTS ---
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

# --- INTERN IMPORTS ---
from src.core import db

class User(db.Base):
  __tablename__ = "users"

  # id = Column(Integer, primary_key=True, nullable=False)
  id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

  # username = Column(String, unique=True)
  username: Mapped[str] = mapped_column(unique=True)

  # hashed_password = Column(String)
  hashed_password: Mapped[str] 