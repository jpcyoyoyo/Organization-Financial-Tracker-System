import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function useAuth() {
  // Change to default export
  const navigate = useNavigate(); // Import navigation hook

  useEffect(() => {
    const authToken = sessionStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [navigate]);
}
