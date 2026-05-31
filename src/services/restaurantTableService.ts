import { restaurantApi } from "@/lib/axios";
import { RestaurantTable } from "@/types/models/restaurantModels";

export const restaurantTableService = {
  getAllTables: async (): Promise<RestaurantTable[]> => {
    const response = await restaurantApi.get("/tables");
    return response.data;
  },
};
