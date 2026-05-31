import axios from "axios";

// Instance for Identity service
export const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Instance for Restaurant service
export const restaurantApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_RESTAURANT_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

restaurantApi.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
