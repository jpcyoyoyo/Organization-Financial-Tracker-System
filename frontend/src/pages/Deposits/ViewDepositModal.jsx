import { useState, useEffect, useContext } from "react";
import Modal from "../../components/ui/modal";
import PropTypes from "prop-types";
import { IpContext } from "../../context/IpContext";
import LightboxModal from "../../components/ui/lightboxmodal";

export default function ViewDepositModal({ isOpen, onClose, id, refreshData }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLightBox, setShowLightBox] = useState(false);
  const [selectedProof, setSelectedProof] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [proofPreviews, setProofPreviews] = useState([]);
  const ip = useContext(IpContext);

  // Local close handler that refreshes table data
  function handleModalClose() {
    onClose();
    if (refreshData) refreshData();
  }

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch deposit details when modal is open and id exists.
  useEffect(() => {
    async function fetchDetails() {
      if (!id) return;
      setLoading(true);
      try {
        const response = await fetch(`${ip}/fetch-deposit-details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) throw new Error("Failed to fetch deposit details");
        const result = await response.json();
        if (result.status && result.data) {
          const data = result.data;
          setDetails(result.data);
          const previews = JSON.parse(data.proof).map(
            (fname) => `${ip}/proofs/${fname}`
          );
          setProofPreviews(previews);
        }
      } catch (error) {
        console.error("Error fetching deposit details:", error);
      } finally {
        setLoading(false);
      }
    }
    if (isOpen) {
      fetchDetails();
    }
  }, [isOpen, id, ip]);

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
        title="VIEW DEPOSIT"
        isOpen={isOpen}
        onClose={handleModalClose}
        w="w-11/12 h-11/12 md:h-6/7 md:w-6/7 xl:w-5/7"
      >
        {loading ? (
          <div className="p-4 h-full w-full flex items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : details ? (
          // Read-only details view for issued deposit
          <div className="sm:p-2 md:p-6h-full h-full w-full">
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
                              className="flex w-full text-xs md:text-sm border-b"
                            >
                              <td className="w-2/3 p-1">{row.breakdownName}</td>
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
          <div>Error</div>
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
    </>
  );
}

ViewDepositModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  refreshData: PropTypes.func,
};
