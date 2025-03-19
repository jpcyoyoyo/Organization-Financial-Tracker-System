import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth"; // Import the custom hook
import { Helmet } from "react-helmet-async"; // Import Helmet
import { Button } from "../../components/ui/button";
import { Sidebar } from "../../components/ui/sidebar";
import BackgroundSection from "../../components/ui/background";
import { motion } from "framer-motion"; // Import framer-motion

export default function Dashboard() {
  useAuth(); // Check if the user is authenticated
  const navigate = useNavigate(); // Import navigation hook

  const handleLogout = () => {
    sessionStorage.removeItem("authToken"); // Clear session
    navigate("/login"); // Redirect to login
  };

  const storedUser = sessionStorage.getItem("user");
  const designation = storedUser ? JSON.parse(storedUser).designation : "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <Helmet>
        <title>Dashboard - Organization Financial Tracker</title>
      </Helmet>
      <BackgroundSection>
        <div className="flex flex-col items-center justify-center h-screen">
          <Sidebar user={storedUser} designation={designation} />
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md transition-all duration-300 transform hover:scale-105"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </BackgroundSection>
    </motion.div>
  );
}
