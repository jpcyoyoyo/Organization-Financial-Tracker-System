import { useState, useEffect, useContext } from "react";
import Modal from "../../components/ui/modal";
import PropTypes from "prop-types";
import { IpContext } from "../../context/IpContext";
import { icons } from "../../assets/icons";

export default function ViewSectionModal({ isOpen, onClose, id, refreshData }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const ip = useContext(IpContext);

  // Fetch detailed info when modal is open and id exists.
  useEffect(() => {
    async function fetchDetails() {
      if (!id) return;
      setLoading(true);
      try {
        const response = await fetch(`${ip}/fetch-section-details`, {
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
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    }
    if (isOpen) {
      fetchDetails();
    }
  }, [isOpen, id, ip]);

  function getYearLevel(params) {
    const yearLevels = {
      1: "1 - First Year",
      2: "2 - Second Year",
      3: "3 - Third Year",
      4: "4 - Fourth Year",
    };
    return yearLevels[params] || "Unknown";
  }

  function handleClose() {
    onClose();
    if (typeof refreshData === "function") {
      refreshData();
    }
  }

  return (
    <>
      <Modal
        title="SECTION DETAILS"
        isOpen={isOpen}
        onClose={handleClose}
        w="w-11/12 h-9/12 sm:h-8/12 sm:w-5/7 lg:w-3/7"
        modalCenter={true}
      >
        {loading ? (
          <div className="p-4 h-full w-full flex items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : details ? (
          <div className="p-4 h-full w-full">
            <div className="space-y-2 h-full overflow-y-auto text-sm">
              <h1 className="font-bold text-center sm:text-start">
                CURRENT SECTION REPRESENTATIVE
              </h1>
              {/* Grid displaying the remaining data with label above (responsive) */}
              <div className="flex flex-col sm:flex-row w-full items-center mb-8">
                <img
                  src={
                    icons[details.user_profile] ||
                    icons["src/assets/profile_default.svg"]
                  }
                  alt="Representaive Profile"
                  className="flex w-20 h-20 bg-yellow-300 object-cover rounded self-center"
                />
                <div className="w-full justify-items-center sm:justify-items-start sm:ml-4 mt-4 sm:mt-0">
                  <h1 className="text-lg">
                    {details.representative_full_name ?? "Not Yet Assigned"}
                  </h1>
                  <h1>{`Representaive - ${details.name}`}</h1>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block font-semibold">Section Name</label>
                  <div>{details.name}</div>
                </div>
                <div>
                  <label className="block font-semibold">Section Number</label>
                  <div>{details.section_no}</div>
                </div>
                <div>
                  <label className="block font-semibold">
                    Section Year Level
                  </label>
                  <div>{getYearLevel(details.section_no)}</div>
                </div>
                <div>
                  <label className="block font-semibold">
                    Students Enrolled
                  </label>
                  <div>{details.student_no}</div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block font-semibold">Section Created</label>
                  <div>{details.created_at}</div>
                </div>
                <div>
                  <label className="block font-semibold">Section Updated</label>
                  <div>{details.created_at}</div>
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

ViewSectionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  refreshData: PropTypes.func,
};
