import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function NotificationPopup({ message, type, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  // Auto close after 3 seconds with fade-out animation
  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false); // Trigger fade-out animation
    }, 2000);

    const closeTimer = setTimeout(() => {
      onClose(); // Close the notification after fade-out
    }, 3000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className={`fixed bottom-5 right-5 px-6 py-3 rounded border-2 shadow-lg text-white mb-6 ${
        type === "success"
          ? "bg-green-500 border-green-700"
          : "bg-red-500 border-red-700"
      }`}
    >
      {message}
    </motion.div>
  );
}

NotificationPopup.propTypes = {
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error"]).isRequired,
  onClose: PropTypes.func.isRequired,
};
