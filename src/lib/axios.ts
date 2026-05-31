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

  // 2. RESPONSE INTERCEPTOR (Magija za automatsko osvežavanje)
  instance.interceptors.response.use(
    (response) => response, // Ako je sve OK, samo vrati odgovor
    async (error: AxiosError) => {
      const originalRequest = error.config as CustomAxiosRequestConfig;

      // Ako je greška 401 (istekao token) i nismo već pokušali refresh na ovom zahtevu
      if (
        error.response?.status === 401 &&
        originalRequest &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true; // Markiramo zahtev da ne bi upali u beskonačnu petlju

        try {
          const refreshToken = localStorage.getItem("refreshToken");

          if (!refreshToken) {
            // Ako nemamo refresh token, nemamo šta da radimo, šalji na login
            window.location.href = "/login";
            return Promise.reject(error);
          }

          // Pozivamo backend za novi access token
          // Koristimo axios (a ne authApi) da izbegnemo presretače za ovaj specifičan poziv
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_AUTH_API_URL}/auth/refresh`,
            {
              refreshToken: refreshToken,
            },
          );

          if (res.status === 200) {
            const newAccessToken = res.data.token;

            // Sačuvaj novi token
            localStorage.setItem("token", newAccessToken);

            // Ažuriraj Authorization header u originalnom zahtevu
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            // Ponovi originalni zahtev sa novim tokenom
            return instance(originalRequest);
          }
        } catch (refreshError) {
          // Ako refresh token ne prolazi (npr. istekao i on nakon 7 dana)
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

// Primeni na OBE instance
setupAuthInterceptor(authApi); // OVO JE FALILO
setupAuthInterceptor(restaurantApi);
