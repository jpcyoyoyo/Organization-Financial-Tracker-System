import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import Modal from "../../components/ui/modal";
import LightboxModal from "../../components/ui/lightboxmodal";
import { IpContext } from "../../context/IpContext";

const ViewReceiptNoEditModal = ({ isOpen, onClose, ip, id, isMobile }) => {
  const [receiptDetails, setReceiptDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showLightBox, setShowLightBox] = useState(false);
  const [selectedProof, setSelectedProof] = useState("");

  const ipH = useContext(IpContext);

  // Fetch receipt details when modal is open and id is provided.
  useEffect(() => {
    if (isOpen && id) {
      const fetchDetails = async () => {
        setLoading(true);
        try {
          const res = await fetch(`${ip || ipH}/fetch-receipt-details`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: id }),
          });
          const result = await res.json();
          if (result.status && result.receipt) {
            setReceiptDetails(result.receipt);
            setErrorMsg("");
          } else {
            setErrorMsg("Failed to fetch receipt details.");
          }
        } catch (error) {
          console.error("Error fetching receipt details:", error);
          setErrorMsg("Failed to fetch receipt details.");
        } finally {
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [isOpen, id, ip, ipH]);

  const openLightbox = (url) => {
    setSelectedProof(url);
    setShowLightBox(true);
  };

  const closeLightbox = () => {
    setSelectedProof("");
    setShowLightBox(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <Modal
        title="VIEW RECEIPT"
        isOpen={isOpen}
        onClose={onClose}
        modalCenter={false}
        w="w-11/12 h-11/12 md:h-6/7 md:w-4/7 lg:w-3/7 xl:w-3/7"
      >
        {loading ? (
          <div className="p-4 h-full w-full flex items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : errorMsg ? (
          <div className="p-4 h-full w-full flex items-center justify-center">
            <p className="text-red-600">{errorMsg}</p>
          </div>
        ) : receiptDetails ? (
          <div className="sm:p-2 md:p-6 h-full w-full">
            <div className="overflow-y-auto bg-[#00ff6222] border rounded-lg w-full h-full">
              <div className="flex flex-col md:flex-row bg-emerald-500 py-2 px-4 border-b">
                <label className="text-base block font-semibold">
                  {receiptDetails.type
                    ? `${receiptDetails.type} Receipt`
                    : "Receipt"}
                </label>
              </div>
              <div className="text-sm p-4 flex flex-col sm:flex-row space-y-4 sm:space-x-4">
                <div className="w-full sm:w-fit justify-items-center sm:justify-items-start">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 border rounded-md overflow-clip">
                    <img
                      src={`${ip || ipH}/receipts/${receiptDetails.image}`}
                      alt="Receipt Preview"
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() =>
                        openLightbox(
                          `${ip || ipH}/receipts/${receiptDetails.image}`
                        )
                      }
                    />
                  </div>
                </div>
                <div className="sm:flex sm:flex-col space-y-4">
                  <div>
                    <label className="block font-semibold">Receive From</label>
                    <div>
                      {receiptDetails.receive_from_name}
                      {receiptDetails.receive_from_student_id
                        ? ` - (${receiptDetails.receive_from_student_id})`
                        : ""}
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold">Receive To</label>
                    <div>
                      {receiptDetails.receive_to_name}
                      {receiptDetails.receive_to_student_id
                        ? ` - (${receiptDetails.receive_to_student_id})`
                        : ""}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 sm:gap-0 sm:space-y-4">
                    <div>
                      <label className="block font-semibold">Receipt ID</label>
                      <div>{receiptDetails.id}</div>
                    </div>
                    <div>
                      <label className="block font-semibold">Direction</label>
                      <div>{receiptDetails.direction}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-sm px-4 py-2 grid border-t grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold">Receipt Created</label>
                  <div>{receiptDetails.created_at}</div>
                </div>
                <div>
                  <label className="block font-semibold">Receipt Updated</label>
                  <div>{receiptDetails.updated_at}</div>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block font-semibold">
                    Relating {receiptDetails.type} Record ID
                  </label>
                  <div>{receiptDetails.relating_id}</div>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <label className="block font-semibold">Issued By</label>
                  <div className="text-base font-semibold">
                    {receiptDetails.full_name}
                  </div>
                  <p className="text-sm">{receiptDetails.designation}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
      {showLightBox && selectedProof && (
        <LightboxModal
          isOpen={showLightBox}
          onClose={closeLightbox}
          selectedProof={selectedProof}
          isMobile={isMobile}
        />
      )}
    </>
  );
};

ViewReceiptNoEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ip: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  isMobile: PropTypes.bool,
};

export default ViewReceiptNoEditModal;
