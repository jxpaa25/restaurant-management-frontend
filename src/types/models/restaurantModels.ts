export interface Category {
  id: number;
  name: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  category: Category;
}

export enum OrderStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Order {
  id: number;
  waiterUsername: string;
  table: {
    id: number;
    tableNumber: number;
  };
  totalPrice: number;
  createdAt: string;
  status: OrderStatus;
  items: Array<{
    id: number;
    menuItem: { name: string; price: number };
    quantity: number;
  }>;
}
