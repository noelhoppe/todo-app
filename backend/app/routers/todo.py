"""
Routes for managing 'ToDo' items.

This module contains endpoints for:
- creating todos (POST /todos/)
- reading user-specific todos (GET /todos/)
- updating user-specific todos (PATCH /todos/{id})
- deleting user-specific todos (DELETE /todos/{id})

These routes require an authenticated user and interact with the database through dependencies.

"""