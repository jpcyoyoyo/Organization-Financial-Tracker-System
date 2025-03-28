import { useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input"; // Ensure correct import
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useLogin } from "./useLogin";
import LoginMessage from "../../components/ui/message";
import PropTypes from "prop-types";

export function LoginForm({ setIsAuthenticated }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { login, loading, error, success, redirect } = useLogin();
  const navigate = useNavigate();

  // Handle redirect after successful login
  useEffect(() => {
    if (redirect) {
      navigate("/dashboard");

      setIsAuthenticated(true); // Update state instantly
    }
  }, [redirect, navigate, setIsAuthenticated]);

  const onSubmit = async (data) => {
    const sanitizedData = {
      studentId: data.studentId.trim(),
      password: data.password.trim(),
    };

    try {
      await login(sanitizedData, reset);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <Card className="w-full shadow-xl rounded-3xl bg-white py-7 sm:py-10 md:py-15 md:w-md md:h-125 xl:px-12">
      <CardHeader>
        <CardTitle className="text-center font-bold text-4xl sm:text-5xl">
          Log-in
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Fixed-height container for login message */}
        <div
          className={`h-8 sm:h-10 text-sm sm:text-base flex items-center justify-center transition-opacity duration-300 ${
            error || success ? "opacity-100" : "opacity-0"
          }`}
        >
          {error && <LoginMessage type="error" message={error} />}
          {success && <LoginMessage type="success" message={success} />}
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 flex flex-col items-center"
        >
          {/* Student ID Field */}
          <div className="w-full">
            <label
              htmlFor="studentId"
              className="block text-sm sm:text-base font-medium text-gray-700 mt-5"
            >
              Student ID
            </label>
            <Input
              id="studentId"
              type="text"
              placeholder="Enter your Student ID"
              {...register("studentId", {
                required: "Student ID is required",
                pattern: {
                  value: /^[0-9A-Za-z-]+$/,
                  message:
                    "Student ID must be alphanumeric and can include dashes",
                },
              })}
              className="mt-1 w-full text-sm sm:text-base"
              disabled={loading}
            />
            <div className="h-5">
              {errors.studentId && (
                <p className="text-red-500 text-xs mt-0.5">
                  {errors.studentId.message}
                </p>
              )}
            </div>
          </div>

          {/* Password Field */}
          <div className="w-full">
            <label
              htmlFor="password"
              className="block text-sm sm:text-base font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="off" // Prevents browser auto-filling
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className="mt-1 w-full text-sm sm:text-base"
              disabled={loading}
            />
            <div className="h-5">
              {errors.password && (
                <p className="text-red-500 text-xs mt-0.5">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            aria-label="Sign in"
            className="rounded-md transition-all duration-300 w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 mt-5 sm:mt-8 transform hover:scale-105"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign-in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

LoginForm.propTypes = {
  setIsAuthenticated: PropTypes.func.isRequired,
};
