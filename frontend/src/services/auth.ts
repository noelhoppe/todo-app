import { ErrorOutline } from "@mui/icons-material";
import { LoginFailure, LoginRequest, LoginSuccess } from "../types/auth";

async function fetchLogin(credentials: LoginRequest): Promise<LoginSuccess> {
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
        const loginFailureData: LoginFailure = await res.json()
        errorMessage = loginFailureData.detail || errorMessage;
      }
      catch(error) {
        errorMessage = "Error parsing error response (POST /login)."
      }
      throw new Error(errorMessage);
    }

    // -- API SUCCESSFULL RESPONSE
    try {
      const loginSuccessData: LoginSuccess = await res.json()
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

async function fetchIsAuthorized() {
  const ENDPOINT = `${import.meta.env.VITE_API_URL}/isAuthorized/`;
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
        const errorResponseData: LoginFailure = await res.json();
        errorMessage = errorResponseData.detail || errorMessage;
      } catch(error) {
        errorMessage = "Error parsing error reponse (GET /isAuthorized).";
      }
      throw new Error(errorMessage);
    }

    try {
      const successfullResponseData: LoginSuccess = await res.json();
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

export {
  fetchLogin,
  fetchIsAuthorized
};