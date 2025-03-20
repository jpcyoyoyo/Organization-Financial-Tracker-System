import { Outlet } from "react-router-dom"; // Import the Outlet component from react-router-dom
import useHomeAuth from "../../hooks/useHomeAuth"; // Import the custom hook
import { Sidebar } from "../../components/ui/sidebar";
import BackgroundSection from "../../components/ui/background";
import { motion } from "framer-motion"; // Import framer-motion
import { useState } from "react"; // Import useState

export default function Home() {
  useHomeAuth(); // Check if the user is authenticated
  const [isCollapsed, setIsCollapsed] = useState(false); // State for sidebar collapse

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <BackgroundSection>
        <div className="flex overflow-x-hidden">
          <Sidebar
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed} // Pass state and setter to Sidebar
          />
          <main
            className={`absolute transition-all duration-300 top-0 h-full overflow-x-hidden ${
              isCollapsed ? "left-16" : "left-76"
            } w-full`}
          >
            {/* The outlet renders the nested route components */}
            <Outlet />
          </main>
        </div>
      </BackgroundSection>
    </motion.div>
  );
}
