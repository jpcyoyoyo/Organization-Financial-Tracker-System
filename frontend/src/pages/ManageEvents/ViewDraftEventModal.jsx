import { useState, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { Button } from "../../components/ui/button";
import { useOutletContext } from "react-router-dom";
import { IpContext } from "../../context/IpContext";
import { motion } from "framer-motion";
import backIcon from "../../assets/prev.svg";
import Modal from "../../components/ui/modal";
import ApprovalDetailsModal from "../Approvals/ApprovalDetailsModal";

export default function ViewDraftEventModal({
  isOpen,
  onClose,
  id,
  refreshData,
  onRefreshGlobalData,
}) {
  const { handleShowNotification } = useOutletContext();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [attendanceGroups, setAttendanceGroups] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [errorMsg, setErrorMsg] = useState("");
  const errorRef = useRef(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const userData = sessionStorage.getItem("user");
  const [approvalHistory, setApprovalHistory] = useState([]);
  const [approvalHistoryError, setApprovalHistoryError] = useState("");
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const ip = useContext(IpContext);
  const title =
    details && details.published_at ? "PUBLISHED EVENT" : "EVENT APPROVALS";

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

    async function fetchApprovalHistory() {
      if (!id) return;
      try {
        const response = await fetch(`${ip}/fetch-approval-history`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "Event", relating_id: id }),
        });
        if (!response.ok) {
          throw new Error("Failed to fetch approval history");
        }
        const result = await response.json();
        if (result.status) {
          setApprovalHistory(result.data);
          setApprovalHistoryError("");
        } else {
          setApprovalHistory([]);
          setApprovalHistoryError(
            result.error || "Failed to fetch approval history"
          );
        }
      } catch (error) {
        console.error("Error fetching approval history:", error);
        setApprovalHistory([]);
        setApprovalHistoryError("Error fetching approval history");
      }
    }

    if (isOpen) {
      fetchDetails();
      fetchApprovalHistory();
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

  const cancelEventApproval = async () => {
    try {
      const response = await fetch(`${ip}/cancel-budget-approval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          approval_id: details.approval_id,
          user_data: userData,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to cancel approval");
      }
      const result = await response.json();
      if (result.status) {
        handleShowNotification(
          "Event approval cancelled successfully",
          "success"
        );
        setShowCancelModal(false);
        refreshData();
        onRefreshGlobalData();
        onClose();
      } else {
        handleShowNotification(result.error || "Cancellation failed", "error");
        setShowCancelModal(false);
        refreshData();
        onRefreshGlobalData();
        onClose();
      }
    } catch (error) {
      console.error("Error cancelling approval:", error);
      handleShowNotification("Error cancelling approval", "error");
      setShowCancelModal(false);
      refreshData();
      onRefreshGlobalData();
      onClose();
    }
  };

  const publishEvent = async () => {
    try {
      const response = await fetch(`${ip}/publish-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          approval_id: details.approval_id,
          user_data: userData,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to publish event");
      }
      const result = await response.json();
      if (result.status) {
        handleShowNotification("Event published successfully", "success");
        refreshData();
        onRefreshGlobalData();
        onClose();
      } else {
        handleShowNotification(result.error || "Publish failed", "error");
        refreshData();
        onRefreshGlobalData();
        onClose();
      }
    } catch (error) {
      console.error("Error publishing event:", error);
      handleShowNotification("Error publishing event", "error");
      refreshData();
      onRefreshGlobalData();
      onClose();
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
            <div className="h-[calc(100%-44px)] p-1 sm:p-3">
              <div
                className={`mt-2 md:mt-0 ${
                  details.published_at ? "h-full" : "h-9/10"
                } overflow-y-auto`}
              >
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

                    {/* Event Details */}
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
                      <div>
                        <label className="flex font-semibold">
                          Date Approved
                        </label>
                        <div>
                          {details.approved_at !== null
                            ? details.approved_at
                            : "Not Yet Approved"}
                        </div>
                      </div>
                      {details.published_at && (
                        <div>
                          <label className="flex font-semibold">
                            Date Published
                          </label>
                          <div>{details.published_at}</div>
                        </div>
                      )}
                      <div>
                        <label className="flex font-semibold">
                          Approval ID
                        </label>
                        <div>{details.approval_id}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 px-4 pb-4">
                    <h2 className="text-2xl font-semibold mb-3 text-gray-800">
                      Approval History
                    </h2>
                    <div className="overflow-x-auto border rounded-lg">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-yellow-300 text-sm">
                            <th className="p-2 text-left">ID</th>
                            <th className="p-2 text-left">Decision</th>
                            <th className="p-2 text-left">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {approvalHistoryError ? (
                            <tr>
                              <td
                                colSpan="3"
                                className="p-2 text-center text-red-600"
                              >
                                {approvalHistoryError}
                              </td>
                            </tr>
                          ) : approvalHistory.length === 0 ? (
                            <tr>
                              <td colSpan="3" className="p-2 text-center">
                                No approval history
                              </td>
                            </tr>
                          ) : (
                            approvalHistory.map((record, idx) => (
                              <tr key={idx} className="bg-white text-sm">
                                <td className="px-2 py-1 border-r">
                                  {record.id}
                                </td>
                                <td className="px-2 py-1 border-r">
                                  {record.decision !== null
                                    ? record.decision
                                    : "Pending"}
                                </td>
                                <td className="px-2 py-1">
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      setSelectedApproval(record);
                                      setShowApprovalModal(true);
                                    }}
                                    className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-blue-800 bg-blue-600 text-white px-2 py-1 rounded"
                                  >
                                    View
                                  </Button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              </div>
              {!details.published_at && (
                <div className="flex justify-end items-center space-x-2 h-1/10">
                  {details && details.status === "Ready to Publish" ? (
                    <Button
                      type="button"
                      onClick={publishEvent}
                      className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-blue-800 bg-blue-600 text-white px-4 py-2 rounded h-fit"
                    >
                      Publish Event
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => {
                        setShowCancelModal(true);
                      }}
                      className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-gray-800 bg-gray-600 text-white px-4 py-2 rounded h-fit"
                    >
                      Cancel Approval
                    </Button>
                  )}
                </div>
              )}
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

          {/* Event Details Section */}
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

                        {/* Event Details */}
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
                          <div>
                            <label className="flex font-semibold">
                              Date Approved
                            </label>
                            <div>
                              {details.approved_at !== null
                                ? details.approved_at
                                : "Not Yet Approved"}
                            </div>
                          </div>
                          {details.published_at && (
                            <div>
                              <label className="flex font-semibold">
                                Date Published
                              </label>
                              <div>{details.published_at}</div>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 px-4 pb-4">
                        <h2 className="text-2xl font-semibold mb-3 text-gray-800">
                          Approval History
                        </h2>
                        <div className="overflow-x-auto border rounded-lg">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-yellow-300 text-sm">
                                <th className="p-2 text-left">ID</th>
                                <th className="p-2 text-left">Decision</th>
                                <th className="p-2 text-left">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {approvalHistoryError ? (
                                <tr>
                                  <td
                                    colSpan="3"
                                    className="p-2 text-center text-red-600"
                                  >
                                    {approvalHistoryError}
                                  </td>
                                </tr>
                              ) : approvalHistory.length === 0 ? (
                                <tr>
                                  <td colSpan="3" className="p-2 text-center">
                                    No approval history
                                  </td>
                                </tr>
                              ) : (
                                approvalHistory.map((record, idx) => (
                                  <tr key={idx} className="bg-white text-sm">
                                    <td className="px-2 py-1 border-r">
                                      {record.id}
                                    </td>
                                    <td className="px-2 py-1 border-r">
                                      {record.decision !== null
                                        ? record.decision
                                        : "Pending"}
                                    </td>
                                    <td className="px-2 py-1">
                                      <Button
                                        type="button"
                                        onClick={() => {
                                          setSelectedApproval(record);
                                          setShowApprovalModal(true);
                                        }}
                                        className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-blue-800 bg-blue-600 text-white px-2 py-1 rounded"
                                      >
                                        View
                                      </Button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
                {/* Attendance Groups Section */}
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
                        {/* Attendance Rows Table */}
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
          {isMobile && !details.published_at && (
            <div className="flex justify-end items-center space-x-2 p-4">
              {details && details.status === "Ready to Publish" ? (
                <Button
                  type="button"
                  onClick={publishEvent}
                  className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-blue-800 bg-blue-600 text-white px-4 py-2 rounded h-fit"
                >
                  Publish Event
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => {
                    setShowCancelModal(true);
                  }}
                  className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-gray-800 bg-gray-600 text-white px-4 py-2 rounded h-fit"
                >
                  Cancel Approval
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </div>
      {showCancelModal && (
        <Modal
          title="CONFIRM CANCEL"
          isOpen={showCancelModal}
          onClose={() => {
            setShowCancelModal(false);
          }}
          modalCenter={true}
          w={"w-11/12 h-11/12 md:h-2/5 md:w-4/7 lg:w-3/7 xl:w-2/7"}
        >
          <div className="p-4 h-6/9 flex justify-center">
            <p className="text-lg text-gray-800">
              Are you sure you want to cancel the event approval? The event will
              go back to draft if you cancel.
            </p>
          </div>
          <div className="flex justify-end space-x-2 h-2/9 p-4">
            <Button
              type="button"
              onClick={() => {
                setShowCancelModal(false);
              }}
              className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-gray-800 bg-gray-400 text-white px-4 py-2 rounded h-fit"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => cancelEventApproval()}
              className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-purple-800 bg-purple-600 text-white px-4 py-2 rounded h-fit"
            >
              Confirm Cancellation
            </Button>
          </div>
        </Modal>
      )}
      {showApprovalModal && selectedApproval && (
        <ApprovalDetailsModal
          isOpen={showApprovalModal}
          approvalId={selectedApproval.id}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedApproval(null);
          }}
        />
      )}
    </>
  );
}

ViewDraftEventModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onGoBack: PropTypes.func,
  rowData: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  updateModal: PropTypes.elementType,
  deleteModal: PropTypes.elementType,
  refreshData: PropTypes.func,
  onRefreshGlobalData: PropTypes.func,
};
