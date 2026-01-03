import React, { useState, useMemo } from "react";
import { Modal } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import useAllUsers from "../../hooks/useAllUsers";

const DEFAULT_LIMIT = 10;
const TOTAL_LIMIT = 20;

const AssignedToSelector = ({ show, onClose, onSelect }) => {
  const { users, loading } = useAllUsers();
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.employeeId?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  const visibleUsers = showAll
    ? filteredUsers.slice(0, TOTAL_LIMIT)
    : filteredUsers.slice(0, DEFAULT_LIMIT);

  return (
    <Modal show={show} onHide={onClose} centered size="md">
      <Modal.Header closeButton>
        <Modal.Title>Select Employee</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {/* SEARCH */}
        <div className="mb-3 position-relative">
          <FaSearch
            style={{
              position: "absolute",
              top: "50%",
              left: 12,
              transform: "translateY(-50%)",
              color: "#6c757d",
            }}
          />
          <input
            className="form-control ps-5"
            placeholder="Search by name or employee id"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowAll(false);
            }}
          />
        </div>

        {/* LIST */}
        <div
          style={{
            maxHeight: 260,
            overflowY: "auto",
            paddingRight: 4,
          }}
        >
          {loading ? (
            <p className="text-muted">Loading employees...</p>
          ) : visibleUsers.length === 0 ? (
            <p className="text-muted">No users found</p>
          ) : (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                alignItems: "center",
              }}
            >
              {visibleUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => {
                    onSelect(user);
                    onClose();
                  }}
                  style={{
                    padding: "5px 12px",
                    background: "#eef7f1",
                    border: "1px solid #70a664",
                    borderRadius: 20,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#06406e",
                    whiteSpace: "nowrap",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#70a664";
                    e.currentTarget.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#eef7f1";
                    e.currentTarget.style.color = "#06406e";
                  }}
                >
                  {user.name}
                  <span style={{ marginLeft: 6, opacity: 0.8 }}>
                    ({user.employeeId})
                  </span>
                </div>
              ))}

              {/* + MORE / LESS INLINE (TEXT STYLE) */}
              {filteredUsers.length > DEFAULT_LIMIT && (
                <span
                  onClick={() => setShowAll(!showAll)}
                  style={{
                    cursor: "pointer",
                    fontWeight: 700,
                    color: "#000000",
                    textDecoration: "underline",
                    whiteSpace: "nowrap",
                    padding: "0 6px",
                  }}
                >
                  {showAll ? "Less" : "+ More"}
                </span>
              )}
            </div>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AssignedToSelector;
