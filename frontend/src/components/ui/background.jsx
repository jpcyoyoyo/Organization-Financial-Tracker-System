import PropTypes from "prop-types";

export default function BackgroundSection({ className = "", children }) {
  return (
    <div
      className={`flex min-h-lvh bg-[#ffb728] bg-[url('/src/assets/tile.png')] bg-cover bg-repeat bg-center flex-col font-[archivo] overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

BackgroundSection.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
