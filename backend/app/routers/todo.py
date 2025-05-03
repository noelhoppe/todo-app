from fastapi import status, Cookie, HTTPException, Depends
from fastapi.routing import APIRouter

from app.schemas.todo import ToDoIn, ToDoOut
from app.core.security import validate_access_token
from app.crud.user import get_user
from app.core.dependencies import DatabaseSessionDep, GetCurrentUser
from app.crud.todo import get_todos, insert_todo

router = APIRouter(
  tags=["todo"],
  prefix="/todos",
)

# @router.post(
#   path="/",
#   status_code=status.HTTP_201_CREATED
# )
# async def handle_create_todo(todo: ToDoIn, user: GetCurrentUser, db_session: DatabaseSessionDep) -> ToDoOut:
#   todo = insert_todo(todo, user.id, db_session)
#   return todo

# to be continued 
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