import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Button } from "./button";
import backIcon from "../../assets/prev.svg";

export default function Modal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#171A1FDD] z-50 flex md:pt-7 items-center md:items-start justify-center">
      {/* Animated container */}
      <motion.div
        initial={{ opacity: 0.5, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-4 pt-15 w-11/12 h-11/12 md:h-6/7 md:w-4/7 max-w-7xl relative"
      >
        <div className="absolute top-0 left-0 flex flex-row h-11 w-full">
          <Button
            className="transition-all duration-300 bg-[#EA916E] hover:bg-[#ad6c53] text-gray-800 rounded-tl-xl w-26 flex items-center justify-center cursor-pointer"
            onClick={onClose}
          >
            <img src={backIcon} width="20" alt="next icon" />
            <h1>Back</h1>
          </Button>
          {title && (
            <h2 className="bg-[#EFB034] text-2xl italic w-full rounded-tr-xl font-semibold text-gray-800 px-8 py-1.5">
              {title}
            </h2>
          )}
        </div>
        {children}
      </motion.div>
    </div>
  );
}

Modal.propTypes = {
  title: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};
