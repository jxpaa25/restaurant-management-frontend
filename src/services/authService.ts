import { authApi } from "@/lib/axios";
import {
  LoginRequest,
  LoginResponse,
  PasswordChangeRequest,
} from "@/types/api";

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await authApi.post("/auth/login", data);
    return response.data;
  },

  changePassword: async (data: PasswordChangeRequest): Promise<string> => {
    const response = await authApi.patch("/auth/change-password", data);
    return response.data;
  },
};
