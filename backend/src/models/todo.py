from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey

from src.core import db

class ToDo(db.Base):
  __tablename__ = "todos"
  id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
  title = Column(String,  nullable=False)
  due_to = Column(DateTime, nullable=True)
  is_done = Column(Boolean, default=False)
  user_id = Column(Integer, ForeignKey("users.id"), nullable=False)