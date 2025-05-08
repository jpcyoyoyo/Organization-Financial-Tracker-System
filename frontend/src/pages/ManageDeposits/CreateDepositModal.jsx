import { useState, useEffect, useContext, useRef } from "react";
import Modal from "../../components/ui/modal";
import PropTypes from "prop-types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useOutletContext } from "react-router-dom";
import { IpContext } from "../../context/IpContext";
import { icons } from "../../assets/icons";

export default function CreateDepositModal({ isOpen, onClose, refreshData }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [isDraft, setIsDraft] = useState(false);
  const [breakdown, setBreakdown] = useState([
    { breakdownName: "", breakdownAmount: "" },
  ]);
  const [recordGroupId, setRecordGroupId] = useState("");
  const [proof, setProof] = useState([]); // store proof file names returned from server
  const [proofPreviews, setProofPreviews] = useState([]); // store local preview URLs
  const [errorMsg, setErrorMsg] = useState("");
  // states for submit processing
  const [issuingState, setIssuingState] = useState(false);
  const [draftingState, setDraftingState] = useState(false);
  // New states for lightbox preview
  const [selectedProof, setSelectedProof] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState(null);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const ip = useContext(IpContext);
  const { handleShowNotification } = useOutletContext();
  const nameRef = useRef(null);
  const errorRef = useRef(null);
  const lightboxContainerRef = useRef(null);
  const lightboxImageRef = useRef(null);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  // Fetch available record groups for deposit
  const [recordGroups, setRecordGroups] = useState([]);
  const userData = sessionStorage.getItem("user");

  // Compute total deposit amount from breakdown rows
  const totalAmount = breakdown.reduce((acc, row) => {
    const amt = parseFloat(row.breakdownAmount);
    return acc + (isNaN(amt) ? 0 : amt);
  }, 0);

  // Scroll error into view if errorMsg changes
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

  // When modal opens, check for draft deposit and fetch record groups options
  useEffect(() => {
    if (isOpen) {
      // Check if a draft deposit exists
      (async () => {
        try {
          const res = await fetch(`${ip}/check-draft-deposit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_data: userData, tab: "deposit" }),
          });
          const result = await res.json();
          if (result.hasDraft) {
            setIsDraft(true);
          } else {
            setIsDraft(false);
          }
          setLoading(false);
        } catch (error) {
          console.error("Error checking draft deposit:", error);
        }
      })();

      // Fetch record group options from a new route
      (async () => {
        try {
          const res = await fetch(
            `${ip}/fetch-record-groups-options?tab=deposit`
          );
          const result = await res.json();
          if (result.status && Array.isArray(result.data)) {
            setRecordGroups(result.data);
          }
        } catch (error) {
          console.error("Error fetching record group options:", error);
        }
      })();
    }
  }, [isOpen, ip, userData, onClose]);

  // Add a new row to the breakdown table
  const addBreakdownRow = () => {
    setBreakdown((prev) => [
      ...prev,
      { breakdownName: "", breakdownAmount: "" },
    ]);
  };

  // Update a breakdown row
  const updateBreakdownRow = (index, field, value) => {
    setBreakdown((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Handle file input change – generate previews and upload files to server
  async function handleProofUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // Prepare FormData to upload files
    const formData = new FormData();
    files.forEach((file) => {
      console.log("Uploading file:", file.name);
      formData.append("proofFiles", file);
    });

    try {
      const res = await fetch(`${ip}/upload-proof`, {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.status && Array.isArray(result.fileNames)) {
        console.log("Uploaded proof names:", result.fileNames);

        // Use the route to generate the public proofs URL once upload is successful.
        const uploadedPreviews = result.fileNames.map(
          (name) => `${ip}/proofs/${name}`
        );

        // Merge the newly uploaded file names into the proof state.
        const newProof = [...proof, ...result.fileNames];
        setProof(newProof);

        // Update proofPreviews to use the actual URLs from the proofs route.
        setProofPreviews((prev) => [...prev, ...uploadedPreviews]);
        console.log("Updated proof state:", newProof);
        handleShowNotification("Proof uploaded successfully.", "success");
      } else {
        handleShowNotification("Failed to upload proof.", "error");
      }
    } catch (error) {
      console.error("Error uploading proof:", error);
      handleShowNotification("Error uploading proof.", "error");
    }
  }

  // Reset form fields
  function resetForm() {
    setName("");
    setBreakdown([{ breakdownName: "", breakdownAmount: "" }]);
    setRecordGroupId("");
    setProof([]);
    setProofPreviews([]);
  }

  // Handle form submission: actionType is either 'draft' or 'issue'
  async function handleSubmit(e, actionType) {
    e.preventDefault();
    setErrorMsg("");

    if (actionType === "draftExit") {
      if (!name.trim()) {
        return;
      }
    }

    if (actionType === "issue") {
      // Check deposit name and source
      if (!name.trim() || !recordGroupId) {
        setErrorMsg("Deposit name and source are required.");
        return;
      }

      // Check that there's at least one complete breakdown row.
      const hasCompleteBreakdown = breakdown.some(
        (row) =>
          row.breakdownName.trim() !== "" && row.breakdownAmount.trim() !== ""
      );
      if (!hasCompleteBreakdown) {
        setErrorMsg("Please input at least one breakdown row.");
        return;
      }

      // Validate each breakdown row: if one field is filled, both must be.
      for (let i = 0; i < breakdown.length; i++) {
        const { breakdownName, breakdownAmount } = breakdown[i];
        const nameFilled = breakdownName.trim() !== "";
        const amountFilled = breakdownAmount.trim() !== "";
        if (
          (nameFilled && !amountFilled) ||
          (!nameFilled && amountFilled) ||
          (!nameFilled && !amountFilled)
        ) {
          setErrorMsg(
            "Please complete all breakdown inputs or remove incomplete rows."
          );
          return;
        }
      }

      // Check that at least one proof photo exists.
      if (proof.length === 0) {
        setErrorMsg("Please add at least one proof photo.");
        return;
      }
    } else if (actionType === "draft") {
      // For a draft, only require the deposit name.
      if (!name.trim()) {
        setErrorMsg("Deposit name is required.");
        return;
      }
    }

    // Prepare payload; if issuing, add issued_at and state "issuing"
    const payload = {
      user_data: userData,
      name,
      breakdown: JSON.stringify(breakdown),
      amount: totalAmount,
      record_group_id: recordGroupId,
      proof: JSON.stringify(proof),
    };
    if (actionType === "issue") {
      payload.status = "Issued";
    } else {
      payload.status = "Draft";
    }
    try {
      if (actionType === "issue") {
        setIssuingState(true);
      } else {
        setDraftingState(true);
      }

      const res = await fetch(`${ip}/create-deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.status) {
        handleShowNotification(
          actionType === "issue"
            ? "Deposit issued successfully."
            : "Draft deposit saved successfully.",
          "success"
        );
        if (refreshData) refreshData();
        resetForm();
        onClose();
      } else {
        handleShowNotification(result.error || "Deposit save failed.", "error");
      }
    } catch (error) {
      console.error("Error saving deposit:", error);
      handleShowNotification("Deposit save failed due to an error.", "error");
    } finally {
      setIssuingState(false);
      setDraftingState(false);
    }
  }

  async function deleteProof(filename) {
    try {
      const response = await fetch(`${ip}/delete-proof`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filename }),
      });
      const result = await response.json();
      if (result.status) {
        handleShowNotification("Photo deleted successfully.", "success");
        // Remove the deleted file from both proof and proofPreviews arrays
        const updatedProof = proof.filter((name) => name !== filename);
        const updatedPreviews = proofPreviews.filter(
          (url) => !url.includes(filename)
        );
        setProof(updatedProof);
        setProofPreviews(updatedPreviews);
        console.log("Updated proofPreviews:", updatedPreviews);
        // If the deleted image is currently open in the lightbox, close it
        if (selectedProof && selectedProof.includes(filename)) {
          closeLightbox();
        }
        // Updisplay the updated previews by scrolling to the top of the preview container
        const previewContainer = document.querySelector(
          ".flex.flex-wrap, .preview-container"
        );
        if (previewContainer) {
          previewContainer.scrollTop = 0;
        }
      } else {
        handleShowNotification("Deletion failed.", "error");
      }
    } catch (error) {
      console.error("Error deleting proof:", error);
      handleShowNotification("Error deleting photo.", "error");
    }
  }

  // onClose handler: automatically save draft when user exits modal
  function handleClose(e) {
    // If no event is passed (e.g. when closing via header), create a dummy event.
    const event = e || { preventDefault: () => {} };
    if (name.trim()) {
      handleSubmit(event, "draftExit");
    } else {
      onClose();
    }
  }

  // Open lightbox with clicked preview
  const openLightbox = (url) => {
    setSelectedProof(url);
    setZoomLevel(1);
  };

  // Close lightbox overlay
  const closeLightbox = () => {
    setSelectedProof(null);
    setZoomLevel(1);
  };

  // Mouse event handlers for panning
  const handleMouseDown = (e) => {
    if (zoomLevel <= 1) return; // no panning if not zoomed in
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (
      !dragStart ||
      !lightboxContainerRef.current ||
      !lightboxImageRef.current
    )
      return;
    const container = lightboxContainerRef.current;
    const image = lightboxImageRef.current;
    // Calculate new potential pan offsets
    let newPan = {
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    };
    // Get container dimensions
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    // Get image dimensions (base size) and scale them
    const imageWidth = image.clientWidth * zoomLevel;
    const imageHeight = image.clientHeight * zoomLevel;
    // Compute max allowed offset so that the image border does not go outside container
    const maxPanX = Math.max(0, (imageWidth - containerWidth) / 2);
    const maxPanY = Math.max(0, (imageHeight - containerHeight) / 2);
    // Clamp newPan accordingly
    newPan.x = clamp(newPan.x, -maxPanX, maxPanX);
    newPan.y = clamp(newPan.y, -maxPanY, maxPanY);
    setPan(newPan);
  };

  const handleMouseUp = () => {
    setDragStart(null);
  };

  // Touch event handlers for mobile panning
  const handleTouchStart = (e) => {
    if (zoomLevel <= 1) return;
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
  };

  const handleTouchMove = (e) => {
    if (
      !dragStart ||
      !lightboxContainerRef.current ||
      !lightboxImageRef.current
    )
      return;
    const touch = e.touches[0];
    const container = lightboxContainerRef.current;
    const image = lightboxImageRef.current;
    let newPan = {
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    };
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const imageWidth = image.clientWidth * zoomLevel;
    const imageHeight = image.clientHeight * zoomLevel;
    const maxPanX = Math.max(0, (imageWidth - containerWidth) / 2);
    const maxPanY = Math.max(0, (imageHeight - containerHeight) / 2);
    newPan.x = clamp(newPan.x, -maxPanX, maxPanX);
    newPan.y = clamp(newPan.y, -maxPanY, maxPanY);
    setPan(newPan);
  };

  const handleTouchEnd = () => {
    setDragStart(null);
  };

  if (!isOpen) return null;
  return (
    <>
      <Modal
        title="CREATE DEPOSIT"
        isOpen={isOpen}
        onClose={(e) => {
          handleClose(e);
        }}
        w={`${
          !isDraft
            ? "w-11/12 h-11/12 md:h-6/7 md:w-4/7 lg:w-3/7 xl:w-3/7"
            : "w-11/12 h-1/3 md:h-2/7 md:w-3/7 lg:w-2/7 xl:w-2/7"
        }`}
        modalCenter={isDraft}
      >
        {loading ? (
          <div className="p-4 h-full w-full flex items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : !isDraft ? (
          <>
            <form
              onSubmit={(e) => handleSubmit(e, "issue")}
              className="sm:p-2 md:p-6 py-4 h-full w-full"
            >
              <div className="space-y-8 h-9/10 overflow-y-auto">
                <div>
                  <label className="block text-sm font-semibold">
                    Deposit Name
                  </label>
                  <Input
                    ref={nameRef}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter deposit name"
                    className="rounded-md border border-black h-7 sm:h-8 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold">Source</label>
                  <select
                    value={recordGroupId}
                    onChange={(e) => setRecordGroupId(e.target.value)}
                    className="rounded-md border border-black h-7 sm:h-8 w-full p-1"
                  >
                    <option value="">Select Source</option>
                    {recordGroups.map((rg) => (
                      <option key={rg.id} value={rg.id}>
                        {rg.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold">
                    Breakdown
                  </label>
                  <div className="border rounded-lg">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-lime-400 border-b text-sm sm:text-base">
                          <th className="text-left p-1 px-2 w-3/5 rounded-tl-lg">
                            Name
                          </th>
                          <th className="text-left p-1 px-2 w-2/5 rounded-tr-lg">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {breakdown.map((row, index) => (
                          <tr
                            key={index}
                            className="border-b text-xs sm:text-sm"
                          >
                            <td className="p-1">
                              <Input
                                type="text"
                                value={row.breakdownName}
                                onChange={(e) =>
                                  updateBreakdownRow(
                                    index,
                                    "breakdownName",
                                    e.target.value
                                  )
                                }
                                placeholder="Item name"
                                className="w-full"
                              />
                            </td>
                            <td className="p-1">
                              <Input
                                type="number"
                                value={row.breakdownAmount}
                                onChange={(e) =>
                                  updateBreakdownRow(
                                    index,
                                    "breakdownAmount",
                                    e.target.value
                                  )
                                }
                                placeholder="Amount"
                                className="w-full"
                                step="0.01"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="text-[14px] font-semibold border-b">
                          <th className="text-left p-1 px-2">Total Amount</th>
                          <th className="text-left p-1 px-2">
                            ₱ {totalAmount.toFixed(2)}
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                    <Button
                      type="button"
                      onClick={addBreakdownRow}
                      className="transition-all duration-150 transform hover:scale-105 m-2 bg-blue-600 text-white px-3 py-1 rounded text-sm cursor-pointer"
                    >
                      Add Row
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold">
                    Upload Proof(s)
                  </label>
                  <div className="flex flex-wrap gap-4 mx-0.5">
                    {proofPreviews.map((url, idx) => {
                      const filename = proof[idx] || url.split("/").pop();
                      return (
                        <div key={idx} className="relative inline-block">
                          <img
                            src={url}
                            alt="Proof preview"
                            className="transition-all duration-150 transform hover:scale-105 w-20 h-20 object-cover rounded cursor-pointer border-2"
                            onClick={() => openLightbox(url)}
                          />
                          <Button
                            type="button"
                            className="transition-all duration-150 transform hover:scale-105 absolute top-0 right-0 m-0.5 bg-red-600 text-white px-1 py-0 text-xs rounded-xs"
                            onClick={() => deleteProof(filename)}
                          >
                            X
                          </Button>
                        </div>
                      );
                    })}
                    {isMobile ? (
                      <>
                        <div className="relative inline-block">
                          <Button
                            type="button"
                            onClick={() => cameraInputRef.current.click()}
                            className="transition-all duration-150 transform hover:scale-105 w-20 h-20 flex flex-col items-center justify-center bg-blue-600 text-white rounded cursor-pointer"
                          >
                            <img
                              src={icons["src/assets/photo.svg"]}
                              alt="icon"
                              className="w-10 h-10 mt-1"
                            />
                            <p className="text-xs mt-1">Take Photo</p>
                          </Button>
                        </div>
                        <div className="relative inline-block">
                          <Button
                            type="button"
                            onClick={() => galleryInputRef.current.click()}
                            className="transition-all duration-150 transform hover:scale-105 w-20 h-20 flex flex-col items-center justify-center bg-gray-600 text-white rounded cursor-pointer"
                          >
                            <img
                              src={icons["src/assets/gallery.svg"]}
                              alt="icon"
                              className="w-12 h-12"
                            />
                            <p className="text-xs">Open Gallery</p>
                          </Button>
                        </div>
                        {/* hidden input for camera */}
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          multiple
                          ref={cameraInputRef}
                          onChange={handleProofUpload}
                          style={{ display: "none" }}
                        />

                        {/* hidden input for gallery */}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          ref={galleryInputRef}
                          onChange={handleProofUpload}
                          style={{ display: "none" }}
                        />
                      </>
                    ) : (
                      <div className="relative inline-block">
                        <div className="relative inline-block">
                          <Button
                            type="button"
                            onClick={() => galleryInputRef.current.click()}
                            className="transition-all duration-150 transform hover:scale-105 w-20 h-20 flex flex-col items-center justify-center bg-gray-600 text-white rounded cursor-pointer"
                          >
                            <img
                              src={icons["src/assets/gallery.svg"]}
                              alt="icon"
                              className="w-12 h-12"
                            />
                            <p className="text-xs">Select Photo</p>
                          </Button>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          ref={galleryInputRef}
                          onChange={handleProofUpload}
                          style={{ display: "none" }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {errorMsg && (
                  <p ref={errorRef} className="text-red-600 text-sm">
                    {errorMsg}
                  </p>
                )}
              </div>
              <div className="flex justify-end items-center space-x-4 mt-4 h-1/10">
                <Button
                  type="button"
                  onClick={(e) => handleSubmit(e, "draft")}
                  className="transform hover:scale-105 bg-yellow-600 text-white px-4 py-2 rounded cursor-pointer transition-all duration-150 hover:bg-yellow-700 text-sm sm:text-base"
                  disabled={draftingState || issuingState}
                >
                  {draftingState ? "Saving Draft..." : "Save as Draft"}
                </Button>
                <Button
                  type="submit"
                  className="transform hover:scale-105 bg-green-600 text-white px-4 py-2 rounded cursor-pointer transition-all duration-150 hover:bg-green-800 text-sm sm:text-base"
                  disabled={issuingState || draftingState}
                >
                  {issuingState ? "Issuing Deposit..." : "Issue Deposit"}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <div className="p-4 h-9/10 w-full flex items-center justify-center">
            <p>
              You have a draft deposit. To create a new deposit, either issued
              the draft deposit or delete it.
            </p>
          </div>
        )}
      </Modal>
      {/* Lightbox overlay */}
      {selectedProof && (
        // Use Modal component for the lightbox overlay
        <Modal
          isOpen={true}
          onClose={closeLightbox}
          w={"w-11/12 h-11/12 md:h-6/7 md:w-4/7 lg:w-3/7 xl:w-3/7"}
          modalCenter={false}
          title="IMAGE PREVIEW"
        >
          <div
            ref={lightboxContainerRef}
            className="h-full w-full relative cursor-move select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="p-2 md:p-5 w-full h-9/10 flex items-center justify-center overflow-hidden">
              <img
                ref={lightboxImageRef}
                src={selectedProof}
                alt="Enlarged proof"
                style={{
                  transform: `scale(${zoomLevel}) translate(${pan.x}px, ${pan.y}px)`,
                  transition: dragStart ? "none" : "transform 0.2s",
                }}
                className="place-center max-w-full max-h-full object-contain border-2 border-gray-300 rounded-lg"
              />
            </div>
            {/* Show zoom slider only on non-mobile */}
            {!isMobile && (
              <div className="h-1/10 p-2 flex items-center justify-center bg-black bg-opacity-50">
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.01"
                  value={zoomLevel}
                  onChange={(e) => {
                    const newZoom = Number(e.target.value);
                    // Adjust pan so that the current center stays fixed:
                    // newPan = currentPan * (oldZoom / newZoom)
                    const adjustedPan = {
                      x: pan.x * (zoomLevel / newZoom),
                      y: pan.y * (zoomLevel / newZoom),
                    };
                    setZoomLevel(newZoom);
                    setPan(adjustedPan);
                  }}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}

CreateDepositModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refreshData: PropTypes.func,
};
