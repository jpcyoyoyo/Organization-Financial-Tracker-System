import { useState, useEffect, useContext } from "react";
import Modal from "../../components/ui/modal";
import PropTypes from "prop-types";
import { IpContext } from "../../context/IpContext";
import LightboxModal from "../../components/ui/lightboxmodal";
import ViewReceiptNoEditModal from "../Receipts/ViewReceiptNoEditModal";

export default function ViewExpenseModal({ isOpen, onClose, id }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expenseGroups, setExpenseGroups] = useState([
    { groupName: "", rows: [{ itemName: "", quantity: "", cost: "" }] },
  ]);
  const [showViewReceiptNoEditModal, setShowViewReceiptNoEditModal] =
    useState(false);
  const [viewReceiptID, setViewReceiptID] = useState(null);
  const [proofPreviews, setProofPreviews] = useState([]);
  const [selectedProof, setSelectedProof] = useState(null);
  const [showLightBox, setShowLightBox] = useState(false);
  const [receiptIDs, setReceiptIDs] = useState([]);
  const [receiptPreviews, setReceiptPreviews] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const ip = useContext(IpContext);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
          const data = result.data;
          setDetails(result.data);
          setExpenseGroups(JSON.parse(data.breakdown));
          const previews = JSON.parse(data.proof).map(
            (fname) => `${ip}/proofs/${fname}`
          );
          setProofPreviews(previews);
          setReceiptIDs(JSON.parse(data.receipt_ids));
          // Set receipt image previews using the modified route.
          if (data.receiptPreviews && data.receiptPreviews.length > 0) {
            setReceiptPreviews(
              data.receiptPreviews.map((img) => `${ip}/receipts/${img}`)
            );
          } else {
            setReceiptPreviews([]);
          }
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

  const calculateGroupTotal = (group) => {
    return group.rows
      .reduce((acc, row) => {
        const cost = parseFloat(row.cost) || 0;
        return acc + cost;
      }, 0)
      .toFixed(2);
  };

  const calculateOverallTotal = () => {
    return expenseGroups
      .reduce((acc, group) => acc + parseFloat(calculateGroupTotal(group)), 0)
      .toFixed(2);
  };

  const openViewReceiptNoEditModal = (receiptId) => {
    // Instead of fetching data here, simply set the receiptId to open the modal.
    setViewReceiptID({ id: receiptId });
    setShowViewReceiptNoEditModal(true);
  };

  // Open lightbox with clicked preview
  const openLightbox = (url) => {
    setSelectedProof(url);
  };

  // Close lightbox overlay
  const closeLightbox = () => {
    setSelectedProof(null);
    setShowLightBox(false);
  };

  return (
    <>
      <Modal
        title="VIEW EXPENSE"
        isOpen={isOpen}
        onClose={onClose}
        w="w-11/12 h-11/12 md:h-6/7 md:w-6/7 xl:w-5/7"
      >
        {loading ? (
          <div className="p-4 h-full w-full flex items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : details ? (
          <div className="sm:p-2 md:p-6h-full h-full w-full">
            <div className="overflow-y-auto bg-[#ffae0020] border rounded-lg w-full h-full">
              <div className="flex flex-col md:flex-row bg-orange-500 p-2">
                <label className="text-base block font-semibold">
                  Expense Name
                </label>
                <h1 className="hidden md:flex font-semibold">{":"}</h1>
                <div className="md:pl-1 text-sm md:text-base">
                  {details && details.name}
                </div>
              </div>
              <div className="flex flex-col md:flex-row-reverse md:h-[calc(100%-40px)]">
                <div className="overflow-y-auto px-2 sm:p-4 py-2 border-t md:w-3/5 h-full">
                  <label className="text-sm block font-semibold">
                    Breakdown
                  </label>
                  <div className="border rounded-md overflow-clip">
                    {details && details.breakdown && (
                      <>
                        {JSON.parse(details.breakdown).map(
                          (group, groupIdx) => (
                            <div key={groupIdx} className="mb-8">
                              <h3 className="font-semibold text-sm p-1 bg-orange-400">
                                {group.groupName || `Group ${groupIdx + 1}`}
                              </h3>
                              <table className="w-full border-collapse">
                                <thead className="bg-orange-200 text-sm border-b">
                                  <tr className="flex w-full">
                                    <th className="w-1/2 text-left p-1">
                                      Item Name
                                    </th>
                                    <th className="w-1/4 text-left p-1">
                                      Quantity
                                    </th>
                                    <th className="w-1/4 text-left p-1">
                                      Cost
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white text-xs md:text-sm">
                                  {group.rows.map((row, rowIdx) => (
                                    <tr
                                      key={rowIdx}
                                      className="flex w-full border-b py-0.5"
                                    >
                                      <td className="w-1/2 p-1 px-2 truncate">
                                        {row.itemName}
                                      </td>
                                      <td className="w-1/4 p-1 px-2">
                                        {row.quantity}
                                      </td>
                                      <td className="w-1/4 p-1 px-2">
                                        ₱ {row.cost}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                                <tfoot className="bg-white text-sm font-semibold border-b">
                                  <tr className="flex w-full py-0.5">
                                    <td className="w-3/4 text-left align-middle p-1 px-2">
                                      Group Total
                                    </td>
                                    <td
                                      className="w-1/4 text-left p-1 px-2"
                                      colSpan="1"
                                    >
                                      ₱{" "}
                                      {group.rows
                                        .reduce(
                                          (acc, r) =>
                                            acc + (parseFloat(r.cost) || 0),
                                          0
                                        )
                                        .toFixed(2)}
                                    </td>
                                  </tr>
                                </tfoot>
                              </table>
                            </div>
                          )
                        )}
                        <div>
                          <h3 className="font-semibold text-sm p-1 bg-orange-400 ">
                            Expense Summary
                          </h3>
                          <table className="w-full border-collapse">
                            <thead className="text-sm border-b">
                              <tr className="bg-orange-200 border-b text-sm">
                                <th className="text-left p-1 px-2 w-3/4">
                                  Expense Group
                                </th>
                                <th className="text-left p-1 px-2 w-1/4">
                                  Cost
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {JSON.parse(details.breakdown).map(
                                (group, idx) => (
                                  <tr
                                    key={idx}
                                    className="border-b text-xs sm:text-sm py-2 bg-white"
                                  >
                                    <td className="p-1 px-2">
                                      {group.groupName || `Group ${idx + 1}`}
                                    </td>
                                    <td className="p-1 px-2">
                                      ₱ {calculateGroupTotal(group)}
                                    </td>
                                  </tr>
                                )
                              )}
                              <tr className="text-sm font-semibold bg-white">
                                <td className="p-1 px-2">Total Expense</td>
                                <td className="py-2 px-2">
                                  ₱ {calculateOverallTotal()}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-2 md:mt-0 md:w-2/5 h-full border-t md:border-r text-sm px-2 sm:p-4 py-2 grid md:flex md:flex-col grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4 overflow-y-auto">
                  <div>
                    <label className="block font-semibold">Source</label>
                    <div>{details.category_name}</div>
                  </div>
                  <div>
                    <label className="flex font-semibold">
                      Relating Budget
                    </label>
                    <div>
                      {details.budget_id !== null
                        ? `${details.budget_name} - (ID: ${details.budget_id})`
                        : "No relating budget"}
                    </div>
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
                  <div className="sm:col-span-2 md:col-span-1">
                    <label className="block text-sm font-semibold">
                      Receipt(s)
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
                                openViewReceiptNoEditModal(receiptId);
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold">Date Created</label>
                    <div>{details.created_at}</div>
                  </div>
                  <div>
                    <label className="block font-semibold">Date Updated</label>
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
        ) : (
          <p className="p-10">No expense details available.</p>
        )}
      </Modal>
      {showViewReceiptNoEditModal && viewReceiptID && (
        <ViewReceiptNoEditModal
          key={`viewReceipt-${viewReceiptID.id}`}
          isOpen={showViewReceiptNoEditModal}
          onClose={() => {
            setShowViewReceiptNoEditModal(false);
            setViewReceiptID(null);
          }}
          ip={ip}
          receiptId={viewReceiptID.id}
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
    </>
  );
}

ViewExpenseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
