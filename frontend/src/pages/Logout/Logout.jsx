import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear session storage
    sessionStorage.clear();

    // Redirect to login page after clearing session
    navigate("/login", { replace: true });
  }, [navigate]);

  return null; // No UI needed for logout
}
