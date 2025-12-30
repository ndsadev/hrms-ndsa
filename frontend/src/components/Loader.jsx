import React from "react";

const Loader = ({ variant = "inline", text = "ND Savla" }) => {
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

        .loader-inline {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }

        .loader-card {
          background: #ffffff;
          padding: 24px 28px;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.12);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .loader-ring {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 4px solid #e2ebf3;
          border-top-color: #06406e;
          animation: spin 0.9s linear infinite;
        }

        .loader-text {
          font-size: 14px;
          font-weight: 600;
          color: #06406e;
          letter-spacing: 0.5px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      {/* 🔹 FULL PAGE LOADER */}
      {variant === "fullscreen" && (
        <div className="loader-overlay">
          <div className="loader-card">
            <div className="loader-ring" />
            <div className="loader-text">{text}</div>
          </div>
        </div>
      )}

      {/* 🔹 INLINE / TABLE LOADER */}
      {variant === "inline" && (
        <div className="loader-inline">
          <div className="loader-ring" />
          <div className="loader-text">{text}</div>
        </div>
      )}
    </>
  );
};

export default Loader;
