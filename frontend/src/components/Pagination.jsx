import React from "react";

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "end",
        alignItems: "center",
        padding: "12px 16px",
        gap: "22px",
      }}
    >
      {/* Showing text */}
      <div style={{ fontSize: 15, color: "black" }}>
        Showing results <strong>{startItem}</strong>–<strong>{endItem}</strong> of{" "}
        <strong>{totalItems}</strong>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Prev */}
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          style={btnStyle}
        >
          Prev
        </button>

        {/* Page Numbers */}
        <span style={{ display: "flex", gap: 6 }}>
          {Array.from({ length: totalPages }, (_, i) => {
            const page = i + 1;
            const isActive = page === currentPage;

            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                disabled={isActive}
                style={{
                  background: isActive ? "#06406E" : "#fff",
                  color: isActive ? "#fff" : "#000",
                  padding: "4px 8px",
                  borderRadius: 6,
                  border: isActive ? "none" : "1px solid #ccc",
                  fontWeight: 600,
                  cursor: isActive ? "default" : "pointer",
                }}
              >
                {page}
              </button>
            );
          })}
        </span>

        {/* Next */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          style={btnStyle}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const btnStyle = {
  padding: "6px 12px",
  borderRadius: 6,
  border: "1px solid #ccc",
  background: "#fff",
  cursor: "pointer",
};

export default Pagination;
