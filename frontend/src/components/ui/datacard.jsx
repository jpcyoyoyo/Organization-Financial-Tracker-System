import PropTypes from "prop-types";
import { useEffect, useState, useCallback } from "react";

export default function DataCard({
  title,
  fetchUrl,
  className,
  id = "",
  name,
}) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(
    async (id) => {
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
        // Set fetched data as an object (not wrapped in an array)
        setData(result.data);
      } catch (error) {
        console.error("Error fetching data for datacard:", error);
        setData({});
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [fetchUrl]
  );

  useEffect(() => {
    fetchData(id);
  }, [id, fetchData]);

  return (
    <div
      className={`flex flex-row w-full transition-all rounded-xl shadow-md ${className} md:hover:-translate-y-1`}
    >
      <div className="lg:w-25 lg:h-20 w-20 h-16 bg-[#DE3B40] rounded-l-xl"></div>
      <div className="bg-white w-full py-2 px-1.5 lg:px-2.5 lg:py-2.5 rounded-r-xl">
        <h2 className="text-sm lg:text-base font-bold">{title}</h2>

        {loading && (
          <p className="text-lg md:text-xl lg:text-2xl font-light">
            Fetching...
          </p>
        )}

        {!loading && Object.keys(data).length !== 0 && (
          <p className="text-lg md:text-xl lg:text-2xl font-light">
            {data[name]}
          </p>
        )}

        {!loading && Object.keys(data).length === 0 && (
          <p className="text-lg md:text-xl lg:text-2xl font-light">{error}</p>
        )}
      </div>
    </div>
  );
}

DataCard.propTypes = {
  title: PropTypes.string.isRequired,
  fetchUrl: PropTypes.string.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
};
