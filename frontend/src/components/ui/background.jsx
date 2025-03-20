import PropTypes from "prop-types";

export default function BackgroundSection({ children }) {
  return (
    <div className="flex min-h-lvh bg-[#ffc34c] bg-[url('/src/assets/tile.png')] bg-cover bg-repeat bg-center flex-col justify-center items-center p-8 font-[archivo]">
      {children}
    </div>
  );
}

BackgroundSection.propTypes = {
  children: PropTypes.node.isRequired,
};
