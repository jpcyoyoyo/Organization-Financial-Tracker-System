import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(fetchUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.parse(userData),
        });
        const result = await response.json();

        // Ensure we set the data to an array
        if (result && Array.isArray(result.users)) {
          setData(result.users);
        } else {
          console.error("Unexpected response format:", result);
          setData([]); // Default to an empty array to prevent errors
        }
      } catch (error) {
        console.error("Error fetching table data:", error);
        setData([]); // Default to an empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchUrl, userData]);

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
      <div className={`card shadow-lg rounded-b-xl bg-white ${h}`}>
        {loading ? (
          <div className="px-5">Loading...</div>
        ) : (
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
                      className="text-xs sm:text-sm px-2.5 md:px-5 py-0.5 md:py-1 border-gray-200"
                      style={{ width: getColumnWidth(col.fraction) }}
                    >
                      {row[col.variable]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
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
