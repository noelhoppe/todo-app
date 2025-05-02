"""
Pydantic models for the ToDo API.

These models define the shape of data accepted from and returned to the client.
"""

from pydantic import BaseModel
from datetime import datetime

class ToDo(BaseModel):
  id: str
  title: str
  due_to: datetime
  is_done: bool