import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginMessage from "../../components/ui/message"; // Import LoginMessage

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [redirect, setRedirect] = useState(false); // New state for redirect
  const navigate = useNavigate();

  useEffect(() => {
    if (redirect) {
      navigate("/dashboard");
    }
  }, [redirect, navigate]);

  const login = async (data, reset) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const sanitizedData = {
        studentId: data.studentId.trim(),
        password: data.password.trim(),
      };

      const response = await fetch("http://localhost:8081/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sanitizedData),
      });

      let result;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        throw new Error("Unexpected server response");
      }

      if (!response.ok) {
        throw new Error(result.error || "Login failed");
      }

      sessionStorage.setItem("authToken", result.token);
      sessionStorage.setItem("user", JSON.stringify(result.user));

      setSuccess("Login successful! Redirecting...");
      console.log("User Logged In:", result.user);

      reset();

      // Set redirect to true after a short delay
      setTimeout(() => {
        setRedirect(true);
      }, 1000);
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, success, LoginMessage }; // Return LoginMessage
}
