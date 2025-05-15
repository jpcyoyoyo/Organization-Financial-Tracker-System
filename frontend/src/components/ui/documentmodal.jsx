import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Button } from "./button";
import { useState, useEffect } from "react";
import backIcon from "../../assets/prev.svg";

export default function DocumentModal({
  title,
  isOpen,
  onClose,
  sidebar, // <- new prop for your left panel
  children, // <- right panel
  modalClass = "w-11/12 h-11/12",
  modalCenter = false,
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className={`fixed inset-0 bg-[#171A1FDD] z-50 flex 
        ${modalCenter ? "items-center" : "items-start"} justify-center
        ${modalCenter ? "md:items-center" : "md:pt-7"}`}
      onClick={() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className={`bg-white rounded-xl shadow-lg overflow-hidden flex flex-col ${modalClass} max-w-7xl`}
      >
        {/* ─── HEADER ───────────────────────────────────────────── */}
        <div className="flex-none flex items-center bg-[#EFB034] px-4 py-2">
          <Button
            className="bg-[#EA916E] hover:bg-[#ad6c53] text-gray-800 rounded transition px-3 py-1 mr-4 flex items-center"
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
          >
            <img src={backIcon} width={20} alt="back" />
            <span className="ml-2 hidden sm:inline">Back</span>
          </Button>

          {title && (
            <h2 className="flex-1 text-2xl italic font-semibold text-gray-800 truncate">
              {title}
            </h2>
          )}
        </div>

        {/* ─── BODY: two columns ─────────────────────────────────── */}
        <div className="flex-1 flex overflow-hidden">
          {/* left sidebar */}
          <div className="w-64 bg-white p-4 overflow-y-auto border-r">
            {sidebar}
          </div>

          {/* right content */}
          <div className="flex-1 bg-white p-4 overflow-y-auto">{children}</div>
        </div>
      </motion.div>
    </div>
  );
}

DocumentModal.propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sidebar: PropTypes.node, // react node for the left panel
  children: PropTypes.node, // main content on the right
  modalClass: PropTypes.string,
  modalCenter: PropTypes.bool,
};
