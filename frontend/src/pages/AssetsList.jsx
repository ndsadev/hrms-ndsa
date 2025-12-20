import React, { useEffect, useState } from "react";
import { FaTrash, FaEye, FaEdit, FaCopy } from "react-icons/fa";
import { Container } from "react-bootstrap";

const AssetsList = () => {
  const [activeTab, setActiveTab] = useState("laptop");
  const [data, setData] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const key = activeTab === "laptop" ? "laptopAssets" : "mobileAssets";
    const list = JSON.parse(localStorage.getItem(key)) || [];
    setData(list);
    setCurrentPage(1);
  }, [activeTab]);

  const handleDelete = (id) => {
    const key = activeTab === "laptop" ? "laptopAssets" : "mobileAssets";
    const updated = data.filter((item) => item.id !== id);
    localStorage.setItem(key, JSON.stringify(updated));
    setData(updated);
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
  };

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <style>{`
        .assets-card {
          padding: 0;
        }

        /* HEADER */
        .page-header {
          background: #70a664a1;
          padding: 12px 24px;
          color: white;
          font-size: 22px;
          font-weight: 700;
          border-radius: 8px;
          margin-bottom: 20px;
          border: 1px solid #70a66433;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .asset-filter {
          font-size: 14px;
          height: 34px;
          padding: 4px 34px 4px 14px;
          border-radius: 20px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          appearance: none;
          background: white
            url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%23000000' d='M5.5 7.5l4.5 4.5 4.5-4.5'/%3E%3C/svg%3E")
            no-repeat right 10px center;
          background-size: 14px;
        }

        /* TABLE */
        .table-wrapper {
          background: #ffffff;
          border: 1px solid #d9e1e8;
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 6px 25px rgba(0,0,0,0.06);
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        thead {
          background: #06406e;
        }

        th {
          color: white;
          padding: 10px;
          font-size: 15px;
          text-align: center;
        }

        td {
          padding: 9px;
          font-size: 15px;
          text-align: center;
          border-bottom: 1px solid #e2e6ea;
        }

        tr:last-child td {
          border-bottom: none;
        }

        /* ACTION ICONS */
        .action-icons {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .icon-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          cursor: pointer;
        }

        .icon-view { background: #d0e1fa; color: #1d4ed8; }
        .icon-edit { background: #c8ecd8; color: #15803d; }
        .icon-delete { background: #fad9d9; color: #dc2626; }
        .icon-copy { background: #cee2f7; color: #334155; }

        /* PAGINATION OUTER BOX 🔥 */
        .pagination-container {
          margin-top: 20px;
          display: flex;
          justify-content: flex-end;
        }

        .pagination-box {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 14px;
          background: #ffffff;
          border: 2px solid #b7d3b1;
          border-radius: 40px;
        }

        .page-btn {
          background: #06406e;
          color: white;
          border: none;
          padding: 8px 18px;
          border-radius: 22px;
          cursor: pointer;
          font-weight: 600;
        }

        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-number {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          font-weight: 600;
          cursor: pointer;
        }

        .page-number.active {
          background: #06406e;
          color: white;
          border-radius: 50%;
        }
      `}</style>

      <Container>
        <div className="assets-card">
          {/* HEADER */}
          <div className="page-header">
            <span>Assets List</span>
            <select
              className="asset-filter"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="laptop">Laptop</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>

          {/* TABLE */}
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Company</th>
                  <th>Assigned To</th>
                  <th>Asset Code</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item, index) => (
                  <tr key={item.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>{item.company}</td>
                    <td>{item.assignedTo}</td>
                    <td>{item.assetCode}</td>
                    <td>
                      <div className="action-icons">
                        <div className="icon-btn icon-view"><FaEye /></div>
                        <div className="icon-btn icon-edit"><FaEdit /></div>
                        <div
                          className="icon-btn icon-delete"
                          onClick={() => handleDelete(item.id)}
                        >
                          <FaTrash />
                        </div>
                        <div
                          className="icon-btn icon-copy"
                          onClick={() => handleCopy(item.assetCode)}
                        >
                          <FaCopy />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination-box">
                <button
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    className={`page-number ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  className="page-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </>
  );
};

export default AssetsList;
