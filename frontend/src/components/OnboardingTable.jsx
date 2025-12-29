import React from "react";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const getStatusClass = (status) => {
  switch (status) {
    case "SUBMITTED":
      return "bg-warning text-white";
    case "VERIFIED":
      return "bg-success";
    case "IN_PROGRESS":
      return "bg-secondary";
    default:
      return "bg-secondary";
  }
};

const OnboardingTable = ({
  employees,
  listLoading,
  onView,
  onEdit,
  onDelete,
  onUploadClick,
}) => {
  return (
    <div style={{ borderRadius: "12px", border: "1px solid #ddd", overflowX: "auto" }}>
      <div className="users-card">
        <table className="users-table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Upload Documents</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {listLoading && employees.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  Loading employees...
                </td>
              </tr>
            ) : employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp._id}>
                  <td>{emp.employeeId}</td>
                  <td>{emp.name || "—"}</td>
                  <td>{emp.email || "—"}</td>

                  {/* Upload */}
                  <td>
                    <HiOutlineDocumentArrowUp
                      size={22}
                      className="doc-icon"
                      style={{
                        opacity: listLoading ? 0.5 : 1,
                        pointerEvents: listLoading ? "none" : "auto",
                      }}
                      onClick={() => onUploadClick(emp)}
                    />
                  </td>

                  {/* Status */}
                  <td>
                    <span
                      className={`badge rounded-pill px-3 py-2 ${getStatusClass(
                        emp.status
                      )}`}
                    >
                      {emp.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    <div className="action-group">
                      <button
                        className="action-btn view-btn"
                        disabled={listLoading}
                        onClick={() => onView(emp)}
                      >
                        <FaEye size={14} />
                      </button>

                      <button
                        className="action-btn edit-btn"
                        disabled={listLoading}
                        onClick={() => onEdit(emp)}
                      >
                        <FaEdit size={14} />
                      </button>

                      <button
                        className="action-btn delete-btn"
                        disabled={listLoading}
                        onClick={() => onDelete(emp)}
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No Employees Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OnboardingTable;
