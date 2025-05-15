import { useState, useEffect, useContext, useRef, useCallback } from "react";
import Modal from "../../components/ui/modal";
import PropTypes from "prop-types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { IpContext } from "../../context/IpContext";
import { icons } from "../../assets/icons";
import LightboxModal from "../../components/ui/lightboxmodal";
import AddReceiptModal from "../Receipts/AddReceiptModal";
import ViewReceiptModal from "../Receipts/ViewReceiptModal";
import UpdateReceiptModal from "../Receipts/UpdateReceiptModal";

export default function UpdateExpenseModal({
  isOpen,
  id,
  onClose,
  refreshData, // function to refresh parent data after update
}) {
  // New states for deposit update
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [expenseGroups, setExpenseGroups] = useState([
    { groupName: "", rows: [{ itemName: "", quantity: "", cost: "" }] },
  ]);
  const [recordGroupId, setRecordGroupId] = useState("");
  const [budgetId, setBudgetId] = useState("");
  const [proof, setProof] = useState([]);
  const [originalProof, setOriginalProof] = useState([]);
  const [deletedProofs, setDeletedProofs] = useState([]);
  const [proofPreviews, setProofPreviews] = useState([]);
  const [showLightBox, setShowLightBox] = useState(false);
  const [uploadingProofs, setUploadingProofs] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [selectedProof, setSelectedProof] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [originalReceiptIDs, setOriginalReceiptIDs] = useState([]);
  const [originalReceiptPreviews, setOriginalReceiptPreviews] = useState([]);
  const [newReceipts, setNewReceipts] = useState([]); // IDs of receipts added in this session
  const [deletedReceipts, setDeletedReceipts] = useState([]); // IDs of originally loaded receipts that were removed

  const ip = useContext(IpContext);
  const nameRef = useRef(null);
  const errorRef = useRef(null);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const keyLockRef = useRef(false);

  // Fetch available record groups for expense
  const [recordGroups, setRecordGroups] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const userData = sessionStorage.getItem("user");

  const [receiptIDs, setReceiptIDs] = useState([]);
  const [receiptPreviews, setReceiptPreviews] = useState([]);
  const [showAddReceiptModal, setShowAddReceiptModal] = useState(false);

  const [showViewReceiptModal, setShowViewReceiptModal] = useState(false);
  const [viewReceiptID, setViewReceiptID] = useState(null);

  // ----- Add these new state declarations (near your other state declarations) -----
  const [showUpdateReceiptModal, setShowUpdateReceiptModal] = useState(false);
  const [updateReceiptID, setUpdateReceiptID] = useState(null);

  const [viewReceiptRefreshKey, setViewReceiptRefreshKey] = useState(
    Date.now()
  );

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

  // Fetch expense details and record group options when modal opens
  useEffect(() => {
    if (isOpen && id) {
      setLoading(true);
      (async () => {
        try {
          const response = await fetch(`${ip}/fetch-expense-details`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });
          const result = await response.json();
          if (result.status && result.data) {
            const data = result.data;
            setName(data.name);
            setRecordGroupId(data.record_group_id);
            setExpenseGroups(JSON.parse(data.breakdown));
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

            const fetchedReceiptIDs = JSON.parse(data.receipt_ids);
            setReceiptIDs(fetchedReceiptIDs);
            setOriginalReceiptIDs(fetchedReceiptIDs);
            if (data.receiptPreviews && data.receiptPreviews.length > 0) {
              const previews = data.receiptPreviews.map(
                (img) => `${ip}/receipts/${img}`
              );
              setReceiptPreviews(previews);
              setOriginalReceiptPreviews(previews);
            } else {
              setReceiptPreviews([]);
              setOriginalReceiptPreviews([]);
            }

            if (data.budget_id === null) {
              setBudgetId("null");
            } else {
              setBudgetId(data.budget_id);
            }
          }
        } catch (error) {
          console.error("Error fetching expense details:", error);
        } finally {
          setLoading(false);
        }
      })();

      (async () => {
        try {
          const res = await fetch(
            `${ip}/fetch-record-groups-options?tab=expense`
          );
          const result = await res.json();
          if (result.status && Array.isArray(result.data)) {
            setRecordGroups(result.data);
          }
        } catch (error) {
          console.error("Error fetching record groups:", error);
        }
      })();

      (async () => {
        try {
          const res = await fetch(`${ip}/fetch-budget-options`);
          const result = await res.json();
          if (result.status && Array.isArray(result.data)) {
            setBudgets(result.data);
          }
        } catch (error) {
          console.error("Error fetching budget options:", error);
        }
      })();
    }
  }, [isOpen, id, ip]);

  // Helper: update group name
  const updateGroupName = (groupIndex, value) => {
    setExpenseGroups((prev) => {
      const updated = [...prev];
      updated[groupIndex].groupName = value;
      return updated;
    });
  };

  // Helper: update row field
  const updateRowField = (groupIndex, rowIndex, field, value) => {
    setExpenseGroups((prev) => {
      const updated = [...prev];
      updated[groupIndex].rows[rowIndex][field] = value;
      return updated;
    });
  };

  // Helper: add a new row to a specific expense group
  const addRowToGroup = useCallback((groupIndex) => {
    setExpenseGroups((prev) =>
      prev.map((group, idx) =>
        idx !== groupIndex
          ? group
          : {
              // spread the group object…
              ...group,
              // …but create a wholly new rows array
              rows: [...group.rows, { itemName: "", quantity: "", cost: "" }],
            }
      )
    );
  }, []);

  // Helper: add a new expense group
  const addExpenseGroup = () => {
    setExpenseGroups((prev) => [
      ...prev,
      { groupName: "", rows: [{ itemName: "", quantity: "", cost: "" }] },
    ]);
  };

  // Helper: calculate group total (sum of cost * quantity)
  const calculateGroupTotal = (group) => {
    return group.rows
      .reduce((acc, row) => {
        const cost = parseFloat(row.cost) || 0;
        return acc + cost;
      }, 0)
      .toFixed(2);
  };

  // Helper: calculate overall total (sum of all groups)
  const calculateOverallTotal = () => {
    return expenseGroups
      .reduce((acc, group) => acc + parseFloat(calculateGroupTotal(group)), 0)
      .toFixed(2);
  };

  // Function to handle Enter key to move focus to next cell.
  // For simplicity, assume each input calls this handler with the next ref’s focus function.
  const handleKeyDown = (e, nextFocusFn) => {
    if (e.key === "Enter") {
      if (keyLockRef.current || e.repeat) return;
      keyLockRef.current = true;
      e.preventDefault();
      nextFocusFn();
      // Release the lock after 150ms (adjust if needed).
      setTimeout(() => {
        keyLockRef.current = false;
      }, 150);
    }
  };

  // Remove a row within a specific expense group
  const removeRowFromGroup = useCallback(
    (groupIndex, rowIndex) => {
      setExpenseGroups((prev) =>
        prev.map((group, idx) => {
          if (idx !== groupIndex) return group;

          // If there's only one row, reset it. Otherwise filter it out.
          const newRows =
            group.rows.length > 1
              ? group.rows.filter((_, i) => i !== rowIndex)
              : [{ itemName: "", quantity: "", cost: "" }];

          return {
            ...group,
            rows: newRows,
          };
        })
      );
    },
    [setExpenseGroups]
  );

  // Remove an entire expense group if more than one exists.
  const removeExpenseGroup = (groupIndex) => {
    setExpenseGroups((prev) => {
      if (prev.length > 1) {
        return prev.filter((_, idx) => idx !== groupIndex);
      }
      // Alternatively, you can clear the group if it's the only one.
      return prev;
    });
  };

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
    if (newReceipts.length > 0) {
      try {
        await Promise.all(
          newReceipts.map((receiptId) =>
            fetch(`${ip}/delete-receipt`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: receiptId }),
            })
          )
        );
      } catch (error) {
        console.error("Error deleting new receipts on cancel:", error);
      }
    }
    // Restore proof state to the originally loaded proofs.
    setProof(originalProof);
    setProofPreviews(originalProof.map((fname) => `${ip}/proofs/${fname}`));
    setDeletedProofs([]); // Clear any marked for deletion
    setReceiptIDs(originalReceiptIDs);
    setReceiptPreviews(originalReceiptPreviews);
    setNewReceipts([]);
    setDeletedReceipts([]);
    onClose();
  }

  // Submit updated deposit details
  async function handleUpdateExpense(e) {
    e.preventDefault();
    setErrorMsg("");
    // Check expense name and source
    if (!name.trim() || !recordGroupId) {
      setErrorMsg("Expense name and source are required.");
      return;
    }

    // Check that there's at least one complete breakdown row.
    const hasCompleteBreakdown = expenseGroups.some((group) =>
      group.rows.some(
        (row) =>
          row.itemName.trim() !== "" &&
          String(row.quantity).trim() !== "" &&
          String(row.cost).trim() !== ""
      )
    );
    if (!hasCompleteBreakdown) {
      setErrorMsg("Please input at least one complete row.");
      return;
    }

    // Validate each expense group: group name must be filled and each row must be complete.
    for (let i = 0; i < expenseGroups.length; i++) {
      const group = expenseGroups[i];
      // Validate group name.
      if (!group.groupName.trim()) {
        setErrorMsg(`Please provide a name for Expense Group ${i + 1}.`);
        return;
      }
      // Validate each row within the group.
      for (let j = 0; j < group.rows.length; j++) {
        const { itemName, quantity, cost } = group.rows[j];
        const itemFilled = itemName.trim() !== "";
        const qtyFilled = String(quantity).trim() !== "";
        const costFilled = String(cost).trim() !== "";
        // If any field is filled but not all, display error.
        if (
          (itemFilled || qtyFilled || costFilled) &&
          !(itemFilled && qtyFilled && costFilled)
        ) {
          setErrorMsg(
            `Please complete all inputs in Expense Group "${group.groupName}" or remove incomplete rows.`
          );
          return;
        }
      }
    }

    // Check that at least one proof photo exists.
    if (proof.length === 0) {
      setErrorMsg("Please add at least one proof photo.");
      return;
    }

    if (receiptIDs.length === 0) {
      setErrorMsg("Please add at least one receipt.");
      return;
    }

    const checkBudgetId = budgetId === "" ? "null" : budgetId;

    // In your handleSubmit function, when building the payload:
    const grandTotalAmount = calculateOverallTotal();
    const payload = {
      id: id,
      name,
      breakdown: JSON.stringify(expenseGroups),
      amount: grandTotalAmount,
      record_group_id: recordGroupId,
      proof: JSON.stringify(proof),
      receipt_ids: JSON.stringify(receiptIDs),
      status: "Issued",
      budget_id: checkBudgetId,
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
      if (deletedReceipts.length > 0) {
        await Promise.all(
          deletedReceipts.map((receiptId) =>
            fetch(`${ip}/delete-receipt`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: receiptId }),
            })
          )
        );
      }
      const res = await fetch(`${ip}/update-expense`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.status) {
        if (refreshData) refreshData();
        onClose();
      } else {
        setErrorMsg(result.error || "Expense update failed.");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
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

  function handleAddReceipt(newReceipt) {
    setReceiptIDs((prev) => [...prev, newReceipt.id]);
    setReceiptPreviews((prev) => [...prev, newReceipt.previewUrl]);
    setNewReceipts((prev) => [...prev, newReceipt.id]);
  }

  // Function to open the View Receipt modal by fetching details via /fecth-receipt-details
  const openViewReceiptModal = (receiptId) => {
    // Instead of fetching data here, simply set the receiptId to open the modal.
    setViewReceiptID({ id: receiptId });
    setShowViewReceiptModal(true);
  };

  // Function to delete a receipt by id.
  async function deleteReceipt(receiptId, previewUrl) {
    try {
      if (originalReceiptIDs.includes(receiptId)) {
        // It's an original receipt: mark it as deleted for later server deletion.
        setDeletedReceipts((prev) => [...prev, receiptId]);
      } else {
        // New receipt: remove from newReceipts and delete via API immediately.
        setNewReceipts((prev) => prev.filter((id) => id !== receiptId));
        await fetch(`${ip}/delete-receipt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: receiptId }),
        });
      }
      // Remove from UI
      setReceiptIDs((prev) => prev.filter((id) => id !== receiptId));
      // Remove preview by direct match instead of string includes.
      setReceiptPreviews((prev) => prev.filter((url) => url !== previewUrl));
      if (viewReceiptID && viewReceiptID.id === receiptId) {
        setShowViewReceiptModal(false);
        setViewReceiptID(null);
      }
    } catch (error) {
      console.error("Error deleting receipt:", error);
    }
  }

  // ----- Function to open update modal, recycling add receipt inputs -----
  const openUpdateReceiptModal = (receipt) => {
    // Instead of passing the full receipt data, save the receipt id.
    setUpdateReceiptID(receipt.id);
    setShowUpdateReceiptModal(true);
  };

  if (!isOpen) return null;
  return (
    <div>
      <Modal
        title="UPDATE EXPENSE"
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
            onSubmit={handleUpdateExpense}
            className="sm:p-2 md:p-6 py-4 h-full w-full"
          >
            <div className="space-y-8 h-9/10 overflow-y-auto">
              <div>
                <label className="block text-sm font-semibold">
                  Expense Name
                </label>
                <Input
                  ref={nameRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter expense name"
                  className="rounded-md border border-black h-7 sm:h-8 w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">Category</label>
                <select
                  value={recordGroupId}
                  onChange={(e) => setRecordGroupId(e.target.value)}
                  className="rounded-md border border-black h-7 sm:h-8 w-full p-1"
                >
                  <option value="">Select Category</option>
                  {recordGroups.map((rg) => (
                    <option key={rg.id} value={rg.id}>
                      {rg.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold">Breakdown</label>
                {/* Render expense groups */}
                <div className="space-y-8 border p-2 rounded-lg bg-[#ffae0035]">
                  <div>
                    <div className="space-y-8">
                      {expenseGroups.map((group, gIdx) => (
                        <div key={gIdx}>
                          <div className="mb-2">
                            <label className="block text-xs font-semibold">
                              Expense Group Name {gIdx + 1}
                            </label>
                            <div className="flex flex-row space-x-2">
                              <Input
                                type="text"
                                value={group.groupName}
                                onChange={(e) =>
                                  updateGroupName(gIdx, e.target.value)
                                }
                                placeholder="Enter Expense Group Name"
                                className={`transition-all duration-150 rounded-md border border-black bg-white ${
                                  expenseGroups.length > 1
                                    ? "w-6/7 sm:w-5/7"
                                    : "w-full"
                                } h-7 text-sm`}
                              />
                              {expenseGroups.length > 1 && (
                                <Button
                                  type="button"
                                  onClick={() => removeExpenseGroup(gIdx)}
                                  className="w-1/7 sm:w-2/7 bg-red-500 text-white px-2 py-1 rounded text-sm transition-all duration-150 transform hover:scale-105 cursor-pointer items-center justify-items-center"
                                >
                                  {isMobile ? (
                                    <img
                                      src={icons["src/assets/delete.svg"]}
                                      alt="Remove row"
                                      className="w-4 h-4 object-cover rounded cursor-pointer"
                                    />
                                  ) : (
                                    <p>Delete</p>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                          <div className="overflow-clip border rounded-lg bg-white">
                            <div className="overflow-x-auto">
                              <table className="min-w-[400px] border-collapse">
                                <thead>
                                  <tr className="bg-orange-400 border-b text-sm">
                                    <th className="p-1 px-2 text-left w-3/7 rounded-tl-lg">
                                      Item Name
                                    </th>
                                    <th className="p-1 px-2 w-1/7 text-left">
                                      Quantity
                                    </th>
                                    <th className="p-1 px-2 text-left w-2/7">
                                      Cost
                                    </th>
                                    <th className="text-left p-1 px-2 w-1/7 rounded-tr-lg">
                                      Action
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {group.rows.map((row, rIdx) => (
                                    <tr
                                      key={rIdx}
                                      className="border-b text-xs sm:text-sm h-8.5 bg-white"
                                    >
                                      <td className="p-1">
                                        <Input
                                          id={`item-${gIdx}-${rIdx}`}
                                          type="text"
                                          value={row.itemName}
                                          onChange={(e) =>
                                            updateRowField(
                                              gIdx,
                                              rIdx,
                                              "itemName",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Item name"
                                          className="w-full"
                                          onKeyDown={(e) =>
                                            handleKeyDown(e, () => {
                                              // Focus on Quantity: you might need to use refs for better control.
                                              document
                                                .getElementById(
                                                  `qty-${gIdx}-${rIdx}`
                                                )
                                                ?.focus();
                                            })
                                          }
                                        />
                                      </td>
                                      <td className="p-1">
                                        <Input
                                          id={`qty-${gIdx}-${rIdx}`}
                                          type="number"
                                          value={row.quantity}
                                          onChange={(e) =>
                                            updateRowField(
                                              gIdx,
                                              rIdx,
                                              "quantity",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Quantity"
                                          className="w-full"
                                          onKeyDown={(e) =>
                                            handleKeyDown(e, () => {
                                              // Focus on Cost.
                                              document
                                                .getElementById(
                                                  `cost-${gIdx}-${rIdx}`
                                                )
                                                ?.focus();
                                            })
                                          }
                                        />
                                      </td>
                                      <td className="p-1">
                                        <Input
                                          id={`cost-${gIdx}-${rIdx}`}
                                          type="number"
                                          value={row.cost}
                                          onChange={(e) =>
                                            updateRowField(
                                              gIdx,
                                              rIdx,
                                              "cost",
                                              e.target.value
                                            )
                                          }
                                          placeholder="Cost"
                                          step="0.01"
                                          className="w-full"
                                          onKeyDown={(e) =>
                                            handleKeyDown(e, () => {
                                              // On Enter at cost, if there is a next row focus that;
                                              // Otherwise, add a new row and focus its item name.
                                              if (group.rows[rIdx + 1]) {
                                                document
                                                  .getElementById(
                                                    `item-${gIdx}-${rIdx + 1}`
                                                  )
                                                  ?.focus();
                                              } else {
                                                addRowToGroup(gIdx);
                                                // Use a short timeout to allow re-render.
                                                setTimeout(() => {
                                                  document
                                                    .getElementById(
                                                      `item-${gIdx}-${rIdx + 1}`
                                                    )
                                                    ?.focus();
                                                }, 100);
                                              }
                                            })
                                          }
                                        />
                                      </td>
                                      <td className="p-1 text-center">
                                        {group.rows.length > 1 && (
                                          <Button
                                            type="button"
                                            onClick={() =>
                                              removeRowFromGroup(gIdx, rIdx)
                                            }
                                            className="transition-all duration-150 transform hover:scale-105 cursor-pointer bg-red-500 text-white px-2 py-1 rounded text-xs"
                                          >
                                            {isMobile ? (
                                              <img
                                                src={
                                                  icons["src/assets/delete.svg"]
                                                }
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
                                  <tr className="text-sm font-semibold border-y bg-white">
                                    <td
                                      className="p-1 px-2 text-left"
                                      colSpan={2}
                                    >
                                      Total Cost
                                    </td>
                                    <td className="p-1 px-2" colSpan={2}>
                                      ₱ {calculateGroupTotal(group)}
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                            <Button
                              type="button"
                              onClick={() => addRowToGroup(gIdx)}
                              className="transition-all duration-150 transform hover:scale-105 m-2 bg-blue-600 text-white px-3 py-1 rounded text-sm cursor-pointer"
                            >
                              Add Row to Group
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="button"
                      onClick={addExpenseGroup}
                      className="m-2 transition-all duration-150 transform hover:scale-105 text-white px-3 py-1 rounded text-sm cursor-pointer bg-green-600"
                    >
                      Add Expense Group
                    </Button>
                  </div>
                  {/* Summary Table for all Expense Groups */}
                  <div className="mt-8">
                    <label className="block text-xs font-semibold">
                      Expense Summary
                    </label>
                    <div className="overflow-x-auto border rounded-lg">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr className="bg-orange-400 border-b text-sm">
                            <th className="text-left p-1 px-2 w-2/3 rounded-tl-lg">
                              Expense Group
                            </th>
                            <th className="text-left p-1 px-2 w-1/3 rounded-tr-lg">
                              Cost
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenseGroups.map((group, idx) => (
                            <tr
                              key={idx}
                              className="border-b text-xs sm:text-sm h-8.5 bg-white"
                            >
                              <td className="p-1 px-2">
                                {group.groupName || `Group ${idx + 1}`}
                              </td>
                              <td className="p-1 px-2">
                                ₱ {calculateGroupTotal(group)}
                              </td>
                            </tr>
                          ))}
                          <tr className="text-sm font-semibold border-y bg-white">
                            <td className="p-1 px-2">Total Expense</td>
                            <td className="p-1 px-2">
                              ₱ {calculateOverallTotal()}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold">
                  Relating Budget
                </label>
                <select
                  value={budgetId === null ? "null" : budgetId}
                  onChange={(e) => setBudgetId(e.target.value)}
                  className="rounded-md border border-black h-7 sm:h-8 w-full p-1"
                >
                  <option value="">
                    Select Budget relating to the expense
                  </option>
                  <option key="null" value="null">
                    No relating budget
                  </option>
                  {budgets.map((rg) => (
                    <option key={rg.id} value={rg.id}>
                      {rg.name}
                    </option>
                  ))}
                </select>
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
                              expenseGroups.every((group) =>
                                group.rows.every(
                                  (row) =>
                                    row.itemName.trim() === "" &&
                                    String(row.quantity).trim() === "" &&
                                    String(row.cost).trim() === ""
                                )
                              )
                            ) {
                              setErrorMsg(
                                "Please fill in expense name, source, and at least one breakdown row before uploading proofs."
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
                              expenseGroups.every((group) =>
                                group.rows.every(
                                  (row) =>
                                    row.itemName.trim() === "" &&
                                    String(row.quantity).trim() === "" &&
                                    String(row.cost).trim() === ""
                                )
                              )
                            ) {
                              setErrorMsg(
                                "Please fill in expense name, source, and at least one breakdown row before uploading proofs."
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
                              expenseGroups.every((group) =>
                                group.rows.every(
                                  (row) =>
                                    row.itemName.trim() === "" &&
                                    String(row.quantity).trim() === "" &&
                                    String(row.cost).trim() === ""
                                )
                              )
                            ) {
                              setErrorMsg(
                                "Please fill in expense name, category, and at least expense group with one row before uploading proofs."
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
              <div>
                <label className="block text-sm font-semibold">
                  Add Receipt(s)
                </label>
                <div className="flex flex-wrap gap-4 mx-0.5">
                  {receiptPreviews.map((url, idx) => {
                    const receiptId = receiptIDs[idx]; // assume same index as receiptIDs
                    return (
                      <div key={idx} className="relative inline-block">
                        <img
                          src={url}
                          alt="Receipt preview"
                          className="transition-all duration-150 transform hover:scale-105 w-20 h-20 object-cover rounded cursor-pointer border-2"
                          onClick={() => {
                            openViewReceiptModal(receiptId);
                          }}
                        />
                        <Button
                          type="button"
                          onClick={() => deleteReceipt(receiptId, url)}
                          className="absolute top-0 right-0 m-0.5 bg-red-600 text-white px-1 py-0 text-xs rounded-xs"
                        >
                          X
                        </Button>
                      </div>
                    );
                  })}
                  <div className="relative inline-block">
                    <Button
                      type="button"
                      onClick={() => {
                        if (
                          !name.trim() ||
                          !recordGroupId ||
                          expenseGroups.every((group) =>
                            group.rows.every(
                              (row) =>
                                row.itemName.trim() === "" &&
                                String(row.quantity).trim() === "" &&
                                String(row.cost).trim() === ""
                            )
                          ) ||
                          proof.length === 0
                        ) {
                          setErrorMsg(
                            "Please fill in expense name, source, fill at least one expexse group with one row and upload at least one proof to add receipt."
                          );
                        } else {
                          // Clear any previous error and trigger camera input.
                          setErrorMsg("");
                          setShowAddReceiptModal(true);
                        }
                      }}
                      className="transition-all duration-150 transform hover:scale-105 w-20 h-20 flex flex-col items-center justify-center bg-blue-600 text-white rounded cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-10 h-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <p className="text-xs">Add Receipt</p>
                    </Button>
                  </div>
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
                className="bg-blue-600 text-sm md:text-base text-white px-4 py-2 rounded cursor-pointer transition-all duration-150 hover:bg-blue-800 transform hover:scale-105 flex items-center"
                disabled={updating}
              >
                {updating ? "Updating Deposit..." : "Update Deposit"}
              </Button>
            </div>
          </form>
        )}
      </Modal>
      {showAddReceiptModal && (
        <AddReceiptModal
          isOpen={showAddReceiptModal}
          onClose={() => setShowAddReceiptModal(false)}
          ip={ip}
          userData={userData}
          onAddReceipt={handleAddReceipt}
        />
      )}

      {showViewReceiptModal && viewReceiptID && (
        <ViewReceiptModal
          key={`viewReceipt-${viewReceiptID.id}-${viewReceiptRefreshKey}`}
          isOpen={showViewReceiptModal}
          onClose={() => {
            setShowViewReceiptModal(false);
            setViewReceiptID(null);
          }}
          ip={ip}
          receiptId={viewReceiptID.id}
          onEdit={openUpdateReceiptModal}
          onDelete={(id, previewUrl) => deleteReceipt(id, previewUrl)}
          isMobile={isMobile}
        />
      )}
      {showUpdateReceiptModal && updateReceiptID && (
        <UpdateReceiptModal
          isOpen={showUpdateReceiptModal}
          onClose={() => {
            setShowUpdateReceiptModal(false);
            setUpdateReceiptID(null);
          }}
          ip={ip}
          receiptId={updateReceiptID}
          onUpdateReceipt={(id, newImage) => {
            const updatedPreviewUrl = `${ip}/receipts/${newImage}`;
            const indexToUpdate = receiptIDs.findIndex(
              (receiptId) => receiptId === id
            );
            if (indexToUpdate !== -1) {
              setReceiptPreviews((prev) =>
                prev.map((url, idx) =>
                  idx === indexToUpdate ? updatedPreviewUrl : url
                )
              );
            }
            // Refresh the view modal by updating its key with a new unique value:
            if (viewReceiptID && viewReceiptID.id === id) {
              setViewReceiptRefreshKey(`${Date.now()}-${Math.random()}`);
            }
          }}
          isMobile={isMobile}
        />
      )}
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
