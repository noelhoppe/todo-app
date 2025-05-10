import { LoginFailure, LoginRequest, LoginResponse, LoginSuccess } from "../types/auth";

async function fetchLogin(credentials: LoginRequest): Promise<LoginResponse> {
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
  const res: Response = await fetch(ENDPOINT, requestInit)
  if (!res.ok) { // statuscode not in range 200-299
    const loginFailureData: LoginFailure = await res.json()
    return loginFailureData;
  }
  const loginSuccessData: LoginSuccess = await res.json()
  return loginSuccessData;
}

export {
  fetchLogin
}