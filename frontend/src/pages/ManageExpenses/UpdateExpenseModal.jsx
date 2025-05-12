import { useState, useEffect, useContext, useRef } from "react";
import Modal from "../../components/ui/modal";
import PropTypes from "prop-types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { IpContext } from "../../context/IpContext";
import { icons } from "../../assets/icons";
import LightboxModal from "../../components/ui/lightboxmodal";

export default function UpdateExpenseModal({
  isOpen,
  id,
  onClose,
  refreshData, // function to refresh parent data after update
}) {
  // New states for deposit update
  const [name, setName] = useState("");
  const [recordGroupId, setRecordGroupId] = useState("");
  const [breakdown, setBreakdown] = useState([
    { breakdownName: "", breakdownAmount: "" },
  ]);
  const [proof, setProof] = useState([]);
  const [originalProof, setOriginalProof] = useState([]);
  const [deletedProofs, setDeletedProofs] = useState([]);
  const [proofPreviews, setProofPreviews] = useState([]);
  const [uploadingProofs, setUploadingProofs] = useState([]);
  const [recordGroups, setRecordGroups] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [showLightBox, setShowLightBox] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [selectedProof, setSelectedProof] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const ip = useContext(IpContext);
  // Refs for inputs and error message
  const nameRef = useRef(null);
  const errorRef = useRef(null);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  // Compute total deposit amount from breakdown rows
  const totalAmount = breakdown.reduce((acc, row) => {
    const amt = parseFloat(row.breakdownAmount);
    return acc + (isNaN(amt) ? 0 : amt);
  }, 0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch deposit details and record group options when modal opens
  useEffect(() => {
    if (isOpen && id) {
      setLoading(true);
      (async () => {
        try {
          const response = await fetch(`${ip}/fetch-deposit-details`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });
          const result = await response.json();
          if (result.status && result.data) {
            const data = result.data;
            setName(data.name || "");
            setRecordGroupId(data.record_group_id || "");
            try {
              setBreakdown(JSON.parse(data.breakdown));
            } catch {
              setBreakdown([{ breakdownName: "", breakdownAmount: "" }]);
            }
            try {
              const proofs = JSON.parse(data.proof);
              setProof(proofs);
              setOriginalProof(proofs);
              const previews = proofs.map((fname) => `${ip}/proofs/${fname}`);
              setProofPreviews(previews);
            } catch {
              setProof([]);
              setProofPreviews([]);
              setOriginalProof([]);
            }
          }
        } catch (error) {
          console.error("Error fetching deposit details:", error);
        } finally {
          setLoading(false);
        }
      })();
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
          console.error("Error fetching record groups:", error);
        }
      })();
    }
  }, [isOpen, id, ip]);

  // Add a new breakdown row
  function addBreakdownRow() {
    setBreakdown((prev) => [
      ...prev,
      { breakdownName: "", breakdownAmount: "" },
    ]);
  }

  // Update a breakdown row
  function updateBreakdownRow(index, field, value) {
    setBreakdown((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  }

  // Handle proof upload
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

  // Handle proof deletion
  function deleteProof(filename) {
    // Remove from current lists...
    setProof((prev) => prev.filter((name) => name !== filename));
    setProofPreviews((prev) => prev.filter((url) => !url.includes(filename)));
    // Mark this proof to be deleted on update.
    setDeletedProofs((prev) => [...prev, filename]);
  }

  async function handleCancel() {
    // Identify new proofs that were uploaded during this session.
    const newProofs = proof.filter((fname) => !originalProof.includes(fname));
    if (newProofs.length > 0) {
      try {
        await Promise.all(
          newProofs.map((filename) =>
            fetch(`${ip}/delete-proof`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ filename }),
            })
          )
        );
      } catch (error) {
        console.error("Error deleting newly uploaded proofs on cancel:", error);
      }
    }
    // Restore proof state to the originally loaded proofs.
    setProof(originalProof);
    setProofPreviews(originalProof.map((fname) => `${ip}/proofs/${fname}`));
    setDeletedProofs([]); // Clear any marked for deletion
    onClose();
  }

  // Submit updated deposit details
  async function handleUpdateDeposit(e) {
    e.preventDefault();
    setErrorMsg("");
    if (!name.trim() || !recordGroupId) {
      setErrorMsg("Deposit name and source are required.");
      return;
    }
    // Validate that there is at least one complete breakdown row
    const hasCompleteBreakdown = breakdown.some(
      (row) =>
        row.breakdownName.trim() !== "" && row.breakdownAmount.trim() !== ""
    );
    if (!hasCompleteBreakdown) {
      setErrorMsg("Please input at least one breakdown row.");
      return;
    }
    // Validate each breakdown row
    for (let i = 0; i < breakdown.length; i++) {
      const { breakdownName, breakdownAmount } = breakdown[i];
      const nameFilled = breakdownName.trim() !== "";
      const amountFilled = breakdownAmount.trim() !== "";
      if ((nameFilled && !amountFilled) || (!nameFilled && amountFilled)) {
        setErrorMsg(
          "Please complete all breakdown inputs or remove incomplete rows."
        );
        return;
      }
    }
    // Optionally, require at least one proof photo
    if (proof.length === 0) {
      setErrorMsg("Please add at least one proof photo.");
      return;
    }
    const payload = {
      id: id,
      name: name,
      breakdown: JSON.stringify(breakdown),
      amount: totalAmount,
      record_group_id: recordGroupId,
      proof: JSON.stringify(proof),
      status: "Issued",
      mode: "Update",
    };
    try {
      setUpdating(true);
      if (deletedProofs.length > 0) {
        await Promise.all(
          deletedProofs.map((filename) =>
            fetch(`${ip}/delete-proof`, {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ filename }),
            })
          )
        );
      }
      const res = await fetch(`${ip}/update-deposit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.status) {
        if (refreshData) refreshData();
        onClose();
      } else {
        setErrorMsg(result.error || "Deposit update failed.");
      }
    } catch (error) {
      console.error("Error updating deposit:", error);
      setErrorMsg("Deposit update failed due to an error.");
    } finally {
      setUpdating(false);
    }
  }

  const openLightbox = (url) => {
    setSelectedProof(url);
  };

  // Close lightbox overlay
  const closeLightbox = () => {
    setSelectedProof(null);
    setShowLightBox(false);
  };

  if (!isOpen) return null;
  return (
    <div>
      <Modal
        title="UPDATE DEPOSIT"
        isOpen={isOpen}
        onClose={handleCancel}
        w="w-11/12 h-11/12 md:h-6/7 md:w-4/7 lg:w-3/7 xl:w-3/7"
      >
        {loading ? (
          <div className="p-4 h-full w-full flex items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : (
          <form
            onSubmit={handleUpdateDeposit}
            className="p-4 md:p-6 h-full w-full"
          >
            <div className="space-y-5 h-9/10 overflow-y-auto">
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
                  className="rounded-md border border-black h-8 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">Source</label>
                <select
                  className="w-full border rounded px-2 py-1 h-8"
                  value={recordGroupId}
                  onChange={(e) => setRecordGroupId(e.target.value)}
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
                <label className="block text-sm font-semibold">Breakdown</label>
                <div className="border rounded-lg">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-lime-400 border-b text-sm">
                        <th className="text-left p-1 px-2 w-3/5">Name</th>
                        <th className="text-left p-1 px-2 w-2/5">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {breakdown.map((row, index) => (
                        <tr key={index} className="border-b text-xs">
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
                      <tr className="font-semibold border-t">
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
                    className="m-2 bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Add Row
                  </Button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold">
                  Upload Proof(s)
                </label>
                <div className="flex flex-wrap gap-4">
                  {proofPreviews.map((url, idx) => {
                    const filename = proof[idx] || url.split("/").pop();
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
                        <Button
                          type="button"
                          className="absolute top-0 right-0 m-0.5 bg-red-600 text-white px-1 py-0 text-xs"
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
                      <p className="mt-2 text-xs text-gray-700">Uploading...</p>
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
            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
                disabled={updating}
              >
                {updating ? "Updating Deposit..." : "Update Deposit"}
              </Button>
            </div>
          </form>
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
    </div>
  );
}

UpdateExpenseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  refreshData: PropTypes.func,
};
