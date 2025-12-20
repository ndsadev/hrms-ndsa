import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* CSS SAME AS BEFORE */}
    
      <style>{`
        .layout {
          display: flex;
          height: 100vh;
          overflow: hidden;
        }

        /* SIDEBAR DESKTOP */
        .sidebar {
          width: 265px;
          background: #06406e;
          color: white;
          padding: 20px 15px;
          transition: width 0.35s ease, transform 0.35s ease;
          overflow: hidden;
          z-index: 10;
        }

        .sidebar.collapsed {
          width: 78px;
        }

        /* PROFILE SECTION */
        .profile-row {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 5px 5px 20px 0px;
          border-bottom: 1px solid rgba(255,255,255,0.4);
        }

        .profile-icon-wrapper {
          width: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .profile-icon {
          font-size: 48px;
          transition: font-size 0.3s ease;
        }

        .sidebar.collapsed .profile-icon {
          font-size: 40px;
        }

        .profile-info {
          opacity: 1;
          transition: opacity 0.3s ease;
        }

        .sidebar.collapsed .profile-info {
          opacity: 0;
        }

        .profile-name {
          font-size: 17px;
          font-weight: 600;
        }

        .profile-role {
          font-size: 13px;
          opacity: 0.8;
        }

        /* BURGER BUTTON */
        .sidebar-toggle-btn {
          background: rgba(255,255,255,0.15);
          border: none;
          color: white;
          padding: 8px;
          border-radius: 8px;
          font-size: 20px;
          width: 45px;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.25s ease;
        }

        .sidebar-toggle-btn:hover {
          background: rgba(255,255,255,0.25);
        }

        /* MENU ITEMS */
        .menu-item {
          color: white !important;
          padding: 8px 19px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 14px;
          transition: background 0.3s ease;
          text-decoration: none;
        }

        .menu-item:not(:last-child) {
          margin-bottom: 8px;
        }

        .menu-item:hover {
          background: #70a66470;
        }

        /* ACTIVE MENU */
        .active-menu {
          background: #70a664 !important;
          border-radius: 10px;
          color: #fff !important;
          text-decoration: none;
        }

        .menu-text {
          opacity: 1;
          transition: opacity 0.3s ease;
        }

        .sidebar.collapsed .menu-text {
          opacity: 0;
        }

        .sidebar.collapsed .active-menu {
          border-radius: 50% !important;
          width: 45px !important;
          height: 45px !important;
          padding: 0 !important;
          justify-content: center !important;
          align-items: center !important;
        }

        .sidebar.collapsed .active-menu .menu-text {
          display: none !important;
        }

        /* RIGHT CONTENT */
        .content-area {
          flex: 1;
          overflow-y: auto;
          position: relative;
        }

        /* DESKTOP SHOULD HIDE HEADER */
        .top-header {
          display: none;
        }

        .page-content {
          padding: 13px 13px;
        }

        /* MOBILE OVERLAY SIDEBAR */
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            height: 100vh;
            left: 0;
            top: 0;
            transform: translateX(-100%);
            width: 320px !important;
          }

          .sidebar.mobile-open {
            transform: translateX(0);
          }

          .sidebar.collapsed {
            width: 320px !important;
          }

          .mobile-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(0,0,0,0.5);
            z-index: 5;
          }

          /* MOBILE SHOULD SHOW HEADER */
          .top-header {
            display: flex !important;
            background: white;
            padding: 15px 20px;
            border-bottom: 1px solid #e5e5e5;
            justify-content: space-between;
            align-items: center;
          }
        }
      `}</style>

      <div className="layout">
        {/* SIDEBAR */}
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* CONTENT */}
        <div className="content-area">
          {/* MOBILE HEADER */}
          <div className="top-header">
            <div onClick={() => setMobileOpen(true)}>
              <FaBars size={26} style={{ cursor: "pointer" }} />
            </div>
            <h5 className="m-0">Dashboard</h5>
          </div>

          <div className="page-content">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
