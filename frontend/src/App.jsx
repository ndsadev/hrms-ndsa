import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";

import api from "./api/axiosInstance";
import SummaryApi from "./common";
import { setUserDetails, clearUser } from "./store/userSlice";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) return;

    const fetchUserDetails = async () => {
      try {
        const res = await api({
          url: SummaryApi.getUserDetails.url,
          method: SummaryApi.getUserDetails.method,
        });

        dispatch(setUserDetails(res.data.user));
      } catch {
        dispatch(clearUser());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    };

    fetchUserDetails();
  }, [dispatch]);

  return (
    <>
      <div className="app-wrapper">
        <Outlet />
      </div>

      {/* 🔥 STABLE TOAST CONTAINER */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
    </>
  );
}

export default App;
