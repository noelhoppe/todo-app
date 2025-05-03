from pydantic import BaseModel
from datetime import datetime, timezone

class ToDoIn(BaseModel):
  title: str
  due_to: datetime | None = None
  is_done: bool = False

class ToDoOut(ToDoIn):
  id: int