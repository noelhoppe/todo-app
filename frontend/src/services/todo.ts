import { TodoItemRequest, TodoItemResponse, ToDoUpdateRequest } from "../types/todo";

export async function fetchPostTodos(todo: TodoItemRequest): Promise<TodoItemResponse> {
  const ENDPOINT = `${import.meta.env.VITE_API_URL}/todos/`;
  const requestInit: RequestInit = {
    credentials: "include",
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  };
  try {
    console.log(`Sending POST request to: ${ENDPOINT}`);
    console.log(`Request body: ${JSON.stringify(requestInit.body)}`);
    const res = await fetch(ENDPOINT, requestInit);
    if (!res.ok) {
      let errorMessage = "Unknown Error";
      try {
        const errorResponseData = await res.json();
        errorMessage = errorResponseData.detail || errorMessage;
      } catch (error) {
        errorMessage = "Error parsing error response (POST /todos).";
      }
      throw new Error(errorMessage);
    }

    try {
      const successResponseData = await res.json();
      return successResponseData;
    } catch (error) {
      throw new Error("Error parsing successful response (POST /todos).");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Todo creation failed: ${error.message}`);
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function fetchGetTodos(): Promise<TodoItemResponse[]> {
  const ENDPOINT = `${import.meta.env.VITE_API_URL}/todos/`;
  const requestInit: RequestInit = {
    credentials: "include",
    method: "GET",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await fetch(ENDPOINT, requestInit);
    if (!res.ok) {
      let errorMessage = "Unknown Error";
      try {
        const errorResponseData = await res.json();
        errorMessage = errorResponseData.detail || errorMessage;
      } catch (error) {
        errorMessage = "Error parsing error response (GET /todos).";
      }
      throw new Error(errorMessage);
    }
    try {
      const successResponseData : TodoItemResponse[] = await res.json();
      return successResponseData;
    } catch (error) {
      throw new Error("Error parsing successful response (GET /todos).");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Todo retrieval failed: ${error.message}`);
    }
    throw new Error("An unexpected error occurred");
  }
}


export async function fetchDeleteTodo(id: number) {
  const ENDPOINT = `${import.meta.env.VITE_API_URL}/todos/${id}`;
  const requestInit: RequestInit = {
    credentials: "include",
    method: "DELETE",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await fetch(ENDPOINT, requestInit)
    if (!res.ok) {
      let errorMessage = "Unknown Error";
      try {
        const errorResponseData = await res.json();
        errorMessage = errorResponseData.detail || errorMessage;
      } catch (error) {
        errorMessage = "Error parsing error response (DELETE /todos).";
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Todo deletion failed: ${error.message}`);
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function fetchPatchTodo(id: number, todo: ToDoUpdateRequest) {
  const ENDPOINT = `${import.meta.env.VITE_API_URL}/todos/${id}`;
  const requestInit: RequestInit = {
    credentials: "include",
    method: "PATCH",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  };
  try {
    const res = await fetch(ENDPOINT, requestInit);
    if (!res.ok) {
      let errorMessage = "Unknown Error";
      try {
        const errorResponseData = await res.json();
        errorMessage = errorResponseData.detail || errorMessage;
      } catch (error) {
        errorMessage = "Error parsing error response (PATCH /todos).";
      }
      throw new Error(errorMessage);
    }
    try {
      const successResponseData: TodoItemResponse = await res.json();
      return successResponseData;
    } catch (error) {
      throw new Error("Error parsing successful response (PATCH /todos).");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Todo update failed: ${error.message}`);
    }
    throw new Error("An unexpected error occurred");
  }
}