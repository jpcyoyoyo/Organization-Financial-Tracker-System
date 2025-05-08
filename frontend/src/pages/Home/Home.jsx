import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../components/ui/sidebar";
import BackgroundSection from "../../components/ui/background";
import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import NotificationPopup from "../../components/ui/notificationpopup";

export default function Home() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [notificationType, setNotificationType] = useState("success");

  // react-router location to detect route changes
  const location = useLocation();

  // Scroll to top whenever route changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [location.pathname]);

  // Function to trigger notification popup
  const handleShowNotification = (message, type = "success") => {
    setNotificationMsg(message);
    setNotificationType(type);
    setShowNotification(true);
  };

  // Memoize context values to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ isCollapsed, handleShowNotification }),
    [isCollapsed]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <BackgroundSection>
        <div className="flex overflow-hidden">
          <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
          <main
            className={`ml-0 transition-all duration-300 top-0 h-full overflow-auto ${
              isCollapsed ? "md:ml-14" : "md:ml-76"
            } w-full`}
          >
            {/* Pass memoized context to Outlet */}
            <Outlet context={contextValue} />
          </main>
        </div>
      </BackgroundSection>
      {showNotification && (
        <NotificationPopup
          message={notificationMsg}
          type={notificationType}
          onClose={() => setShowNotification(false)}
        />
      )}
    </motion.div>
  );
}
