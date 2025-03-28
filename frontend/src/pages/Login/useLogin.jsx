import { useState } from "react";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [redirect, setRedirect] = useState(false); // Return this to handle navigation in the component

  const login = async (data, reset) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const sanitizedData = {
        studentId: data.studentId.trim(),
        password: data.password.trim(),
      };

      const response = await fetch("http://192.168.100.21:8081/login", {
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

      if (result.token) {
        sessionStorage.setItem("authToken", result.token);
        sessionStorage.setItem("user", JSON.stringify(result.user));
      }

      setSuccess("Login successful! Redirecting...");
      console.log("User Logged In:", result.user);

      reset();

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

  return { login, loading, error, success, redirect };
}
