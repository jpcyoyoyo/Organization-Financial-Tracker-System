import { memo, useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";

function DataCard({ title, fetchUrl, className, id = "", name }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Memoized fetchData function
  const fetchData = useCallback(async () => {
    console.log(`Fetching data for ${title}:`, { id, fetchUrl }); // Debugging log
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(fetchUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const result = await response.json();
      setData(result.data || {}); // Ensure data is set correctly
    } catch (error) {
      console.error("Error fetching data for DataCard:", error);
      setData({});
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [fetchUrl, id, title]); // Only re-create fetchData if fetchUrl or id changes

  // Fetch data when the component mounts or when `id` or `fetchUrl` changes
  useEffect(() => {
    if (id && fetchUrl) {
      fetchData();
    }
  }, [id, fetchUrl, fetchData]); // Only run when `id`, `fetchUrl`, or `fetchData` changes

  console.log(`DataCard rendered: ${title}`); // Debugging log

  return (
    <div
      className={`flex flex-row w-full transition-all rounded-xl shadow-md ${className} md:hover:-translate-y-1`}
    >
      <div className="w-20 h-16 bg-[#DE3B40] rounded-l-xl"></div>
      <div className="bg-white w-full py-2 px-1.5 lg:px-2.5 lg:py-1.5 rounded-r-xl">
        <h2 className="text-sm lg:text-base font-bold">{title}</h2>

        {loading && (
          <p className="text-base md:text-lg lg:text-xl font-light">
            Fetching...
          </p>
        )}

        {!loading && Object.keys(data).length !== 0 && (
          <p className="text-base md:text-lg lg:text-xl font-light">
            {data[name]}
          </p>
        )}

        {!loading && Object.keys(data).length === 0 && (
          <p className="text-base md:text-lg lg:text-xl font-light">{error}</p>
        )}
      </div>
    </div>
  );
}

DataCard.propTypes = {
  title: PropTypes.string.isRequired,
  fetchUrl: PropTypes.string.isRequired,
  className: PropTypes.string,
  id: PropTypes.number,
  name: PropTypes.string,
};

// Wrap DataCard with React.memo to prevent unnecessary re-renders
export default memo(DataCard);
