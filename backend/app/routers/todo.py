"""
Routes for managing 'ToDo' items.

This module contains endpoints for:
- creating todos (POST /todos/)
- reading user-specific todos (GET /todos/)
- updating user-specific todos (PATCH /todos/{id})
- deleting user-specific todos (DELETE /todos/{id})

These routes require an authenticated user and interact with the database through dependencies.

"""
from typing import Annotated

from fastapi import status, Cookie, HTTPException, Depends
from fastapi.routing import APIRouter

from app.schemas.todo import ToDoIn, ToDoOut
from app.core.security import validate_access_token, oauth2_scheme
from app.models.todo import ToDo
from app.crud.user import get_user
from app.core.dependencies import DatabaseSessionDep, OAuth2PasswordBearerDep
from app.crud.todo import insert_todo


router = APIRouter(
  tags=["todo"],
  prefix="/todos",
  dependencies=[Depends(oauth2_scheme)]
)

@router.post(
  path="/",
  status_code=status.HTTP_201_CREATED
)
async def handle_create_todo(todo: ToDoIn, db_session: DatabaseSessionDep, access_token: OAuth2PasswordBearerDep) -> ToDoOut:

  payload = validate_access_token(access_token)
  username = payload["sub"]
  user = get_user(username, db_session)
  if not user:
    raise HTTPException(
      status_code=status.HTTP_401_UNAUTHORIZED,
      detail="Invalid authentication credentials: user not found"
    )
  todo = insert_todo(todo, user.id, db_session)
  return todo

@router.get(
    path="/",
    status_code=status.HTTP_200_OK
)
async def read_todos():
  return {"message": "Hier deine ToDos"}


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

