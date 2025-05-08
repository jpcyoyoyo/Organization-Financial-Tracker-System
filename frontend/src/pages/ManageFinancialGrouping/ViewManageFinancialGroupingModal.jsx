import { useState, useEffect, useContext, Fragment } from "react";
import Modal from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import PropTypes from "prop-types";
import { IpContext } from "../../context/IpContext";

// Function to format the details text
function formatLogDetails(rawText) {
  // Convert escaped newlines and tabs into actual characters
  const normalized = rawText.replace(/\\n/g, "\n").replace(/\\t/g, "\t");

  // Split by newline and map to JSX with <br />
  const lines = normalized.split("\n");

  return (
    <div>
      {lines.map((line, index) => (
        <Fragment key={index}>
          {line}
          <br />
        </Fragment>
      ))}
    </div>
  );
}

export default function ViewManageFinancialGroupingModal({
  isOpen,
  onClose,
  rowData,
  id,
  refreshData,
  updateModal: UpdateModal,
}) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const ip = useContext(IpContext);

  // Local close handler that refreshes table data
  function handleModalClose() {
    onClose();
    if (refreshData) refreshData();
  }

  // Fetch record group details when modal is open and id exists
  useEffect(() => {
    async function fetchDetails() {
      if (!id) return;
      setLoading(true);
      try {
        const response = await fetch(`${ip}/fetch-record-group-details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!response.ok)
          throw new Error("Failed to fetch record group details");
        const result = await response.json();
        if (result.status && result.data) {
          setDetails(result.data);
        }
      } catch (error) {
        console.error("Error fetching record group details:", error);
      } finally {
        setLoading(false);
      }
    }
    if (isOpen) {
      fetchDetails();
    }
  }, [isOpen, id, ip]);

  return (
    <>
      <Modal
        title="RECORD GROUP DETAILS"
        isOpen={isOpen}
        onClose={handleModalClose}
        w="w-11/12 h-11/12 sm:h-10/12 sm:w-5/7 lg:w-3/7"
        modalCenter={true}
      >
        {loading ? (
          <div className="p-4 h-full w-full flex items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : details && Object.keys(details).length > 0 ? (
          <div className="p-1 sm:p-4 h-full w-full">
            <div className="space-y-1 h-9/10 overflow-y-auto text-sm sm:text-base">
              {/* Record Group Details */}
              <div className="border rounded-lg bg-[#f4f4f4]">
                <h2 className="text-lg font-bold px-4 py-2 rounded-t-lg bg-[#EFB034] truncate">
                  {`${
                    details.tab === "deposit"
                      ? "DEPOSIT SOURCE"
                      : "EXPENSE CATEGORY"
                  }`}
                </h2>

                <div className="text-sm text-gray-700 p-4 border-t">
                  <strong>Group Name:</strong>
                  <p>{details.name}</p>
                </div>

                <div className="text-sm text-gray-700 p-4 h-46 sm:h-42 md:h-30 overflow-y-auto border-t">
                  <strong>Description:</strong>
                  <p>{formatLogDetails(details.description)}</p>
                </div>

                {/* Grid displaying the record group details */}
                <div className="text-sm px-4 py-2 grid border-t grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold">Group ID</label>
                    <div>{details.id}</div>
                  </div>
                  <div>
                    <label className="block font-semibold">Record Number</label>
                    <div>{details.record_no}</div>
                  </div>
                </div>
                <div className="text-sm px-4 py-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold">Created At</label>
                    <div>{details.created_at}</div>
                  </div>
                  <div>
                    <label className="block font-semibold">Updated At</label>
                    <div>{details.updated_at}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-2 sm:space-x-4 h-1/10">
              {UpdateModal && (
                <Button
                  onClick={() => {
                    onClose();
                    setShowUpdate(true);
                  }}
                  className="bg-blue-600 text-sm md:text-base text-white px-4 py-2 rounded cursor-pointer transition-all duration-150 hover:bg-blue-800 transform hover:scale-105 flex items-center h-8"
                >
                  <span>Edit</span>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <p className="p-10">No record group details available.</p>
        )}
      </Modal>

      {UpdateModal && showUpdate && (
        <UpdateModal
          isOpen={showUpdate}
          onClose={() => {
            setShowUpdate(false);
          }}
          rowData={rowData}
          id={id}
          refreshData={refreshData}
        />
      )}
    </>
  );
}

ViewManageFinancialGroupingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  rowData: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  refreshData: PropTypes.func,
  updateModal: PropTypes.elementType,
};
