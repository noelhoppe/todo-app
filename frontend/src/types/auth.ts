// --- REQUEST ---
export type LoginRequest = {
  username: string;
  password: string;
}

// --- RESPONSE ---
export type LoginSuccess = {
  message: string
};

export type LoginFailure = {
  detail: string;
};

export type LoginResponse = LoginSuccess | LoginFailure;

// --- CONTEXT ---
export type AuthContext = {
  login: (credentials: LoginRequest) => Promise<LoginSuccess>;
  isAuthenticated: () => Promise<boolean>;
}