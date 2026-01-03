import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { FaEye, FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/axiosInstance";
import SummaryApi from "../common";
import { setLaptopAssets } from "../store/laptopAssetSlice";
import CommonTable from "../components/Table";

const AssetsList = () => {
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.laptopAssets);

  const [activeTab, setActiveTab] = useState("laptop");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 9;

  /* ==========================
     FETCH LAPTOP ASSETS
  ========================== */
  useEffect(() => {
    if (activeTab !== "laptop") return;

    const fetchAssets = async () => {
      try {
        const res = await api({
          url: SummaryApi.getAllLaptopAssets.url,
          method: SummaryApi.getAllLaptopAssets.method,
        });

        dispatch(setLaptopAssets(res.data?.data || []));
        setCurrentPage(1);
      } catch (err) {
        console.error("Failed to load laptop assets");
      }
    };

    fetchAssets();
  }, [activeTab, dispatch]);

  /* ==========================
     PAGINATION
  ========================== */
  const totalPages = Math.ceil(list.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = list.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const columns = [
    "Sr No",
    "Company",
    "Assigned Employee",
    "Employee ID",
    "Official Email",
    "Asset Code",
    "Created On",
    "Action",
  ];

  return (
    <>
      <style>{`
        .assets-card { padding: 0; }

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

        .pagination-container {
          margin-top: 20px;
          display: flex;
          justify-content: flex-end;
        }

        .pagination-box {
          display: flex;
          gap: 10px;
          padding: 10px 14px;
          background: #ffffff;
          border-radius: 40px;
          border: 2px solid #b7d3b1;
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

        .page-number {
          width: 36px;
          height: 36px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          background: transparent;
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
              <option value="mobile" disabled>
                Mobile
              </option>
            </select>
          </div>

          {/* TABLE */}
          <CommonTable
            columns={columns}
            data={paginatedData}
            renderRow={(item, index) => (
              <tr key={item._id}>
                <td>{startIndex + index + 1}</td>
                <td>{item.company}</td>
                <td>{item.assignedTo?.name || "-"}</td>
                <td>{item.assignedTo?.employeeId || "-"}</td>
                <td>{item.officialEmail}</td>
                <td>{item.assetCode}</td>
                <td>
                  {new Date(item.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td>
                  <div className="action-icons">
                    <div className="icon-btn icon-view">
                      <FaEye />
                    </div>
                    <div className="icon-btn icon-edit">
                      <FaEdit />
                    </div>
                  </div>
                </td>
              </tr>
            )}
          />

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="pagination-container">
              <div className="pagination-box">
                <button
                  className="page-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
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
