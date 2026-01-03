import React, { useState } from "react";
import { FaLaptop } from "react-icons/fa";
import { Container } from "react-bootstrap";
import LaptopAsset from "../components/assets/LaptopAsset";

const CreateAssets = () => {
  const [activeTab, setActiveTab] = useState("laptop");
  const [open, setOpen] = useState(false);

  return (
    <>
      <style> {
        ` .page-header {
            background: #70a664a1;
            padding: 13px 30px;
            color: white;
            font-size: 25px;
            font-weight: 700;
            border-radius: 8px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .asset-select {
            background: white;
            color: #06406e;
            border-radius: 25px;
            padding: 8px 40px 8px 18px;
            /* right padding zyada */
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='%2306406e' viewBox='0 0 16 16'%3E%3Cpath d='M1.5 5.5l6 6 6-6'/%3E%3C/svg%3E");
            background-repeat: no-repeat;
            background-position: right 16px center;
            background-size: 14px;

            font-weight: 600;
            border: none;
            outline: none;
            cursor: pointer;
            font-size: 15px;
        }

        .asset-dropdown {
            position: relative;
        }

        .asset-dropdown-trigger {
            background: white;
            padding: 4px 14px;
            border-radius: 22px;
            cursor: pointer;
            font-weight: 500;
            font-size: 15px;
            color: #000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            min-width: 120px;
            line-height: 1.2;
        }

        .asset-dropdown-trigger .arrow {
            font-size: 23px;
            color: #000;
        }

        .asset-dropdown-menu {
            position: absolute;
            top: calc(100% + 6px);
            right: 0;
            width: 100%;
            background: white;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
            max-height: 96px;
            overflow-y: auto;
            z-index: 9999;
        }

        .asset-option {
            padding: 8px 14px;
            font-size: 14px;
            font-weight: 500;
            color: #000;
            cursor: pointer;
            line-height: 1.2;
        }

        .asset-option:hover,
        .asset-option.active {
            background: #70a664;
            color: #fff;
        }

        .asset-dropdown-menu::-webkit-scrollbar {
            width: 5px;
        }

        .asset-dropdown-menu::-webkit-scrollbar-thumb {
            background: #70a664;
            border-radius: 10px;
        }
`}
      </style>

      <Container>
        {/* HEADER */}
        <div className="page-header">
          <div>
            <FaLaptop className="me-2" /> Create Assets
          </div>

          <div className="asset-dropdown">
            <div
              className="asset-dropdown-trigger"
              onClick={() => setOpen((prev) => !prev)}
            >
              <span>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
              <span className="arrow">▾</span>
            </div>

            {open && (
              <div className="asset-dropdown-menu">
                {["laptop", "mobile", "mouse", "vehicle"].map((item) => (
                  <div
                    key={item}
                    className={`asset-option ${activeTab === item ? "active" : ""
                      }`}
                    onClick={() => {
                      setActiveTab(item);
                      setOpen(false);
                    }}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        <div className="assets-card">
          {activeTab === "laptop" && <LaptopAsset />}

          {activeTab !== "laptop" && (
            <div className="empty-box">
              {activeTab.toUpperCase()} asset form will be added later 🚧
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default CreateAssets;
