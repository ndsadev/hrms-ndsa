import { useState } from "react";
import { useDispatch } from "react-redux";

import api from "../api/axiosInstance";
import SummaryApi from "../common";
import { setUser, setLoading, setError } from "../store/userSlice";

export const useLogin = () => {
  const dispatch = useDispatch();

  const [error, setLocalError] = useState(null);

  const login = async (form) => {
    setLocalError(null);
    dispatch(setLoading(true));

    try {
      const res = await api({
        url: SummaryApi.signIn.url,
        method: SummaryApi.signIn.method,
        data: form,
      });

      const { accessToken, refreshToken, user } = res.data;

      // Save tokens
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // Redux update
      dispatch(
        setUser({
          user,
          token: accessToken,
        })
      );

      // clear any previous error
      dispatch(setError(null));
      setLocalError(null);

      dispatch(setLoading(false));

      // MUST return user for role-based redirect
      return {
        success: true,
        user,
      };
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Try again.";

      setLocalError(msg);
      dispatch(setError(msg));
      dispatch(setLoading(false));

      return {
        success: false,
        message: msg,
      };
    }
  };

  return {
    login,
    error,
  };
};
