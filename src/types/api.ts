export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  isFirstLogin: boolean;
}

export type Role = "ROLE_ADMIN" | "ROLE_MANAGER" | "ROLE_WAITER";

export interface RegisterRequest {
  username: string;
  password: string;
  roles: Set<Role>;
}
