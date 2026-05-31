import { restaurantApi } from "@/lib/axios";
import { RestaurantTable } from "@/types/models/restaurantModels";

export const restaurantTableService = {
  getAllTables: async (): Promise<RestaurantTable[]> => {
    const response = await restaurantApi.get("/tables");
    return response.data;
  },

  createNewTable: async (tableNumber: number): Promise<RestaurantTable> => {
    const response = await restaurantApi.post("/tables", { tableNumber });
    return response.data;
  },

  removeTable: async (tableId: number): Promise<void> => {
    const response = await restaurantApi.delete(`/tables/${tableId}`);
    return response.data;
  },
};
