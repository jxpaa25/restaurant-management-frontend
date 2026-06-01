import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

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

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem("refreshToken");

          if (!refreshToken) {
            window.location.href = "/login";
            return Promise.reject(error);
          }

          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/refresh`,
            {
              refreshToken: refreshToken,
            },
          );

          if (res.status === 200) {
            const newAccessToken = res.data.token;

            localStorage.setItem("token", newAccessToken);

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return instance(originalRequest);
          }
        } catch (refreshError) {
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    },
  );
};

setupAuthInterceptor(authApi);
setupAuthInterceptor(restaurantApi);
