"""
Routes for managing 'ToDo' items.

This module contains endpoints for:
- creating todos (POST /todos/)
- reading user-specific todos (GET /todos/)
- updating user-specific todos (PATCH /todos/{id})
- deleting user-specific todos (DELETE /todos/{id})

These routes require an authenticated user and interact with the database through dependencies.

"""


from fastapi import status
from fastapi.routing import APIRouter

router = APIRouter(
  tags=["todo"],
  prefix="/todos"
)

@router.post(
  path="/",
  status_code=status.HTTP_201_CREATED
)
async def create_todo():
  return {"message": "ToDo created"}


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

