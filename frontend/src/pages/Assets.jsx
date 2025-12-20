import React, { useState } from "react";
import { FaLaptop } from "react-icons/fa";
import { Container } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Assets = () => {
  const [activeTab, setActiveTab] = useState("laptop");

  const [laptop, setLaptop] = useState({
    company: "",
    model: "",
    serialNo: "",
    assetCode: "",
    assignedTo: "",
    remarks: "",

    purchaseDate: "",
    assetCondition: "",
    purchasedFrom: "",
    warranty: "",
    antivirusStart: "",
    antivirusEnd: "",
    ram: "",
    storage: "",
    processor: "",
  });

  /* =====================
     SUBMIT HANDLER
     (AS IT IS)
  ====================== */
  const handleSubmit = () => {
    const existing =
      JSON.parse(localStorage.getItem("laptopAssets")) || [];

    localStorage.setItem(
      "laptopAssets",
      JSON.stringify([...existing, { ...laptop, id: Date.now() }])
    );

    toast.success("Created Successfully", {
      position: "top-right",
      autoClose: 2000,
    });

    setLaptop({
      company: "",
      model: "",
      serialNo: "",
      assetCode: "",
      assignedTo: "",
      remarks: "",
      purchaseDate: "",
      assetCondition: "",
      purchasedFrom: "",
      warranty: "",
      antivirusStart: "",
      antivirusEnd: "",
      ram: "",
      storage: "",
      processor: "",
    });
  };

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
        .assets-card {
          background: #ffffff;
          border-radius: 14px;
          padding: 26px;
          box-shadow: 0 6px 25px rgba(0,0,0,0.08);
        }

        .asset-inner {
          border: 1px solid #e1e1e1;
          border-radius: 12px;
          padding: 22px;
        }

        .asset-header {
          margin-bottom: 20px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 18px 20px;
        }

        .form-group label {
          font-weight: 600;
          font-size: 14px;
          margin-bottom: 6px;
          display: block;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 11px 12px;
          border-radius: 8px;
          border: 1px solid #cfd6dc;
          outline: none;
          font-size: 14px;
        }

        textarea {
          resize: none;
        }

        .save-btn {
          margin-top: 18px;
          background: #70a664;
          color: white;
          border: none;
          padding: 10px 26px;
          border-radius: 22px;
          font-weight: 600;
          cursor: pointer;
        }

        .empty-box {
          text-align: center;
          padding: 50px;
          color: #6c757d;
          font-weight: 600;
          font-size: 15px;
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <Container>
        {/* HEADER */}
        <div className="page-header">
          <div>
            <FaLaptop className="me-2" size={28} /> Create Assets
          </div>

          {/* DROPDOWN (RIGHT SIDE) */}
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
          {/* ================= LAPTOP ================= */}
           {activeTab === "laptop" && (
            <div className="asset-inner">
              <div className="asset-header">
                <h5>Laptop Asset Details</h5>
              </div>

              <div className="form-grid">
                {/* EXISTING FIELDS */}
                <div className="form-group">
                  <label>Company Name</label>
                  <input
                    value={laptop.company}
                    onChange={(e) =>
                      setLaptop({ ...laptop, company: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Model</label>
                  <input
                    value={laptop.model}
                    onChange={(e) =>
                      setLaptop({ ...laptop, model: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Serial Number</label>
                  <input
                    value={laptop.serialNo}
                    onChange={(e) =>
                      setLaptop({ ...laptop, serialNo: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Asset Code (Sticker)</label>
                  <input
                    value={laptop.assetCode}
                    onChange={(e) =>
                      setLaptop({ ...laptop, assetCode: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Assigned To</label>
                  <input
                    value={laptop.assignedTo}
                    onChange={(e) =>
                      setLaptop({ ...laptop, assignedTo: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Remarks</label>
                  <textarea
                    rows="3"
                    value={laptop.remarks}
                    onChange={(e) =>
                      setLaptop({ ...laptop, remarks: e.target.value })
                    }
                  />
                </div>

                {/* 🔹 NEW FIELDS */}
                <div className="form-group">
                  <label>Date of Purchase</label>
                  <input
                    type="date"
                    value={laptop.purchaseDate}
                    onChange={(e) =>
                      setLaptop({ ...laptop, purchaseDate: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Asset Condition</label>
                  <select
                    value={laptop.assetCondition}
                    onChange={(e) =>
                      setLaptop({ ...laptop, assetCondition: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    <option value="New">New</option>
                    <option value="Refurbished">Refurbished</option>
                    <option value="Rented">Rented</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Purchased From</label>
                  <input
                    value={laptop.purchasedFrom}
                    onChange={(e) =>
                      setLaptop({ ...laptop, purchasedFrom: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Warranty (Months)</label>
                  <input
                    type="number"
                    value={laptop.warranty}
                    onChange={(e) =>
                      setLaptop({ ...laptop, warranty: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Antivirus Start Date</label>
                  <input
                    type="date"
                    value={laptop.antivirusStart}
                    onChange={(e) =>
                      setLaptop({ ...laptop, antivirusStart: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Antivirus End Date</label>
                  <input
                    type="date"
                    value={laptop.antivirusEnd}
                    onChange={(e) =>
                      setLaptop({ ...laptop, antivirusEnd: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>RAM (GB)</label>
                  <input
                    value={laptop.ram}
                    onChange={(e) =>
                      setLaptop({ ...laptop, ram: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Storage</label>
                  <input
                    value={laptop.storage}
                    onChange={(e) =>
                      setLaptop({ ...laptop, storage: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Processor</label>
                  <input
                    value={laptop.processor}
                    onChange={(e) =>
                      setLaptop({ ...laptop, processor: e.target.value })
                    }
                  />
                </div>
              </div>

              <button className="save-btn" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          )}

          {/* ================= OTHERS ================= */}
          {activeTab !== "laptop" && (
            <div className="empty-box">
              {activeTab.toUpperCase()} asset form will be added later 🚧
            </div>
          )}
        </div>
      </Container>

      <ToastContainer />
    </>
  );
};

export default Assets;
