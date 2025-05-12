import { useState, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import Modal from "../../components/ui/modal";
import PropTypes from "prop-types";
import { Button } from "../../components/ui/button";
import { IpContext } from "../../context/IpContext";

export default function DeleteExpenseModal({
  isOpen,
  onClose,
  onGoBack,
  id,
  refreshData,
}) {
  const [loading, setLoading] = useState(false);
  const ip = useContext(IpContext);
  const { handleShowNotification } = useOutletContext();

  async function handleDeleteAccount() {
    setLoading(true);
    try {
      const res = await fetch(`${ip}/delete-deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const result = await res.json();
      if (result.status) {
        handleShowNotification("Deposit deleted successfully.", "success");
        if (refreshData) refreshData();
        onClose();
      } else {
        handleShowNotification(
          result.error || "Deposit deletion failed.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error deleting deposit:", error);
      handleShowNotification("Deposit deletion failed due to an error.", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Modal
        title="DELETE ACCOUNT"
        isOpen={isOpen}
        onClose={onClose}
        w="w-11/12 md:h-2/5 md:w-5/9 xl:w-1/3"
      >
        <div className="p-4 h-full w-full">
          <p className="h-1/2">
            Are you sure you want to permanently delete this deposit? All data
            related to this deposit including all proofs photos will be deleted.
          </p>
          <div className="flex justify-end mt-10 space-x-2 sm:space-x-4 h-1/2">
            <Button
              onClick={onGoBack}
              className="bg-gray-400 hover:bg-gray-600 text-sm md:text-base text-white px-4 py-2 rounded cursor-pointer transition-all duration-150 transform hover:scale-105 flex items-center h-8"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-800 text-sm md:text-base text-white px-4 py-2 rounded cursor-pointer transition-all duration-150 transform hover:scale-105 flex items-center h-8"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

DeleteExpenseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onGoBack: PropTypes.func,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  refreshData: PropTypes.func,
};
