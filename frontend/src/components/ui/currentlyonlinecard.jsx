import { useState, useEffect, useCallback, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";
import { motion } from "framer-motion";
import { IpContext } from "../../context/IpContext";
import { io } from "socket.io-client";

// Session inactivity timeout - same as backend (30 minutes)
const INACTIVITY_TIMEOUT = 1800000; // 30 minutes in milliseconds
const HEARTBEAT_INTERVAL = 7000; // Frontend heartbeat every 7 seconds

export default function CurrentlyOnlineCard({
  title,
  fetchUrl,
  navUrl,
  userData,
  h = "h-auto",
  w = "w-full",
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const ip = useContext(IpContext);
  const socketRef = useRef(null);
  const inactivityTrackingRef = useRef(new Map()); // Track user inactivity timestamps

  // Parse user data
  const userDataObj =
    typeof userData === "string" ? JSON.parse(userData) : userData;

  // Fetch currently online users
  const fetchData = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await fetch(fetchUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userDataObj),
      });
      const result = await response.json();

      if (result && result.status && Array.isArray(result.data)) {
        setData(result.data);
        // Initialize inactivity tracking for newly fetched users
        result.data.forEach((user) => {
          if (!inactivityTrackingRef.current.has(user.id)) {
            inactivityTrackingRef.current.set(user.id, Date.now());
          }
        });
      } else if (result && Array.isArray(result.data)) {
        setData(result.data);
        result.data.forEach((user) => {
          if (!inactivityTrackingRef.current.has(user.id)) {
            inactivityTrackingRef.current.set(user.id, Date.now());
          }
        });
      } else {
        console.error("Unexpected response format:", result);
        setData([]);
      }
    } catch (err) {
      console.error("Error fetching currently online users:", err);
      setError(err.message);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [fetchUrl, userDataObj]);

  // Check for inactive users and remove them from the display
  const checkAndRemoveInactiveUsers = useCallback(() => {
    const now = Date.now();
    const inactiveUserIds = [];

    inactivityTrackingRef.current.forEach((lastSeen, userId) => {
      if (now - lastSeen > INACTIVITY_TIMEOUT) {
        inactiveUserIds.push(userId);
        inactivityTrackingRef.current.delete(userId);
      }
    });

    if (inactiveUserIds.length > 0) {
      console.log(
        `[CurrentlyOnlineCard] Removing ${inactiveUserIds.length} inactive users`,
        inactiveUserIds
      );
      setData((prevData) =>
        prevData.filter((user) => !inactiveUserIds.includes(user.id))
      );
    }
  }, []);

  // Initialize Socket.IO connection
  useEffect(() => {
    // Connect to Socket.IO server
    socketRef.current = io(ip, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Join the online-users room
    socketRef.current.emit("join-online-users");

    // Listen for user joined event
    socketRef.current.on("user-joined", (data) => {
      console.log("[Socket] User joined:", data);
      // Reset inactivity timer for this user
      inactivityTrackingRef.current.set(data.userId, Date.now());
      // Refresh the list when a user comes online
      fetchData();
    });

    // Listen for user left event
    socketRef.current.on("user-left", (data) => {
      console.log("[Socket] User left:", data);
      // Remove from inactivity tracking
      inactivityTrackingRef.current.delete(data.userId);
      // Refresh the list when a user goes offline
      fetchData();
    });

    // Listen for online users list update
    socketRef.current.on("online-users-list", (result) => {
      console.log("[Socket] Online users list received:", result);
      if (result && Array.isArray(result.data)) {
        setData(result.data);
        result.data.forEach((user) => {
          inactivityTrackingRef.current.set(user.id, Date.now());
        });
      }
    });

    // Connection established
    socketRef.current.on("connect", () => {
      console.log("[Socket] Connected to server for online users");
      // Request the full list of online users on connect
      socketRef.current.emit("request-online-users");
    });

    // Connection error
    socketRef.current.on("connect_error", (error) => {
      console.error("[Socket] Connection error:", error);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [ip, fetchData]);

  // Set up inactivity check interval (every heartbeat interval)
  useEffect(() => {
    const inactivityCheckInterval = setInterval(() => {
      checkAndRemoveInactiveUsers();
    }, HEARTBEAT_INTERVAL);

    return () => {
      clearInterval(inactivityCheckInterval);
    };
  }, [checkAndRemoveInactiveUsers]);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = useCallback(() => {
    setError(null);
    fetchData();
  }, [fetchData]);

  return (
    <div
      className={`flex transition-all flex-col md:hover:-translate-y-1 mt-1 ${w}`}
    >
      <h2
        className="text-2xl md:text-3xl font-bold bg-[#EA916E] rounded-t-xl px-4 py-2 cursor-pointer"
        onClick={() => navigate(navUrl)}
      >
        {title}
      </h2>
      <div
        className={`card shadow-lg rounded-b-xl bg-white ${h} overflow-hidden flex flex-col`}
      >
        {loading ? (
          <div className="px-5 flex items-center justify-center h-full">
            <p className="text-sm text-gray-600">Loading online users...</p>
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
        ) : data.length === 0 ? (
          <div className="px-5 flex items-center justify-center h-full">
            <p className="text-sm text-gray-600">No users currently online</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0.5, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 2 }}
            transition={{ duration: 0.5 }}
            className="overflow-y-auto flex-1"
          >
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-[#10B981] text-white">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold w-12">
                    Profile
                  </th>
                  <th className="px-4 py-2 text-left font-semibold w-32">
                    Student ID
                  </th>
                  <th className="px-4 py-2 text-left font-semibold flex-1">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left font-semibold w-32">
                    Platform
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.map((user, idx) => (
                  <motion.tr
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      {user.profile_pic ? (
                        <img
                          src={`${ip}/profile-pic/${user.profile_pic}`}
                          alt={user.full_name || "User"}
                          className="w-10 h-10 rounded-full object-cover border border-gray-300"
                          onError={(e) => {
                            e.target.src =
                              "https://cdn.jsdelivr.net/npm/heroicons@2.0.18/24/solid/user.svg";
                          }}
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <span className="text-xs font-bold text-gray-600">
                            {user.full_name?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-gray-700">
                      {user.student_id}
                    </td>
                    <td className="px-4 py-3 text-gray-800 font-medium truncate">
                      {user.full_name || user.name}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                          user.platform === "Web"
                            ? "bg-blue-100 text-blue-700"
                            : user.platform === "Mobile"
                            ? "bg-purple-100 text-purple-700"
                            : user.platform === "Web & Mobile"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {user.platform}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
}

CurrentlyOnlineCard.propTypes = {
  title: PropTypes.string.isRequired,
  fetchUrl: PropTypes.string.isRequired,
  navUrl: PropTypes.string.isRequired,
  userData: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  h: PropTypes.string,
  w: PropTypes.string,
};

CurrentlyOnlineCard.defaultProps = {
  h: "h-auto",
  w: "w-full",
};
