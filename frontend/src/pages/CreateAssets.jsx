import React, { useState } from "react";
import { FaLaptop } from "react-icons/fa";
import { Container } from "react-bootstrap";
import LaptopAsset from "../components/assets/LaptopAsset";

const CreateAssets = () => {
  const [activeTab, setActiveTab] = useState("laptop");

  return (
    <>
      <style>{`
             .page-header {
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

  /* FIX HERE */
  padding: 8px 40px 8px 18px;   /* right padding zyada */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  /* arrow position control */
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
      `}</style>

      <Container>
        {/* HEADER */}
        <div className="page-header">
          <div>
            <FaLaptop className="me-2" /> Create Assets
          </div>

          <select
            className="asset-select"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <option value="laptop">Laptop</option>
            <option value="mobile">Mobile</option>
            <option value="mouse">Mouse</option>
            <option value="vehicle">Vehicle</option>
          </select>
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
