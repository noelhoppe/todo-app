# --- EXTERN IMPORTS ---
from pydantic import BaseModel
from datetime import datetime

class ToDoIn(BaseModel):
  title: str
  due_to: datetime | None = None
  is_done: bool = False

class ToDoOut(ToDoIn):
  id: int

class ToDoUpdate(BaseModel):
  title: str | None = None
  due_to: datetime | None = None
  is_done: bool | None = None