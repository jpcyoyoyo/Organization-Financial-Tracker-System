import { useState, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useOutletContext } from "react-router-dom";
import { IpContext } from "../../context/IpContext";
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
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [attendanceGroups, setAttendanceGroups] = useState([]);
  const today = new Date().toISOString().slice(0, 10);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const keyLockRef = useRef(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [readyToSubmit, setReadyToSubmit] = useState(false);

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

  const formatDateForInput = (date) => {
    if (!date) return "";

    // Handle "YYYY-MM-DD" format
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }

    // Handle "DD-MM-YYYY" format
    if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
      const [day, month, year] = date.split("-");
      return `${year}-${month}-${day}`;
    }

    // Handle "Month DD, YYYY at HH:MM:SS AM/PM" or other JS-parseable formats
    const parsedDate = new Date(date);
    if (!isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString().slice(0, 10);
    }

    // Fallback: return as-is if unparseable
    return date;
  };

  // Fetch draft event details and populate modal state
  const fetchDraftDetails = async () => {
    setLoading(true);
    if (!id) return setLoading(false);
    try {
      const response = await fetch(`${ip}/fetch-draft-event-details`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Failed to fetch details");
      const result = await response.json();
      if (result.status) {
        const data = result.data;
        setDetails(data);
        setEventName(data.name || "");
        setEventDescription(data.description || "");
        setEventDate(data.date ? formatDateForInput(data.date) : "");

        // Parse time_period if provided (format: "HH:MM-HH:MM"), otherwise use start_time/end_time
        if (data.time_period) {
          const [start, end] = data.time_period.split("-").map((t) => t.trim());
          setStartTime(start || "");
          setEndTime(end || "");
        } else {
          setStartTime(data.start_time || "");
          setEndTime(data.end_time || "");
        }

        // Parse attendances or breakdown JSON
        const attendanceData = data.attendances || data.breakdown;
        if (
          attendanceData &&
          Array.isArray(attendanceData) &&
          attendanceData.length > 0
        ) {
          try {
            const parsedAttendance =
              typeof attendanceData === "string"
                ? JSON.parse(attendanceData)
                : attendanceData;
            // Normalize attendance structure
            const normalized = parsedAttendance.map((group, idx) => {
              const gDate = group.date || data.date || eventDate || today;
              const rawRows = group.rows || [];
              const rows = rawRows.map((r) => {
                if (r.start_time !== undefined) {
                  return {
                    process: r.process || "",
                    start_time: r.start_time || "",
                    cutoff: r.cutoff || "",
                  };
                }
                return {
                  process: r.process || "",
                  start_time: r.time || "",
                  cutoff: r.cutoff || "",
                };
              });
              if (rows.length === 0) {
                rows.push({ process: "In", start_time: "", cutoff: "" });
                rows.push({ process: "Out", start_time: "", cutoff: "" });
              } else {
                if (rows[0].process !== "In") {
                  rows.unshift({ process: "In", start_time: "", cutoff: "" });
                }
                if (rows[rows.length - 1].process !== "Out") {
                  rows.push({ process: "Out", start_time: "", cutoff: "" });
                }
              }
              let period_start = group.period_start || "";
              let period_end = group.period_end || "";
              const times = rows.map((r) => r.start_time).filter(Boolean);
              if (!period_start && times.length)
                period_start = times.reduce((a, b) => (a < b ? a : b));
              if (!period_end && times.length)
                period_end = times.reduce((a, b) => (a > b ? a : b));
              let name = group.name || "";
              let custom_name = !!group.name;
              if (!name) {
                const label =
                  getPeriodFromTime(period_start) ||
                  getPeriodFromTime(period_end);
                if (label) name = `${label} Attendance Period`;
                else name = `Attendance Period ${idx + 1}`;
              }
              return {
                date: gDate,
                period_start: period_start || "",
                period_end: period_end || "",
                rows,
                name,
                custom_name,
              };
            });
            setAttendanceGroups(normalized);
          } catch (err) {
            console.error("Error parsing attendance data:", err);
            setAttendanceGroups([]);
          }
        } else {
          // No attendance data: ensure at least one default group if date exists
          if (data.date) {
            setAttendanceGroups([
              {
                date: data.date,
                period_start: "",
                period_end: "",
                rows: [
                  { process: "In", start_time: "", cutoff: "" },
                  { process: "Out", start_time: "", cutoff: "" },
                ],
                name: "Attendance Period 1",
                custom_name: false,
              },
            ]);
          } else {
            setAttendanceGroups([]);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch approval history
  const fetchApprovalHistory = async () => {
    if (!id) return;
    try {
      const response = await fetch(`${ip}/fetch-approval-history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "Event", relating_id: id }),
      });
      if (!response.ok) throw new Error("Failed to fetch approval history");
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
  };

  useEffect(() => {
    if (!isOpen) {
      setDetails(null);
      setEventName("");
      setEventDescription("");
      setEventDate("");
      setStartTime("");
      setEndTime("");
      setAttendanceGroups([]);
      setIsEditingDetails(false);
      setErrorMsg("");
      setShowDelete(false);
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
    if (isOpen) {
      fetchDraftDetails();
      fetchApprovalHistory();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, id, ip]);

  // Check for validation errors after details are loaded
  useEffect(() => {
    if (details && attendanceGroups.length > 0) {
      // Run validation checks and display errors if any
      const errorMsg = getValidationErrorMessage();
      if (errorMsg) {
        setErrorMsg(errorMsg);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  // Clear global error message if there are any attendance period or row errors
  useEffect(() => {
    const hasAttendanceErrors = attendanceGroups.some((group) => {
      if (group.periodError) return true;
      if (group.rows && group.rows.some((row) => row.rowError)) return true;
      return false;
    });

    if (hasAttendanceErrors) {
      setErrorMsg("");
    }
  }, [attendanceGroups]);

  // Check if form is ready to submit (no validation errors)
  useEffect(() => {
    const isReady = !hasValidationErrors();
    setReadyToSubmit(isReady);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attendanceGroups, eventDate, startTime, endTime]);

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

  // Ensure end time is not before start time when updating either field
  const handleStartTimeChange = (value) => {
    // If an endTime exists, ensure it's not before the new start
    if (endTime && value && endTime < value) {
      setErrorMsg("End time must not be before start time.");
      // Don't update start time if it makes end time invalid
      return;
    }
    setStartTime(value);
    // clear any related error and persist draft
    setErrorMsg("");
    if (typeof updateEvent === "function") {
      updateEvent("Draft", {
        eventName,
        eventDescription,
        eventDate,
        startTime: value,
        endTime,
        attendanceGroups,
      });
    }

    // Validate existing attendance periods against the new event time
    if (value && endTime && eventDate) {
      // Compare times as minutes to avoid date/timezone issues
      const eventStartMin = timeToMinutes(value);
      const eventEndMin = timeToMinutes(endTime);

      setAttendanceGroups((prev) =>
        prev.map((g) => {
          if (!g.period_start || !g.period_end)
            return { ...g, periodError: g.periodError || "" };

          const pStartMin = timeToMinutes(g.period_start);
          const pEndMin = timeToMinutes(g.period_end);

          if (
            pStartMin !== null &&
            pEndMin !== null &&
            eventStartMin !== null &&
            eventEndMin !== null
          ) {
            if (pStartMin < eventStartMin || pEndMin > eventEndMin) {
              const msg = `Attendance periods must be within the event time range.`;
              return { ...g, periodError: msg };
            }
          }
          return { ...g, periodError: "" };
        })
      );
      // Per-period errors are set above; clear global error (errors show inline)
      setErrorMsg("");
    }
  };

  const handleEndTimeChange = (value) => {
    // If a startTime exists, ensure end is not before start
    if (startTime && value && value < startTime) {
      setErrorMsg("End time must not be before start time.");
      // Don't update end time if it makes it before start time
      return;
    }
    setEndTime(value);
    setErrorMsg("");
    if (typeof updateEvent === "function") {
      updateEvent("Draft", {
        eventName,
        eventDescription,
        eventDate,
        startTime,
        endTime: value,
        attendanceGroups,
      });
    }

    // Validate existing attendance periods against the new event time
    if (startTime && value && eventDate) {
      // Compare times as minutes to avoid date/timezone issues
      const eventStartMin = timeToMinutes(startTime);
      const eventEndMin = timeToMinutes(value);

      setAttendanceGroups((prev) =>
        prev.map((g) => {
          if (!g.period_start || !g.period_end)
            return { ...g, periodError: g.periodError || "" };

          const pStartMin = timeToMinutes(g.period_start);
          const pEndMin = timeToMinutes(g.period_end);

          if (
            pStartMin !== null &&
            pEndMin !== null &&
            eventStartMin !== null &&
            eventEndMin !== null
          ) {
            if (pStartMin < eventStartMin || pEndMin > eventEndMin) {
              const msg = `Attendance periods must be within the event time range.`;
              return { ...g, periodError: msg };
            }
          }
          return { ...g, periodError: "" };
        })
      );
      // Per-period errors are set above; clear global error (errors show inline)
      setErrorMsg("");
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

  // ----- Helper to convert HH:MM to minutes since midnight -----
  const timeToMinutes = (timeValue) => {
    if (!timeValue) return null;
    const [h, m] = timeValue.split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
    return h * 60 + m;
  };

  // ----- Compute auto-generated name for an attendance period -----
  const computeAttendanceGroupName = (group, groupIdx) => {
    // If custom_name is true, return the user's custom name
    if (group.custom_name) return group.name;

    const { period_start, period_end } = group;

    // If no time is set, use sequence number among groups without times
    if (!period_start || !period_end) {
      let countNoTime = 0;
      for (let i = 0; i <= groupIdx; i++) {
        if (
          !(attendanceGroups[i].period_start && attendanceGroups[i].period_end)
        ) {
          countNoTime++;
        }
      }
      return `Attendance Period ${countNoTime}`;
    }

    // Both period_start and period_end are set
    const startLabel = getPeriodFromTime(period_start);
    const endLabel = getPeriodFromTime(period_end);

    let baseName = "";
    if (startLabel === endLabel && startLabel) {
      // Same period
      baseName = `${startLabel} Attendance Period`;
    } else if (startLabel && endLabel) {
      // Spans multiple periods
      baseName = `${startLabel} to ${endLabel} Attendance Period`;
    } else if (startLabel) {
      baseName = `${startLabel} Attendance Period`;
    } else if (endLabel) {
      baseName = `${endLabel} Attendance Period`;
    } else {
      baseName = "Attendance Period";
    }

    // Count duplicates: how many groups before this one have the same baseName
    let duplicateIndex = 0;
    for (let i = 0; i < groupIdx; i++) {
      const otherGroup = attendanceGroups[i];
      const otherName = computeAttendanceGroupName(otherGroup, i);
      if (otherName.startsWith(baseName)) {
        duplicateIndex++;
      }
    }

    // If there are duplicates or we detected a duplicate will come later, add number
    if (duplicateIndex > 0) {
      return `${baseName} ${duplicateIndex + 1}`;
    }
    // Check if a future group would have the same base name
    for (let i = groupIdx + 1; i < attendanceGroups.length; i++) {
      const otherGroup = attendanceGroups[i];
      if (
        !otherGroup.custom_name &&
        otherGroup.period_start &&
        otherGroup.period_end
      ) {
        const otherStart = getPeriodFromTime(otherGroup.period_start);
        const otherEnd = getPeriodFromTime(otherGroup.period_end);
        let otherBaseName = "";
        if (otherStart === otherEnd && otherStart) {
          otherBaseName = `${otherStart} Attendance Period`;
        } else if (otherStart && otherEnd) {
          otherBaseName = `${otherStart} to ${otherEnd} Attendance Period`;
        } else if (otherStart) {
          otherBaseName = `${otherStart} Attendance Period`;
        } else if (otherEnd) {
          otherBaseName = `${otherEnd} Attendance Period`;
        }
        if (otherBaseName === baseName) {
          return `${baseName} 1`;
        }
      }
    }

    return baseName;
  };

  // ----- Update a field in an attendance group row -----
  const updateAttendanceGroupRow = (groupIdx, rowIdx, field, value) => {
    setAttendanceGroups((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      // Update row fields (process, start_time, cutoff)
      if (field === "start_time" || field === "cutoff" || field === "process") {
        const row = updated[groupIdx].rows[rowIdx];
        const ps = updated[groupIdx].period_start;
        const pe = updated[groupIdx].period_end;

        // Clear previous row error
        row.rowError = "";

        // Special handling for start_time and cutoff fields to validate and reset on error
        if (field === "start_time") {
          // Validate start_time is within period bounds
          if (value && ps && pe) {
            const startMin = timeToMinutes(value);
            const periodStartMin = timeToMinutes(ps);
            const periodEndMin = timeToMinutes(pe);
            if (
              startMin === null ||
              periodStartMin === null ||
              periodEndMin === null
            ) {
              row.rowError = "Invalid time format.";
              row.start_time = ""; // Reset invalid input
              return updated;
            } else if (startMin < periodStartMin || startMin > periodEndMin) {
              row.rowError = "Start time must be within the attendance period.";
              row.start_time = ""; // Reset invalid input
              return updated;
            }
          }
          row.start_time = value;

          // If cutoff also exists, check if new start_time makes cutoff invalid
          if (row.cutoff) {
            const sMin = timeToMinutes(value);
            const cMin = timeToMinutes(row.cutoff);
            if (sMin !== null && cMin !== null && cMin - sMin < 10) {
              row.rowError =
                "Cutoff must be at least 10 minutes after the start time.";
              row.cutoff = ""; // Reset cutoff to blank
            }
          }
        } else if (field === "cutoff") {
          // Validate cutoff is within period bounds
          if (value && ps && pe) {
            const cutoffMin = timeToMinutes(value);
            const periodStartMin = timeToMinutes(ps);
            const periodEndMin = timeToMinutes(pe);
            if (
              cutoffMin === null ||
              periodStartMin === null ||
              periodEndMin === null
            ) {
              row.rowError = "Invalid time format.";
              row.cutoff = ""; // Reset invalid input
              return updated;
            } else if (cutoffMin < periodStartMin || cutoffMin > periodEndMin) {
              row.rowError = "Cutoff must be within the attendance period.";
              row.cutoff = ""; // Reset invalid input
              return updated;
            }
          }
          row.cutoff = value;

          // If start_time exists, check if new cutoff is at least 10 minutes after start
          if (row.start_time) {
            const sMin = timeToMinutes(row.start_time);
            const cMin = timeToMinutes(value);
            if (sMin !== null && cMin !== null && cMin - sMin < 10) {
              row.rowError =
                "Cutoff must be at least 10 minutes after the start time.";
              row.cutoff = ""; // Reset invalid input
            }
          }
        } else if (field === "process") {
          row.process = value;
        }

        // Extra checks for Surprise process
        if (row.process === "Surprise" && row.start_time && row.cutoff) {
          const rows = updated[groupIdx].rows;
          const inRow = rows.find((r) => r.process === "In");
          const outRow = [...rows].reverse().find((r) => r.process === "Out");
          if (!inRow || !outRow || !inRow.cutoff || !outRow.start_time) {
            row.rowError =
              "Cannot set Surprise times: In cutoff or Out start time is missing.";
          } else {
            const inCut = timeToMinutes(inRow.cutoff);
            const outStart = timeToMinutes(outRow.start_time);
            const rStart = timeToMinutes(row.start_time);
            const rCut = timeToMinutes(row.cutoff);
            if (
              inCut === null ||
              outStart === null ||
              rStart === null ||
              rCut === null
            ) {
              row.rowError = "Invalid time format.";
            } else if (rStart < inCut || rCut > outStart) {
              row.rowError =
                "Surprise times must be within In cutoff and Out start times.";
              // Reset both times for Surprise if they're invalid
              if (field === "start_time") row.start_time = "";
              if (field === "cutoff") row.cutoff = "";
            } else if (rCut - rStart < 10) {
              row.rowError =
                "Cutoff must be at least 10 minutes after the start time.";
              // Reset cutoff if it's less than 10 minutes after start
              if (field === "cutoff") row.cutoff = "";
            }
          }
        }
      }
      // Update group's period bounds when user edits period_start / period_end
      if (field === "period_start" || field === "period_end") {
        updated[groupIdx][field] = value;
        // Auto-update the attendance period name when time range changes, unless user customized it
        const ps = updated[groupIdx].period_start;
        const pe = updated[groupIdx].period_end;
        if (!updated[groupIdx].custom_name) {
          if (ps && pe) {
            const label = getPeriodFromTime(ps) || getPeriodFromTime(pe);
            if (label) {
              updated[groupIdx].name = `${label} Attendance Period`;
            }
          } else if (!ps && !pe) {
            // compute sequence number among groups without a full time range
            let num = 0;
            for (let i = 0; i <= groupIdx; i++) {
              const g = updated[i];
              if (!(g.period_start && g.period_end)) num++;
            }
            updated[groupIdx].name = `Attendance Period ${num}`;
          } else {
            // partial time set: try to derive a label from whichever time exists
            const label = getPeriodFromTime(ps) || getPeriodFromTime(pe);
            if (label) updated[groupIdx].name = `${label} Attendance Period`;
          }
        }
      }

      return updated;
    });

    // Check for overlaps and event-bound violations after period times are set
    if (field === "period_start" || field === "period_end") {
      setAttendanceGroups((prev) => {
        const group = prev[groupIdx];
        if (group.period_start && group.period_end) {
          // Check overlap against other groups
          const currentStart = new Date(`2000-01-01T${group.period_start}:00`);
          const currentEnd = new Date(`2000-01-01T${group.period_end}:00`);
          // If this period's end is before its start, reset the invalid field
          if (currentEnd <= currentStart) {
            const msg =
              "Attendance period end time must not be before start time.";
            const updatedPrev = prev.map((g, idx) => {
              if (idx !== groupIdx) return { ...g };
              // Reset the field that caused the error
              const updated = { ...g, periodError: msg };
              if (field === "period_start") updated.period_start = "";
              if (field === "period_end") updated.period_end = "";
              return updated;
            });
            setErrorMsg("");
            return updatedPrev;
          }
          let overlapError = null;

          for (let i = 0; i < prev.length; i++) {
            if (i === groupIdx) continue;

            const otherGroup = prev[i];
            if (!otherGroup.period_start || !otherGroup.period_end) continue;

            const otherStart = new Date(
              `2000-01-01T${otherGroup.period_start}:00`
            );
            const otherEnd = new Date(`2000-01-01T${otherGroup.period_end}:00`);

            // Check if periods overlap
            if (currentStart < otherEnd && currentEnd > otherStart) {
              const otherName = computeAttendanceGroupName(otherGroup, i);
              const currentName = computeAttendanceGroupName(group, groupIdx);
              overlapError = `Attendance periods cannot overlap: "${currentName}" overlaps with "${otherName}".`;
              break;
            }
          }

          // Check against event-level time bounds (only when event times exist)
          let eventBoundError = null;
          if (startTime && endTime && eventDate) {
            // Compare times as minutes to avoid date/timezone issues
            const pStartMin = timeToMinutes(group.period_start);
            const pEndMin = timeToMinutes(group.period_end);
            const eventStartMin = timeToMinutes(startTime);
            const eventEndMin = timeToMinutes(endTime);

            if (
              pStartMin !== null &&
              pEndMin !== null &&
              eventStartMin !== null &&
              eventEndMin !== null
            ) {
              // Check if period is OUTSIDE event bounds (period starts before event or ends after event)
              if (pStartMin < eventStartMin || pEndMin > eventEndMin) {
                eventBoundError = `Attendance periods must be within the event time range.`;
              }
            }
          }

          // Build updated groups with per-group error set on the modified group
          const updatedPrev = prev.map((g, idx) => {
            if (idx !== groupIdx) return { ...g };
            const updated = {
              ...g,
              periodError: overlapError || eventBoundError || "",
            };
            // If there's an error, reset the field that caused it
            if (overlapError || eventBoundError) {
              if (field === "period_start") updated.period_start = "";
              if (field === "period_end") updated.period_end = "";
            }
            return updated;
          });

          // Also update global errorMsg to the first found message (keeps previous behavior)
          if (overlapError) setErrorMsg(overlapError);
          else if (eventBoundError) setErrorMsg(eventBoundError);
          else setErrorMsg("");

          return updatedPrev;
        }
        return prev;
      });
    }
  };

  // ----- Add a Surprise process to an attendance group (always inserted before the last 'Out') -----
  const addRowToAttendanceGroup = (groupIdx) => {
    setAttendanceGroups((prev) =>
      prev.map((group, idx) => {
        if (idx !== groupIdx) return group;
        const rows = [...group.rows];
        // Ensure basic structure: at least In and Out
        if (rows.length === 0) {
          rows.push({ process: "In", start_time: "", cutoff: "" });
          rows.push({ process: "Out", start_time: "", cutoff: "" });
          return { ...group, rows, periodError: "" };
        }

        // Before inserting Surprise, ensure In cutoff and Out start_time exist
        const inRow = rows.find((r) => r.process === "In");
        const outRow = [...rows].reverse().find((r) => r.process === "Out");
        if (!inRow || !outRow || !inRow.cutoff || !outRow.start_time) {
          // set per-group error instead of adding
          return {
            ...group,
            periodError:
              "Cannot add Surprise process: In cutoff and Out start time must be set first.",
          };
        }

        // insert Surprise before last (which should be Out)
        const insertAt = Math.max(0, rows.length - 1);
        rows.splice(insertAt, 0, {
          process: "Surprise",
          start_time: "",
          cutoff: "",
          rowError: "",
        });
        return { ...group, rows, periodError: "" };
      })
    );
  };

  // ----- Remove a row from an attendance group (only allows removing Surprise rows) -----
  const removeRowFromAttendanceGroup = (groupIdx, rowIdx) => {
    setAttendanceGroups((prev) =>
      prev.map((group, idx) => {
        if (idx !== groupIdx) return group;
        const row = group.rows[rowIdx];
        if (!row) return group;
        if (row.process !== "Surprise") return group; // only allow removing Surprise
        const rows = group.rows.filter((_, i) => i !== rowIdx);
        return { ...group, rows };
      })
    );
  };

  // ----- Add a new attendance period -----
  const addAttendancePeriod = () => {
    setAttendanceGroups((prev) => {
      const newGroup = {
        date: eventDate || today,
        period_start: "",
        period_end: "",
        rows: [
          { process: "In", start_time: "", cutoff: "" },
          { process: "Out", start_time: "", cutoff: "" },
        ],
        name: "",
        custom_name: false,
      };
      return [...prev, newGroup];
    });
    // persist draft after adding (use setTimeout to ensure state is updated)
    setTimeout(() => updateEvent("Draft"), 0);
  };

  // ----- Remove an entire attendance period -----
  const removeAttendancePeriod = (groupIdx) => {
    // Prevent removing the last attendance period
    if (attendanceGroups.length <= 1) {
      setErrorMsg("At least one attendance period must be present.");
      return;
    }
    setAttendanceGroups((prev) => prev.filter((_, i) => i !== groupIdx));
    // persist draft after removing (use setTimeout to ensure state is updated)
    setTimeout(() => updateEvent("Draft"), 0);
  };

  // ----- Update the name of an attendance period (marks it as customized) -----
  const updateAttendanceGroupName = (groupIdx, value) => {
    setAttendanceGroups((prev) => {
      const updated = JSON.parse(JSON.stringify(prev));
      updated[groupIdx].name = value;
      // If name is empty, revert to smart naming; otherwise mark as customized
      updated[groupIdx].custom_name = value.trim() !== "";
      return updated;
    });
    // persist draft after updating (use setTimeout to ensure state is updated)
    setTimeout(() => updateEvent("Draft"), 0);
  };

  // Helper to auto-save with setTimeout to allow state updates
  const autoSaveDraft = () => {
    setTimeout(() => updateEvent("Draft"), 0);
  };

  // ----- Auto-save draft event to backend -----
  const updateEvent = async (status, overrideData = null) => {
    try {
      // Parse user data
      const userObj = userData ? JSON.parse(userData) : null;
      if (!userObj) {
        console.error("User data not found");
        return;
      }

      // Use overridden data if provided (for handlers that need current values immediately)
      const currentEventName = overrideData?.eventName ?? eventName;
      const currentEventDescription =
        overrideData?.eventDescription ?? eventDescription;
      const currentEventDate = overrideData?.eventDate ?? eventDate;
      const currentStartTime = overrideData?.startTime ?? startTime;
      const currentEndTime = overrideData?.endTime ?? endTime;
      const currentAttendanceGroups =
        overrideData?.attendanceGroups ?? attendanceGroups;

      // If status is "Sent for Approval", validate first
      if (status === "Sent for Approval") {
        if (!validateForApproval()) {
          // validateForApproval sets error message
          return;
        }
      }

      // Serialize attendance groups to JSON
      const attendancesData = currentAttendanceGroups.map((group) => ({
        date: group.date,
        period_start: group.period_start,
        period_end: group.period_end,
        name: group.name,
        custom_name: group.custom_name,
        rows: group.rows.map((row) => ({
          process: row.process,
          start_time: row.start_time,
          cutoff: row.cutoff,
        })),
      }));

      // Merge start and end times into time_period format
      const timePeriod =
        currentStartTime && currentEndTime
          ? `${currentStartTime}-${currentEndTime}`
          : null;

      // Prepare request payload
      const payload = {
        user_data: JSON.stringify(userObj),
        id,
        name: currentEventName,
        description: currentEventDescription,
        date: currentEventDate,
        start_time: currentStartTime || null,
        end_time: currentEndTime || null,
        time_period: timePeriod,
        status,
        attendances: attendancesData,
        request_message: status === "Sent for Approval" ? requestMessage : null,
      };

      // Send to backend
      const response = await fetch(`${ip}/update-draft-event`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating event:", errorData);
        const errorMessage =
          errorData.error || "Failed to update event. Please try again.";
        handleShowNotification(errorMessage, "error");
        if (status === "Sent for Approval") {
          setShowRequestModal(false);
          setRequestMessage("");
          setRequestError("");
        }
        return;
      }

      const result = await response.json();
      if (result.status) {
        // Show success notification
        if (status === "Sent for Approval") {
          handleShowNotification(
            "Event submitted for approval successfully!",
            "success"
          );
          setShowRequestModal(false);
          setRequestMessage("");
          setRequestError("");
          // Close both modals and refresh global data
          if (typeof onRefreshGlobalData === "function") {
            onRefreshGlobalData();
          }
          if (typeof onClose === "function") {
            onClose();
          }
        } else if (status === "Draft") {
          handleShowNotification("Event saved successfully!", "success");
          // Notify parent to refresh listing if provided
          if (typeof refreshData === "function") refreshData();
        }
      } else {
        console.error("Error updating event:", result.error);
        const errorMessage =
          result.error || "Failed to update event. Please try again.";
        handleShowNotification(errorMessage, "error");
        if (status === "Sent for Approval") {
          setShowRequestModal(false);
          setRequestMessage("");
          setRequestError("");
        }
      }
    } catch (error) {
      console.error("Error updating event:", error);
      const errorMessage =
        "An error occurred while updating the event. Please try again.";
      handleShowNotification(errorMessage, "error");
      if (status === "Sent for Approval") {
        setShowRequestModal(false);
        setRequestMessage("");
        setRequestError("");
      }
    }
  };

  // Get validation error message if any (returns null if no errors)
  const getValidationErrorMessage = () => {
    // Check if no attendance groups
    if (!attendanceGroups || attendanceGroups.length === 0) {
      return null;
    }

    // Validate each group's period and rows
    for (let g = 0; g < attendanceGroups.length; g++) {
      const group = attendanceGroups[g];
      const { period_start, period_end, rows } = group;

      if (!period_start || !period_end) {
        return "Each attendance period requires a start and end time.";
      }
      if (period_start >= period_end) {
        return "Attendance period start must be before end.";
      }

      // Ensure In and Out are present and at the ends
      if (!rows || rows.length < 2) {
        return "Each attendance period must have at least In and Out processes.";
      }
      if (rows[0].process !== "In" || rows[rows.length - 1].process !== "Out") {
        return "Attendance processes must begin with In and end with Out.";
      }

      // Validate each row fields and that they are within the group's period
      for (let r = 0; r < rows.length; r++) {
        const row = rows[r];
        if (!row.process || !row.start_time || !row.cutoff) {
          return "Please fill in all required fields in attendance groups.";
        }
        // start_time and cutoff must be within period bounds
        if (row.start_time < period_start || row.start_time > period_end) {
          return "Start time must be within the attendance period.";
        }
        if (row.cutoff < period_start || row.cutoff > period_end) {
          return "Cutoff must be within the attendance period.";
        }
        // cutoff must be at least 10 minutes after start
        const sMin = timeToMinutes(row.start_time);
        const cMin = timeToMinutes(row.cutoff);
        if (sMin === null || cMin === null || cMin - sMin < 10) {
          return "Cutoff must be at least 10 minutes after the start time.";
        }
        // Surprise constraints
        if (row.process === "Surprise") {
          const inRow = rows.find((rr) => rr.process === "In");
          const outRow = [...rows].reverse().find((rr) => rr.process === "Out");
          if (!inRow || !outRow || !inRow.cutoff || !outRow.start_time) {
            return "Surprise attendance requires In and Out attendance start and cutoff times to be set.";
          }
          const inCut = timeToMinutes(inRow.cutoff);
          const outStart = timeToMinutes(outRow.start_time);
          if (inCut === null || outStart === null) {
            return "Invalid time format in In/Out rows.";
          }
          if (sMin < inCut || cMin > outStart) {
            return "Surprise attendance must be within In and Out start times.";
          }
        }
      }
    }

    // Ensure attendance periods do not overlap and are within event time (if set)
    const parsedRanges = attendanceGroups.map((g) => ({
      start: new Date(`${g.date}T${g.period_start}:00`),
      end: new Date(`${g.date}T${g.period_end}:00`),
    }));
    // check overlaps
    for (let i = 0; i < parsedRanges.length; i++) {
      for (let j = i + 1; j < parsedRanges.length; j++) {
        if (
          parsedRanges[i].start < parsedRanges[j].end &&
          parsedRanges[j].start < parsedRanges[i].end
        ) {
          const period1Name = computeAttendanceGroupName(
            attendanceGroups[i],
            i
          );
          const period2Name = computeAttendanceGroupName(
            attendanceGroups[j],
            j
          );
          return `Attendance periods cannot overlap: "${period1Name}" overlaps with "${period2Name}".`;
        }
      }
    }

    // check within event-level time if available
    if (startTime && endTime) {
      // Compare times as minutes to avoid date/timezone issues
      const eventStartMin = timeToMinutes(startTime);
      const eventEndMin = timeToMinutes(endTime);

      if (eventStartMin !== null && eventEndMin !== null) {
        for (let g of attendanceGroups) {
          const pStartMin = timeToMinutes(g.period_start);
          const pEndMin = timeToMinutes(g.period_end);

          if (pStartMin !== null && pEndMin !== null) {
            // Check if period is OUTSIDE event bounds
            if (pStartMin < eventStartMin || pEndMin > eventEndMin) {
              return "Attendance periods must be within the event time range.";
            }
          }
        }
      }
    }

    return null;
  };

  // Check for validation errors without setting error message (for ready-to-submit check)
  const hasValidationErrors = () => {
    return getValidationErrorMessage() !== null;
  };

  const validateForApproval = () => {
    // Validate each group's period and rows
    for (let g = 0; g < attendanceGroups.length; g++) {
      const group = attendanceGroups[g];
      const { period_start, period_end, rows } = group;
      if (!period_start || !period_end) {
        setErrorMsg("Each attendance period requires a start and end time.");
        return false;
      }
      if (period_start >= period_end) {
        setErrorMsg("Attendance period start must be before end.");
        return false;
      }

      // Ensure In and Out are present and at the ends
      if (!rows || rows.length < 2) {
        setErrorMsg(
          "Each attendance period must have at least In and Out processes."
        );
        return false;
      }
      if (rows[0].process !== "In" || rows[rows.length - 1].process !== "Out") {
        setErrorMsg(
          "Attendance processes must begin with In and end with Out."
        );
        return false;
      }

      // Validate each row fields and that they are within the group's period
      for (let r = 0; r < rows.length; r++) {
        const row = rows[r];
        if (!row.process || !row.start_time || !row.cutoff) {
          setErrorMsg(
            "Please fill in all required fields in attendance groups."
          );
          return false;
        }
        // start_time and cutoff must be within period bounds
        if (row.start_time < period_start || row.start_time > period_end) {
          setErrorMsg("Start time must be within the attendance period.");
          return false;
        }
        if (row.cutoff < period_start || row.cutoff > period_end) {
          setErrorMsg("Cutoff must be within the attendance period.");
          return false;
        }
        // cutoff must be at least 10 minutes after start
        const sMin = timeToMinutes(row.start_time);
        const cMin = timeToMinutes(row.cutoff);
        if (sMin === null || cMin === null || cMin - sMin < 10) {
          setErrorMsg(
            "Cutoff must be at least 10 minutes after the start time."
          );
          return false;
        }
        // Surprise constraints
        if (row.process === "Surprise") {
          const inRow = rows.find((rr) => rr.process === "In");
          const outRow = [...rows].reverse().find((rr) => rr.process === "Out");
          if (!inRow || !outRow || !inRow.cutoff || !outRow.start_time) {
            setErrorMsg(
              "Surprise attendance requires In and Out attendance start and cutoff times to be set."
            );
            return false;
          }
          const inCut = timeToMinutes(inRow.cutoff);
          const outStart = timeToMinutes(outRow.start_time);
          if (inCut === null || outStart === null) {
            setErrorMsg("Invalid time format in In/Out rows.");
            return false;
          }
          if (sMin < inCut || cMin > outStart) {
            setErrorMsg(
              "Surprise attendance must be within In and Out start times."
            );
            return false;
          }
        }
      }
    }

    // Ensure attendance periods do not overlap and are within event time (if set)
    const parsedRanges = attendanceGroups.map((g) => ({
      start: new Date(`${g.date}T${g.period_start}:00`),
      end: new Date(`${g.date}T${g.period_end}:00`),
    }));
    // check overlaps
    for (let i = 0; i < parsedRanges.length; i++) {
      for (let j = i + 1; j < parsedRanges.length; j++) {
        if (
          parsedRanges[i].start < parsedRanges[j].end &&
          parsedRanges[j].start < parsedRanges[i].end
        ) {
          const period1Name = computeAttendanceGroupName(
            attendanceGroups[i],
            i
          );
          const period2Name = computeAttendanceGroupName(
            attendanceGroups[j],
            j
          );
          setErrorMsg(
            `Attendance periods cannot overlap: "${period1Name}" overlaps with "${period2Name}".`
          );
          return false;
        }
      }
    }

    // check within event-level time if available
    if (startTime && endTime) {
      // Compare times as minutes to avoid date/timezone issues
      const eventStartMin = timeToMinutes(startTime);
      const eventEndMin = timeToMinutes(endTime);

      if (eventStartMin !== null && eventEndMin !== null) {
        for (let g of attendanceGroups) {
          const pStartMin = timeToMinutes(g.period_start);
          const pEndMin = timeToMinutes(g.period_end);

          if (pStartMin !== null && pEndMin !== null) {
            // Check if period is OUTSIDE event bounds
            if (pStartMin < eventStartMin || pEndMin > eventEndMin) {
              setErrorMsg(
                "Attendance periods must be within the event time range."
              );
              return false;
            }
          }
        }
      }
    }

    // All validations passed, clear any previous error messages
    setErrorMsg("");
    return true;
  };

  // If both start and end times are set, determine if the end is before the start
  const timeRangeInvalid = startTime && endTime && endTime < startTime;

  // Check if event time range is at least one hour
  const timeRangeLessThanOneHour = () => {
    if (!startTime || !endTime) return false;
    const startMin = timeToMinutes(startTime);
    const endMin = timeToMinutes(endTime);
    if (startMin === null || endMin === null) return false;
    return endMin - startMin < 60; // less than 60 minutes
  };
  const isTimeRangeLessThanOneHour = timeRangeLessThanOneHour();
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
                          updateEvent("Draft", {
                            eventName,
                            eventDescription,
                            eventDate,
                            startTime,
                            endTime,
                            attendanceGroups,
                          });
                          setDetails((prev) => ({
                            ...prev,
                            name: eventName,
                            description: eventDescription,
                          }));
                          setIsEditingDetails(false);
                        }}
                        className="transition-all duration-150 transform hover:scale-105 hover:bg-blue-800 bg-blue-600 text-white px-4 py-2 rounded text-sm cursor-pointer"
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
                        className="transition-all duration-150 transform hover:scale-105 hover:bg-gray-800 bg-gray-400 text-white px-4 py-2 rounded text-sm cursor-pointer"
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
                            Event Date
                          </label>
                          <Input
                            type="date"
                            value={eventDate}
                            onChange={(e) => {
                              setEventDate(e.target.value);
                              autoSaveDraft();
                            }}
                            min={today}
                            className="w-full border rounded p-2 bg-white"
                          />
                        </div>
                        {eventDate && (
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <label className="block font-semibold mb-1">
                                Start Time
                              </label>
                              <Input
                                type="time"
                                value={startTime}
                                onChange={(e) => {
                                  handleStartTimeChange(e.target.value);
                                }}
                                className="w-full border rounded p-2 bg-white"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block font-semibold mb-1">
                                End Time
                              </label>
                              <Input
                                type="time"
                                value={endTime}
                                onChange={(e) => {
                                  handleEndTimeChange(e.target.value);
                                }}
                                className="w-full border rounded p-2 bg-white"
                              />
                            </div>
                          </div>
                        )}
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
                  <span className="md:hidden xl:block">for Approval</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowDelete(true)}
                  className="transition-all duration-150 transform hover:scale-105 hover:bg-red-800 bg-red-600 text-white px-4 py-2 rounded text-sm cursor-pointer flex flex-row lg:space-x-1"
                >
                  <span>Delete </span>
                  <span className="md:hidden lg:block">Event</span>
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
                {/* Event Details Section */}
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
                      className="text-sm flex flex-col p-1 gap-4"
                    >
                      <div>
                        <label className="block font-semibold">
                          Event Name
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
                          Event Date
                        </label>
                        <Input
                          type="date"
                          value={eventDate}
                          onChange={(e) => {
                            setEventDate(e.target.value);
                            autoSaveDraft();
                          }}
                          min={today}
                          className="w-full border rounded p-2"
                        />
                      </div>
                      {eventDate && (
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="block font-semibold mb-1">
                              Start Time
                            </label>
                            <Input
                              type="time"
                              value={startTime}
                              onChange={(e) => {
                                handleStartTimeChange(e.target.value);
                              }}
                              className="w-full border rounded p-2"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block font-semibold mb-1">
                              End Time
                            </label>
                            <Input
                              type="time"
                              value={endTime}
                              onChange={(e) => {
                                handleEndTimeChange(e.target.value);
                              }}
                              className="w-full border rounded p-2"
                            />
                          </div>
                        </div>
                      )}
                      {details && (
                        <>
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
                        </>
                      )}
                      <div className="mt-2">
                        <label className="flex font-semibold">
                          Approval History
                        </label>
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
                    Manage Attendances
                  </h2>
                  {/* If event date/time not fully set, hide attendance management and show message */}
                  {!eventDate ||
                  !startTime ||
                  !endTime ||
                  timeRangeInvalid ||
                  isTimeRangeLessThanOneHour ? (
                    <div className="p-4 rounded bg-red-50 border border-red-200 text-sm text-gray-700">
                      {isTimeRangeLessThanOneHour ? (
                        <>
                          <span className="font-semibold text-red-600">
                            Event time period must be at least 1 hour to manage
                            attendance periods.
                          </span>
                        </>
                      ) : timeRangeInvalid ? (
                        <>
                          <span className="font-semibold text-red-600">
                            Error:
                          </span>{" "}
                          End time must not be before start time.
                        </>
                      ) : (
                        <>
                          Please set the{" "}
                          <span className="font-semibold">Event Date</span>,{" "}
                          <span className="font-semibold">Start Time</span> and{" "}
                          <span className="font-semibold">End Time</span> to
                          manage Attendance Periods.
                        </>
                      )}
                    </div>
                  ) : (
                    <>
                      {attendanceGroups.map((group, gIdx) => (
                        <div
                          key={gIdx}
                          className="mb-6 p-4 border rounded-lg bg-gray-50"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <div>
                              <label className="block text-sm font-semibold">
                                Attendance Period
                              </label>
                              <div className="mt-1">
                                <Input
                                  type="text"
                                  value={group.custom_name ? group.name : ""}
                                  onChange={(e) =>
                                    updateAttendanceGroupName(
                                      gIdx,
                                      e.target.value
                                    )
                                  }
                                  placeholder={computeAttendanceGroupName(
                                    group,
                                    gIdx
                                  )}
                                  className="w-full md:w-64 border rounded p-2 text-sm"
                                />
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {attendanceGroups.length > 1 && (
                                <Button
                                  type="button"
                                  onClick={() => {
                                    removeAttendancePeriod(gIdx);
                                  }}
                                  className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                                >
                                  Remove Period
                                </Button>
                              )}
                            </div>
                          </div>
                          {/* Attendance period bounds */}
                          <div className="mb-3 flex gap-4 items-end">
                            <div>
                              <label className="block text-sm font-semibold">
                                Period Start
                              </label>
                              <Input
                                type="time"
                                value={group.period_start || ""}
                                onChange={(e) => {
                                  updateAttendanceGroupRow(
                                    gIdx,
                                    0,
                                    "period_start",
                                    e.target.value
                                  );
                                  autoSaveDraft();
                                }}
                                className="w-40"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold">
                                Period End
                              </label>
                              <Input
                                type="time"
                                value={group.period_end || ""}
                                onChange={(e) => {
                                  updateAttendanceGroupRow(
                                    gIdx,
                                    0,
                                    "period_end",
                                    e.target.value
                                  );
                                  autoSaveDraft();
                                }}
                                className="w-40"
                              />
                            </div>
                          </div>
                          {group.periodError && (
                            <div className="p-4 rounded bg-red-50 border border-red-200 text-sm text-gray-700 mt-2">
                              <span className="font-semibold text-red-600">
                                {group.periodError}
                              </span>
                            </div>
                          )}

                          <div className="border rounded-lg overflow-clip">
                            <div className="overflow-x-auto">
                              <table className="min-w-full border-collapse">
                                <thead className="bg-yellow-400 text-sm text-white">
                                  <tr>
                                    <th className="p-2 text-left">
                                      Attendance Type
                                    </th>
                                    <th className="p-2 text-left">
                                      Start Time
                                    </th>
                                    <th className="p-2 text-left">Cutoff</th>
                                    <th className="p-2 text-left">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {group.rows.map((row, rIdx) => [
                                    <tr
                                      key={`row-${gIdx}-${rIdx}`}
                                      className="text-sm bg-white border-b"
                                    >
                                      <td className="p-2 whitespace-nowrap">
                                        <Input
                                          type="text"
                                          value={row.process}
                                          onChange={(e) => {
                                            updateAttendanceGroupRow(
                                              gIdx,
                                              rIdx,
                                              "process",
                                              e.target.value
                                            );
                                            autoSaveDraft();
                                          }}
                                          className="w-32 border rounded p-1 text-sm"
                                          disabled={
                                            rIdx === 0 ||
                                            rIdx === group.rows.length - 1
                                          }
                                        />
                                      </td>
                                      <td className="p-2 whitespace-nowrap">
                                        <Input
                                          type="time"
                                          value={row.start_time}
                                          onChange={(e) => {
                                            updateAttendanceGroupRow(
                                              gIdx,
                                              rIdx,
                                              "start_time",
                                              e.target.value
                                            );
                                            autoSaveDraft();
                                          }}
                                          className="w-full"
                                        />
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
                                            autoSaveDraft();
                                          }}
                                          className="w-full"
                                        />
                                      </td>
                                      <td className="p-2 text-center whitespace-nowrap">
                                        {row.process === "Surprise" && (
                                          <Button
                                            type="button"
                                            onClick={() => {
                                              removeRowFromAttendanceGroup(
                                                gIdx,
                                                rIdx
                                              );
                                              autoSaveDraft();
                                            }}
                                            className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                          >
                                            Remove
                                          </Button>
                                        )}
                                      </td>
                                    </tr>,
                                    row.rowError ? (
                                      <tr
                                        key={`err-${gIdx}-${rIdx}`}
                                        className="bg-white"
                                      >
                                        <td colSpan="4" className="p-2">
                                          <div className="p-4 rounded bg-red-50 border border-red-200 text-sm text-gray-700">
                                            <span className="font-semibold text-red-600">
                                              {row.rowError}
                                            </span>
                                          </div>
                                        </td>
                                      </tr>
                                    ) : null,
                                  ])}
                                </tbody>
                                <tfoot>
                                  <tr>
                                    <td
                                      colSpan="4"
                                      className="p-2 whitespace-nowrap"
                                    >
                                      <Button
                                        type="button"
                                        onClick={() => {
                                          addRowToAttendanceGroup(gIdx);
                                          autoSaveDraft();
                                        }}
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                                      >
                                        Add Surprise Attendance
                                      </Button>
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="mt-3">
                        <Button
                          type="button"
                          onClick={() => {
                            addAttendancePeriod();
                          }}
                          className="transition-all duration-150 transform hover:scale-105 bg-green-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Add Attendance Period
                        </Button>
                      </div>
                    </>
                  )}
                </div>
                {errorMsg && (
                  <div
                    ref={errorRef}
                    className="mt-8 p-4 rounded bg-red-50 border border-red-200 text-sm text-gray-700"
                  >
                    <span className="font-semibold text-red-600">
                      {errorMsg}
                    </span>
                  </div>
                )}
                {readyToSubmit && !errorMsg && (
                  <div className="mt-8 p-4 rounded bg-green-50 border border-green-200 text-sm text-gray-700">
                    <span className="font-semibold text-green-600">
                      ✓ Event is ready to submit for approval
                    </span>
                  </div>
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
                Delete Event
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
