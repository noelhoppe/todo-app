from fastapi import status, Cookie, HTTPException, Depends
from fastapi.routing import APIRouter

from app.schemas.todo import ToDoIn, ToDoOut
from app.models.todo import ToDo as ToDoModel
from app.core.security import validate_access_token
from app.crud.user import get_user
from app.core.dependencies import DatabaseSessionDep, GetCurrentUser
from app.crud.todo import insert_todo

router = APIRouter(
  tags=["todo"],
  prefix="/todos",
)

@router.post(
  path="/",
  status_code=status.HTTP_201_CREATED
)
async def create_todo(todo: ToDoIn, user: GetCurrentUser, db_session: DatabaseSessionDep):
  # todo_out = ToDoOut(title=todo.title, due_to=todo.due_to, is_done=todo.is_done, id=2)
  todo_model = insert_todo(todo, user.id, db_session)
  return ToDoOut.model_validate(todo_model)

# @router.get(
#     path="/",
#     status_code=status.HTTP_200_OK
# )
# async def read_todos(user: GetCurrentUser, db_session: DatabaseSessionDep) -> list[ToDoOut]:  
#   return get_todos(user.id, db_session)


@router.patch(
  path="/{todo_id}",
  status_code=status.HTTP_200_OK
)
async def update_todo():
  return {"message": "Hier ToDos updaten"}

@router.delete(
  path="/{todo_id}",
  status_code=status.HTTP_204_NO_CONTENT
)
async def delete_todo():
  return {"message": "Hier todos löschen"}