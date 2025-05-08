import PropTypes from "prop-types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { motion } from "framer-motion";
import { useState } from "react";
import backIcon from "../../assets/prev.svg";

export default function FilterPopup({
  availableYears,
  year,
  startDate,
  endDate,
  onYearChange,
  onStartDateChange,
  onEndDateChange,
  onApply,
  onCancel,
  onReset, // New prop for resetting the filter
}) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div
      className={`fixed inset-0 transition-all duration-300 bg-[#171A1FDD] ${
        isVisible ? "opacity-100" : "opacity-0"
      } flex items-center justify-center z-50`}
    >
      <motion.div
        initial={{ opacity: 0.5, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-4 pt-15 w-11/12 md:w-xl relative"
      >
        <div className="absolute top-0 left-0 flex flex-row h-11 w-full">
          <Button
            className="transition-all duration-300 bg-[#EA916E] hover:bg-[#ad6c53] text-gray-800 rounded-tl-xl w-26 flex items-center justify-center cursor-pointer"
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                onCancel();
              }, 300);
            }}
          >
            <img src={backIcon} width="20" alt="next icon" />
            <h1>Back</h1>
          </Button>
          <h2 className="bg-[#EFB034] text-2xl italic w-full rounded-tr-xl font-semibold text-gray-800 px-8 py-1.5">
            FILTER
          </h2>
        </div>
        <label className="block mb-2 text-sm font-semibold">Year</label>
        <select
          className="border border-gray-300 rounded-md px-3 py-1 w-full mb-4"
          value={year}
          onChange={(e) => onYearChange(e.target.value)}
        >
          <option value="">-- Select Year --</option>
          {availableYears.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
        <label className="block mb-2 text-sm font-semibold">Start Date</label>
        <Input
          type="date"
          className="border border-gray-300 rounded-md px-3 py-1 w-full mb-4"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
        />
        <label className="block mb-2 text-sm font-semibold">End Date</label>
        <Input
          type="date"
          className="border border-gray-300 rounded-md px-3 py-1 w-full mb-4"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <Button
            className="px-4 py-1 bg-gray-300 text-black rounded-md hover:bg-gray-400 cursor-pointer"
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                onCancel();
              }, 300);
            }}
          >
            Cancel
          </Button>
          <Button
            className="px-4 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 cursor-pointer"
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                onReset();
              }, 300);
            }} // Call the reset function
          >
            Reset
          </Button>
          <Button
            className="px-4 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                onApply();
              }, 300);
            }}
          >
            Apply
          </Button>
        </div>
      </motion.div>
    </div>
  );
}

FilterPopup.propTypes = {
  availableYears: PropTypes.array,
  year: PropTypes.string,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  onYearChange: PropTypes.func,
  onStartDateChange: PropTypes.func,
  onEndDateChange: PropTypes.func,
  onApply: PropTypes.func,
  onCancel: PropTypes.func,
  onReset: PropTypes.func, // New prop for reset functionality
};
