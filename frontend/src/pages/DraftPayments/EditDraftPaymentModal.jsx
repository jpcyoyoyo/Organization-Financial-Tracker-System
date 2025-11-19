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

export default function EditDraftPaymentModal({
  isOpen,
  onClose,
  onGoBack,
  id,
  refreshData,
  deleteModal: DeleteModal,
  onRefreshGlobalData,
}) {
  const { handleShowNotification } = useOutletContext();
  const ip = useContext(IpContext);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Editable fields for Draft/Go Back to Draft
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedAmount, setEditedAmount] = useState("");
  const [editedDueDate, setEditedDueDate] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const errorRef = useRef(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestError, setRequestError] = useState("");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const userData = sessionStorage.getItem("user");

  // For Approval Details modal (if needed)
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const title = "EDIT PAYMENT";

  // Reset state on modal close
  useEffect(() => {
    if (!isOpen) {
      setDetails(null);
      setEditedName("");
      setEditedDescription("");
      setEditedAmount("");
      setEditedDueDate("");
      setErrorMsg("");
      setShowRequestModal(false);
      setRequestMessage("");
      setRequestError("");
      setShowCancelModal(false);
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
    setIsVisible(isOpen);
  }, [isOpen]);

  // Fetch payment details
  useEffect(() => {
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
          // initialize editable fields
          setEditedName(data.name || "");
          setEditedDescription(data.description || "");
          setEditedAmount(data.amount || "");
          setEditedDueDate(data.due_date || "");
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

  // Helper for due date: only days ahead of today
  const getMinDueDateString = () => {
    const minDueDate = new Date();
    minDueDate.setDate(minDueDate.getDate() + 1);
    return minDueDate.toISOString().slice(0, 16);
  };

  // updatePayment will call /update-payment endpoint
  const updatePayment = async (statusParam) => {
    setErrorMsg("");
    // if updating for approval then validate inputs
    if (statusParam === "Sent for Approval") {
      if (
        !editedName.trim() ||
        !editedDescription.trim() ||
        !editedAmount.trim() ||
        !editedDueDate.trim()
      ) {
        setErrorMsg("Please fill in all required fields.");
        return;
      }
    }
    try {
      const response = await fetch(`${ip}/update-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_data: userData,
          id,
          name: editedName,
          description: editedDescription,
          amount: editedAmount,
          due_date: editedDueDate,
          status: statusParam,
        }),
      });
      if (!response.ok) throw new Error("Failed to update payment");
      const result = await response.json();
      if (result.status) {
        handleShowNotification("Payment updated successfully", "success");
        // refresh details if in Draft to update view
        if (statusParam === "Draft") {
          setDetails(result.data);
        } else if (statusParam === "Sent for Approval") {
          onClose();
          refreshData();
        }
      } else {
        setErrorMsg(result.error || "Update failed");
        handleShowNotification(result.error || "Update failed", "error");
      }
    } catch (error) {
      console.error("Error updating payment:", error);
      setErrorMsg("Error updating payment");
      handleShowNotification("Error updating payment", "error");
    }
  };

  // Function to cancel payment approval (/cancel-payment-approval)
  const cancelPaymentApproval = async () => {
    try {
      const response = await fetch(`${ip}/cancel-payment-approval`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          approval_id: details.approval_id,
          user_data: sessionStorage.getItem("user"),
        }),
      });
      if (!response.ok) throw new Error("Failed to cancel payment approval");
      const result = await response.json();
      if (result.status) {
        handleShowNotification("Payment approval cancelled", "success");
        refreshData();
        onClose();
      } else {
        handleShowNotification(result.error || "Cancellation failed", "error");
      }
    } catch (error) {
      console.error("Error cancelling payment approval:", error);
      handleShowNotification("Error cancelling approval", "error");
    }
  };

  // Function to issue payment (/issue-payment)
  const issuePayment = async () => {
    try {
      const response = await fetch(`${ip}/issue-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error("Failed to issue payment");
      const result = await response.json();
      if (result.status) {
        handleShowNotification("Payment issued successfully", "success");
        refreshData();
        onClose();
      } else {
        handleShowNotification(result.error || "Issuance failed", "error");
      }
    } catch (error) {
      console.error("Error issuing payment:", error);
      handleShowNotification("Error issuing payment", "error");
    }
  };

  // Render logic based on details.status
  const renderEditableForm = () => (
    <div className="p-4">
      <div className="mb-4">
        <label className="block font-semibold">Payment Name</label>
        <Input
          type="text"
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onBlur={() => updatePayment("Draft")}
          placeholder="Enter Payment Name"
          className="w-full border rounded-md p-1.5 text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold">Description</label>
        <textarea
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          onBlur={() => updatePayment("Draft")}
          placeholder="Enter Description"
          className="w-full border rounded-md p-1.5 text-sm resize-none"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold">Amount</label>
        <Input
          type="number"
          value={editedAmount}
          onChange={(e) => setEditedAmount(e.target.value)}
          onBlur={() => updatePayment("Draft")}
          placeholder="Enter Amount"
          step="0.01"
          className="w-full border rounded-md p-1.5 text-sm"
        />
      </div>
      <div className="mb-4">
        <label className="block font-semibold">Due Date</label>
        <Input
          type="datetime-local"
          value={editedDueDate}
          onChange={(e) => setEditedDueDate(e.target.value)}
          onBlur={() => updatePayment("Draft")}
          placeholder="Select Due Date"
          min={getMinDueDateString()}
          className="w-full border rounded-md p-1.5 text-sm"
        />
      </div>
      {errorMsg && (
        <p ref={errorRef} className="text-red-600 text-sm">
          {errorMsg}
        </p>
      )}
    </div>
  );

  const renderReadOnlyView = () => (
    <div className="p-2 md:p-6 h-full w-full">
      <div className="overflow-y-auto bg-[#ff002b2f] border rounded-lg w-full h-full">
        <div className="flex flex-col md:flex-row text-white bg-red-500 p-2">
          <label className="text-base block font-semibold">Payment Name</label>
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
            <label className="flex font-semibold">Date Approved</label>
            <div>
              {details.approved_at !== null
                ? details.approved_at
                : "Not Yet Approved"}
            </div>
          </div>
          {details.published_at && (
            <div>
              <label className="flex font-semibold">Date Published</label>
              <div>{details.published_at}</div>
            </div>
          )}
          <div>
            <label className="flex font-semibold">Approval ID</label>
            <div>{details.approval_id}</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main render: switch based on details.status
  const renderActionButtons = () => {
    if (!details) return null;

    if (details.status === "Draft" || details.status === "Go Back to Draft") {
      return (
        <div className="flex justify-end items-center space-x-2 p-4">
          <Button
            type="button"
            onClick={() => {
              // Validate then open request modal for submission
              if (
                !editedName.trim() ||
                !editedDescription.trim() ||
                !editedAmount.trim() ||
                !editedDueDate.trim()
              ) {
                setErrorMsg("Please fill in all fields.");
                return;
              }
              setShowRequestModal(true);
            }}
            className="bg-purple-600 hover:bg-purple-800 text-white px-4 py-2 rounded"
          >
            Submit for Approval
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (DeleteModal) {
                setShowDelete(true);
              }
            }}
            className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded"
          >
            Delete Payment
          </Button>
        </div>
      );
    } else if (details.status === "Sent for Approval") {
      return (
        <div className="flex justify-end items-center space-x-2 p-4">
          <Button
            type="button"
            onClick={() => setShowCancelModal(true)}
            className="transition-all duration-150 transform hover:scale-105 cursor-pointer bg-gray-600 hover:bg-gray-800 text-white px-4 py-2 rounded"
          >
            Cancel Approval
          </Button>
        </div>
      );
    } else if (details.status === "Ready to Issue") {
      return (
        <div className="flex justify-end items-center space-x-2 p-4">
          <Button
            type="button"
            onClick={issuePayment}
            className="transition-all duration-150 transform hover:scale-105 cursor-pointer bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded"
          >
            Issue Payment
          </Button>
        </div>
      );
    } else if (details.status === "Issued") {
      return null;
    }
    return null;
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
            <>
              {details.status === "Draft" || details.status === "Back to Draft"
                ? renderEditableForm()
                : renderReadOnlyView()}
              {renderActionButtons()}
            </>
          ) : (
            <div className="p-4 h-9/10 w-full flex items-center justify-center">
              <p>Failed to fetch details</p>
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
              className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-gray-800 bg-gray-400 text-white px-4 py-2 rounded"
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
                updatePayment("Sent for Approval");
              }}
              className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-purple-800 bg-purple-600 text-white px-4 py-2 rounded"
            >
              Send
            </Button>
          </div>
        </Modal>
      )}
      {showCancelModal && (
        <Modal
          title="CONFIRM CANCEL"
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          modalCenter={true}
          w={"w-11/12 h-11/12 md:h-2/5 md:w-4/7 lg:w-3/7 xl:w-2/7"}
        >
          <div className="p-4 h-6/9 flex justify-center">
            <p className="text-lg text-gray-800">
              Are you sure you want to cancel the payment approval? The payment
              will revert back to Draft.
            </p>
          </div>
          <div className="flex justify-end space-x-2 h-2/9 p-4">
            <Button
              type="button"
              onClick={() => setShowCancelModal(false)}
              className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-gray-800 bg-gray-400 text-white px-4 py-2 rounded h-fit"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={cancelPaymentApproval}
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
      {DeleteModal && showDelete && (
        <DeleteModal
          isOpen={showDelete}
          onClose={() => setShowDelete(false)}
          onGoBack={onGoBack}
          id={id}
          rowData={details}
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

EditDraftPaymentModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onGoBack: PropTypes.func,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  refreshData: PropTypes.func,
  deleteModal: PropTypes.elementType,
  onRefreshGlobalData: PropTypes.func,
};
