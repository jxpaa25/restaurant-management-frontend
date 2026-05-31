import { authApi } from "@/lib/axios";
import { LoginRequest, LoginResponse, RegisterRequest } from "@/types/api";

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await authApi.post("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<string> => {
    const response = await authApi.post("/auth/register", data);
    return response.data;
  },
};
