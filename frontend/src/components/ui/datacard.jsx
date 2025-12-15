import { memo, useEffect, useState, useCallback, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { IpContext } from "../../context/IpContext";
import { io } from "socket.io-client";

function DataCard({
  title,
  fetchUrl,
  className,
  id = "",
  name,
  iconUrl,
  iconBgColor = "#DE3B40",
  socketEvent = null, // Optional Socket.IO event name to listen for
}) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const ip = useContext(IpContext);
  const socketRef = useRef(null);

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

  // Initialize Socket.IO connection for live updates
  useEffect(() => {
    if (!socketEvent) return; // Skip if no socket event specified

    socketRef.current = io(ip, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Listen for the specified socket event
    socketRef.current.on(socketEvent, (data) => {
      console.log(`[Socket] ${socketEvent} event received:`, data);
      // Refresh data when socket event is triggered
      fetchData();
    });

    // Connection established
    socketRef.current.on("connect", () => {
      console.log(`[Socket] Connected for ${title}`);
    });

    // Connection error
    socketRef.current.on("connect_error", (error) => {
      console.error(`[Socket] Connection error for ${title}:`, error);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [ip, socketEvent, title, fetchData]);

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
      <div
        className="w-20 h-16 rounded-l-xl flex items-center justify-center"
        style={{ backgroundColor: iconBgColor }}
      >
        {iconUrl && <img src={iconUrl} alt={title} className="w-10 h-10" />}
      </div>
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
  iconUrl: PropTypes.string,
  iconBgColor: PropTypes.string,
  socketEvent: PropTypes.string, // Socket.IO event name
};

// Wrap DataCard with React.memo to prevent unnecessary re-renders
export default memo(DataCard);
