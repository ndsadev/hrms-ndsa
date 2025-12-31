import axios from "axios";
import SummaryApi from "../common/index";

// Axios Instance
const api = axios.create({
  baseURL:
  //  "http://localhost:5000",
  import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // refresh-token API ko loop se bachao
    if (originalRequest?.url?.includes("/refresh-token")) {
      return Promise.reject(error);
    }

    const status = error.response?.status;

    // Access token expired
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token cookie se automatically jayega
        const res = await api.post(SummaryApi.refreshToken.url);

        const { accessToken } = res.data;

        // Save new access token
        localStorage.setItem("accessToken", accessToken);

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);

        // Session expired → logout
        localStorage.removeItem("accessToken");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
