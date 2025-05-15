import { useState, useRef } from "react";
import PropTypes from "prop-types";
import Modal from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import LightboxModal from "../../components/ui/lightboxmodal";

const AddReceiptModal = ({ isOpen, onClose, ip, userData, onAddReceipt }) => {
  // Local state for receipt fields
  const [receiptImage, setReceiptImage] = useState(null);
  const [receiptImagePreview, setReceiptImagePreview] = useState("");
  const [receiptFrom, setReceiptFrom] = useState("");
  const [receiptTo, setReceiptTo] = useState("");
  const [receiptFromComsoc, setReceiptFromComsoc] = useState(false);
  const [receiptToComsoc, setReceiptToComsoc] = useState(false);
  const [receiptUserOptions, setReceiptUserOptions] = useState([]);
  const [receiptErrorMsg, setReceiptErrorMsg] = useState("");

  const [showLightBox, setShowLightBox] = useState(false);
  const [selectedProof, setSelectedProof] = useState("");

  const receiptInputRef = useRef(null);

  // Fetch COMSOC user options
  const fetchReceiptUserOptions = async () => {
    try {
      const res = await fetch(`${ip}/fetch-user-options`);
      const result = await res.json();
      if (result.status && Array.isArray(result.data)) {
        setReceiptUserOptions(result.data);
      }
    } catch (error) {
      console.error("Error fetching user options:", error);
    }
  };

  // Handle file input change: set image file and preview URL.
  const handleReceiptImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setReceiptImage(file);
    setReceiptImagePreview(URL.createObjectURL(file));
  };

  // Submit receipt: upload image then create the receipt record.
  const handleReceiptSubmit = async () => {
    if (!receiptImage || !receiptFrom || !receiptTo) {
      setReceiptErrorMsg(
        "Receipt image, receive from, and receive to are required."
      );
      return;
    }
    // Upload receipt image.
    const formData = new FormData();
    formData.append("receiptFile", receiptImage);
    try {
      const res = await fetch(`${ip}/upload-receipt-image`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (
        result.status &&
        Array.isArray(result.fileNames) &&
        result.fileNames.length > 0
      ) {
        const fname = result.fileNames[0];
        // Build receipt payload.
        const receiptPayload = {
          user_data: userData,
          type: "Expense",
          image: fname,
          direction: "Outgoing",
          receive_from: receiptFrom,
          receive_to: receiptTo,
        };
        const creRes = await fetch(`${ip}/create-receipt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(receiptPayload),
        });
        const creResult = await creRes.json();
        if (creResult.status && creResult.id) {
          // Construct preview URL.
          const previewUrl = `${ip}/receipts/${fname}`;
          // Notify parent component about the new receipt.
          onAddReceipt({ id: creResult.id, previewUrl });
          // Clean up local state.
          setReceiptImage(null);
          setReceiptImagePreview("");
          setReceiptFrom("");
          setReceiptTo("");
          setReceiptFromComsoc(false);
          setReceiptToComsoc(false);
          setReceiptErrorMsg("");
          onClose();
        } else {
          setReceiptErrorMsg("Failed to create receipt.");
        }
      } else {
        setReceiptErrorMsg("Failed to upload receipt image.");
      }
    } catch (error) {
      console.error("Error submitting receipt:", error);
      setReceiptErrorMsg("Failed to submit receipt. Please try again.");
    }
  };

  const closeLightbox = () => {
    setSelectedProof("");
    setShowLightBox(false);
  };

  if (!isOpen) return null;

  return (
    <>
      <Modal
        title="ADD RECEIPT"
        isOpen={isOpen}
        onClose={() => {
          setReceiptErrorMsg("");
          onClose();
        }}
        modalCenter={true}
        w="w-11/12 md:w-4/7 lg:w-3/7 xl:w-3/7 md:h-1/2"
      >
        <div className="p-4 h-full overflow-y-auto">
          <div className="h-3/4 flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-x-4">
              <div className="sm:w-1/3">
                <div>
                  <label className="block text-sm font-semibold">
                    Receipt Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptImageChange}
                    ref={receiptInputRef}
                    style={{ display: "none" }}
                  />
                  {receiptImagePreview ? (
                    <div className="relative w-32 h-32 border rounded-md overflow-clip">
                      <img
                        src={receiptImagePreview}
                        alt="Receipt Preview"
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => {
                          setSelectedProof(receiptImagePreview);
                          setShowLightBox(true);
                        }}
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          setReceiptImage(null);
                          setReceiptImagePreview("");
                        }}
                        className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-sm"
                      >
                        X
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => {
                        setReceiptErrorMsg("");
                        receiptInputRef.current.click();
                      }}
                      className="w-32 h-32 flex items-center justify-center border-2 border-dashed rounded-md"
                    >
                      <p className="text-xs">Add Image</p>
                    </Button>
                  )}
                </div>
              </div>
              <div className="sm:w-2/3 space-y-4">
                <div>
                  <label className="block text-sm font-semibold">
                    Receive From
                  </label>
                  {receiptFromComsoc ? (
                    <>
                      <Input
                        type="text"
                        list="receiptFromList"
                        value={receiptFrom}
                        onChange={(e) => setReceiptFrom(e.target.value)}
                        placeholder="Type to search member"
                        className="rounded-md border border-black p-0.5 w-full"
                      />
                      <datalist id="receiptFromList">
                        {receiptUserOptions.map((user) => (
                          <option key={user.student_id} value={user.student_id}>
                            {user.full_name}
                          </option>
                        ))}
                      </datalist>
                    </>
                  ) : (
                    <Input
                      type="text"
                      value={receiptFrom}
                      onChange={(e) => setReceiptFrom(e.target.value)}
                      placeholder="Enter name"
                      className="border rounded-md w-full p-0.5"
                    />
                  )}
                  <div className="mt-2 flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={receiptFromComsoc}
                      onChange={(e) => {
                        setReceiptFromComsoc(e.target.checked);
                        setReceiptFrom("");
                        if (e.target.checked) {
                          fetchReceiptUserOptions();
                        }
                      }}
                    />
                    <span className="mt-0.5 text-xs">COMSOC Member</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold">
                    Receive To
                  </label>
                  {receiptToComsoc ? (
                    <>
                      <Input
                        type="text"
                        list="receiptToList"
                        value={receiptTo}
                        onChange={(e) => setReceiptTo(e.target.value)}
                        placeholder="Type to search member"
                        className="rounded-md border border-black p-0.5 w-full"
                      />
                      <datalist id="receiptToList">
                        {receiptUserOptions.map((user) => (
                          <option key={user.student_id} value={user.student_id}>
                            {user.full_name}
                          </option>
                        ))}
                      </datalist>
                    </>
                  ) : (
                    <Input
                      type="text"
                      value={receiptTo}
                      onChange={(e) => setReceiptTo(e.target.value)}
                      placeholder="Enter name"
                      className="border rounded-md w-full p-0.5"
                    />
                  )}
                  <div className="mt-2 flex items-center space-x-1">
                    <input
                      type="checkbox"
                      checked={receiptToComsoc}
                      onChange={(e) => {
                        setReceiptToComsoc(e.target.checked);
                        setReceiptTo("");
                        if (e.target.checked) {
                          fetchReceiptUserOptions();
                        }
                      }}
                    />
                    <span className="mt-0.5 text-xs">COMSOC Member</span>
                  </div>
                </div>
              </div>
            </div>
            {receiptErrorMsg && (
              <p className="text-red-600 text-sm">{receiptErrorMsg}</p>
            )}
          </div>
          <div className="flex justify-end space-x-4 h-1/4 pt-8">
            <Button
              type="button"
              onClick={() => {
                setReceiptErrorMsg("");
                onClose();
              }}
              className="transform hover:scale-105 bg-gray-400 hover:bg-gray-600 text-sm md:text-base text-white px-4 py-2 rounded cursor-pointer transition-all duration-150 flex items-center h-10"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                setReceiptErrorMsg("");
                handleReceiptSubmit();
              }}
              className="transform hover:scale-105 bg-green-600 text-white px-4 py-1 rounded cursor-pointer transition-all duration-150 hover:bg-green-800 text-sm sm:text-base h-10"
            >
              Submit Receipt
            </Button>
          </div>
        </div>
      </Modal>
      {showLightBox && selectedProof && (
        <LightboxModal
          isOpen={showLightBox}
          onClose={closeLightbox}
          selectedProof={selectedProof}
          isMobile={window.innerWidth < 768}
        />
      )}
    </>
  );
};

AddReceiptModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ip: PropTypes.string.isRequired,
  userData: PropTypes.string.isRequired,
  onAddReceipt: PropTypes.func.isRequired,
};

export default AddReceiptModal;
