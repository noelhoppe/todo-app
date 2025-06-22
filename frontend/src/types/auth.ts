// --- REQUEST ---
export type LoginRequest = {
  username: string;
  password: string;
}
export type RegisterRequest = LoginRequest & {
  repeatPassword: string; // frontend only, not sent to the backend
}

// --- RESPONSE ---
export type Success = {
  message: string
};

export type Failure = {
  detail: string;
};

export type Response = Success | Failure;

// --- CONTEXT ---
export type AuthContext = {
  login: (credentials: LoginRequest) => Promise<Success>;
  logout: () => Promise<Success>;
  isAuthenticated: () => Promise<boolean>;
}