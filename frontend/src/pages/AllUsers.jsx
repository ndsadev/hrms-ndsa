import React, { useState } from "react";
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

  const filteredUsers = users
    .filter((u) => {
      const matchSearch =
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase());

      const matchRole = roleFilter === "ALL" || u.role === roleFilter;
      return matchSearch && matchRole;
    })
    .sort((a, b) =>
      sortOrder === "FIRST"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );

  const handleUpdate = async () => {
    const res = await updateUser();

    if (res.success) {
      toast.success("User updated successfully");
    } else {
      toast.error(res.message);
    }
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

                if (res.success) {
                  toast.success("User deleted successfully");
                } else {
                  toast.error(res.message);
                }
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


  return (
    <>
      {loading && <Loader />}

      <style>{`
        .page-header {
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

        /* SEARCH */
        .search-box {
          display: flex;
          align-items: center;
          background: white;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
       }

      /* ICON BOX */
       .search-icon {
        background: #06406e;     
        color: #ffffff;
        padding: 13px 14px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

     /* INPUT */
       .search-box input {
         border: none;
         outline: none;
         padding: 10px 14px;
         font-size: 14px;
         min-width: 220px;
      }

    /* PLACEHOLDER COLOR (DARKER) */
       .search-box input::placeholder {
         color: #4f5d75;         
         font-weight: 500;
      }


        /* SELECT – ARROW SAFE */
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

      /* hover / focus look */
       .filter-select:hover {
        background-color: #f3f8f4;
      }

      .filter-select:focus {
       outline: none;
       box-shadow: 0 0 0 2px #70a66455;
        }

        /* Dropdown hover color fix */
        select option:hover,
        select option:checked {
          background-color: #70a664 !important;
          color: white !important;
        }

        .users-card {
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 6px 25px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .users-table {
          width: 100%;
          border-collapse: collapse;
        }

        .users-table thead {
          background: #06406e;
          color: white;
        }

        .users-table th,
        .users-table td {
          padding: 10px 14px;
          text-align: center;
          border-bottom: 1px solid #e5e5e5;
        }

        .users-table tbody tr:hover {
          background: #f3f8f4;
        }

        .action-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          margin: 0 4px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .edit-btn {
          background: #d4f8dd;
          color: #198754;
        }

        .delete-btn {
          background: #fde2e2;
          color: #dc3545;
        }

        /* MODAL */
        .modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.45);
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
          
        /* PAGINATION */
        .pagination-wrap {
          display: flex;
          justify-content: flex-end;
          margin-top: 22px;
        }

        .pagination {
         display: flex;
         gap: 10px;
         background: white;
         padding: 10px 15px;
         border-radius: 30px;
         border: 1px solid #9bc092;
        }

        .page-btn {
          border: none;
          background: transparent;
          font-weight: 600;
          cursor: pointer;
        }

        .page-btn.active {
          background: #06406e;
          color: white;
          border-radius: 50%;
          width: 32px;
          height: 32px;
        }

        .nav-btn {
          background: #06406e;
          color: white;
          border: none;
          padding: 6px 18px;
          border-radius: 18px;
        }

      `}</style>

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
          <table className="users-table">
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Designation</th>
                <th>Role</th>
                <th>Created Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {!loading && filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: 20 }}>
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, i) => (
                  <tr key={u._id}>
                    <td>{i + 1}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.designation}</td>
                    <td>{u.role}</td>
                    <td>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => openEditModal(u)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(u._id)}
                      >
                        <FaTrash />
                      </button>

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

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

              <button
                type="button"
                className="modal-btn"
                onClick={handleUpdate}
              >
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