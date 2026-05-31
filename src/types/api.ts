import { OrderItem } from "./models/restaurantModels";

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

export interface CreateMenuItemRequest {
  name: string;
  description: string;
  price: number;
}

export interface CreateOrderRequest {
  tableNumber: number;
  items: {
    menuItemId: number;
    quantity: number;
  }[];
}
