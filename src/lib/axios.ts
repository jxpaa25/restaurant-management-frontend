import axios, { AxiosInstance } from "axios";

// Instance za Identity service
export const authApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Instance za Restaurant service
export const restaurantApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_RESTAURANT_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Funkcija koja dodaje token na bilo koju Axios instancu
const setupAuthInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          // Osiguravamo ispravan Bearer format
          const finalToken = token.startsWith("Bearer ")
            ? token
            : `Bearer ${token}`;
          config.headers.Authorization = finalToken;
        }
      }
      return config;
    },
    (error) => Promise.reject(error),
  );
};

// Primeni na OBE instance
setupAuthInterceptor(authApi); // OVO JE FALILO
setupAuthInterceptor(restaurantApi);
