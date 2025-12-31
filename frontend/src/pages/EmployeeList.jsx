import React, { useState, useEffect, useMemo } from "react";
import { Container } from "react-bootstrap";
import { FaUsers, FaUserEdit, FaSearch } from "react-icons/fa";
import useAllUsers from "../hooks/useAllUsers";
import Pagination from "../components/Pagination";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import SummaryApi from "../common";
import EmployeeListTable from "../components/EmployeeListTable";

const ITEMS_PER_PAGE = 9;

const EmployeeList = () => {
  const { users, loading } = useAllUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const [preboardedIds, setPreboardedIds] = useState(new Set());
  const [showPreboarding, setShowPreboarding] = useState(false);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("FIRST");
  const [preboardingFilter, setPreboardingFilter] = useState("ALL");

  const navigate = useNavigate();

  /* FETCH PREBOARDING IDS */
  useEffect(() => {
    const fetchPreboardingList = async () => {
      try {
        const res = await api.get(SummaryApi.getPreboardingList.url);
        const ids = new Set(res.data.data.map((item) => item.employeeId));
        setPreboardedIds(ids);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPreboardingList();
  }, []);

  // Filter and Sort
  const filteredUsers = useMemo(() => {
    let list = [...users];

    // SEARCH
    if (search) {
      list = list.filter(
        (u) =>
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.email?.toLowerCase().includes(search.toLowerCase()) ||
          u.employeeId?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // PREBOARDING STATUS
    if (preboardingFilter !== "ALL") {
      list = list.filter((u) =>
        preboardingFilter === "COMPLETED"
          ? preboardedIds.has(u.employeeId)
          : !preboardedIds.has(u.employeeId)
      );
    }

    //  SORT
    list.sort((a, b) =>
      sortOrder === "FIRST"
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt)
    );

    return list;
  }, [users, search, sortOrder, preboardingFilter, preboardedIds]);

  /* Reset page on filter change */
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortOrder, preboardingFilter]);

  /* PAGINATION */
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUsers = filteredUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePreboarding = (emp) => {
    navigate("/dashboard/preboarding-stage", {
      state: {
        employee: {
          name: emp.name,
          email: emp.email,
          phone: emp.phone,
          employeeId: emp.employeeId,
        },
      },
    });
  };

  return (
    <>
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

        .search-box {
          display: flex;
          align-items: center;
          background: white;
          border-radius: 28px;
          overflow: hidden;
        }

        .search-icon {
           background: #06406e;
    color: #ffffff;
    padding: 14px 14px;
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

      .filter-select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

    background-color: #ffffff;
    border-radius: 999px;
    border: none;
    padding: 5px 40px 5px 18px;
    height: 44px;
    line-height: 36px;
    font-size: 14px;
    cursor: pointer;

  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='18' height='18' fill='%2306406e'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 18px center;
  background-size: 18px;
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

        .action-btn {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: none;
          background: #d4f8dd;
          color: #198754;
          cursor: pointer;
        }
          .filter-select:focus {
  outline: none;
  box-shadow: none;   
      }
.filter-select option[value="COMPLETED"] {
  background-color: #d4f8dd;
  color: #198754;
  font-weight: 600;
}

.filter-select option[value="PENDING"] {
  background-color: #fde2e2;
  color: #dc3545;
  font-weight: 600;
}
  .search-box input::placeholder {
  color: #000;     
  opacity: 1;   
}
      `}</style>

      <Container>
        {/* HEADER */}
        <div className="page-header">
          <div className="header-row">
            <div className="header-left">
              <FaUsers /> Employee List
            </div>

            <div className="header-right">
              {/* SEARCH */}
              <div className="search-box">
                <div className="search-icon">
                  <FaSearch />
                </div>
                <input
                  placeholder="Search name, email or ID"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {/* PREBOARDING FILTER */}
              <select
                className="filter-select"
                value={preboardingFilter}
                onChange={(e) => setPreboardingFilter(e.target.value)}
              >
                <option value="ALL">All</option>
                <option value="COMPLETED">Preboarding ✔</option>
                <option value="PENDING">Preboarding ✖</option>
              </select>

              {/* SORT */}
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
        <EmployeeListTable
          loading={loading}
          users={paginatedUsers}
          startIndex={startIndex}
          preboardedIds={preboardedIds}
          onPreboarding={handlePreboarding}
        />

        {/* PAGINATION */}
        <Pagination
          totalItems={filteredUsers.length}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </Container>
    </>
  );
};

export default EmployeeList;
