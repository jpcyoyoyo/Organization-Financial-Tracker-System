import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function Logout({ setIsAuthenticated }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear session storage
    sessionStorage.clear();

    // Update authentication state
    setIsAuthenticated(false);

    // Redirect to login page after clearing session
    navigate("/login", { replace: true });
  }, [navigate, setIsAuthenticated]);

  return null; // No UI needed for logout
}

Logout.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired, // Ensure the prop is passed
};
