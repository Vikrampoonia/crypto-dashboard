import axios from "axios";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // your backend
});

// Request interceptor: attach access token
api.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Response interceptor: handle token expiry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { refreshToken, setAccessToken, logout } = useAuthStore.getState();

    if (error.response?.status === 401 && refreshToken) {
      try {
        // Request new access token
        const res = await axios.post("http://localhost:5000/api/auth/refresh", {
          refreshToken,
        });
        const newAccessToken = res.data.accessToken;

        setAccessToken(newAccessToken);

        // Retry original request with new token
        error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        return api.request(error.config);
      } catch (err) {
        logout();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
