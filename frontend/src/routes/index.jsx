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

      // 🔐 PROTECTED DASHBOARD
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "create-users",
            element: <CreateUsers />,
          },
          {
            path: "all-users",
            element: <AllUsers />,
          },
          {
            path: "preboarding-stage",
            element: <Profile />,
          },
          {
            path: "onboarding",
            element: <Onboarding />,
          },
          {
            path: "assets",
            element: <Assets />,
          },
          {
            path: "assets-list",
            element: <AssetsList />,
          },
        ],
      },
    ],
  },
]);

export default router;
