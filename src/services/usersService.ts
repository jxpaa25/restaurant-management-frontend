import { authApi } from "@/lib/axios";
import { RegisterRequest } from "@/types/api";
import { User } from "@/types/models/identityModels";

export const usersService = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await authApi.get("/auth/users");
    return response.data;
  },

  removeUser: async (userId: number): Promise<string> => {
    const response = await authApi.delete(`/auth/users/${userId}`);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<string> => {
    const response = await authApi.post("/auth/register", data);
    return response.data;
  },
};
