import { useState, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { Button } from "../../components/ui/button";
import { useOutletContext } from "react-router-dom";
import { IpContext } from "../../context/IpContext";
import { motion } from "framer-motion";
import backIcon from "../../assets/prev.svg";
import Modal from "../../components/ui/modal";

export default function DecideBudgetApproval({
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
  const [budgetGroups, setBudgetGroups] = useState([
    {
      groupName: "",
      rows: [{ itemName: "", quantity: "", estimatedCost: "" }],
    },
  ]);
  const [payments, setPayments] = useState([
    { paymentName: "", amount: "", contributor: "", exemption: "" },
  ]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [includePayments, setIncludePayments] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const errorRef = useRef(null);
  const [showDecisionMessageModal, setShowDecisionMessageModal] =
    useState(false);
  const [DecisionMessageMessage, setDecisionMessageMessage] = useState("");
  const [DecisionMessageError, setDecisionMessageError] = useState("");
  const [decision, setDecision] = useState("");
  const userData = sessionStorage.getItem("user");

  const ip = useContext(IpContext);
  const title = "APPROVE BUDGET";

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
        if (result.status && result.data) {
          const data = result.data;
          setDetails(data);
          setBudgetGroups(JSON.parse(data.breakdown));
          setPayments(JSON.parse(data.payments));
          if (data.include_payment.data[0] === 1) {
            setIncludePayments(true);
          } else {
            setIncludePayments(false);
          }
        }
      } catch (error) {
        console.error("Error fetching budget details:", error);
      } finally {
        setLoading(false);
      }
    }
    if (isOpen) {
      fetchDetails();
    }
  }, [isOpen, id, ip]);

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

  // Payment total helper
  const calculateTotalPayments = () =>
    payments
      .reduce((acc, payment) => acc + (parseFloat(payment.amount) || 0), 0)
      .toFixed(2);

  // Called when user presses Approved or Disapproved button.
  const handleDecisionButton = (decisionValue) => {
    setDecision(decisionValue);
    setShowDecisionMessageModal(true);
  };

  const budgetApprovalDecision = async () => {
    if (!DecisionMessageMessage.trim()) {
      setDecisionMessageError("Decision message is required.");
      return;
    }

    try {
      const response = await fetch(`${ip}/budget-approval-decision`, {
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
          "Budget decision submitted successfully",
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
                  className="border rounded-xl bg-[#03fffb22]"
                >
                  <div className="text-sm flex flex-col gap-2">
                    <div className="py-3 px-4 border-b rounded-t-xl bg-sky-400">
                      <label className="block font-semibold">Budget Name</label>
                      <div className="text-2xl">{details.name}</div>
                    </div>
                    <div className="pb-3 px-4 border-b">
                      <label className="flex font-semibold">Description</label>
                      <div className="h-20 overflow-y-auto text-balance">
                        {details.description}
                      </div>
                    </div>

                    {/* Additional details remain unchanged */}
                    <div className="flex flex-col gap-6 px-4 pb-4 pt-1">
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
                    </div>
                  </div>
                </motion.div>
              </div>
              <div className="flex justify-end items-center space-x-2 h-1/10">
                {/* Approved and Disapproved Buttons */}
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
                      Budget Details
                    </h2>
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
                        </div>

                        {/* Additional details remain unchanged */}
                        <div className="flex flex-col gap-6 px-4 pb-4 pt-1">
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
                              Date Approved
                            </label>
                            <div>{details.updated_at}</div>
                          </div>
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
                          Expense Group {gIdx + 1}
                        </label>
                        <div className="flex flex-row space-x-2">
                          <div className="transition-all duration-150 border-black bg-white w-full text-xl">
                            {group.groupName || `Group ${gIdx + 1}`}
                          </div>
                        </div>
                      </div>
                      {/* Items Table for the Group */}
                      <div className="border rounded-lg overflow-clip">
                        <div className="overflow-x-auto">
                          <table className="min-w-[450px] w-full border-collapse">
                            <thead>
                              <tr className="bg-sky-400 text-sm text-white">
                                <th className="p-2 text-left w-3/7 rounded-tl-lg">
                                  Item Name
                                </th>
                                <th className="p-1 px-2 text-left w-2/7">
                                  Quantity
                                </th>
                                <th className="p-1 px-2 text-left w-2/7">
                                  Estimated Cost
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="text-sm bg-white">
                                  <td className="p-1 px-2 border-r border-b text-xs sm:text-sm bg-white">
                                    {row.itemName}
                                  </td>
                                  <td className="p-1 px-2 border-r border-b text-xs sm:text-sm bg-white">
                                    {row.quantity}
                                  </td>
                                  <td className="p-1 px-2 border-r border-b text-xs sm:text-sm bg-white">
                                    ₱ {row.estimatedCost}
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
                    </div>
                  ))}
                </div>
                {/* Payments Section */}
                {includePayments && (
                  <div className="mt-5 border-b border-gray-500 pb-6">
                    <h2 className="text-2xl font-semibold mb-3 text-gray-800">
                      Payments
                    </h2>
                    <div className="overflow-x-auto border rounded-lg bg-white">
                      <table className="min-w-[450px] w-full border-collapse">
                        <thead>
                          <tr className="bg-sky-400 text-sm text-white">
                            <th className="p-2 text-left rounded-tl-lg">
                              Payment Name
                            </th>
                            <th className="p-2 text-left">Amount</th>
                            <th className="p-2 text-left">Description</th>
                            <th className="p-2 text-left rounded-tr-lg">
                              Due Date
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.length > 0 ? (
                            payments.map((payment, idx) => (
                              <tr key={idx} className="bg-white text-sm">
                                <td className="p-1 px-2 border-r border-b text-xs sm:text-sm bg-white">
                                  {payment.paymentName}
                                </td>
                                <td className="p-1 px-2 border-r border-b text-xs sm:text-sm bg-white">
                                  ₱ {payment.amount}
                                </td>
                                <td className="p-1 px-2 border-r border-b text-xs sm:text-sm bg-white">
                                  {payment.description}
                                </td>
                                <td className="p-1 px-2 border-r border-b text-xs sm:text-sm bg-white">
                                  {new Date(payment.dueDate).toLocaleString()}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="4" className="p-2 text-center">
                                No payments available.
                              </td>
                            </tr>
                          )}
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
                className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-green-800 bg-green-600 text-white px-4 py-2 rounded text-sm"
              >
                Approved
              </Button>
              <Button
                type="button"
                onClick={() => handleDecisionButton("Disapproved")}
                className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-red-800 bg-red-600 text-white px-4 py-2 rounded text-sm"
              >
                Disapproved
              </Button>
            </div>
          )}
        </motion.div>
      </div>

      {showDecisionMessageModal && (
        <Modal
          title="SUBMIT DECISION MESSAGE"
          isOpen={showDecisionMessageModal}
          onClose={() => {
            setShowDecisionMessageModal(false);
            setDecisionMessageMessage("");
            setDecisionMessageError("");
          }}
          modalCenter={true}
          w={"w-11/12 h-11/12 md:h-4/7 md:w-4/7 lg:w-3/7 xl:w-3/7"}
        >
          <div className="p-4 h-7/9">
            <textarea
              value={DecisionMessageMessage}
              onChange={(e) => {
                setDecisionMessageMessage(e.target.value);
                setDecisionMessageError("");
              }}
              placeholder="Enter your Decision message here..."
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
              onClick={() => {
                if (!DecisionMessageMessage.trim()) {
                  setDecisionMessageError("Decision message is required.");
                  return;
                }
                budgetApprovalDecision();
              }}
              className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-purple-800 bg-purple-600 text-white px-4 py-2 rounded h-fit"
            >
              Confirm Decision
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}

DecideBudgetApproval.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onGoBack: PropTypes.func,
  handleClose: PropTypes.func,
  rowData: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  updateModal: PropTypes.elementType,
  deleteModal: PropTypes.elementType,
  refreshData: PropTypes.func,
};
