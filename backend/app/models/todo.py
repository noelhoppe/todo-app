"""
Database model for the ToDo entity.

This model defines the structure of the 'todos' table in the database.
It uses SQLModel to enable ORM functionality and type annotations.

Attributes:
    id (int): Primary key, auto-generated.
    title (str): The title or description of the task.
    due_to (datetime | None): Optional due date of the task.
    is_done (bool): Whether the task has been completed.
    user_id (int): Foreign key referencing the 'users' table.
"""

from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey

from app.core import db

class ToDo(db.Base):
  __tablename__ = "todos"
  id = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
  title = Column(String,  nullable=False)
  due_to = Column(DateTime, nullable=True)
  is_done = Column(Boolean, default=False)
  user_id = Column(Integer, ForeignKey("users.id"), nullable=False)