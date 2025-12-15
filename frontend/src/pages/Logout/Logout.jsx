import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { IpContext } from "../../context/IpContext";
import { io } from "socket.io-client";

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
    const performLogout = async () => {
      const userData = JSON.parse(sessionStorage.getItem("user"));
      const id = userData?.id;
      const platform = detectPlatform();

      if (id) {
        // Connect to Socket.IO and emit user-offline event
        const socket = io(ip, {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        });

        // Emit user-offline event to broadcast the logout
        socket.emit("user-offline", {
          userId: id,
          platform: platform,
        });

        console.log(`[Logout] Emitted user-offline event for user ${id}`);

        // Send logout request to the backend
        try {
          const response = await fetch(`${ip}/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, platform }),
          });

          const result = await response.json();

          if (result.status) {
            console.log("Logout successful:", result.message);
          } else {
            console.error("Logout failed:", result.error);
          }
        } catch (err) {
          console.error("Error during logout:", err);
        }

        // Disconnect from Socket.IO
        socket.disconnect();
      }

      // Clear session storage
      sessionStorage.clear();

      // Update authentication state
      setIsAuthenticated(false);
      setDesignation("");

      // Redirect to login page after clearing session
      navigate("/login", { replace: true });
    };

    performLogout();
  }, [navigate, setIsAuthenticated, ip, setDesignation]);

  return null; // No UI needed for logout
}

Logout.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired, // Ensure the prop is passed
  setDesignation: PropTypes.func.isRequired,
};
