import React from "react";

const Loader = () => {
  return (
    <>
      <style>{`
        .loader-overlay {
          position: fixed;
          inset: 0;
          background: rgba(255,255,255,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .loader-card {
          background: #ffffff;
          padding: 28px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.12);
        }

        .loader-ring {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 4px solid #e2ebf3;
          border-top-color: #06406e;
          animation: spin 0.9s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div className="loader-overlay">
        <div className="loader-card">
          <div className="loader-ring" />
        </div>
      </div>
    </>
  );
};

export default Loader;
