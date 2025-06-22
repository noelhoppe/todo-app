import { Failure, LoginRequest, Success } from "../types/auth";

export async function fetchLogin(credentials: LoginRequest): Promise<Success> {
  const ENDPOINT = `${import.meta.env.VITE_API_URL}/login/`;
  const { username, password } = credentials;
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  const requestInit: RequestInit = {
    credentials: "include",
    method: "POST",
    mode: "cors",
    body: formData
  };
  try {
    const res: Response = await fetch(ENDPOINT, requestInit)
    // --- API ERROR RESPONSE
    if (!res.ok) {
      let errorMessage = "Unknown Error";
      try {
        const loginFailureData: Failure = await res.json()
        errorMessage = loginFailureData.detail || errorMessage;
      }
      catch(error) {
        errorMessage = "Error parsing error response (POST /login)."
      }
      throw new Error(errorMessage);
    }

    // -- API SUCCESSFULL RESPONSE
    try {
      const loginSuccessData: Success = await res.json()
      return loginSuccessData;
    } catch(error) {
        throw new Error("Error parsing successfull login reponse (POST /login).")
    }

  } catch(error) {
    if (error instanceof Error) {
      throw new Error(`Login failed: ${error.message}`)
    }
    throw new Error("An unexpected error occured")
  }
}

export async function fetchIsAuthorized() {
  const ENDPOINT = `${import.meta.env.VITE_API_URL}/is_authorized/`;
  const requestInit: RequestInit = {
    credentials: "include",
    method: "GET",
    mode: "cors",
  };
  try {
    const res = await fetch(ENDPOINT, requestInit)
    if (!res.ok) {
      let errorMessage = "Unknwon Error";
      try {
        const errorResponseData: Failure = await res.json();
        errorMessage = errorResponseData.detail || errorMessage;
      } catch(error) {
        errorMessage = "Error parsing error reponse (GET /isAuthorized).";
      }
      throw new Error(errorMessage);
    }

    try {
      const successfullResponseData: Success = await res.json();
      return successfullResponseData;
    } catch(error) {
      throw new Error("Error parsing successfull response (GET /isAuthorized).")
    }
  } catch(error) {
    if (error instanceof Error) {
      throw new Error(`Authetication failed: ${error.message}`);
    }
    throw new Error("An unexpected error occured");
  }
}

export async function fetchRegister(credentials: LoginRequest): Promise<Success> {
  const ENDPOINT = `${import.meta.env.VITE_API_URL}/register/`;
  const { username, password } = credentials;
  const formData = new FormData();
  formData.append("username", username);
  formData.append("password", password);
  const requestInit: RequestInit = {  
    credentials: "include",
    method: "POST",
    mode: "cors",
    body: formData
  };
  try {
    const res: Response = await fetch(ENDPOINT, requestInit);
    // --- API ERROR RESPONSE
    if (!res.ok) {
      let errorMessage = "Unknown Error";
      try {
        const loginFailureData: Failure = await res.json();
        errorMessage = loginFailureData.detail || errorMessage;
      } catch(error) {
        errorMessage = "Error parsing error response (POST /register).";
      }
      throw new Error(errorMessage);
    }

    // -- API SUCCESSFULL RESPONSE
    try {
      const registerSuccessData: Success = await res.json();
      return registerSuccessData;
    } catch(error) {
      throw new Error("Error parsing successfull register reponse (POST /register).");
    }
  } catch(error) {
    if (error instanceof Error) {
      throw new Error(`Register failed: ${error.message}`);
    }
    throw new Error("An unexpected error occured");
  }
}

export async function fetchLogout(): Promise<Success> {
  const ENDPOINT = `${import.meta.env.VITE_API_URL}/logout/`;
  const requestInit: RequestInit = {
    credentials: "include",
    method: "POST",
    mode: "cors",
  };
  try {
    const res: Response = await fetch(ENDPOINT, requestInit);
    // --- API ERROR RESPONSE
    if (!res.ok) {
      let errorMessage = "Unknown Error";
      try {
        const logoutFailureData: Failure = await res.json();
        errorMessage = logoutFailureData.detail || errorMessage;
      } catch(error) {
        errorMessage = "Error parsing error response (POST /logout).";
      }
      throw new Error(errorMessage);
    }

    // -- API SUCCESSFULL RESPONSE
    try {
      const logoutSuccessData: Success = await res.json();
      return logoutSuccessData;
    } catch(error) {
      throw new Error("Error parsing successfull logout reponse (POST /logout).");
    }
  } catch(error) {
    if (error instanceof Error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
    throw new Error("An unexpected error occured");
  }
}