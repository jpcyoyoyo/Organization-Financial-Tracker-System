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

export default function EditDraftBudgetModal({
  isOpen,
  onClose,
  onGoBack,
  rowData,
  id,
  deleteModal: DeleteModal,
  refreshData,
}) {
  const { handleShowNotification } = useOutletContext();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [budgetGroups, setBudgetGroups] = useState([
    {
      groupName: "",
      rows: [{ itemName: "", quantity: "", estimatedCost: "" }],
    },
  ]);
  const [payments, setPayments] = useState([
    { paymentName: "", amount: "", description: "", dueDate: "" },
  ]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const keyLockRef = useRef(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [editedBudgetName, setEditedBudgetName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [includePayments, setIncludePayments] = useState(false);
  const [showOtherOfficers, setShowOtherOfficers] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
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
  const title = "EDIT DRAFT BUDGET";

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
        const response = await fetch(`${ip}/fetch-draft-budget-details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) throw new Error("Failed to fetch details");
        const result = await response.json();
        console.log("Fetched budget details:", result);
        if (result.status) {
          const data = result.data;
          setDetails(data);
          setEditedBudgetName(data.name || "");
          setEditedDescription(data.description || "");
          setBudgetGroups(JSON.parse(data.breakdown));
          setPayments(JSON.parse(data.payments));
          if (data.include_payment.data[0] === 1) {
            setIncludePayments(true);
          } else {
            setIncludePayments(false);
          }

          if (data.show_other_officers.data[0] === 1) {
            setShowOtherOfficers(true);
          } else {
            setShowOtherOfficers(false);
          }
        }
      } catch (error) {
        console.error("Error fetching budget details:", error);
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
          body: JSON.stringify({ type: "Budget", relating_id: id }),
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

  const updateBudgetGroupName = (groupIndex, value) => {
    setBudgetGroups((prev) => {
      const updated = [...prev];
      updated[groupIndex].groupName = value;
      return updated;
    });
  };

  const updateBudgetGroupRow = (groupIndex, rowIndex, field, value) => {
    setBudgetGroups((prev) => {
      const updated = [...prev];
      updated[groupIndex].rows[rowIndex][field] = value;
      return updated;
    });
  };

  const addRowToBudgetGroup = (groupIndex) => {
    setBudgetGroups((prev) =>
      prev.map((group, idx) =>
        idx === groupIndex
          ? {
              ...group,
              rows: [
                ...group.rows,
                { itemName: "", quantity: "", estimatedCost: "" },
              ],
            }
          : group
      )
    );
  };

  const removeRowFromBudgetGroup = (groupIndex, rowIndex) => {
    setBudgetGroups((prev) =>
      prev.map((group, idx) => {
        if (idx !== groupIndex) return group;
        if (group.rows.length > 1) {
          return {
            ...group,
            rows: group.rows.filter((_, i) => i !== rowIndex),
          };
        }
        return group;
      })
    );
  };

  const addBudgetGroup = () => {
    setBudgetGroups((prev) => [
      ...prev,
      {
        groupName: "",
        rows: [{ itemName: "", quantity: "", estimatedCost: "" }],
      },
    ]);
  };

  const removeBudgetGroup = (groupIndex) => {
    setBudgetGroups((prev) => {
      if (prev.length > 1) return prev.filter((_, idx) => idx !== groupIndex);
      return prev;
    });
  };

  const calculateBudgetGroupTotal = (group) =>
    group.rows
      .reduce((acc, row) => acc + (parseFloat(row.estimatedCost) || 0), 0)
      .toFixed(2);

  const calculateOverallBudgetTotal = () =>
    budgetGroups
      .reduce(
        (acc, group) => acc + parseFloat(calculateBudgetGroupTotal(group)),
        0
      )
      .toFixed(2);

  const updatePaymentRow = (index, field, value) => {
    setPayments((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addPaymentRow = () => {
    setPayments((prev) => [
      ...prev,
      { name: "", amount: "", description: "", dueDate: "" },
    ]);
  };

  const removePaymentRow = (index) => {
    setPayments((prev) => prev.filter((_, idx) => idx !== index));
  };

  const getMinDueDateString = () => {
    const minDueDate = new Date();
    minDueDate.setDate(minDueDate.getDate() + 1); // only days ahead of today
    return minDueDate.toISOString().slice(0, 16);
  };

  // Payment total helper
  const calculateTotalPayments = () =>
    payments
      .reduce((acc, payment) => acc + (parseFloat(payment.amount) || 0), 0)
      .toFixed(2);

  const validateForApproval = () => {
    // Validate each budget group.
    const budgetGroupInvalid = budgetGroups.some((group) => {
      if (!group.groupName.trim()) return true;
      return group.rows.some(
        (row) =>
          !row.itemName.trim() ||
          !String(row.quantity).trim() ||
          !String(row.estimatedCost).trim()
      );
    });
    if (budgetGroupInvalid) {
      const msg = "Please fill in all required fields in budget groups.";
      setErrorMsg(msg);
      return false;
    }

    // Validate payments only if payments are included.
    if (includePayments) {
      const paymentInvalid = payments.some((payment) => {
        // Check for empty required fields.
        if (
          !payment.paymentName.trim() ||
          !String(payment.amount).trim() ||
          !payment.description.trim() ||
          !payment.dueDate.trim()
        ) {
          return true;
        }
        // Ensure dueDate is in the future.
        const selectedDueDate = new Date(payment.dueDate);
        const now = new Date();
        if (selectedDueDate <= now) {
          return true;
        }
        return false;
      });
      if (paymentInvalid) {
        const msg =
          "Please fill in all required payment fields and ensure the due date is in the future.";
        setErrorMsg(msg);
        return false;
      }
    }
    return true;
  };

  const updateBudget = async (statusParam = "Draft") => {
    // Clear previous error message.
    setErrorMsg("");
    // Only perform validation when submitting for approval.
    if (statusParam === "Sent for Approval") {
      // Validate each budget group.
      const budgetGroupInvalid = budgetGroups.some((group) => {
        if (!group.groupName.trim()) return true;
        return group.rows.some(
          (row) =>
            !row.itemName.trim() ||
            !String(row.quantity).trim() ||
            !String(row.estimatedCost).trim()
        );
      });
      if (budgetGroupInvalid) {
        const msg = "Please fill in all required fields in budget groups.";
        setErrorMsg(msg);
        return;
      }
      // Validate payments only if payments are included.
      if (includePayments) {
        const paymentInvalid = payments.some((payment) => {
          // Check for empty required fields.
          if (
            !payment.name.trim() ||
            !String(payment.amount).trim() ||
            !payment.description.trim() ||
            !payment.dueDate.trim()
          ) {
            return true;
          }
          // Ensure dueDate is in the future.
          const selectedDueDate = new Date(payment.dueDate);
          const now = new Date();
          if (selectedDueDate <= now) {
            return true;
          }
          return false;
        });
        if (paymentInvalid) {
          const msg =
            "Please fill in all required payment fields and ensure the due date is in the future.";
          setErrorMsg(msg);
          return false;
        }
      }
    }
    try {
      const response = await fetch(`${ip}/update-draft-budget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_data: userData,
          id,
          name: editedBudgetName,
          description: editedDescription,
          amount: calculateOverallBudgetTotal(),
          breakdown: budgetGroups,
          payments: includePayments
            ? payments
            : [{ paymentName: "", amount: "", description: "", dueDate: "" }],
          include_payment: includePayments,
          show_other_officers: showOtherOfficers,
          status: statusParam,
          request_message:
            statusParam === "Sent for Approval" ? requestMessage : "",
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update budget");
      }
      const result = await response.json();
      console.log("Updated budget:", result);
      if (result.status) {
        if (statusParam === "Draft") {
          // Only update details if name or description has changed
          if (
            result.data.name !== details?.name ||
            result.data.description !== details?.description ||
            result.data.updated_at !== details?.updated_at
          ) {
            setDetails(result.data);
          }
          setPayments(JSON.parse(result.data.payments));
          setIsEditingDetails(false);
          handleShowNotification("Budget updated successfully", "success");
          if (refreshData) refreshData();
        } else if (statusParam === "Sent for Approval") {
          // Do not update details; just notify and close the modal.
          handleShowNotification("Budget is sent for approval", "success");
          if (refreshData) refreshData();
          onClose();
        }
      } else {
        const msg = "Failed to update budget";
        setErrorMsg(msg);
        handleShowNotification(msg, "error");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      const msg = "Error updating budget";
      setErrorMsg(msg);
      handleShowNotification(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && details) {
      if (
        details.include_payment.data[0] !== (includePayments ? 1 : 0) ||
        details.show_other_officers.data[0] !== (showOtherOfficers ? 1 : 0)
      ) {
        updateBudget("Draft");
        console.log("Updating checkbox....");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details, includePayments, isOpen, showOtherOfficers]);

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
          ) : (
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
                      <label className="block font-semibold">Budget Name</label>
                      <Input
                        value={editedBudgetName}
                        onChange={(e) => setEditedBudgetName(e.target.value)}
                        placeholder="Enter Budget Name"
                        className="w-full border rounded-md p-1.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="flex font-semibold">Description</label>
                      <textarea
                        type="text"
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        placeholder="Enter Description"
                        className="rounded-md border border-black h-40 p-1.5 w-full resize-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        onClick={() => {
                          // Update details and exit edit mode
                          updateBudget("Draft");
                          setDetails((prev) => ({
                            ...prev,
                            name: editedBudgetName,
                            description: editedDescription,
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
                          setEditedBudgetName(details?.name || "");
                          setEditedDescription(details?.description || "");
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
                          Budget Name
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
                          <label className="flex font-semibold">
                            Tentative Budget Amount
                          </label>
                          <div className="text-2xl">
                            ₱ {calculateOverallBudgetTotal()}
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
                        {/* Action buttons to edit details or delete budget */}
                        <div>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={includePayments}
                              onChange={(e) =>
                                setIncludePayments(e.target.checked)
                              }
                              className="form-checkbox"
                            />
                            <span className="text-sm font-semibold">
                              Include Payments
                            </span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={showOtherOfficers}
                              onChange={(e) =>
                                setShowOtherOfficers(e.target.checked)
                              }
                              className="form-checkbox"
                            />
                            <span className="text-sm font-semibold">
                              Show Budget to Other Officers
                            </span>
                          </label>
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
                          value={editedBudgetName}
                          onChange={(e) => setEditedBudgetName(e.target.value)}
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
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          placeholder="Enter Description"
                          className="rounded-md border border-black h-40 p-1.5 w-full resize-none"
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
                        <div>{details.updated_at || "cdsfvjihubi"}</div>
                      </div>
                      {/* Action buttons to edit details or delete budget */}
                      <div>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={includePayments}
                            onChange={(e) =>
                              setIncludePayments(e.target.checked)
                            }
                            className="form-checkbox"
                          />
                          <span className="text-sm font-semibold">
                            Include Payments
                          </span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={showOtherOfficers}
                            onChange={(e) =>
                              setShowOtherOfficers(e.target.checked)
                            }
                            className="form-checkbox"
                          />
                          <span className="text-sm font-semibold">
                            Show Budget to Other Officers
                          </span>
                        </label>
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
                    Budget Groups
                  </h2>
                  {budgetGroups.map((group, gIdx) => (
                    <div
                      key={gIdx}
                      className="mb-6 p-4 border rounded-lg bg-gray-50"
                    >
                      <div className="mb-3">
                        <label className="block text-sm font-semibold">
                          Budget Group {gIdx + 1}
                        </label>
                        <div className="flex flex-row space-x-2">
                          <Input
                            type="text"
                            value={group.groupName}
                            onChange={(e) =>
                              updateBudgetGroupName(gIdx, e.target.value)
                            }
                            onBlur={() => updateBudget("Draft")}
                            placeholder="Enter Budget Group Name"
                            className={`transition-all duration-150 rounded-md border border-black bg-white ${
                              budgetGroups.length > 1
                                ? "w-6/7 sm:w-5/7"
                                : "w-full"
                            } p-1.5 text-sm`}
                          />
                          {budgetGroups.length > 1 && (
                            <Button
                              type="button"
                              onClick={() => {
                                removeBudgetGroup(gIdx);
                                updateBudget("Draft");
                              }}
                              className="w-1/7 sm:w-2/7 bg-red-500 text-white p-1.5 rounded text-sm transition-all duration-150 transform hover:scale-105 cursor-pointer items-center justify-items-center"
                            >
                              {isMobile ? (
                                <img
                                  src={icons["src/assets/delete.svg"]}
                                  alt="Remove row"
                                  className="w-4 h-4 object-cover rounded cursor-pointer"
                                />
                              ) : (
                                <p>Remove Group</p>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>
                      {/* Items Table for the Group */}
                      <div className="border rounded-lg overflow-clip">
                        <div className="overflow-x-auto">
                          <table className="min-w-[450px] border-collapse">
                            <thead>
                              <tr className="bg-sky-400 text-sm text-white">
                                <th className="p-2 text-left w-3/7 rounded-tl-lg">
                                  Item Name
                                </th>
                                <th className="p-1 px-2 text-left w-1/7">
                                  Quantity
                                </th>
                                <th className="p-1 px-2 text-left w-2/7">
                                  Estimated Cost
                                </th>
                                <th className="p-1 px-2 text-left w-1/7 rounded-tr-lg">
                                  Action
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="text-sm bg-white">
                                  <td className="p-1 border-r border-b text-xs sm:text-sm bg-white">
                                    <Input
                                      id={`item-${gIdx}-${rIdx}`}
                                      type="text"
                                      value={row.itemName}
                                      onChange={(e) =>
                                        updateBudgetGroupRow(
                                          gIdx,
                                          rIdx,
                                          "itemName",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Item Name"
                                      className="w-full"
                                      onBlur={() => updateBudget("Draft")}
                                      onKeyDown={(e) =>
                                        handleKeyDown(e, () => {
                                          // Focus on Quantity: you might need to use refs for better control.
                                          document
                                            .getElementById(
                                              `qty-${gIdx}-${rIdx}`
                                            )
                                            ?.focus();
                                        })
                                      }
                                    />
                                  </td>
                                  <td className="p-1 border-r border-b text-xs sm:text-sm bg-white">
                                    <Input
                                      id={`qty-${gIdx}-${rIdx}`}
                                      type="number"
                                      value={row.quantity}
                                      onChange={(e) =>
                                        updateBudgetGroupRow(
                                          gIdx,
                                          rIdx,
                                          "quantity",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Quantity"
                                      className="w-full"
                                      onBlur={() => updateBudget("Draft")}
                                      onKeyDown={(e) =>
                                        handleKeyDown(e, () => {
                                          // Focus on Quantity: you might need to use refs for better control.
                                          document
                                            .getElementById(
                                              `cost-${gIdx}-${rIdx}`
                                            )
                                            ?.focus();
                                        })
                                      }
                                    />
                                  </td>
                                  <td className="p-1 border-r border-b text-xs sm:text-sm bg-white">
                                    <Input
                                      id={`cost-${gIdx}-${rIdx}`}
                                      type="number"
                                      value={row.estimatedCost}
                                      onChange={(e) =>
                                        updateBudgetGroupRow(
                                          gIdx,
                                          rIdx,
                                          "estimatedCost",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Estimated Cost"
                                      step="0.01"
                                      className="w-full"
                                      onBlur={() => updateBudget("Draft")}
                                      onKeyDown={(e) =>
                                        handleKeyDown(e, () => {
                                          // Focus on Quantity: you might need to use refs for better control.
                                          document
                                            .getElementById(
                                              `item-${gIdx}-${rIdx}`
                                            )
                                            ?.focus();
                                        })
                                      }
                                    />
                                  </td>
                                  <td className="p-1 text-center border-b">
                                    {group.rows.length > 1 && (
                                      <Button
                                        type="button"
                                        onClick={() => {
                                          removeRowFromBudgetGroup(gIdx, rIdx);
                                          updateBudget("Draft");
                                        }}
                                        className="transition-all duration-150 transform hover:scale-105 cursor-pointer bg-red-500 text-white px-2 py-1 rounded text-xs"
                                      >
                                        {isMobile ? (
                                          <img
                                            src={icons["src/assets/delete.svg"]}
                                            alt="Remove row"
                                            className="transition-all duration-150 transform hover:scale-105 w-4 h-4 object-cover rounded cursor-pointer"
                                          />
                                        ) : (
                                          <p>Remove</p>
                                        )}
                                      </Button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="font-semibold text-sm border-t">
                                <td className="p-2" colSpan={2}>
                                  Group Total
                                </td>
                                <td className="p-2" colSpan={2}>
                                  ₱ {calculateBudgetGroupTotal(group)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Button
                          type="button"
                          onClick={() => {
                            addRowToBudgetGroup(gIdx);
                            updateBudget("Draft");
                          }}
                          className="transition-all duration-150 transform hover:scale-105 bg-blue-600 text-white px-3 py-1 rounded text-sm cursor-pointer"
                        >
                          Add Row
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    onClick={() => {
                      addBudgetGroup();
                      updateBudget("Draft");
                    }}
                    className="transition-all duration-150 transform hover:scale-105 text-white px-3 py-2 rounded text-sm cursor-pointer bg-green-600"
                  >
                    Add Budget Group
                  </Button>
                </div>
                {/* Payments Section */}
                {includePayments && (
                  <div className="mt-5 border-b border-gray-500 pb-6">
                    <h2 className="text-2xl font-semibold mb-3 text-gray-800">
                      Payments
                    </h2>
                    <div className="overflow-clip border rounded-lg bg-white">
                      <div className="overflow-x-auto">
                        <table className="min-w-[450px] border-collapse">
                          <thead>
                            <tr className="bg-sky-400 text-sm text-white">
                              <th className="p-2 text-left w-3/9 rounded-tl-lg">
                                Payment Name
                              </th>
                              <th className="p-2 w-1/9 text-left">Amount</th>
                              <th className="p-2 w-2/9 text-left">
                                Description
                              </th>
                              <th className="p-2 w-2/9 text-left">Due Date</th>
                              <th className="text-left p-2 w-1/9 rounded-tr-lg">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {payments.map((payment, idx) => (
                              <tr key={idx} className="bg-white text-sm">
                                <td className="p-1 border-r border-b text-xs sm:text-sm bg-white">
                                  <Input
                                    type="text"
                                    value={payment.paymentName}
                                    placeholder="Payment Name"
                                    onChange={(e) =>
                                      updatePaymentRow(
                                        idx,
                                        "paymentName",
                                        e.target.value
                                      )
                                    }
                                    className="w-full"
                                  />
                                </td>
                                <td className="p-1 border-r border-b text-xs sm:text-sm bg-white">
                                  <Input
                                    type="number"
                                    value={payment.amount}
                                    placeholder="Amount"
                                    step="0.01"
                                    onChange={(e) =>
                                      updatePaymentRow(
                                        idx,
                                        "amount",
                                        e.target.value
                                      )
                                    }
                                    onBlur={() => updateBudget("Draft")}
                                    className="w-full"
                                  />
                                </td>
                                <td className="p-1 border-r border-b text-xs sm:text-sm bg-white">
                                  <Input
                                    type="text"
                                    value={payment.description}
                                    placeholder="Description"
                                    onChange={(e) =>
                                      updatePaymentRow(
                                        idx,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                    onBlur={() => updateBudget("Draft")}
                                    className="w-full"
                                  />
                                </td>
                                <td className="p-1 border-r border-b text-xs sm:text-sm bg-white">
                                  <Input
                                    type="datetime-local"
                                    value={payment.dueDate}
                                    min={getMinDueDateString()}
                                    onChange={(e) =>
                                      updatePaymentRow(
                                        idx,
                                        "dueDate",
                                        e.target.value
                                      )
                                    }
                                    onBlur={() => updateBudget("Draft")}
                                    className="w-full"
                                  />
                                </td>
                                <td className="p-1 border-b text-center">
                                  {payments.length > 1 && (
                                    <Button
                                      type="button"
                                      onClick={() => removePaymentRow(idx)}
                                      className="transition-all duration-150 transform hover:scale-105 cursor-pointer bg-red-500 text-white px-2 py-1 rounded text-xs"
                                    >
                                      {isMobile ? (
                                        <img
                                          src={icons["src/assets/delete.svg"]}
                                          alt="Remove row"
                                          className="transition-all duration-150 transform hover:scale-105 w-4 h-4 object-cover rounded cursor-pointer"
                                        />
                                      ) : (
                                        <p>Remove</p>
                                      )}
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="font-semibold text-sm border-t">
                              <td className="p-2" colSpan={1}>
                                Total Payment
                              </td>
                              <td className="p-2">
                                ₱ {calculateTotalPayments()}
                              </td>
                              <td className="p-2" colSpan={3}></td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button
                        type="button"
                        onClick={addPaymentRow}
                        className="transition-all duration-150 transform hover:scale-105 text-white px-3 py-2 rounded text-sm cursor-pointer bg-green-600"
                      >
                        Add Payment
                      </Button>
                    </div>
                  </div>
                )}
                {/* Overall Summary Section */}
                <div className="mt-6">
                  <h2 className="text-2xl font-semibold mb-3 text-gray-800">
                    Overall Budget Summary
                  </h2>
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-sky-400 text-sm text-white">
                          <th className="p-2 w-8/20 text-left">Budget Group</th>
                          <th className="p-2 w-12/20 text-left">
                            Total Estimated Cost
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {budgetGroups.map((group, idx) => (
                          <tr key={idx} className="bg-white text-sm">
                            <td className="p-1 px-2 border-r border-b text-xs sm:text-sm bg-white">
                              {group.groupName || `Group ${idx + 1}`}
                            </td>
                            <td className="p-1 px-2 border-b text-xs sm:text-sm bg-white">
                              ₱ {calculateBudgetGroupTotal(group)}
                            </td>
                          </tr>
                        ))}
                        <tr className="font-semibold border-t text-sm bg-white">
                          <td className="p-2">Overall Total</td>
                          <td className="p-2">
                            ₱ {calculateOverallBudgetTotal()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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
                updateBudget("Sent for Approval");
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
        />
      )}
    </>
  );
}

EditDraftBudgetModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onGoBack: PropTypes.func,
  rowData: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  updateModal: PropTypes.elementType,
  deleteModal: PropTypes.elementType,
  refreshData: PropTypes.func,
};
