# --- EXTERN IMPORTS ---
from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from typing import Optional

# --- INTERN IMPORTS ---
from src.core import db

class ToDo(db.Base):
  __tablename__ = "todos"
  
  # id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
  id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)

  # title = Column(String,  nullable=False)
  title: Mapped[str]

  # due_to = Column(DateTime, nullable=True)
  due_to: Mapped[Optional[DateTime]] 

  is_done = Column(Boolean, default=False)
  is_done: Mapped[bool] = mapped_column(default=False)


  # user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
  user_id: Mapped[int] = mapped_column(ForeignKey("users.id")) 