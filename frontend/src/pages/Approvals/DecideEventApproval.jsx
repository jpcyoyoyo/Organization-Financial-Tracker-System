import { useState, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { Button } from "../../components/ui/button";
import { useOutletContext } from "react-router-dom";
import { IpContext } from "../../context/IpContext";
import { motion } from "framer-motion";
import backIcon from "../../assets/prev.svg";
import Modal from "../../components/ui/modal";

export default function DecideEventApproval({
  isOpen,
  onClose,
  id,
  refreshData,
  handleClose,
}) {
  const { handleShowNotification } = useOutletContext();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [attendanceGroups, setAttendanceGroups] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [errorMsg, setErrorMsg] = useState("");
  const errorRef = useRef(null);
  const [showDecisionMessageModal, setShowDecisionMessageModal] =
    useState(false);
  const [DecisionMessageMessage, setDecisionMessageMessage] = useState("");
  const [DecisionMessageError, setDecisionMessageError] = useState("");
  const [decision, setDecision] = useState("");
  const userData = sessionStorage.getItem("user");

  const ip = useContext(IpContext);
  const title = "APPROVE EVENT";

  useEffect(() => {
    if (errorMsg && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errorMsg]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  useEffect(() => {
    setLoading(true);
    async function fetchDetails() {
      if (!id) return;
      try {
        const response = await fetch(`${ip}/fetch-draft-event-details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) throw new Error("Failed to fetch details");
        const result = await response.json();
        if (result.status && result.data) {
          const data = result.data;
          setDetails(data);
          // Parse attendance groups if available
          if (data.attendances) {
            const parsedAttendance =
              typeof data.attendances === "string"
                ? JSON.parse(data.attendances)
                : data.attendances;
            setAttendanceGroups(
              Array.isArray(parsedAttendance) ? parsedAttendance : []
            );
          }
        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isOpen) {
      fetchDetails();
    }
  }, [isOpen, id, ip]);

  // Format time for display
  const formatTimeForDisplay = (time) => {
    if (!time) return "";
    if (time.includes(":")) {
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const displayHour = hour % 12 || 12;
      return `${String(displayHour).padStart(2, "0")}:${minutes} ${ampm}`;
    }
    return time;
  };

  // Called when user presses Approved or Disapproved button.
  const handleDecisionButton = (decisionValue) => {
    setDecision(decisionValue);
    setShowDecisionMessageModal(true);
  };

  const eventApprovalDecision = async () => {
    if (!DecisionMessageMessage.trim()) {
      setDecisionMessageError("Decision message is required.");
      return;
    }

    try {
      const response = await fetch(`${ip}/event-approval-decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          approval_id: details.approval_id,
          decision,
          decision_message: DecisionMessageMessage,
          user_data: userData,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to submit decision");
      }
      const result = await response.json();
      if (result.status) {
        handleShowNotification(
          "Event decision submitted successfully",
          "success"
        );
        setShowDecisionMessageModal(false);
        refreshData();
        onClose();
        handleClose();
      } else {
        handleShowNotification(
          result.error || "Decision submission failed",
          "error"
        );
        setShowDecisionMessageModal(false);
        refreshData();
        onClose();
        handleClose();
      }
    } catch (error) {
      console.error("Error submitting decision:", error);
      handleShowNotification("Error submitting decision", "error");
      setShowDecisionMessageModal(false);
      refreshData();
      onClose();
      handleClose();
    }
  };

  if (!isOpen && !isVisible) return null;
  return (
    <>
      <div
        className={`fixed inset-0 bg-[#171A1FDD] z-50 flex justify-center items-center w-full px-6 md:px-12 py-8 h-full space-x-4`}
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => {
            setErrorMsg("");
            refreshData();
            onClose();
          }, 300); // Trigger fade-out animation before closing
        }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`bg-white rounded-l-xl shadow-lg overflow-hidden hidden md:flex flex-col w-full md:w-2/7 h-full`}
        >
          <div className="flex flex-row h-11 w-full">
            <Button
              className="transition-all duration-300 bg-[#EA916E] hover:bg-[#ad6c53] text-gray-800 rounded-tl-xl w-12 sm:w-26 flex items-center justify-center cursor-pointer"
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => {
                  setErrorMsg("");
                  refreshData();
                  onClose();
                }, 300); // Trigger fade-out animation before closing
              }}
            >
              <img src={backIcon} width="20" alt="next icon" />
              <h1 className="hidden sm:block">Back</h1>
            </Button>
            {title && (
              <h2 className="bg-[#EFB034] text-2xl italic w-full font-semibold text-gray-800 pl-3 sm:px-4 py-1.5 truncate">
                {title}
              </h2>
            )}
          </div>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-xl text-gray-600">Loading...</p>
            </div>
          ) : details ? (
            <div className="h-full p-1 sm:p-3">
              <div className="mt-2 md:mt-0 h-9/10 overflow-y-auto">
                <motion.div
                  initial={{ opacity: 0.1, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 2 }}
                  transition={{ duration: 0.75 }}
                  className="border rounded-xl bg-[#e0f40a22]"
                >
                  <div className="text-sm flex flex-col gap-2">
                    <div className="py-3 px-4 border-b rounded-t-xl bg-yellow-400">
                      <label className="block font-semibold">Event Name</label>
                      <div className="text-2xl">{details.name}</div>
                    </div>
                    <div className="pb-3 px-4 border-b">
                      <label className="flex font-semibold">Description</label>
                      <div className="h-20 overflow-y-auto text-balance">
                        {details.description}
                      </div>
                    </div>

                    <div className="flex flex-col gap-6 px-4 pb-4 pt-1">
                      <div>
                        <label className="flex font-semibold">Event Date</label>
                        <div className="text-lg">
                          {details.date || "Not Set"}
                        </div>
                      </div>
                      <div>
                        <label className="flex font-semibold">
                          Time Period
                        </label>
                        <div className="text-lg">
                          {details.start_time && details.end_time
                            ? `${formatTimeForDisplay(
                                details.start_time
                              )} - ${formatTimeForDisplay(details.end_time)}`
                            : "Not Set"}
                        </div>
                      </div>
                      <div>
                        <label className="flex font-semibold">
                          Date Created
                        </label>
                        <div>{details.created_at}</div>
                      </div>
                      <div>
                        <label className="flex font-semibold">
                          Date Updated
                        </label>
                        <div>{details.updated_at}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
              <div className="flex justify-end items-center space-x-2 h-1/10">
                <Button
                  type="button"
                  onClick={() => handleDecisionButton("Approved")}
                  className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-green-800 bg-green-600 text-white px-4 py-2 rounded h-fit"
                >
                  Approved
                </Button>
                <Button
                  type="button"
                  onClick={() => handleDecisionButton("Disapproved")}
                  className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-red-800 bg-red-600 text-white px-4 py-2 rounded h-fit"
                >
                  Disapproved
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 h-9/10 w-full flex items-center justify-center">
              <p>Fail to fetch details</p>
            </div>
          )}
        </motion.div>
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`bg-white ${
            isMobile ? "rounded-xl" : "rounded-r-xl"
          } shadow-lg flex flex-col w-full md:w-5/7 h-full`}
        >
          <div className="md:hidden flex flex-row h-11 w-full">
            <Button
              className="transition-all duration-300 bg-[#EA916E] hover:bg-[#ad6c53] text-gray-800 rounded-tl-xl w-12 sm:w-26 flex items-center justify-center cursor-pointer"
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => {
                  setErrorMsg("");
                  refreshData();
                  onClose();
                }, 300); // Trigger fade-out animation before closing // Trigger fade-out animation before closing
              }}
            >
              <img src={backIcon} width="20" alt="next icon" />
              <h1 className="hidden sm:block">Back</h1>
            </Button>
            {title && (
              <h2
                className={`bg-[#EFB034] ${
                  isMobile ? "rounded-tr-xl" : "rounded-none"
                } text-2xl italic w-full font-semibold text-gray-800 pl-3 sm:px-4 py-1.5 truncate`}
              >
                {title}
              </h2>
            )}
          </div>

          {/* Budget Groups Section */}
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-xl text-gray-600">Loading...</p>
            </div>
          ) : details ? (
            <div className="overflow-y-auto">
              <div className="pt-5 pb-5 md:pb-20 md:py-10 transition-all duration-300 px-5 sm:px-10 md:px-15 lg:px-20 xl:px-25 2xl:px-35">
                {isMobile && (
                  <div className="border-b border-gray-500 pb-4 mb-4">
                    <h2 className="text-2xl font-semibold mb-3 text-gray-800">
                      Event Details
                    </h2>
                    <motion.div
                      initial={{ opacity: 0.1, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 2 }}
                      transition={{ duration: 0.75 }}
                      className="border rounded-xl bg-[#e0f40a22]"
                    >
                      <div className="text-sm flex flex-col gap-2">
                        <div className="py-3 px-4 border-b rounded-t-xl bg-yellow-400">
                          <label className="block font-semibold">
                            Event Name
                          </label>
                          <div className="text-2xl">{details.name}</div>
                        </div>
                        <div className="pb-3 px-4 border-b">
                          <label className="flex font-semibold">
                            Description
                          </label>
                          <div className="h-20 overflow-y-auto text-balance">
                            {details.description}
                          </div>
                        </div>

                        <div className="flex flex-col gap-6 px-4 pb-4 pt-1">
                          <div>
                            <label className="flex font-semibold">
                              Event Date
                            </label>
                            <div className="text-lg">
                              {details.date || "Not Set"}
                            </div>
                          </div>
                          <div>
                            <label className="flex font-semibold">
                              Time Period
                            </label>
                            <div className="text-lg">
                              {details.start_time && details.end_time
                                ? `${formatTimeForDisplay(
                                    details.start_time
                                  )} - ${formatTimeForDisplay(
                                    details.end_time
                                  )}`
                                : "Not Set"}
                            </div>
                          </div>
                          <div>
                            <label className="flex font-semibold">
                              Date Created
                            </label>
                            <div>{details.created_at}</div>
                          </div>
                          <div>
                            <label className="flex font-semibold">
                              Date Updated
                            </label>
                            <div>{details.updated_at}</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}

                {attendanceGroups.length > 0 && (
                  <div className="border-b border-gray-500 pb-6">
                    <h2 className="text-2xl font-semibold mb-3 text-gray-800">
                      Attendance Groups
                    </h2>
                    {attendanceGroups.map((group, gIdx) => (
                      <div
                        key={gIdx}
                        className="mb-6 p-4 border rounded-lg bg-gray-50"
                      >
                        <div className="mb-3">
                          <label className="block text-sm font-semibold">
                            {group.name ||
                              group.custom_name ||
                              `Group ${gIdx + 1}`}
                          </label>
                          <div className="text-sm text-gray-600">
                            Date: {group.date || "Not Set"}
                          </div>
                        </div>
                        <div className="border rounded-lg overflow-clip">
                          <div className="overflow-x-auto">
                            <table className="min-w-112.5 w-full border-collapse">
                              <thead>
                                <tr className="bg-yellow-400 text-sm text-white">
                                  <th className="p-2 text-left w-3/7">
                                    Process
                                  </th>
                                  <th className="p-1 px-2 text-left w-2/7">
                                    Start Time
                                  </th>
                                  <th className="p-1 px-2 text-left w-2/7">
                                    Cutoff
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {group.rows && group.rows.length > 0 ? (
                                  group.rows.map((row, rIdx) => (
                                    <tr key={rIdx} className="text-sm bg-white">
                                      <td className="p-1 px-2 border-r border-b text-xs sm:text-sm">
                                        {row.process}
                                      </td>
                                      <td className="p-1 px-2 border-r border-b text-xs sm:text-sm">
                                        {row.start_time
                                          ? formatTimeForDisplay(row.start_time)
                                          : "-"}
                                      </td>
                                      <td className="p-1 px-2 border-r border-b text-xs sm:text-sm">
                                        {row.cutoff || "-"}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="3" className="p-2 text-center">
                                      No rows
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {errorMsg && (
                  <p ref={errorRef} className="mt-8 text-red-600 text-sm">
                    {errorMsg}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 h-9/10 w-full flex items-center justify-center">
              <p>Fail to fetch details</p>
            </div>
          )}
          {isMobile && (
            <div className="flex justify-end items-center space-x-2 p-4">
              <Button
                type="button"
                onClick={() => handleDecisionButton("Approved")}
                className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-green-800 bg-green-600 text-white px-4 py-2 rounded h-fit"
              >
                Approved
              </Button>
              <Button
                type="button"
                onClick={() => handleDecisionButton("Disapproved")}
                className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-red-800 bg-red-600 text-white px-4 py-2 rounded h-fit"
              >
                Disapproved
              </Button>
            </div>
          )}
        </motion.div>
      </div>

      {showDecisionMessageModal && (
        <Modal
          title="SUBMIT DECISION"
          isOpen={showDecisionMessageModal}
          onClose={() => {
            setShowDecisionMessageModal(false);
            setDecisionMessageMessage("");
            setDecisionMessageError("");
          }}
          modalCenter={true}
          w={"w-11/12 h-11/12 md:h-4/7 md:w-4/7 lg:w-3/7 xl:w-2/7"}
        >
          <div className="p-4 h-7/9">
            <textarea
              value={DecisionMessageMessage}
              onChange={(e) => {
                setDecisionMessageMessage(e.target.value);
                setDecisionMessageError("");
              }}
              placeholder="Enter your decision message here..."
              className="w-full h-full border rounded p-2 mb-2"
            />
            {DecisionMessageError && (
              <p className="text-red-600 text-sm mb-2">
                {DecisionMessageError}
              </p>
            )}
          </div>
          <div className="flex justify-end space-x-2 h-2/9 p-4">
            <Button
              type="button"
              onClick={() => {
                setShowDecisionMessageModal(false);
                setDecisionMessageMessage("");
                setDecisionMessageError("");
              }}
              className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-gray-800 bg-gray-400 text-white px-4 py-2 rounded h-fit"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={eventApprovalDecision}
              className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-purple-800 bg-purple-600 text-white px-4 py-2 rounded h-fit"
            >
              Submit Decision
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

DecideEventApproval.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  handleClose: PropTypes.func,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  refreshData: PropTypes.func,
};
