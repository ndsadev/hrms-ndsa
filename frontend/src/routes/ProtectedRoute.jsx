import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRef } from "react";

//  role wise safe fallback
const roleFallbackRoute = {
  SUPER_ADMIN: "/dashboard/all-users",
  HR: "/dashboard/employee-list",
  ADMIN: "/dashboard/assets",
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  const { user, loading } = useSelector((state) => state.user);

  //  toast ko repeat hone se rokne ke liye
  const toastShownRef = useRef(false);

  // wait until auth restore
  if (loading) {
    return null; // or <Loader />
  }

  // not logged in
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (!toastShownRef.current) {
      toast.info("You don’t have access to that module");
      toastShownRef.current = true;
    }

    const fallback =
      roleFallbackRoute[user.role] || "/dashboard";

    return (
      <Navigate
        to={fallback}
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // allowed
  return children;
};

export default ProtectedRoute;
