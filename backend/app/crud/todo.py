from app.models.todo import ToDo as ToDoModel
from app.schemas.todo import ToDoIn, ToDoOut
from sqlalchemy.orm import Session

def insert_todo(todo: ToDoIn, user_id: int, db_session: Session) -> ToDoOut:
  new_todo = ToDoModel(
    title=todo.title,
    due_to=todo.due_to,
    is_done=todo.is_done,
    user_id=user_id
  )
  db_session.add(new_todo)
  db_session.commit()
  db_session.refresh(new_todo)
  return new_todo
