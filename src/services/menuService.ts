import { restaurantApi } from "@/lib/axios";
import { Category, MenuItem } from "@/types/models/restaurantModels";
import { CreateMenuItemRequest } from "@/types/api";

export const menuService = {
  getAllItems: async (): Promise<MenuItem[]> => {
    const response = await restaurantApi.get("/menu/items");
    return response.data;
  },

  getAllCategories: async (): Promise<Category[]> => {
    const response = await restaurantApi.get("/menu/categories");
    return response.data;
  },

  getItemsByCategory: async (categoryId: number): Promise<MenuItem[]> => {
    const response = await restaurantApi.get(
      `/menu/items/category/${categoryId}`,
    );
    return response.data;
  },

  createCategory: async (name: string): Promise<Category> => {
    const response = await restaurantApi.post("/menu/categories", { name });
    return response.data;
  },

  deleteCategory: async (categoryId: number): Promise<void> => {
    await restaurantApi.delete(`/menu/categories/${categoryId}`);
  },

  createMenuItem: async (
    data: CreateMenuItemRequest,
    categoryId: number,
  ): Promise<MenuItem> => {
    const response = await restaurantApi.post(`menu/items/${categoryId}`, data);
    return response.data;
  },

  toggleMenuItemAvailability: async (
    menuItemId: number,
    isAvailable: boolean,
  ) => {
    const response = await restaurantApi.patch(
      `/menu/items/${menuItemId}/availability`,
      null,
      {
        params: {
          available: isAvailable,
        },
      },
    );
    return response.data;
  },

  deleteMenuItem: async (menuItemId: number): Promise<void> => {
    await restaurantApi.delete(`/menu/items/${menuItemId}`);
  },
};
