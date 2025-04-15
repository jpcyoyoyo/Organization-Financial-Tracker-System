import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "./button";
import { useNavigate } from "react-router-dom";

export default function TextCard({
  title,
  fetchUrl,
  userData,
  navUrl,
  h,
  w,
  viewModal: ViewModal,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
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
      <div className="flex justify-between items-center bg-[#EA916E] rounded-t-xl px-4 py-2">
        <h2
          className={`text-2xl md:text-3xl font-bold cursor-pointer`}
          onClick={() => navigate(navUrl)}
        >
          {title}
        </h2>
        <Button
          onClick={() => setIsViewOpen(true)}
          className="bg-blue-500 text-white px-3 py-1 cursor-pointer rounded text-lg md:text-xl font-normal"
        >
          View
        </Button>
      </div>
      <div className={`card shadow-lg rounded-b-xl bg-white ${h}`}>
        {loading ? (
          "Loading announcements..."
        ) : data ? (
          Array.isArray(data) ? (
            data.map((item, index) => <p key={index}>{item}</p>)
          ) : (
            <p>{data}</p>
          )
        ) : (
          <p>No announcements available.</p>
        )}
      </div>
      {ViewModal && isViewOpen && (
        <ViewModal
          isOpen={isViewOpen}
          onClose={() => setIsViewOpen(false)}
          data={data}
        />
      )}
    </div>
  );
}

TextCard.propTypes = {
  title: PropTypes.string.isRequired,
  fetchUrl: PropTypes.string,
  navUrl: PropTypes.string,
  userData: PropTypes.string,
  h: PropTypes.string,
  w: PropTypes.string,
  viewModal: PropTypes.elementType,
};
