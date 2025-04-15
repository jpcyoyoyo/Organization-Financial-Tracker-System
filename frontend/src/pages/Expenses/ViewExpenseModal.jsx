import { useState, useEffect, useContext } from "react";
import Modal from "../../components/ui/modal";
import PropTypes from "prop-types";
import { IpContext } from "../../context/IpContext";

export default function ViewExpenseModal({
  isOpen,
  onClose,
  id,
  updateModal,
  deleteModal,
}) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const ip = useContext(IpContext);

  // Function to fetch expense details when modal is open
  useEffect(() => {
    async function fetchDetails() {
      if (!id) return;
      setLoading(true);
      try {
        const response = await fetch(`${ip}/fetch-expense-details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) throw new Error("Failed to fetch expense details");
        const result = await response.json();
        if (result.status && result.data) {
          setDetails(result.data);
        }
      } catch (error) {
        console.error("Error fetching expense details:", error);
      } finally {
        setLoading(false);
      }
    }
    if (isOpen) {
      fetchDetails();
    }
  }, [isOpen, id, ip]);

  return (
    <Modal
      title="VIEW EXPENSE"
      isOpen={isOpen}
      onClose={onClose}
      w="w-11/12 h-11/12 sm:w-5/7 lg:w-4/7"
    >
      {loading ? (
        <div className="p-4 h-full w-full flex items-center justify-center">
          <p>Loading...</p>
        </div>
      ) : details ? (
        <div className="p-4 h-full w-full">
          <div className="space-y-2 text-sm sm:text-base">
            <div>
              <label className="block font-semibold">Expense ID</label>
              <div>{details.id}</div>
            </div>
            <div>
              <label className="block font-semibold">Amount</label>
              <div>{details.amount}</div>
            </div>
            <div>
              <label className="block font-semibold">Date</label>
              <div>{details.date}</div>
            </div>
            <div>
              <label className="block font-semibold">Category</label>
              <div>{details.category}</div>
            </div>
            <div>
              <label className="block font-semibold">Description</label>
              <div>{details.description}</div>
            </div>
            <div>
              <label className="block font-semibold">Quantity</label>
              <div>{details.quantity}</div>
            </div>
            <div>
              <label className="block font-semibold">Item</label>
              <div>{details.item}</div>
            </div>
          </div>
        </div>
      ) : (
        <p className="p-10">No expense details available.</p>
      )}
    </Modal>
  );
}

ViewExpenseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  updateModal: PropTypes.func,
  deleteModal: PropTypes.func,
};
