import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/Input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { useForm } from "react-hook-form";
import { useLogin } from "./useLogin"; // Import the custom hook
import { useEffect } from "react";

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { login, loading, error, success } = useLogin(); // Use the custom hook

  const onSubmit = (data) => {
    login(data, reset); // Call the custom hook function
  };

  const errorStyle = "text-red-500 text-xs mt-0.5";
  const successStyle = "text-green-500 text-xs mt-0.5";

  return (
    <Card className="w-full shadow-xl rounded-3xl bg-white p-10 md:w-md md:h-125 xl:px-18">
      <CardHeader>
        <CardTitle className="text-center font-bold text-3xl">Log-in</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 flex flex-col items-center"
        >
          {/* Student ID Field */}
          <div className="w-full">
            <label
              htmlFor="studentId"
              className="block text-md font-medium text-gray-700 mt-10"
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
              className="mt-1 w-full"
              disabled={loading}
            />
            {errors.studentId && (
              <p className={errorStyle}>{errors.studentId.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="w-full">
            <label
              htmlFor="password"
              className="block text-md font-medium text-gray-700"
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
              className="mt-1 w-full"
              disabled={loading}
            />
            {errors.password && (
              <p className={errorStyle}>{errors.password.message}</p>
            )}
          </div>

          {/* Show error from custom hook */}
          {error && <p className={errorStyle}>{error}</p>}

          {/* Show success message */}
          {success && <p className={successStyle}>{success}</p>}

          {/* Submit Button */}
          <Button
            type="submit"
            aria-label="Sign in"
            className="w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 mt-10 sm:mt-16"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign-in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
