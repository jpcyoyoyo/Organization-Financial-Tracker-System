import PropTypes from "prop-types";
import React from "react";

export const Input = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref} // Forward the ref
      className={`border border-gray-300 rounded-md p-2 py-1.5 w-full focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
      {...props}
    />
  );
});

Input.propTypes = {
  className: PropTypes.string,
};

// Give a display name for better debugging
Input.displayName = "Input";
