import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";

// Helper to convert a fraction string like "1/3" into a percentage width
function getColumnWidth(fraction) {
  if (!fraction) return "auto";
  const parts = fraction.split("/");
  if (parts.length !== 2) return "auto";
  const num = parseFloat(parts[0]);
  const den = parseFloat(parts[1]);
  if (isNaN(num) || isNaN(den) || den === 0) return "auto";
  return `${(num / den) * 100}%`;
}

export default function TableCard({
  title,
  tableConfig,
  fetchUrl,
  navUrl,
  userData,
  h,
  w,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      // Handle userData that might be a string or already an object
      let userDataObj = userData;
      if (typeof userData === "string") {
        userDataObj = JSON.parse(userData);
      }

      const response = await fetch(fetchUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userDataObj),
      });
      const result = await response.json();

      // Ensure we set the data to an array
      if (result && Array.isArray(result.users)) {
        setData(result.users);
      } else {
        console.error("Unexpected response format:", result);
        setData([]); // Default to an empty array to prevent errors
      }
    } catch (err) {
      console.error("Error fetching table data:", err);
      setError(err.message);
      setData([]); // Default to an empty array on error
    } finally {
      setLoading(false);
    }
  }, [fetchUrl, userData]);

  const handleRefresh = useCallback(() => {
    setError(null);
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div
      className={`flex transition-all flex-col md:hover:-translate-y-1 mt-1 ${w}`}
    >
      <h2
        className={`text-2xl md:text-3xl font-bold bg-[#EA916E] rounded-t-xl px-4 py-2 cursor-pointer`}
        onClick={() => navigate(navUrl)}
      >
        {title}
      </h2>
      <div
        className={`card shadow-lg rounded-b-xl bg-white ${h} overflow-hidden flex flex-col`}
      >
        {loading ? (
          <div className="px-5 flex items-center justify-center h-full">
            Loading...
          </div>
        ) : error ? (
          <div className="px-5 flex flex-col items-center justify-center h-full gap-4">
            <p className="text-sm text-red-600">{error}</p>
            <Button
              type="button"
              onClick={handleRefresh}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm cursor-pointer transition-all duration-150"
            >
              Refresh
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full font-[inter]">
              <thead>
                <tr>
                  {tableConfig.columns.map((col, index) => (
                    <th
                      key={index}
                      className="text-left text-xs sm:text-sm px-2.5 md:px-5 py-0.5 md:py-1 border-b border-gray-300 font-normal"
                      style={{ width: getColumnWidth(col.fraction) }}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row, rowIndex) => (
                  <tr key={rowIndex} className="">
                    {tableConfig.columns.map((col, colIndex) => (
                      <td
                        key={colIndex}
                        className={`text-xs sm:text-sm px-2.5 md:px-5 py-0.5 md:py-1 border-gray-200 truncate ${
                          row.dueDateColor && col.variable === "date_due"
                            ? row.dueDateColor
                            : ""
                        }`}
                        style={{ width: getColumnWidth(col.fraction) }}
                        title={row[col.variable]}
                      >
                        {row[col.variable]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

TableCard.propTypes = {
  title: PropTypes.string.isRequired,
  // tableConfig should be an object with a "columns" property.
  // Each column is an object with: header, fraction (e.g., "1/3"), and variable.
  tableConfig: PropTypes.shape({
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        header: PropTypes.string,
        fraction: PropTypes.string, // e.g., "1/3"
        variable: PropTypes.string,
      })
    ),
  }),
  fetchUrl: PropTypes.string,
  navUrl: PropTypes.string,
  userData: PropTypes.string,
  h: PropTypes.string,
  w: PropTypes.string,
};
