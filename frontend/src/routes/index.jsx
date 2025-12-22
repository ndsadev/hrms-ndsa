import App from "../App.jsx";
import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import CreateUsers from "../pages/CreateUsers.jsx";
import AllUsers from "../pages/AllUsers.jsx";
import Profile from "../pages/PreboardingStage.jsx";
import Onboarding from "../pages/Onboarding.jsx";
import Assets from "../pages/Assets.jsx";
import AssetsList from "../pages/AssetsList.jsx";
import EmployeeList from "../pages/EmployeeList.jsx";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Login />,
      },

      // DASHBOARD (LOGIN REQUIRED)
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
        children: [
          // SUPER ADMIN ONLY
          {
            path: "create-users",
            element: (
              <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <CreateUsers />
              </ProtectedRoute>
            ),
          },
          {
            path: "all-users",
            element: (
              <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
                <AllUsers />
              </ProtectedRoute>
            ),
          },

          // HR
          {
            path: "employee-list",
            element: (
              <ProtectedRoute allowedRoles={["HR"]}>
                <EmployeeList />
              </ProtectedRoute>
            ),
          },
          {
            path: "preboarding-stage",
            element: (
              <ProtectedRoute allowedRoles={["HR"]}>
                <Profile />
              </ProtectedRoute>
            ),
          },
          {
            path: "onboarding",
            element: (
              <ProtectedRoute allowedRoles={["HR"]}>
                <Onboarding />
              </ProtectedRoute>
            ),
          },

          // ADMIN ONLY
          {
            path: "assets",
            element: (
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Assets />
              </ProtectedRoute>
            ),
          },
          {
            path: "assets-list",
            element: (
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <AssetsList />
              </ProtectedRoute>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
