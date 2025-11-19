import { useState, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useOutletContext } from "react-router-dom";
import { IpContext } from "../../context/IpContext";
import { icons } from "../../assets/icons";
import { motion } from "framer-motion";
import backIcon from "../../assets/prev.svg";
import Modal from "../../components/ui/modal";
import ApprovalDetailsModal from "../Approvals/ApprovalDetailsModal";

export default function EditDraftEventModal({
  isOpen,
  onClose,
  onGoBack,
  rowData,
  id,
  deleteModal: DeleteModal,
  refreshData,
  onRefreshGlobalData,
}) {
  const { handleShowNotification } = useOutletContext();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [attendanceGroups, setAttendanceGroups] = useState([]);
  const today = new Date().toISOString().slice(0, 10);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const keyLockRef = useRef(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [showDelete, setShowDelete] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestError, setRequestError] = useState("");
  const [approvalHistory, setApprovalHistory] = useState([]);
  const [approvalHistoryError, setApprovalHistoryError] = useState("");
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const userData = sessionStorage.getItem("user");

  const errorRef = useRef(null);

  const ip = useContext(IpContext);
  const title = "EDIT DRAFT EVENT";

  const formatDateForInput = (date) =>
    new Date(date).toISOString().slice(0, 10);

  useEffect(() => {
    if (!isOpen) {
      setDetails(null);
      setEventName("");
      setEventDescription("");
      setErrorMsg("");
      setShowRequestModal(false);
      setRequestMessage("");
      setRequestError("");
      setApprovalHistory([]);
      setApprovalHistoryError("");
      setSelectedApproval(null);
      setShowApprovalModal(false);
    }
  }, [isOpen]);

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
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (start > end) {
        setErrorMsg("Start date must be before End date.");
        setAttendanceGroups([]);
        return;
      }
      let groups = [];
      let current = new Date(start);
      while (current <= end) {
        groups.push({
          date: current.toISOString().slice(0, 10),
          rows: [{ time: "", period: "", process: "In", cutoff: "" }],
        });
        current.setDate(current.getDate() + 1);
      }
      setAttendanceGroups(groups);
    }
  }, [startDate, endDate]);

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
        console.log("Fetched event details:", result);
        if (result.status) {
          const data = result.data;
          setDetails(data);
          setEventName(data.name || "");
          setEventDescription(data.description || "");
          setStartDate(
            data.start_date ? formatDateForInput(data.start_date) : ""
          );
          setEndDate(data.end_date ? formatDateForInput(data.end_date) : "");
          if (data.breakdown) {
            try {
              const parsedAttendance = JSON.parse(data.breakdown);
              setAttendanceGroups(parsedAttendance);
            } catch (err) {
              console.error("Error parsing attendance data:", err);
            }
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

  const handleKeyDown = (e, nextFocusFn) => {
    if (e.key === "Enter") {
      if (keyLockRef.current || e.repeat) return;
      keyLockRef.current = true;
      e.preventDefault();
      nextFocusFn();
      // Release the lock after 150ms (adjust if needed).
      setTimeout(() => {
        keyLockRef.current = false;
      }, 150);
    }
  };

  // ----- Helper to determine period based on time input -----
  const getPeriodFromTime = (timeValue) => {
    if (!timeValue) return "";
    const [hour, minute] = timeValue.split(":").map(Number);
    const total = hour * 60 + minute;
    if (total >= 0 && total < 360) return "Dawn"; // 12am - 6am
    if (total >= 360 && total < 720) return "Morning"; // 6am - 12pm
    if (total >= 720 && total < 1080) return "Afternoon"; // 12pm - 6pm
    if (total >= 1080 && total <= 1440) return "Evening"; // 6pm - 12am
    return "";
  };

  // ----- Update a field in an attendance group row -----
  const updateAttendanceGroupRow = (groupIdx, rowIdx, field, value) => {
    setAttendanceGroups((prev) => {
      const updated = [...prev];
      updated[groupIdx].rows[rowIdx][field] = value;
      if (field === "time") {
        updated[groupIdx].rows[rowIdx].period = getPeriodFromTime(value);
      }
      return updated;
    });
  };

  // ----- Add a new row to an attendance group -----
  const addRowToAttendanceGroup = (groupIdx) => {
    setAttendanceGroups((prev) =>
      prev.map((group, idx) =>
        idx === groupIdx
          ? {
              ...group,
              rows: [
                ...group.rows,
                { time: "", period: "", process: "In", cutoff: "" },
              ],
            }
          : group
      )
    );
  };

  // ----- Remove a row from an attendance group -----
  const removeRowFromAttendanceGroup = (groupIdx, rowIdx) => {
    setAttendanceGroups((prev) =>
      prev.map((group, idx) => {
        if (idx !== groupIdx) return group;
        if (group.rows.length > 1) {
          return { ...group, rows: group.rows.filter((_, i) => i !== rowIdx) };
        }
        return group;
      })
    );
  };

  const validateForApproval = () => {
    const attendanceGroupInvalid = attendanceGroups.some((group) =>
      group.rows.some(
        (row) => !row.time.trim() || !row.cutoff.trim() || !row.process.trim()
      )
    );
    if (attendanceGroupInvalid) {
      const msg = "Please fill in all required fields in attendance groups.";
      setErrorMsg(msg);
      return false;
    }
    return true;
  };

  const updateEvent = async (statusParam = "Draft") => {
    // Clear previous error message.
    setErrorMsg("");
    setErrorMsg("");

    const todayDateObj = new Date(new Date().toISOString().split("T")[0]);
    const todayDateStr = todayDateObj.toISOString().slice(0, 10);
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start < todayDateObj || end < todayDateObj) {
      setErrorMsg("Start date and End date must be today or in the future.");
      // Reset both dates to today's date.
      setStartDate(todayDateStr);
      setEndDate(todayDateStr);
      return;
    }

    if (end < start) {
      setErrorMsg("End date cannot be before start date.");
      // Reset both dates to today's date.
      setStartDate(todayDateStr);
      setEndDate(todayDateStr);
      return;
    }

    // Calculate inclusive difference in days.
    const diffTime = end - start;
    const diffDays = diffTime / (1000 * 60 * 60 * 24) + 1; // +1 for inclusive count
    if (diffDays > 5) {
      setErrorMsg("Event range maximum is five days.");
      // Reset endDate to startDate + 4 days (making a five-day range inclusive)
      let newEndDate = new Date(start);
      newEndDate.setDate(newEndDate.getDate() + 4);
      setEndDate(newEndDate.toISOString().slice(0, 10));
      return;
    }

    // Only perform validation when submitting for approval.
    if (statusParam === "Sent for Approval") {
      // Validate each attendance group.
      // (Adjust validation logic as needed; here we simply check that each row has a time and cutoff.)
      const attendanceGroupInvalid = attendanceGroups.some((group) =>
        group.rows.some(
          (row) => !row.time.trim() || !row.cutoff.trim() || !row.process.trim()
        )
      );
      if (attendanceGroupInvalid) {
        const msg = "Please fill in all required fields in attendance groups.";
        setErrorMsg(msg);
        return;
      }
    }
    try {
      const response = await fetch(`${ip}/update-draft-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_data: userData,
          id,
          name: eventName,
          description: eventDescription,
          start_date: startDate,
          end_date: endDate,
          breakdown: attendanceGroups, // now using attendance groups instead of budget groups
          status: statusParam,
          request_message:
            statusParam === "Sent for Approval" ? requestMessage : "",
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update event");
      }
      const result = await response.json();
      console.log("Updated event:", result);
      if (result.status) {
        if (statusParam === "Draft") {
          // If details have changed, update the details state.
          if (
            result.data.name !== details?.name ||
            result.data.description !== details?.description ||
            result.data.updated_at !== details?.updated_at
          ) {
            setDetails(result.data);
          }
          setIsEditingDetails(false);
          handleShowNotification("Event updated successfully", "success");
          if (refreshData) refreshData();
        } else if (statusParam === "Sent for Approval") {
          // Notify and close the modal when submission is sent for approval.
          handleShowNotification("Event is sent for approval", "success");
          if (refreshData) refreshData();
          onRefreshGlobalData();
          onClose();
        }
      } else {
        const msg = "Failed to update event";
        setErrorMsg(msg);
        handleShowNotification(msg, "error");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      const msg = "Error updating event";
      setErrorMsg(msg);
      handleShowNotification(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen && !isVisible) return null;
  return (
    <>
      <div
        className={`fixed inset-0 bg-[#171A1FDD] z-50 flex justify-center items-center w-full px-6 lg:px-12 py-8 h-full space-x-4`}
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => {
            setErrorMsg("");
            refreshData();
            onClose();
          }, 300);
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
                }, 300);
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
              <div className="mt-2 md:mt-0 h-9/10 overflow-y-auto">
                {isEditingDetails ? (
                  <motion.div
                    initial={{ opacity: 0.1, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 2 }}
                    transition={{ duration: 0.75 }}
                    className="text-sm flex flex-col p-1 gap-4"
                  >
                    <div>
                      <label className="block font-semibold">Event Name</label>
                      <Input
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                        placeholder="Enter Event Name"
                        className="w-full border rounded-md p-1.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="flex font-semibold">Description</label>
                      <textarea
                        type="text"
                        value={eventDescription}
                        onChange={(e) => setEventDescription(e.target.value)}
                        placeholder="Enter Description"
                        className="rounded-md border border-black h-40 p-1.5 w-full resize-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => {
                          // Update details and exit edit mode
                          updateEvent("Draft");
                          setDetails((prev) => ({
                            ...prev,
                            name: eventName,
                            description: eventDescription,
                          }));
                          setIsEditingDetails(false);
                        }}
                        className="transition-all duration-150 transform hover:scale-105 hover:bg-blue-800 bg-blue-600 text-white px-3 py-1 rounded text-sm cursor-pointer"
                      >
                        Save Details
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          // Reset edited values and exit edit mode
                          setEventName(details?.name || "");
                          setEventDescription(details?.description || "");
                          setIsEditingDetails(false);
                        }}
                        className="transition-all duration-150 transform hover:scale-105 hover:bg-gray-800 bg-gray-400 text-white px-3 py-1 rounded text-sm cursor-pointer"
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0.1, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 2 }}
                    transition={{ duration: 0.75 }}
                    className="border rounded-xl bg-[#03fffb22]"
                  >
                    <div className="text-sm flex flex-col gap-2">
                      <div className="py-3 px-4 border-b rounded-t-xl bg-sky-400">
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
                        {!isEditingDetails && (
                          <div className="flex gap-2 mt-2 justify-end">
                            <Button
                              type="button"
                              onClick={() => setIsEditingDetails(true)}
                              className="transition-all duration-150 transform hover:scale-105 hover:bg-green-800 bg-green-600 text-white px-4 py-2 rounded text-sm cursor-pointer"
                            >
                              Edit Details
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Additional details remain unchanged */}
                      <div className="flex flex-col gap-6 px-4 pb-4 pt-1 border-b">
                        <div>
                          <label className="block font-semibold mb-1">
                            Start Date
                          </label>
                          <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                              setStartDate(e.target.value);
                              updateEvent("Draft");
                            }}
                            min={today} // Only today or future dates allowed
                            className="w-full border rounded p-2"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold mb-1">
                            End Date
                          </label>
                          <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                              setEndDate(e.target.value);
                              updateEvent("Draft");
                            }}
                            min={today} // Only today or future dates allowed
                            className="w-full border rounded p-2"
                          />
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
                    <div className="mt-4 px-4 pb-4">
                      <h2 className="text-2xl font-semibold mb-3 text-gray-800">
                        Approval History
                      </h2>
                      <div className="overflow-x-auto border rounded-lg">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-sky-300 text-sm">
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
                                      : "Pendeing"}
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
                )}
              </div>
              <div className="flex justify-end items-center space-x-2 h-1/10">
                <Button
                  type="button"
                  onClick={() => {
                    if (validateForApproval()) {
                      setShowRequestModal(true);
                    }
                  }}
                  className="transition-all duration-150 transform hover:scale-105 hover:bg-purple-800 bg-purple-600 text-white px-4 py-2 rounded text-sm cursor-pointer flex flex-row lg:space-x-1"
                >
                  <span>Submit </span>
                  <span className="md:hidden lg:block">for Approval</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowDelete(true)}
                  className="transition-all duration-150 transform hover:scale-105 hover:bg-red-800 bg-red-600 text-white px-4 py-2 rounded text-sm cursor-pointer flex flex-row lg:space-x-1"
                >
                  <span>Delete </span>
                  <span className="md:hidden lg:block">Budget</span>
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
                }, 300); // Trigger fade-out animation before closing
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

          {loading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-xl text-gray-600">Loading...</p>
            </div>
          ) : (
            <div className="overflow-y-auto">
              <div className="pt-5 pb-5 md:pb-20 md:py-10 transition-all duration-300 px-5 sm:px-10 md:px-15 lg:px-20 xl:px-25 2xl:px-35">
                {/* Budget Details Section */}
                {isMobile && (
                  <div className="border-b border-gray-500 pb-4 mb-4">
                    <h2 className="text-2xl font-semibold mb-3 text-gray-800">
                      Budget Details
                    </h2>
                    <motion.div
                      initial={{ opacity: 0.1, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 2 }}
                      transition={{ duration: 0.75 }}
                      className="text-sm flex flex-col p-1 gap-4"
                    >
                      <div>
                        <label className="block font-semibold">
                          Budget Name
                        </label>
                        <Input
                          value={eventName}
                          onChange={(e) => setEventName(e.target.value)}
                          placeholder="Enter Budget Name"
                          className="w-full border rounded-md p-1.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="flex font-semibold">
                          Description
                        </label>
                        <textarea
                          type="text"
                          value={eventDescription}
                          onChange={(e) => setEventDescription(e.target.value)}
                          placeholder="Enter Description"
                          className="rounded-md border border-black h-40 p-1.5 w-full resize-none"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">
                          Start Date
                        </label>
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => {
                            setStartDate(e.target.value);
                            updateEvent("Draft");
                          }}
                          min={today} // Only today or future dates allowed
                          className="w-full border rounded p-2"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">
                          End Date
                        </label>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => {
                            setEndDate(e.target.value);
                            updateEvent("Draft");
                          }}
                          min={today} // Only today or future dates allowed
                          className="w-full border rounded p-2"
                        />
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
                      <div className="mt-2">
                        <label className="flex font-semibold">
                          Approval History
                        </label>
                        <div className="overflow-x-auto border rounded-lg">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-sky-300 text-sm">
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
                                        : "Pendeing"}
                                    </td>
                                    <td className="px-2 py-1">
                                      <Button
                                        type="button"
                                        onClick={() => {
                                          setSelectedApproval(record);
                                          setShowApprovalModal(true);
                                        }}
                                        className="bg-blue-500 text-white px-2 py-1 rounded"
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
                          Attendance Group - {group.date}
                        </label>
                      </div>
                      {/* Items Table for the Attendance Group */}
                      <div className="border rounded-lg overflow-clip">
                        <div className="overflow-x-auto">
                          <table className="min-w-[450px] border-collapse">
                            <thead className="bg-sky-400 text-sm text-white">
                              <tr>
                                <th className="p-2 text-left w-2/7">Date</th>
                                <th className="p-2 text-left w-1/7">Time</th>
                                <th className="p-2 text-left w-1/7">Period</th>
                                <th className="p-2 text-left w-1/7">Process</th>
                                <th className="p-2 text-left w-1/7">Cutoff</th>
                                <th className="p-2 text-left w-1/7">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.rows.map((row, rIdx) => (
                                <tr
                                  key={rIdx}
                                  className="text-sm bg-white border-b"
                                >
                                  <td className="p-2 whitespace-nowrap">
                                    {/* Date is non-editable */}
                                    <Input type="hidden" value={group.date} />
                                    <span>{group.date}</span>
                                  </td>
                                  <td className="p-2 whitespace-nowrap">
                                    <Input
                                      type="time"
                                      value={row.time}
                                      onChange={(e) => {
                                        updateAttendanceGroupRow(
                                          gIdx,
                                          rIdx,
                                          "time",
                                          e.target.value
                                        );
                                        updateEvent("Draft");
                                      }}
                                      className="w-full"
                                    />
                                  </td>
                                  <td className="p-2 whitespace-nowrap">
                                    <Input
                                      type="text"
                                      value={row.period}
                                      readOnly
                                      className="w-full bg-gray-100"
                                    />
                                  </td>
                                  <td className="p-2 whitespace-nowrap">
                                    <select
                                      value={row.process}
                                      onChange={(e) => {
                                        updateAttendanceGroupRow(
                                          gIdx,
                                          rIdx,
                                          "process",
                                          e.target.value
                                        );
                                        updateEvent("Draft");
                                      }}
                                      className="w-full border rounded p-1 text-sm"
                                    >
                                      <option value="In">In</option>
                                      <option value="Out">Out</option>
                                    </select>
                                  </td>
                                  <td className="p-2 whitespace-nowrap">
                                    <Input
                                      type="time"
                                      value={row.cutoff}
                                      onChange={(e) => {
                                        updateAttendanceGroupRow(
                                          gIdx,
                                          rIdx,
                                          "cutoff",
                                          e.target.value
                                        );
                                        updateEvent("Draft");
                                      }}
                                      className="w-full"
                                    />
                                  </td>
                                  <td className="p-2 text-center whitespace-nowrap">
                                    {group.rows.length > 1 && (
                                      <Button
                                        type="button"
                                        onClick={() => {
                                          removeRowFromAttendanceGroup(
                                            gIdx,
                                            rIdx
                                          );
                                          updateEvent("Draft");
                                        }}
                                        className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                      >
                                        Remove
                                      </Button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                <td
                                  colSpan="6"
                                  className="p-2 whitespace-nowrap"
                                >
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      addRowToAttendanceGroup(gIdx);
                                      updateEvent("Draft");
                                    }}
                                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                  >
                                    Add Row
                                  </Button>
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errorMsg && (
                  <p ref={errorRef} className="mt-8 text-red-600 text-sm">
                    {errorMsg}
                  </p>
                )}
              </div>
            </div>
          )}
          {isMobile && (
            <div className="flex justify-end items-center space-x-2 p-4">
              <Button
                type="button"
                onClick={() => {
                  if (validateForApproval()) {
                    setShowRequestModal(true);
                  }
                }}
                className="transition-all duration-150 transform hover:scale-105 hover:bg-purple-800 bg-purple-600 text-white px-4 py-2 rounded text-sm cursor-pointer"
              >
                Submit for Approval
              </Button>
              <Button
                type="button"
                onClick={() => setShowDelete(true)}
                className="transition-all duration-150 transform hover:scale-105 hover:bg-red-800 bg-red-600 text-white px-4 py-2 rounded text-sm cursor-pointer"
              >
                Delete Budget
              </Button>
            </div>
          )}
        </motion.div>
      </div>
      {showRequestModal && (
        <Modal
          title="SUBMIT FOR APPROVAL"
          isOpen={showRequestModal}
          onClose={() => {
            setShowRequestModal(false);
            setRequestMessage("");
            setRequestError("");
          }}
          modalCenter={true}
          w={"w-11/12 h-11/12 md:h-4/7 md:w-4/7 lg:w-3/7 xl:w-2/7"}
        >
          <div className="p-4 h-7/9">
            <textarea
              value={requestMessage}
              onChange={(e) => {
                setRequestMessage(e.target.value);
                setRequestError("");
              }}
              placeholder="Enter your request message here..."
              className="w-full h-full border rounded p-2 mb-2"
            />
            {requestError && (
              <p className="text-red-600 text-sm mb-2">{requestError}</p>
            )}
          </div>
          <div className="flex justify-end space-x-2 h-2/9 p-4">
            <Button
              type="button"
              onClick={() => {
                setShowRequestModal(false);
                setRequestMessage("");
                setRequestError("");
              }}
              className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-gray-800 bg-gray-400 text-white px-4 py-2 rounded h-fit"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                if (!requestMessage.trim()) {
                  setRequestError("Request message is required.");
                  return;
                }
                updateEvent("Sent for Approval");
              }}
              className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-purple-800 bg-purple-600 text-white px-4 py-2 rounded h-fit"
            >
              Send
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
      {DeleteModal && showDelete && (
        <DeleteModal
          isOpen={showDelete}
          onClose={() => {
            setShowDelete(false);
          }}
          onGoBack={() => {
            setShowDelete(false);
            onGoBack();
          }}
          id={id}
          rowData={rowData}
          refreshData={refreshData}
          handleOnClose={() => {
            onClose();
            onRefreshGlobalData();
          }}
        />
      )}
    </>
  );
}

EditDraftEventModal.propTypes = {
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
