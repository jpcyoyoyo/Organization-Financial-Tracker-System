import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import Modal from "../../components/ui/modal";
import { Button } from "../../components/ui/button";
import { IpContext } from "../../context/IpContext";
import DecideBudgetApproval from "./DecideBudgetApproval";

export default function DecideApprovalModal({
  isOpen,
  id,
  refreshData,
  onClose,
}) {
  const ip = useContext(IpContext);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDecideBudgetModal, setShowDecideBudgetModal] = useState(false);
  const [showDecidePaymentModal, setShowDecidePaymentModal] = useState(false);
  const [showDecideAnnouncementModal, setShowDecideAnnouncementModal] =
    useState(false);

  useEffect(() => {
    if (isOpen && id) {
      const fetchdetails = async () => {
        setLoading(true);
        try {
          const response = await fetch(`${ip}/fetch-approval-details`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ approval_id: id }),
          });
          if (!response.ok) {
            throw new Error("Failed to fetch approval details");
          }
          const result = await response.json();
          if (result.status) {
            setDetails(result.data);
            setError("");
          } else {
            setDetails(null);
            setError(result.error || "Failed to fetch approval details");
          }
        } catch (err) {
          console.error("Error fetching approval details:", err);
          setDetails(null);
          setError("Error fetching approval details");
        } finally {
          setLoading(false);
        }
      };
      fetchdetails();
    }
  }, [ip, isOpen, id]);

  const handleDecideModal = () => {
    if (details.type === "Budget") {
      setShowDecideBudgetModal(true);
    } else if (details.type === "Payment") {
      setShowDecidePaymentModal(true);
    } else if (details.type === "Announcement") {
      setShowDecideAnnouncementModal(true);
    }
  };

  return (
    <>
      <Modal
        title="DECIDE APPROVAL"
        isOpen={isOpen}
        onClose={() => {
          refreshData();
          onClose();
        }}
        modalCenter={false}
        w={"w-11/12 h-11/12 md:w-1/2"}
      >
        <div className="p-4 w-full h-full space-y-4">
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : details ? (
            <>
              <div className="overflow-y-auto bg-[#ffe60022] border rounded-lg h-9/10">
                <div className="flex flex-col md:flex-row bg-amber-500 py-2 px-4 border-b">
                  <label className="text-base block font-semibold">
                    {details.type
                      ? `${details.type} Approval Request`
                      : "Approval Request"}
                  </label>
                </div>
                <div className="text-sm px-4 grid grid-cols-2 border-b">
                  <div className="pr-2 border-r py-2">
                    <label className="block font-semibold">Approval ID</label>
                    <div>{details.id}</div>
                  </div>
                  <div className="pl-2 py-2">
                    <label className="block font-semibold">Decision</label>
                    <div>{details.decision ?? "Not Decided"}</div>
                  </div>
                </div>
                <div className="text-sm p-4 flex flex-col sm:flex-row space-y-4 sm:space-x-4">
                  <div className="sm:flex sm:flex-col w-full">
                    <div className="h-40 overflow-y-auto pb-2">
                      <label className="block font-semibold">
                        Request Message
                      </label>
                      <div>{details.request_message}</div>
                    </div>
                  </div>
                </div>
                <div className="text-sm px-4 py-2 grid border-t grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold">
                      Approval Request Created
                    </label>
                    <div>{details.created_at}</div>
                  </div>
                  <div>
                    <label className="block font-semibold">
                      Approval Request{" "}
                      {details.decision === "Approved"
                        ? "Approved"
                        : details.decision === "Disapproved"
                        ? "Disapproved"
                        : details.decision === "Cancelled"
                        ? "Cancelled"
                        : "Sent"}
                    </label>
                    <div>{details.updated_at}</div>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block font-semibold">
                      Relating {details.type} Record ID
                    </label>
                    <div>{details.relating_id}</div>
                  </div>
                  <div className="col-span-1 sm:col-span-2">
                    <label className="block font-semibold">Request By</label>
                    <div className="text-base font-semibold">
                      {details.full_name}
                    </div>
                    <p className="text-sm">{details.designation}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end h-1/10">
                <Button
                  type="button"
                  onClick={handleDecideModal}
                  className="transition-all duration-150 transform hover:scale-105 cursor-pointer hover:bg-amber-800 bg-amber-600 text-white px-4 py-2 rounded h-fit"
                >
                  Decide
                </Button>
              </div>
            </>
          ) : (
            <p>No details available</p>
          )}
        </div>
      </Modal>
      {showDecideBudgetModal && details.relating_id && (
        <DecideBudgetApproval
          isOpen={showDecideBudgetModal}
          onClose={() => setShowDecideBudgetModal(false)}
          id={details.relating_id}
          refreshData={refreshData}
          handleClose={onClose}
        ></DecideBudgetApproval>
      )}
    </>
  );
}

DecideApprovalModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClose: PropTypes.func.isRequired,
  refreshData: PropTypes.func,
};
