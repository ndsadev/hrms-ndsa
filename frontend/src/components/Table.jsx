import React from "react";
import { FaEye, FaEdit } from "react-icons/fa";

const Table = ({
  columns,
  data,
  renderRow,
  emptyMessage = "No records found",
}) => {
  return (
    <>
      <style>{`
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
          white-space: nowrap;
        }

        td {
          padding: 9px;
          font-size: 15px;
          text-align: center;
          border-bottom: 1px solid #e2e6ea;
          white-space: nowrap;
        }

        tr:last-child td {
          border-bottom: none;
        }

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
      `}</style>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i}>{col}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ padding: 20 }}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map(renderRow)
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
