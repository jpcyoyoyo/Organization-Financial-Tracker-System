import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // Import the custom hook
import { Helmet } from "react-helmet-async"; // Import Helmet
import { Button } from "../../components/ui/button";

export default function Dashboard() {
  useAuth(); // Check if the user is authenticated
  const navigate = useNavigate(); // Import navigation hook

  const handleLogout = () => {
    sessionStorage.removeItem("authToken"); // Clear session
    navigate("/login"); // Redirect to login
  };

  return (
    <>
      <Helmet>
        <title>Dashboard - Organization Financial Tracker</title>
      </Helmet>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </>
  );
}
