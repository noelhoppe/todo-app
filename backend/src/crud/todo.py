# --- EXTERN IMPORTS ---
from fastapi import HTTPException, status
from sqlalchemy import and_, select
from sqlmodel import Session

# --- INTERN IMPORTS ---
from src.models.todo import ToDo as ToDoModel
from src.schemas.todo import ToDoIn

def insert_todo(todo: ToDoIn, user_id: int, db_session: Session) -> ToDoModel:
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

def get_todos(user_id: int, db_session: Session) -> list[ToDoModel]:
  sql_statement = select(ToDoModel).where(ToDoModel.user_id == user_id)
  todos = db_session.scalars(sql_statement).all()
  return todos 

def update_todo_in_db(
  user_id: int,
  todo_id: int,
  todo_data: dict,
  db_session: Session
) -> ToDoModel:
  sql_statement = select(ToDoModel).where(
    and_(
      ToDoModel.id == todo_id,
      ToDoModel.user_id == user_id
    )
  )
  result = db_session.scalars(sql_statement).first()
  
  if not result:
    raise HTTPException(
      status_code=status.HTTP_403_FORBIDDEN,
      detail=f"Todo with id {todo_id} is not for user with id {user_id}"
    )

  for key, value in todo_data.items():
    setattr(result, key, value)

  db_session.commit()
  db_session.refresh(result)
  return result

def delete_todo_in_db(
  user_id: int,
  todo_id: int,
  db_session: Session
):
  todo = db_session.get(ToDoModel, todo_id)

  if not todo or todo.user_id != user_id:
      raise HTTPException(
          status_code=status.HTTP_403_FORBIDDEN,
          detail=f"Todo with id {todo_id} is not for user with id {user_id}"
      )
  
  db_session.delete(todo)
  db_session.commit()