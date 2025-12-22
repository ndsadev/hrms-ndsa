import React from "react";
import { Nav } from "react-bootstrap";
import {
  FaBars,
  FaUserPlus,
  FaUsers,
  FaClipboardCheck,
  FaUserCheck,
  FaBriefcase,
  FaUserTimes,
  FaLaptop,
  FaListAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useLogout } from "../hooks/useLogout";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

//  Role Based Menu Config
const roleMenus = {
  SUPER_ADMIN: [
    { label: "Create Users", path: "create-users", icon: <FaUserPlus size={18} /> },
    { label: "All Users", path: "all-users", icon: <FaUsers size={18} /> },
  ],

  HR: [
    { label: "Employee List", path: "employee-list", icon: <FaClipboardCheck size={18} /> },
    { label: "Preboarding Stage", path: "preboarding-stage", icon: <FaClipboardCheck size={18} /> },
    { label: "Onboarding", path: "onboarding", icon: <FaUserCheck size={18} /> },
    { label: "Active Employment", path: "active-employment", icon: <FaBriefcase size={18} /> },
    { label: "Exit", path: "exit", icon: <FaUserTimes size={18} /> },
  ],

  ADMIN: [
    { label: "Create Assets", path: "assets", icon: <FaLaptop size={18} /> },
    { label: "Assets List", path: "assets-list", icon: <FaListAlt size={18} /> },
  ],
};

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const navigate = useNavigate();
  const { logout } = useLogout();

  const handleLogout = () => {
    toast.warn(
      ({ closeToast }) => (
        <div>
          <p style={{ marginBottom: 10 }}>
            Are you sure you want to logout?
          </p>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn btn-danger btn-sm"
              onClick={async () => {
                closeToast();

                const res = await logout();

                if (res?.success) {
                  // ONLY NAVIGATE WITH STATE
                  navigate("/", {
                    replace: true,
                    state: { fromLogout: true },
                  });
                }
              }}
            >
              Logout
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={closeToast}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false }
    );
  };


  // Logged-in user
  const user = useSelector((state) => state.user.user);
  const role = user?.role;

  // Initials
  const getInitials = (name = "") => {
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
  };

  const initials = user?.name ? getInitials(user.name) : "?";

  const formatRole = (role) =>
    role
      ?.toLowerCase()
      .split("_")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  // FINAL MENU BASED ON ROLE
  const sidebarModules = roleMenus[role] || [];

  return (
    <>
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div
        className={`sidebar ${collapsed ? "collapsed" : ""} ${mobileOpen ? "mobile-open" : ""
          }`}
      >
        {/* TOGGLE */}
        <button
          className="sidebar-toggle-btn"
          onClick={() => {
            if (window.innerWidth <= 768) {
              setMobileOpen(false);
            } else {
              setCollapsed(!collapsed);
            }
          }}
        >
          <FaBars />
        </button>

        {/* Profile */}
        {!collapsed ? (
          <div
            className="profile-row mt-4"
            style={{
              background: "linear-gradient(135deg, #06406e, #0a5c9e)",
              borderRadius: "14px",
              padding: "14px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
              color: "#fff",
              marginInline: "10px",
            }}
          >
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: "#ffffff",
                color: "#06406e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              {initials}
            </div>

            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>
                {user?.name || "Loading..."}
              </div>
              <div style={{ fontSize: 12, opacity: 0.85 }}>
                ({formatRole(user?.role)})
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-4 d-flex justify-content-center">
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "#ffffff",
                color: "#06406e",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
              }}
            >
              {initials}
            </div>
          </div>
        )}

        <Nav className="flex-column mt-3">
          {sidebarModules.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `menu-item ${isActive ? "active-menu" : ""}`
              }
            >
              {item.icon}
              {!collapsed && (
                <span className="menu-text">{item.label}</span>
              )}
            </NavLink>
          ))}

          {/* LOGOUT – ALL ROLES */}
          <div
            className="menu-item"
            onClick={handleLogout}
            style={{ cursor: "pointer" }}
          >
            <FaSignOutAlt size={18} />
            {!collapsed && <span className="menu-text">Logout</span>}
          </div>

        </Nav>
      </div>
    </>
  );
};

export default Sidebar;
