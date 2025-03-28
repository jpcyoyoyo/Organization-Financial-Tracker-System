import PropTypes from "prop-types";

export function Button({ children, className = "", ...props }) {
  return (
    <button className={`${className}`} {...props}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
