import PropTypes from "prop-types";

export default function DataCard({ title, fetchUrl, className, userData }) {
  return (
    <div
      className={`flex flex-row w-full transition-all rounded-xl shadow-md ${className} md:hover:-translate-y-1`}
    >
      <div className="lg:w-25 lg:h-20 w-20 h-16 bg-[#DE3B40] rounded-l-xl"></div>
      <div className="bg-white w-full py-2 px-1.5 lg:px-2.5 lg:py-2.5 rounded-r-xl">
        <h2 className="text-sm lg:text-base font-bold">{title}</h2>
        <p className="text-lg md:text-xl lg:text-2xl font-light">
          00.00{fetchUrl}
        </p>
      </div>
    </div>
  );
}

DataCard.propTypes = {
  title: PropTypes.string.isRequired,
  fetchUrl: PropTypes.string.isRequired,
  className: PropTypes.string,
  userData: PropTypes.string,
};
