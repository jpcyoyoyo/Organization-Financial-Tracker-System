import { useState, useEffect, useContext, Fragment } from "react";
import Modal from "../../components/ui/modal";
import PropTypes from "prop-types";
import { IpContext } from "../../context/IpContext";
import { icons } from "../../assets/icons";

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

export default function ViewLogModal({ isOpen, onClose, id, refreshData }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const ip = useContext(IpContext);

  // Fetch detailed info when modal is open and id exists.
  useEffect(() => {
    async function fetchDetails() {
      if (!id) return;
      setLoading(true);
      try {
        const response = await fetch(`${ip}/fetch-log-details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) throw new Error("Failed to fetch details");
        const result = await response.json();
        if (result.status && result.data) {
          setDetails(result.data);
        }
      } catch (error) {
        console.error("Error fetching log details:", error);
      } finally {
        setLoading(false);
      }
    }
    if (isOpen) {
      fetchDetails();
    }
  }, [isOpen, id, ip]);

  function handleClose() {
    onClose();
    refreshData();
  }

  return (
    <>
      <Modal
        title="LOG DETAILS"
        isOpen={isOpen}
        onClose={handleClose}
        w="w-11/12 h-11/12 sm:h-10/12 sm:w-5/7 lg:w-3/7"
        modalCenter={true}
      >
        {loading ? (
          <div className="p-4 h-full w-full flex items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : details && Object.keys(details).length > 0 ? (
          <div className="p-1 sm:p-4 h-full w-full">
            <div className="space-y-1 h-full overflow-y-auto text-sm sm:text-base">
              {/* Summary and Details */}
              <div
                className={`border rounded-lg ${
                  details.status === "0"
                    ? "bg-[#bbf4510b]"
                    : details.status === "1"
                    ? "bg-[#d685850b]"
                    : "bg-[#a2f4fd0b]"
                }`}
              >
                <h2
                  className={`text-lg font-bold px-4 py-2 rounded-t-lg ${
                    details.status === "0"
                      ? "bg-[#37ff14dc]"
                      : details.status === "1"
                      ? "bg-red-600"
                      : "bg-cyan-400"
                  } truncate`}
                >
                  {details.summary}
                </h2>

                <div className="text-sm text-gray-700 p-4 h-64 sm:h-58 md:h-46 overflow-y-auto">
                  {formatLogDetails(details.details)}
                </div>
                {/* Grid displaying the log details */}
                <div className="text-sm px-4 py-2 grid border-t grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold">Log ID</label>
                    <div>{details.id}</div>
                  </div>

                  <div>
                    <label className="block font-semibold">Status</label>
                    <div
                      className={`font-bold ${
                        details.status === "0"
                          ? "text-green-600"
                          : details.status === "1"
                          ? "text-red-600"
                          : "text-cyan-600"
                      }`}
                    >
                      {details.status === "0"
                        ? "Success"
                        : details.status === "1"
                        ? "Failed"
                        : "Process"}
                    </div>
                  </div>
                </div>
                <div className="text-sm px-4 py-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold">Log Created</label>
                    <div>{details.created_at}</div>
                  </div>
                  <div>
                    <label className="block font-semibold">
                      Tab and Activity
                    </label>
                    {details.tab} - {details.activity}
                  </div>
                </div>
                <div className="text-sm px-4 py-2">
                  <label className="block font-semibold">User Involved</label>
                  <div className="flex flex-row w-full items-center my-2">
                    <img
                      src={
                        details.profile_pic !== null
                          ? icons[details.profile_pic] ||
                            `${ip}/profile-pic/${details.profile_pic}`
                          : icons["src/assets/server.svg"]
                      }
                      alt="User Profile"
                      className="flex w-14 h-14 bg-yellow-300 object-cover rounded self-center"
                    />
                    <div className="w-full justify-items-start ml-2">
                      <h1 className="font-bold">
                        {details.full_name ?? "SERVER"}{" "}
                        {details.user_id ? `(UserID: ${details.user_id})` : ""}
                      </h1>
                      <h1
                        className={`${
                          details.designation ? "block" : "hidden"
                        }`}
                      >
                        {details.designation ?? "Not Available"}{" "}
                        {`(${details.student_id})`}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="p-10">No details available.</p>
        )}
      </Modal>
    </>
  );
}

ViewLogModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  refreshData: PropTypes.func,
};
