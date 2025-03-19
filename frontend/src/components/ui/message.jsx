import PropTypes from "prop-types";

export default function LoginMessage({ type, message }) {
  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  return (
    <div
      className={`w-full p-2 text-white text-center rounded-md ${bgColor}`}
      role="alert"
    >
      {message}
    </div>
  );
}

LoginMessage.propTypes = {
  message: PropTypes.string,
  type: PropTypes.string,
};
