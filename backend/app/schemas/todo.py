"""
Pydantic models for the ToDo API.

These models define the shape of data accepted from and returned to the client.
"""

from pydantic import BaseModel
from datetime import datetime, timezone

class ToDoIn(BaseModel):
  title: str
  due_to: datetime = datetime.now(timezone.utc)
  is_done: bool = False

class ToDoOut(ToDoIn):
  id: int