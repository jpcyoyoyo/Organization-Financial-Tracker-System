import Modal from "../../components/ui/modal";
import PropTypes from "prop-types";

export default function ViewReportsModal({
  isOpen,
  onClose,
  fetchUrl,
  userData,
  rowData,
  id,
  updateModal,
  deleteModal,
}) {
  if (!isOpen) return null;
  return (
    <Modal title="VIEW REPORTS" isOpen={isOpen} onClose={onClose}>
      <p>ID: {id}</p>
      <p>Row Data: {JSON.stringify(rowData)}</p>
      {/* If updateModal or deleteModal exist, show some buttons here */}
    </Modal>
  );
}

ViewReportsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Modal open state
  onClose: PropTypes.func.isRequired, // Function to close the modal
  fetchUrl: PropTypes.string, // URL for fetching data (optional)
  userData: PropTypes.object, // User data object (optional)
  rowData: PropTypes.object, // Row data object (optional)
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // ID can be string or number (optional)
  updateModal: PropTypes.func, // Function for updating (optional)
  deleteModal: PropTypes.func, // Function for deleting (optional)
};
