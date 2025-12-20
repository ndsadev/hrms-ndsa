import { useDispatch } from "react-redux";
import api from "../api/axiosInstance";
import SummaryApi from "../common";
import { clearUser } from "../store/userSlice";

export const useLogout = () => {
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        await api({
          url: SummaryApi.logout.url,
          method: SummaryApi.logout.method,
          data: { refreshToken },
        });
      }
    } catch (err) {
      console.warn("Logout API failed, clearing session anyway");
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      dispatch(clearUser());
    }

    return { success: true };
  };

  return { logout };
};
