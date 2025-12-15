import { PropTypes } from "prop-types";
import { useLocation } from "react-router-dom";

export default function ProfilePic({
  className = "",
  profilePic,
  onClick,
  isAdmin = false,
}) {
  const location = useLocation();
  const isActive = location.pathname === "/profile";

  return (
    <button
      onClick={onClick}
      disabled={isAdmin}
      className={`m-0 transition-all duration-300 rounded-full focus:outline-none ${
        isAdmin ? "cursor-default" : "cursor-pointer"
      } ${
        isAdmin
          ? "hover:shadow-[0_0_15px_rgba(255,195,76,0.6),0_17px_35px_rgba(23,26,31,0.24),0_0_2px_rgba(23,26,31,0.12)] shadow-[0_17px_35px_rgba(23,26,31,0.24),0_0_2px_rgba(23,26,31,0.12)]"
          : isActive
          ? "shadow-[0_0_20px_rgba(255,195,76,0.8),0_17px_35px_rgba(23,26,31,0.24),0_0_2px_rgba(23,26,31,0.12)]"
          : "hover:shadow-[0_0_15px_rgba(255,195,76,0.6),0_17px_35px_rgba(23,26,31,0.24),0_0_2px_rgba(23,26,31,0.12)] shadow-[0_17px_35px_rgba(23,26,31,0.24),0_0_2px_rgba(23,26,31,0.12)]"
      }`}
    >
      <img
        src={profilePic}
        alt="Profile Picture"
        className={`h-auto rounded-full ${className}`}
        width="44"
      />
    </button>
  );
}

ProfilePic.propTypes = {
  className: PropTypes.string,
  profilePic: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  isAdmin: PropTypes.bool,
};
