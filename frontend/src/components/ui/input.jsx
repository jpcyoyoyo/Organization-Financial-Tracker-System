import PropTypes from "prop-types";
import React from "react";

export const Input = React.forwardRef(
  ({ className = "border border-gray-300", ...props }, ref) => {
    return (
      <input
        ref={ref} // Forward the ref
        className={`px-1.5 focus:ring-2 focus:ring-blue-500 focus:outline-none ${className}`}
        {...props}
      />
    );
  }
);

Input.propTypes = {
  className: PropTypes.string,
};

// Give a display name for better debugging
Input.displayName = "Input";
