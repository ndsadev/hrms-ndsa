import React from "react";
import { FaUserEdit } from "react-icons/fa";
import Loader from "./Loader";

const EmployeeListTable = ({
  loading,
  users,
  startIndex,
  preboardedIds,
  onPreboarding,
}) => {
  return (
    <div className="users-card">
      <table className="users-table">
        <thead>
          <tr>
            <th>Sr.</th>
            <th>Employee ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" style={{ padding: 30 }}>
                <Loader />
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ padding: 20 }}>
                No employees found
              </td>
            </tr>
          ) : (
            users.map((emp, index) => (
              <tr key={emp._id}>
                <td>{startIndex + index + 1}</td>
                <td>{emp.employeeId || "-"}</td>
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.phone || "-"}</td>
                <td>
                  {preboardedIds.has(emp.employeeId) ? (
                    <span style={{ color: "green", fontWeight: "bold" }}>
                      ✔
                    </span>
                  ) : (
                    <button
                      className="action-btn"
                      onClick={() => onPreboarding(emp)}
                    >
                      <FaUserEdit />
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeListTable;
