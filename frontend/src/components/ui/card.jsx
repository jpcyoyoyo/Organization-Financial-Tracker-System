import PropTypes from "prop-types";

export function Card({ children, className = "" }) {
  return (
    <div className={`bg-white p-6 shadow-md ${className}`}>{children}</div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function CardHeader({ children }) {
  return <div className="mb-4">{children}</div>;
}

CardHeader.propTypes = {
  children: PropTypes.node.isRequired,
};

export function CardTitle({ children, className = "" }) {
  return (
    <h2 className={`text-5xl font-bold text-center ${className}`}>
      {children}
    </h2>
  );
}

CardTitle.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export function CardContent({ children }) {
  return <div>{children}</div>;
}

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
};
