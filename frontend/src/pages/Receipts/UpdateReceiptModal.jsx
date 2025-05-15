import { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import LightboxModal from "../../components/ui/lightboxmodal";

const UpdateReceiptModal = ({
  isOpen,
  onClose,
  ip,
  receiptId,
  onUpdateReceipt, // callback after successful update
  isMobile,
}) => {
  // Local state for fetched receipt details.
  const [receiptData, setReceiptData] = useState(null);
  // Local states for update form fields.
  const [updateReceiptImage, setUpdateReceiptImage] = useState(null);
  const [updateReceiptImagePreview, setUpdateReceiptImagePreview] =
    useState("");
  const [updateReceiptFrom, setUpdateReceiptFrom] = useState("");
  const [updateReceiptTo, setUpdateReceiptTo] = useState("");
  const [updateReceiptFromComsoc, setUpdateReceiptFromComsoc] = useState(false);
  const [updateReceiptToComsoc, setUpdateReceiptToComsoc] = useState(false);
  const [receiptUserOptions, setReceiptUserOptions] = useState([]);
  const [receiptErrorMsg, setReceiptErrorMsg] = useState("");

  // Lightbox state
  const [showLightBox, setShowLightBox] = useState(false);
  const [selectedProof, setSelectedProof] = useState("");

  const updateReceiptInputRef = useRef(null);

  // Fetch user options for COMSOC members.
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

  // Fetch full receipt details given the receiptId.
  useEffect(() => {
    if (isOpen && receiptId) {
      const fetchReceiptDetails = async () => {
        try {
          const res = await fetch(`${ip}/fetch-receipt-details`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: receiptId }),
          });
          const result = await res.json();
          if (result.status && result.receipt) {
            setReceiptData(result.receipt);
          } else {
            setReceiptErrorMsg("Failed to fetch receipt details.");
          }
        } catch (error) {
          console.error("Error fetching receipt details:", error);
          setReceiptErrorMsg("Error fetching receipt details.");
        }
      };
      fetchReceiptDetails();
    }
  }, [isOpen, receiptId, ip]);

  // When receiptData is available, initialize the form fields.
  useEffect(() => {
    if (receiptData) {
      setUpdateReceiptImagePreview(`${ip}/receipts/${receiptData.image}`);
      if (receiptData.receive_from_comsoc === 1) {
        setUpdateReceiptFromComsoc(true);
        setUpdateReceiptFrom(receiptData.receive_from_student_id);
      } else {
        setUpdateReceiptFromComsoc(false);
        setUpdateReceiptFrom(receiptData.receive_from_name);
      }
      if (receiptData.receive_to_comsoc === 1) {
        setUpdateReceiptToComsoc(true);
        setUpdateReceiptTo(receiptData.receive_to_student_id);
      } else {
        setUpdateReceiptToComsoc(false);
        setUpdateReceiptTo(receiptData.receive_to_name);
      }
    }
  }, [receiptData, ip]);

  // Handle image file change for update.
  const handleUpdateReceiptImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUpdateReceiptImage(file);
    setUpdateReceiptImagePreview(URL.createObjectURL(file));
  };

  // Lightbox handlers.
  const openLightbox = (url) => {
    setSelectedProof(url);
    setShowLightBox(true);
  };

  const closeLightbox = () => {
    setSelectedProof("");
    setShowLightBox(false);
  };

  // Submit update for receipt.
  async function handleUpdateReceiptSubmit() {
    if (!receiptData) return;
    let imageFileName = receiptData.image;
    const oldImageName = receiptData.image;
    if (updateReceiptImage) {
      const formData = new FormData();
      formData.append("receiptFile", updateReceiptImage);
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
          imageFileName = result.fileNames[0];
        } else {
          setReceiptErrorMsg("Failed to upload updated receipt image.");
          return;
        }
      } catch (error) {
        console.error("Error updating receipt image:", error);
        setReceiptErrorMsg("Failed to update receipt image. Please try again.");
        return;
      }
      if (oldImageName && oldImageName !== imageFileName) {
        try {
          await fetch(`${ip}/delete-receipt-image`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ filename: oldImageName }),
          });
        } catch (deleteError) {
          console.error("Error deleting old receipt image:", deleteError);
        }
      }
    }
    const updatePayload = {
      id: receiptData.id,
      type: receiptData.type,
      image: imageFileName,
      receive_from: updateReceiptFrom,
      receive_to: updateReceiptTo,
    };

    try {
      const res = await fetch(`${ip}/update-receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });
      const result = await res.json();
      if (result.status) {
        if (onUpdateReceipt) onUpdateReceipt(receiptData.id, imageFileName);
        onClose();
      } else {
        setReceiptErrorMsg(result.error || "Receipt update failed.");
      }
    } catch (error) {
      console.error("Error updating receipt:", error);
      setReceiptErrorMsg("Error updating receipt.");
    }
  }

  if (!isOpen) return null;
  return (
    <>
      <Modal
        title="UPDATE RECEIPT"
        isOpen={isOpen}
        onClose={() => {
          setReceiptErrorMsg("");
          onClose();
        }}
        modalCenter={true}
        w="w-11/12 md:w-4/7 lg:w-3/7 xl:w-3/7 md:h-1/2"
      >
        {receiptData ? (
          <div className="p-4 h-full overflow-y-auto">
            <div className="h-3/4 flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-x-4">
                <div className="sm:w-1/3">
                  <label className="block text-sm font-semibold">
                    Receipt Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpdateReceiptImageChange}
                    ref={updateReceiptInputRef}
                    style={{ display: "none" }}
                  />
                  {updateReceiptImagePreview ? (
                    <div className="relative w-32 h-32 border rounded-md overflow-clip">
                      <img
                        src={updateReceiptImagePreview}
                        alt="Receipt Preview"
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => openLightbox(updateReceiptImagePreview)}
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          setUpdateReceiptImage(null);
                          setUpdateReceiptImagePreview("");
                        }}
                        className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-sm z-10"
                      >
                        X
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => {
                        setReceiptErrorMsg("");
                        updateReceiptInputRef.current.click();
                      }}
                      className="w-32 h-32 flex items-center justify-center border-2 border-dashed rounded-md"
                    >
                      <p className="text-xs">Add Image</p>
                    </Button>
                  )}
                </div>
                <div className="sm:w-2/3 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold">
                      Receive From
                    </label>
                    {updateReceiptFromComsoc ? (
                      <>
                        <Input
                          type="text"
                          list="updateReceiptFromList"
                          value={updateReceiptFrom}
                          onChange={(e) => setUpdateReceiptFrom(e.target.value)}
                          placeholder="Type to search member"
                          className="rounded-md border border-black p-0.5 w-full"
                        />
                        <datalist id="updateReceiptFromList">
                          {receiptUserOptions.map((user) => (
                            <option
                              key={user.student_id}
                              value={user.student_id}
                            >
                              {user.full_name}
                            </option>
                          ))}
                        </datalist>
                      </>
                    ) : (
                      <Input
                        type="text"
                        value={updateReceiptFrom}
                        onChange={(e) => setUpdateReceiptFrom(e.target.value)}
                        placeholder="Enter name"
                        className="border rounded-md w-full p-0.5"
                      />
                    )}
                    <div className="mt-2 flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={updateReceiptFromComsoc}
                        onChange={(e) => {
                          setUpdateReceiptFromComsoc(e.target.checked);
                          setUpdateReceiptFrom("");
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
                    {updateReceiptToComsoc ? (
                      <>
                        <Input
                          type="text"
                          list="updateReceiptToList"
                          value={updateReceiptTo}
                          onChange={(e) => setUpdateReceiptTo(e.target.value)}
                          placeholder="Type to search member"
                          className="rounded-md border border-black p-0.5 w-full"
                        />
                        <datalist id="updateReceiptToList">
                          {receiptUserOptions.map((user) => (
                            <option
                              key={user.student_id}
                              value={user.student_id}
                            >
                              {user.full_name}
                            </option>
                          ))}
                        </datalist>
                      </>
                    ) : (
                      <Input
                        type="text"
                        value={updateReceiptTo}
                        onChange={(e) => setUpdateReceiptTo(e.target.value)}
                        placeholder="Enter name"
                        className="border rounded-md w-full p-0.5"
                      />
                    )}
                    <div className="mt-2 flex items-center space-x-1">
                      <input
                        type="checkbox"
                        checked={updateReceiptToComsoc}
                        onChange={(e) => {
                          setUpdateReceiptToComsoc(e.target.checked);
                          setUpdateReceiptTo("");
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
                  handleUpdateReceiptSubmit();
                }}
                className="transform hover:scale-105 bg-blue-600 text-white px-4 py-1 rounded cursor-pointer transition-all duration-150 hover:bg-blue-800 text-sm sm:text-base h-10"
              >
                Update Receipt
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 h-full w-full flex items-center justify-center">
            <p>Loading receipt details...</p>
          </div>
        )}
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

UpdateReceiptModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  ip: PropTypes.string.isRequired,
  receiptId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onUpdateReceipt: PropTypes.func,
  isMobile: PropTypes.bool,
};

export default UpdateReceiptModal;
