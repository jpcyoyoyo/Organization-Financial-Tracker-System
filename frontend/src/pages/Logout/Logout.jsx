import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { IpContext } from "../../context/IpContext";

export default function Logout({ setIsAuthenticated, setDesignation }) {
  const navigate = useNavigate();
  const ip = useContext(IpContext);

  const detectPlatform = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Check for mobile devices
    if (/android/i.test(userAgent)) {
      return "mobile";
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "mobile";
    }

    // Default to web
    return "web";
  };

  useEffect(() => {
    const userData = JSON.parse(sessionStorage.getItem("user"));
    const id = userData?.id;
    const platform = detectPlatform();

    if (id) {
      // Send logout request to the backend
      fetch(`${ip}/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, platform }),
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.status) {
            console.log("Logout successful:", result.message);
          } else {
            console.error("Logout failed:", result.error);
          }
        })
        .catch((err) => {
          console.error("Error during logout:", err);
        });
    }
    // Clear session storage
    sessionStorage.clear();

    // Update authentication state
    setIsAuthenticated(false);
    setDesignation("");

    // Redirect to login page after clearing session
    navigate("/login", { replace: true });
  }, [navigate, setIsAuthenticated, ip, setDesignation]);

  return null; // No UI needed for logout
}

Logout.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired, // Ensure the prop is passed
  setDesignation: PropTypes.func.isRequired,
};
