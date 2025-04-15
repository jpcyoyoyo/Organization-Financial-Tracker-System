import { Outlet } from "react-router-dom";
import { Sidebar } from "../../components/ui/sidebar";
import BackgroundSection from "../../components/ui/background";
import { motion } from "framer-motion";
import { useState } from "react";
import NotificationPopup from "../../components/ui/notificationpopup";

export default function Home() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  // Notification popup state
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [notificationType, setNotificationType] = useState("success"); // or "error"

  // Function to trigger notification popup
  function handleShowNotification(message, type = "success") {
    setNotificationMsg(message);
    setNotificationType(type);
    setShowNotification(true);
  }

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
            className={`ml-0 transition-all duration-300 top-0 h-full overflow-hidden ${
              isCollapsed ? "md:ml-14" : "md:ml-76"
            } w-full`}
          >
            {/* Pass notification trigger along with existing context */}
            <Outlet context={{ isCollapsed, handleShowNotification }} />
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
