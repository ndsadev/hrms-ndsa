import { useDispatch } from "react-redux";
import api from "../api/axiosInstance";
import SummaryApi from "../common";
import { clearUser } from "../store/userSlice";

export const useLogout = () => {
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      //  Refresh token cookie automatically jayegi
      await api({
        url: SummaryApi.logout.url,
        method: SummaryApi.logout.method,
      });
    } catch (err) {
      console.warn("Logout API failed, clearing session anyway");
    } finally {
      //  Only accessToken clear karo
      localStorage.removeItem("accessToken");
      dispatch(clearUser());
    }

    return { success: true };
  };

  return { logout };
};
