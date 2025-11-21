"use client";
import { useMediaQuery, useTheme } from "@mui/material";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useRef } from "react";

const GlobalToastContainer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:500px)");
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && containerRef.current) {
      // Add custom styles for success toast
      const style = document.createElement('style');
      style.textContent = `
        .Toastify__toast--success {
          background: ${theme.palette.primary.main} !important;
          color: ${theme.palette.common.white} !important;
          border-radius: 4px;
          box-shadow: ${theme.shadows[3]};
        }
        .Toastify__progress-bar--success {
          background: rgba(255, 255, 255, 0.7) !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, [theme]);

  return (
    <div ref={containerRef}>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        limit={1}
        hideProgressBar={true}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={true}
        pauseOnHover={false}
        theme="colored"
        transition={Bounce}
        style={{
          width: isMobile ? "90%" : "auto",
          left: isMobile ? "5%" : "50%",
          top: "10px",
          transform: isMobile ? "none" : "translateX(-50%)",
          zIndex: 99999,
        }}
      />
    </div>
  );
};

export default GlobalToastContainer;