import axios from "axios";
import SummaryApi from "../common/index";

// Axios Instance
const api = axios.create({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Intercepter
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Request Intercepter
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    //  Skip refresh token call itself
    if (
      originalRequest?.url?.includes("/refresh-token")
    ) {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const errorMessage =
      error.response?.data?.message?.toLowerCase() || "";

    const isJwtExpired =
      (status === 401 || status === 403) &&
      (errorMessage.includes("jwt expired") ||
        errorMessage.includes("token expired")) &&
      !originalRequest._retry;

    if (isJwtExpired) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.warn("No refresh token found. Redirecting to login...");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        //  Refresh token using SAME instance
        const res = await api.post(
          SummaryApi.refreshToken.url,
          { refreshToken }
        );

        const {
          accessToken,
          refreshToken: newRefreshToken,
        } = res.data;

        //  Save new tokens
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        //  Retry original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
