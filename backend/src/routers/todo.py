from fastapi import status
from fastapi.routing import APIRouter

from src.core.db import DatabaseSessionDep
from src.schemas.todo import ToDoIn, ToDoOut, ToDoUpdate
from src.core.dependencies import GetCurrentUser
from src.crud.todo import delete_todo_in_db, get_todos, insert_todo, update_todo_in_db

router = APIRouter(
  tags=["todo"],
  prefix="/todos",
)

@router.post(
  path="/",
  status_code=status.HTTP_201_CREATED
)
async def create_todo(todo: ToDoIn, user: GetCurrentUser, db_session: DatabaseSessionDep):
  todo_model = insert_todo(todo, user.id, db_session)
  return ToDoOut.model_validate(todo_model, from_attributes=True)

@router.get(
    path="/",
    status_code=status.HTTP_200_OK
)
async def read_todos(user: GetCurrentUser, db_session: DatabaseSessionDep) -> list[ToDoOut]:  
  todo_models = get_todos(user.id, db_session)
  return [ToDoOut.model_validate(todo_model, from_attributes=True) for todo_model in todo_models]

@router.patch(
  path="/{todo_id}",
  status_code=status.HTTP_200_OK
)
async def update_todo(
  user: GetCurrentUser,
  dbSession: DatabaseSessionDep,
  todo_id: int,
  todo: ToDoUpdate
):
  todo_model = update_todo_in_db(
    user_id=user.id,
    todo_id=todo_id,
    todo_data=todo.model_dump(exclude_unset=True),
    db_session=dbSession
  )
  return ToDoOut.model_validate(todo_model, from_attributes=True)

@router.delete(
  path="/{todo_id}",
  status_code=status.HTTP_204_NO_CONTENT
)
async def delete_todo(
  user: GetCurrentUser,
  dbSession: DatabaseSessionDep,
  todo_id: int
):
  delete_todo_in_db(
    user_id=user.id,
    todo_id=todo_id,
    db_session=dbSession
  )