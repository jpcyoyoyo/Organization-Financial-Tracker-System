import { useState, useEffect, useContext, useRef, useCallback } from "react";
import Modal from "../../components/ui/modal";
import PropTypes from "prop-types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useOutletContext } from "react-router-dom";
import { IpContext } from "../../context/IpContext";
import { icons } from "../../assets/icons";
import LightboxModal from "../../components/ui/lightboxmodal";

export default function ViewManageDepositModal({
  isOpen,
  onClose,
  onGoBack,
  rowData,
  id,
  updateModal: UpdateModal,
  deleteModal: DeleteModal,
  refreshData,
}) {
  const [name, setName] = useState("");
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [breakdown, setBreakdown] = useState([
    { breakdownName: "", breakdownAmount: "" },
  ]);
  const [recordGroupId, setRecordGroupId] = useState("");
  const [proof, setProof] = useState([]);
  const [proofPreviews, setProofPreviews] = useState([]);
  const [uploadingProofs, setUploadingProofs] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showLightBox, setShowLightBox] = useState(false);
  const [issuingState, setIssuingState] = useState(false);
  const [draftingState, setDraftingState] = useState(false);
  const [selectedProof, setSelectedProof] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const ip = useContext(IpContext);
  const { handleShowNotification } = useOutletContext();
  const nameRef = useRef(null);
  const errorRef = useRef(null);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Fetch available record groups for deposit
  const [recordGroups, setRecordGroups] = useState([]);

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
      (async () => {
        if (!id) return;
        setLoading(true);
        try {
          const response = await fetch(`${ip}/fetch-deposit-details`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });
          if (!response.ok) throw new Error("Failed to fetch expense details");
          const result = await response.json();
          if (result.status && result.data) {
            const data = result.data;
            setDetails(data);
            if (data.status === "Draft") {
              setIsDraft(true);
              setName(data.name);
              setRecordGroupId(data.record_group_id);
              setBreakdown(JSON.parse(data.breakdown));
              setProof(JSON.parse(data.proof));
              const previews = JSON.parse(data.proof).map(
                (fname) => `${ip}/proofs/${fname}`
              );
              setProofPreviews(previews);
            } else {
              setProof(JSON.parse(data.proof));
              const previews = JSON.parse(data.proof).map(
                (fname) => `${ip}/proofs/${fname}`
              );
              setProofPreviews(previews);
              setIsDraft(false);
            }
          }
        } catch (error) {
          console.error("Error fetching expense details:", error);
        } finally {
          setLoading(false);
        }
      })();

      // Fetch record group options
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
  }, [isOpen, ip, id]);

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

  const removeBreakdownRow = (index) => {
    setBreakdown((prev) => {
      // At least one row remains
      if (prev.length === 1) return prev;
      return prev.filter((_, i) => i !== index);
    });
  };

  // Handle file input change – generate previews and upload files to server
  async function handleProofUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    for (const file of files) {
      const uploadingID = `${Date.now()}-${file.name}`;
      // Add an ID to track this uploading photo.
      setUploadingProofs((prev) => [...prev, uploadingID]);
      const formData = new FormData();
      formData.append("proofFiles", file);
      try {
        const res = await fetch(`${ip}/upload-proof`, {
          method: "POST",
          body: formData,
        });
        const result = await res.json();
        if (
          result.status &&
          Array.isArray(result.fileNames) &&
          result.fileNames.length > 0
        ) {
          const fname = result.fileNames[0]; // assuming one file per upload call
          const previewUrl = `${ip}/proofs/${fname}`;
          setProof((prev) => [...prev, fname]);
          setProofPreviews((prev) => [...prev, previewUrl]);
        }
      } catch (error) {
        console.error("Error uploading proof:", error);
      } finally {
        // Remove the uploading indicator for this file.
        setUploadingProofs((prev) => prev.filter((id) => id !== uploadingID));
      }
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
      id: id,
      name,
      breakdown: JSON.stringify(breakdown),
      amount: totalAmount,
      record_group_id: recordGroupId,
      proof: JSON.stringify(proof),
      mode: "editDraft",
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

      const res = await fetch(`${ip}/update-deposit`, {
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

        if (actionType !== "draftExit") {
          onClose();
        }
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
      onClose();
    } else {
      onClose();
    }
  }

  const handleDeleteDraft = () => {
    // If deposit is a draft, simply close the view modal without saving the draft.
    onClose();
    // Wait a moment then show the delete modal.
    setTimeout(() => {
      setShowDelete(true);
    }, 300);
  };

  // Open lightbox with clicked preview
  const openLightbox = (url) => {
    setSelectedProof(url);
  };

  // Close lightbox overlay
  const closeLightbox = () => {
    setSelectedProof(null);
    setShowLightBox(false);
    onGoBack();
  };

  const viewModalTitle = useCallback(() => {
    if (isDraft) {
      return "EDIT DRAFT DEPOSIT";
    } else if (!isDraft) {
      return "VIEW ISSUED DEPOSIT";
    } else {
      return "LOADING";
    }
  }, [isDraft]);

  return (
    <>
      <Modal
        title={viewModalTitle()}
        isOpen={isOpen}
        onClose={(e) => {
          handleClose(e);
        }}
        w={`${
          isDraft
            ? "w-11/12 h-11/12 md:h-6/7 md:w-4/7 lg:w-3/7 xl:w-3/7"
            : "w-11/12 h-11/12 md:h-6/7 md:w-6/7 xl:w-5/7"
        }`}
      >
        {loading ? (
          <div className="p-4 h-full w-full flex items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : isDraft ? (
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
                          <th className="text-left p-1 px-2 w-2/5">Amount</th>
                          <th className="text-left p-1 px-2 w-1/5 rounded-tr-lg ">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {breakdown.map((row, index) => (
                          <tr
                            key={index}
                            className="border-b text-xs sm:text-sm h-8.5"
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
                            <td className="p-1 text-center">
                              {breakdown.length > 1 && (
                                <Button
                                  type="button"
                                  onClick={() => removeBreakdownRow(index)}
                                  className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                >
                                  {isMobile ? (
                                    <img
                                      src={icons["src/assets/delete.svg"]}
                                      alt="Remove row"
                                      className="transition-all duration-150 transform hover:scale-105 w-4 h-4 object-cover rounded cursor-pointer"
                                    />
                                  ) : (
                                    <p>Remove</p>
                                  )}
                                </Button>
                              )}
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
                            onClick={() => {
                              openLightbox(url);
                              setShowLightBox(true);
                            }}
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
                    {uploadingProofs.map((id) => (
                      <div
                        key={id}
                        className="flex flex-col w-20 h-20 bg-gray-200 rounded items-center justify-center border-2 border-dashed"
                      >
                        <div className="mt-2 animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                        <p className="mt-2 text-xs text-gray-700">
                          Uploading...
                        </p>
                      </div>
                    ))}
                    {isMobile ? (
                      <>
                        <div className="relative inline-block">
                          <Button
                            type="button"
                            onClick={() => {
                              if (
                                !name.trim() ||
                                !recordGroupId ||
                                breakdown.every(
                                  (row) =>
                                    row.breakdownName.trim() === "" &&
                                    row.breakdownAmount.trim() === ""
                                )
                              ) {
                                setErrorMsg(
                                  "Please fill in deposit name, source, and at least one breakdown row before uploading proofs."
                                );
                              } else {
                                // Clear any previous error and trigger camera input.
                                setErrorMsg("");
                                cameraInputRef.current.click();
                              }
                            }}
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
                            onClick={() => {
                              if (
                                !name.trim() ||
                                !recordGroupId ||
                                breakdown.every(
                                  (row) =>
                                    row.breakdownName.trim() === "" &&
                                    row.breakdownAmount.trim() === ""
                                )
                              ) {
                                setErrorMsg(
                                  "Please fill in deposit name, source, and at least one breakdown row before uploading proofs."
                                );
                              } else {
                                // Clear any previous error and trigger camera input.
                                setErrorMsg("");
                                galleryInputRef.current.click();
                              }
                            }}
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
                            onClick={() => {
                              if (
                                !name.trim() ||
                                !recordGroupId ||
                                breakdown.every(
                                  (row) =>
                                    row.breakdownName.trim() === "" &&
                                    row.breakdownAmount.trim() === ""
                                )
                              ) {
                                setErrorMsg(
                                  "Please fill in deposit name, source, and at least one breakdown row before uploading proofs."
                                );
                              } else {
                                // Clear any previous error and trigger camera input.
                                setErrorMsg("");
                                galleryInputRef.current.click();
                              }
                            }}
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
              <div className="flex justify-end items-center space-x-2 mt-4 h-1/10">
                <Button
                  type="button"
                  onClick={(e) => handleSubmit(e, "draft")}
                  className="transform hover:scale-105 bg-yellow-600 text-white px-4 py-2 rounded cursor-pointer transition-all duration-150 hover:bg-yellow-700 text-xs sm:text-sm md:text-base"
                  disabled={draftingState || issuingState}
                >
                  {draftingState ? "Saving Draft..." : "Save as Draft"}
                </Button>
                <Button
                  type="submit"
                  className="transform hover:scale-105 bg-green-600 text-white px-4 py-2 rounded cursor-pointer transition-all duration-150 hover:bg-green-800 text-xs sm:text-sm md:text-base"
                  disabled={issuingState || draftingState}
                >
                  {issuingState ? "Issuing Deposit..." : "Issue Deposit"}
                </Button>
                {DeleteModal && (
                  <Button
                    type="button"
                    onClick={handleDeleteDraft}
                    className="bg-red-600 hover:bg-red-800 text-xs sm:text-sm md:text-base text-white px-4 py-2 rounded cursor-pointer transition-all duration-150 transform hover:scale-105 flex items-center"
                  >
                    <span>Delete</span>
                  </Button>
                )}
              </div>
            </form>
          </>
        ) : details ? (
          // Read-only details view for issued deposit
          <div className="sm:p-2 md:p-6h-full h-full w-full">
            <div className="h-9/10">
              <div className="overflow-y-auto bg-[#c7ff882f] border rounded-lg w-full h-full">
                <div className="flex flex-col md:flex-row bg-lime-500 p-2">
                  <label className="text-base block font-semibold">
                    Deposit Name
                  </label>
                  <h1 className="hidden md:flex font-semibold">{":"}</h1>
                  <div className="md:pl-1 text-sm md:text-base">
                    {details && details.name}
                  </div>
                </div>
                <div className="overflow-y-auto flex flex-col md:flex-row-reverse md:h-[calc(100%-40px)]">
                  <div className="px-2 sm:p-4 py-2 border-t md:w-3/5 h-full">
                    <label className="text-sm block font-semibold">
                      Breakdown
                    </label>
                    <div className="border rounded-md">
                      {details && details.breakdown && (
                        <table className="w-full border-collapse">
                          <thead className="block w-full bg-lime-400 text-sm border-b">
                            <tr className="flex w-full">
                              <th className="w-2/3 text-left p-1 rounded-tl-md">
                                Name
                              </th>
                              <th className="w-1/3 text-left p-1 rounded-tr-md">
                                Amount
                              </th>
                            </tr>
                          </thead>
                          <tbody className="block w-full max-h-38 md:max-h-94 overflow-y-auto">
                            {JSON.parse(details.breakdown).map((row, idx) => (
                              <tr
                                key={idx}
                                className="flex w-full text-xs md:text-sm border-b h-8.5"
                              >
                                <td className="w-2/3 p-1">
                                  {row.breakdownName}
                                </td>
                                <td className="w-1/3 p-1">
                                  ₱ {row.breakdownAmount}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot className="block w-full">
                            <tr className="flex w-full text-[14px] md:text-sm font-semibold">
                              <th className="w-2/3 text-left p-1">
                                Total Amount
                              </th>
                              <th className="w-1/3 text-left p-1">
                                ₱ {details.amount}
                              </th>
                            </tr>
                          </tfoot>
                        </table>
                      )}
                    </div>
                  </div>

                  <div className="mt-2 md:mt-0 md:w-2/5 h-full border-t md:border-r text-sm px-2 sm:p-4 py-2 grid md:flex md:flex-col grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 overflow-y-auto">
                    <div>
                      <label className="block font-semibold">Source</label>
                      <div>{details.source_name}</div>
                    </div>
                    <div>
                      <label className="flex font-semibold">Date Issued</label>
                      <div>{details.issued_at}</div>
                    </div>

                    <div className="sm:col-span-2 md:col-span-1">
                      <label className="block font-semibold">Proof(s):</label>
                      <div className="flex flex-wrap gap-4">
                        {proofPreviews.map((url, idx) => {
                          return (
                            <div key={idx} className="relative inline-block">
                              <img
                                src={url}
                                alt="Proof preview"
                                className="w-20 h-20 object-cover rounded cursor-pointer border-2"
                                onClick={() => {
                                  openLightbox(url);
                                  setShowLightBox(true);
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold">
                        Date Created
                      </label>
                      <div>{details.created_at}</div>
                    </div>
                    <div>
                      <label className="block font-semibold">
                        Date Updated
                      </label>
                      <div>{details.updated_at}</div>
                    </div>
                    <div>
                      <label className="block font-semibold">Issued By</label>
                      <div className="text-base font-semibold">
                        {details.treasurer_full_name}
                      </div>
                      <p className="text-sm">Treasurer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-2 sm:space-x-4 h-1/10">
              {UpdateModal && (
                <Button
                  onClick={() => {
                    onClose();
                    setTimeout(() => {
                      setShowUpdate(true);
                    }, 300);
                  }}
                  className="bg-blue-600 text-sm md:text-base text-white px-4 py-2 rounded cursor-pointer transition-all duration-150 hover:bg-blue-800 transform hover:scale-105 flex items-center h-8"
                >
                  <span>Edit</span>
                </Button>
              )}
              {DeleteModal && (
                <Button
                  onClick={() => {
                    onClose();
                    setTimeout(() => {
                      setShowDelete(true);
                    }, 300);
                  }}
                  className="bg-red-600 hover:bg-red-800 text-sm md:text-base text-white px-4 py-2 rounded cursor-pointer transition-all duration-150 transform hover:scale-105 flex items-center h-8"
                >
                  <span>Delete</span>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <p className="p-10">No details available.</p>
        )}
      </Modal>
      {selectedProof && showLightBox && (
        <LightboxModal
          isOpen={showLightBox}
          onClose={closeLightbox}
          selectedProof={selectedProof}
          isMobile={isMobile}
        />
      )}
      {UpdateModal && showUpdate && (
        <UpdateModal
          isOpen={showUpdate}
          onClose={() => {
            setShowUpdate(false);
            onGoBack();
          }}
          rowData={rowData}
          id={id}
          refreshData={refreshData}
        />
      )}

      {DeleteModal && showDelete && (
        <DeleteModal
          isOpen={showDelete}
          onClose={() => {
            setShowDelete(false);
          }}
          onGoBack={() => {
            setShowDelete(false);
            onGoBack();
          }}
          id={id}
          rowData={rowData}
          refreshData={refreshData}
        />
      )}
    </>
  );
}

ViewManageDepositModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onGoBack: PropTypes.func,
  rowData: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  updateModal: PropTypes.elementType,
  deleteModal: PropTypes.elementType,
  refreshData: PropTypes.func,
};
