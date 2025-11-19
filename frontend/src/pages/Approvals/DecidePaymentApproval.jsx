import { useState, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { Button } from "../../components/ui/button";
import { useOutletContext } from "react-router-dom";
import { IpContext } from "../../context/IpContext";
import { motion } from "framer-motion";
import backIcon from "../../assets/prev.svg";
import Modal from "../../components/ui/modal";

export default function DecidePaymentApproval({
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
    setIsVisible(isOpen);
  }, [isOpen]);

  useEffect(() => {
    setLoading(true);
    async function fetchPaymentDetails() {
      if (!id) return;
      setLoading(true);
      try {
        const response = await fetch(`${ip}/fetch-payment-details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) throw new Error("Failed to fetch payment details");
        const result = await response.json();
        if (result.status && result.data) {
          const data = result.data;
          setDetails(data);
        }
      } catch (error) {
        console.error("Error fetching payment details:", error);
      } finally {
        setLoading(false);
      }
    }
    if (isOpen) {
      fetchPaymentDetails();
    }
  }, [isOpen, id, ip]);

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
      const response = await fetch(`${ip}/payment-approval-decision`, {
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
        className="fixed inset-0 bg-[#171A1FDD] z-50 flex justify-center items-center w-full px-6 lg:px-12 py-8 h-full"
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
          className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col w-full md:w-3/7 h-full"
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
              <img src={backIcon} width="20" alt="Back" />
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
            <div className="sm:p-2 md:p-6 h-full w-full">
              <div className="overflow-y-auto bg-[#ff002b2f] border rounded-lg w-full h-9/10">
                <div className="flex flex-col md:flex-row text-white bg-red-500 p-2">
                  <label className="text-base block font-semibold">
                    Payment Name
                  </label>
                  <h1 className="hidden md:flex font-semibold">{":"}</h1>
                  <div className="md:pl-1 text-sm md:text-base">
                    {details && details.name}
                  </div>
                </div>
                <div className="text-sm p-4 grid grid-cols-2 border-b">
                  <div className="h-30">
                    <label className="block font-semibold">Description</label>
                    <div>{details.description}</div>
                  </div>
                </div>
                <div className="text-sm px-4 py-2 grid border-t grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold">Amount</label>
                    <div>{details.amount}</div>
                  </div>
                  <div>
                    <label className="block font-semibold">Due Date</label>
                    <div>{new Date(details.due_date).toLocaleString()}</div>
                  </div>
                  <div>
                    <label className="flex font-semibold">Date Created</label>
                    <div>{details.created_at}</div>
                  </div>
                  <div>
                    <label className="flex font-semibold">Date Updated</label>
                    <div>{details.updated_at}</div>
                  </div>
                  <div>
                    <label className="flex font-semibold">Approval ID</label>
                    <div>{details.approval_id}</div>
                  </div>
                </div>
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
              <p>Failed to fetch details</p>
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

DecidePaymentApproval.propTypes = {
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
