import { PropTypes } from "prop-types";

export default function ProfilePic({ className = "", profilePic }) {
  return (
    <div className="m-0">
      <img
        src={profilePic} // Use the imported logo
        alt="Profile Picture"
        className={`h-auto rounded-full shadow-[0_17px_35px_rgba(23,26,31,0.24),0_0_2px_rgba(23,26,31,0.12)] ${className}`}
        width="44"
      />
    </div>
  );
}

ProfilePic.propTypes = {
  className: PropTypes.string,
  profilePic: PropTypes.string.isRequired,
};
