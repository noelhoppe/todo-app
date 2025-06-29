# --- EXTERN IMPORTS ---
from datetime import datetime
from sqlalchemy import ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional

# --- INTERN IMPORTS ---
from src.core import db

class ToDo(db.Base):
  __tablename__ = "todos" 
  id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
  title: Mapped[str]
  due_to: Mapped[Optional[datetime]] 
  is_done: Mapped[bool] = mapped_column(default=False)
  user_id: Mapped[int] = mapped_column(ForeignKey("users.id")) 