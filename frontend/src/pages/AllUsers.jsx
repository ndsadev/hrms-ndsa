import React, { useState, useMemo, useEffect } from "react";
import {
  FaUsers,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import { Container } from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import useAllUsers from "../hooks/useAllUsers";
import CommonTable from "../components/Table";
import Pagination from "../components/Pagination";

const ITEMS_PER_PAGE = 8;

const AllUsers = () => {
  const {
    users,
    loading,
    showModal,
    selectedUser,
    setSelectedUser,
    openEditModal,
    closeModal,
    updateUser,
    deleteUser,
  } = useAllUsers();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("FIRST");
  const [currentPage, setCurrentPage] = useState(1);

  /* ===========================
     FILTER + SORT
  ============================ */
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        const matchSearch =
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase());

        const matchRole =
          roleFilter === "ALL" || u.role === roleFilter;

        return matchSearch && matchRole;
      })
      .sort((a, b) =>
        sortOrder === "FIRST"
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt)
      );
  }, [users, search, roleFilter, sortOrder]);

  /* ===========================
     PAGINATION DATA
  ============================ */
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, sortOrder]);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  /* ===========================
     UPDATE / DELETE
  ============================ */
  const handleUpdate = async () => {
    const res = await updateUser();
    res.success
      ? toast.success("User updated successfully")
      : toast.error(res.message);
  };

  const handleDelete = (userId) => {
    toast.warn(
      ({ closeToast }) => (
        <div>
          <p style={{ marginBottom: 10 }}>
            Are you sure you want to delete this user?
          </p>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn btn-danger btn-sm"
              onClick={async () => {
                closeToast();
                const res = await deleteUser(userId);
                res.success
                  ? toast.success("User deleted successfully")
                  : toast.error(res.message);
              }}
            >
              Delete
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

  const columns = [
    "Sr No",
    "Emp ID",
    "Name",
    "Email",
    "Designation",
    "Role",
    "Created Date",
    "Action",
  ];

  return (
    <>
      <style> {
        ` .page-header {
          background: #70a664a1;
          color: white;
          padding: 14px 20px;
          border-radius: 10px;
          margin-bottom: 18px;
      }

      .header-row {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
      }

      .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 22px;
          font-weight: 700;
      }

      .header-right {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
      }

      .search-box {
          display: flex;
          align-items: center;
          background: white;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      }

      .search-icon {
          background: #06406e;
          color: #ffffff;
          padding: 13px 14px;
          display: flex;
          align-items: center;
          justify-content: center;
      }

      .search-box input {
          border: none;
          outline: none;
          padding: 10px 14px;
          font-size: 14px;
          min-width: 220px;
      }

      .search-box input::placeholder {
          color: #4f5d75;
          font-weight: 500;
      }

      .filter-select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;

          background-color: #ffffff;
          border-radius: 22px;
          border: none;
          padding: 8px 42px 8px 16px;
          font-size: 14px;
          cursor: pointer;

          background-image: url("data:image/svg+xml;utf8,<svg fill='%2306406e' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
          background-repeat: no-repeat;
          background-position: right 14px center;
          background-size: 18px;
      }

      .filter-select:hover {
          background-color: #f3f8f4;
      }

      .filter-select:focus {
          outline: none;
          box-shadow: 0 0 0 2px #70a66455;
      }

      select option:hover,
      select option:checked {
          background-color: #70a664 !important;
          color: white !important;
      }

      .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 999;
      }

      .modal-box {
          background: #fff;
          width: 420px;
          border-radius: 12px;
          padding: 24px;
          position: relative;
      }

      .modal-title {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 16px;
      }

      .close-btn {
          position: absolute;
          top: 14px;
          right: 14px;
          border: none;
          background: none;
          font-size: 18px;
          cursor: pointer;
      }

      .modal-label {
          font-weight: 600;
          margin-top: 10px;
      }

      .modal-input,
      .modal-select {
          width: 100%;
          padding: 10px;
          margin-top: 6px;
          border-radius: 8px;
          border: 1px solid #ccc;
      }

      .modal-input[readonly] {
          background: #f1f3f5;
      }

      .modal-btn {
          margin-top: 18px;
          background: #06406e;
          color: white;
          border: none;
          padding: 10px 22px;
          border-radius: 22px;
      }

      `}
      </style>

      <Container>
        {/* HEADER */}
        <div className="page-header">
          <div className="header-row">
            <div className="header-left">
              <FaUsers /> All Users
            </div>

            <div className="header-right">
              <div className="search-box">
                <div className="search-icon">
                  <FaSearch />
                </div>
                <input
                  placeholder="Search name or email"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="filter-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="ALL">All Roles</option>
                <option>SUPER_ADMIN</option>
                <option>ADMIN</option>
                <option>HR</option>
                <option>EMPLOYEE</option>
              </select>

              <select
                className="filter-select"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="FIRST">First → Last</option>
                <option value="LAST">Last → First</option>
              </select>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="users-card">
          {loading ? (
            <div style={{ padding: 40, textAlign: "center" }}>
              <Loader />
            </div>
          ) : (
            <CommonTable
              columns={columns}
              data={paginatedUsers}
              renderRow={(u, i) => (
                <tr key={u._id}>
                  <td>{(currentPage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                  <td>{u.employeeId || "-"}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.designation || "-"}</td>
                  <td>{u.role}</td>
                  <td>{formatDate(u.createdAt)}</td>
                  <td>
                    <div className="action-icons">
                      <div
                        className="icon-btn icon-edit"
                        onClick={() => openEditModal(u)}
                      >
                        <FaEdit />
                      </div>
                      <div
                        className="icon-btn icon-delete"
                        onClick={() => handleDelete(u._id)}
                      >
                        <FaTrash />
                      </div>
                    </div>
                  </td>
                </tr>
              )}
              emptyMessage="No users found"
            />
          )}
        </div>
        {/* PAGINATION */}
        <Pagination
          totalItems={filteredUsers.length}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />

        {/* EDIT MODAL */}
        {showModal && (
          <div className="modal-backdrop" onClick={closeModal}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={closeModal}>
                <FaTimes />
              </button>

              <div className="modal-title">Change User Details</div>

              <label className="modal-label">Name</label>
              <input
                className="modal-input"
                value={selectedUser.name}
                readOnly
              />

              <label className="modal-label">Designation</label>
              <input
                className="modal-input"
                value={selectedUser.designation}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    designation: e.target.value,
                  })
                }
              />

              <label className="modal-label">Role</label>
              <select
                className="modal-select"
                value={selectedUser.role}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    role: e.target.value,
                  })
                }
              >
                <option>SUPER_ADMIN</option>
                <option>ADMIN</option>
                <option>HR</option>
                <option>EMPLOYEE</option>
              </select>

              <button className="modal-btn" onClick={handleUpdate}>
                Update User
              </button>
            </div>
          </div>
        )}
      </Container>
    </>
  );
};

export default AllUsers;
