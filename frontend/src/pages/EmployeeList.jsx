import React from "react";
import { Container } from "react-bootstrap";
import { FaUsers, FaUserEdit } from "react-icons/fa";
import Loader from "../components/Loader";
import useAllUsers from "../hooks/useAllUsers";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosInstance";
import SummaryApi from "../common";
import { useState } from "react";
import { useEffect } from "react";


const EmployeeList = () => {
  const { users, loading } = useAllUsers();
  const [preboardedIds, setPreboardedIds] = useState(new Set());
  const navigate = useNavigate();


  useEffect(() => {
    const fetchPreboardingList = async () => {
      try {
        const res = await api.get(SummaryApi.getPreboardingList.url);

        // res.data.data = [{ employeeId, name, status }]
        const ids = new Set(
          res.data.data.map((item) => item.employeeId)
        );

        setPreboardedIds(ids);
      } catch (error) {
        console.error("Failed to fetch preboarding list", error);
      }
    };

    fetchPreboardingList();
  }, []);

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
      {loading && <Loader />}

      <style>{`
        .page-header {
          background: #70a664a1;
          color: white;
          padding: 14px 20px;
          border-radius: 10px;
          margin-bottom: 18px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 22px;
          font-weight: 700;
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
      `}</style>

      <Container>
        <div className="page-header">
          <div className="header-left">
            <FaUsers /> Employee List
          </div>
        </div>

        <div className="users-card">
          {loading ? (
            <div className="content-loader">
              <Loader />
            </div>
          ) : (
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
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ padding: 20 }}>
                      No employees found
                    </td>
                  </tr>
                ) : (
                  users.map((emp, index) => (
                    <tr key={emp._id}>
                      <td>{index + 1}</td>
                      <td>{emp.employeeId || "-"}</td>
                      <td>{emp.name}</td>
                      <td>{emp.email}</td>
                      <td>{emp.phone || "-"}</td>
                      <td>
                        {preboardedIds.has(emp.employeeId) ? (
                          <span
                            title="Preboarding started"
                            style={{
                              color: "green",
                              fontSize: "18px",
                              fontWeight: "bold",
                              cursor: "default",
                            }}
                          >✔</span>
                        ) : (
                          <button
                            className="action-btn"
                            onClick={() => handlePreboarding(emp)}
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
          )}
        </div>
      </Container>

    </>
  );
};

export default EmployeeList;
