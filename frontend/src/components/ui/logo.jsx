import { PropTypes } from "prop-types";
import logo from "../../assets/comsoc_logo.png"; // Corrected the relative path

export default function Logo({ className = "", size, onClick, bg = "" }) {
  return (
    <div className={`m-0 ${bg}`}>
      <img
        src={logo} // Use the imported logo
        alt="Organization Logo" // Improved alt text for accessibility
        className={`h-auto rounded-full shadow-[0_17px_35px_rgba(23,26,31,0.24),0_0_2px_rgba(23,26,31,0.12)] ${className}`}
        width={size} // Apply dynamic size
        onClick={onClick}
      />
    </div>
  );
}

Logo.propTypes = {
  className: PropTypes.string,
  size: PropTypes.string,
  onClick: PropTypes.func,
  bg: PropTypes.string,
};
