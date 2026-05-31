import { restaurantApi } from "@/lib/axios";
import { CreateOrderRequest } from "@/types/api";
import { Order } from "@/types/models/restaurantModels";

export const ordersService = {
  createOrder: async (data: CreateOrderRequest): Promise<Order> => {
    const response = await restaurantApi.post("/orders", data);
    return response.data;
  },

  getPendingOrders: async (): Promise<Order[]> => {
    const response = await restaurantApi.get("/orders/pending");
    return response.data;
  },

  completeOrder: async (orderId: number): Promise<Order> => {
    const response = await restaurantApi.patch(`/orders/${orderId}/complete`);
    return response.data;
  },

  cancelOrder: async (orderId: number): Promise<Order> => {
    const response = await restaurantApi.patch(`/orders/${orderId}/cancel`);
    return response.data;
  },
};
