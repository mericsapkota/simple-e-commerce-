export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}
export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  access_token: string;
}
export interface SignupResponse {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface LoginCreds {
  email: string;
  password: string;
}
export interface RegisterCreds {
  email: string;
  password: string;
  username: string;
  role: string;
}

export interface JWTPayload {
  userId: number;
  role: string;
}
