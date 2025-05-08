import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Button } from "./button";
import { useState, useEffect } from "react";
import backIcon from "../../assets/prev.svg";

export default function Modal({
  title,
  isOpen,
  onClose,
  w = "w-11/12 h-11/12 md:h-6/7 md:w-4/7",
  children,
  modalCenter = false,
}) {
  const [isVisible, setIsVisible] = useState(false);

  // Handle visibility when the modal is opened or closed
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-[#171A1FDD] z-50 flex ${
        modalCenter ? "md:pb-14" : "md:pt-7"
      } items-center ${
        modalCenter ? "md:items-center" : "md:items-start"
      } justify-center`}
      onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 750); // Trigger fade-out animation before closing
      }}
    >
      {/* Animated container */}
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`transition-all duration-300 bg-white rounded-xl shadow-lg p-4 pt-15 ${w} max-w-7xl relative`}
      >
        <div className="absolute top-0 left-0 flex flex-row h-11 w-full">
          <Button
            className="transition-all duration-300 bg-[#EA916E] hover:bg-[#ad6c53] text-gray-800 rounded-tl-xl w-12 sm:w-26 flex items-center justify-center cursor-pointer"
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300); // Trigger fade-out animation before closing
            }}
          >
            <img src={backIcon} width="20" alt="next icon" />
            <h1 className="hidden sm:block">Back</h1>
          </Button>
          {title && (
            <h2 className="bg-[#EFB034] text-2xl italic w-full rounded-tr-xl font-semibold text-gray-800 pl-3 sm:px-4 md:px-8 py-1.5 truncate">
              {title}
            </h2>
          )}
        </div>
        <div className="w-full h-full">{children}</div>
      </motion.div>
    </div>
  );
}

Modal.propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  w: PropTypes.string,
  modalCenter: PropTypes.bool,
};
