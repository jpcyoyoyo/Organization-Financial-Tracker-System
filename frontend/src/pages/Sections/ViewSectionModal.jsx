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
        console.error("Error fetching section details:", error);
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
      1: "First Year",
      2: "Second Year",
      3: "Third Year",
      4: "Fourth Year",
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
        w="w-11/12 h-11/12 sm:h-11/12 sm:w-5/7 lg:w-4/7"
        modalCenter={true}
      >
        {loading ? (
          <div className="p-4 h-full w-full flex items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : details ? (
          <div className="p-1 sm:p-4 h-full w-full">
            <div className="space-y-1 h-full overflow-y-auto text-sm sm:text-base">
              {/* Section Info Card */}
              <div className="border rounded-lg bg-[#ff637d1b]">
                <h2 className="text-lg font-bold px-4 py-2 rounded-t-lg bg-rose-400 truncate">
                  SECTION {details.name}
                </h2>

                {/* Representative Section */}
                <div className="flex flex-col lg:flex-row text-sm text-gray-700 p-4 w-full gap-4">
                  <div className="w-full lg:w-4/5 text-sm text-gray-700">
                    <h3 className="font-semibold mb-3">
                      CURRENT SECTION REPRESENTATIVE
                    </h3>
                    <div className="flex flex-col md:flex-row w-full items-center gap-3">
                      <img
                        src={
                          details.representative_profile_pic &&
                          !details.representative_profile_pic.startsWith("src/")
                            ? `${ip}/profile-pic/${details.representative_profile_pic}`
                            : icons[details.representative_profile_pic] ||
                              icons["src/assets/profile_default.svg"]
                        }
                        alt="Representative Profile"
                        className="border flex w-20 h-20 md:w-32 md:h-32 bg-yellow-300 object-cover rounded flex-shrink-0"
                      />
                      <div className="w-full justify-items-center md:justify-items-start text-center md:text-left">
                        <h1 className="font-bold text-lg md:text-2xl">
                          {details.representative_full_name ??
                            "Not Yet Assigned"}
                        </h1>
                        <h1 className="text-sm md:text-lg text-gray-600">
                          Representative - {details.name}
                        </h1>
                      </div>
                    </div>
                  </div>
                  {/* Section Details Grid */}
                  <div className="w-full lg:w-1/5 text-sm px-0 lg:px-4 py-2 grid border-t lg:border-t-0 lg:border-l grid-cols-2 lg:grid-cols-1 gap-2 md:gap-4">
                    <div>
                      <label className="block font-semibold">Year Level</label>
                      <div>{getYearLevel(details.year)}</div>
                    </div>
                    <div>
                      <label className="block font-semibold">Section No</label>
                      <div>{details.section_no}</div>
                    </div>
                  </div>
                </div>

                <div className="text-sm px-4 py-2 grid border-t grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold">
                      Students Enrolled
                    </label>
                    <div>{details.student_no}</div>
                  </div>
                  <div>
                    <label className="block font-semibold">Section ID</label>
                    <div>{details.id}</div>
                  </div>
                </div>
                {/* Enrolled Users Table */}
                <div className="border-t p-4">
                  <h3 className="font-semibold mb-3">ENROLLED STUDENTS</h3>
                  <div className="border rounded-lg bg-white overflow-x-auto max-h-64 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-rose-400 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold">
                            Profile
                          </th>
                          <th className="px-3 py-2 text-left font-semibold">
                            Student ID
                          </th>
                          <th className="px-3 py-2 text-left font-semibold">
                            Name
                          </th>
                          <th className="px-3 py-2 text-left font-semibold">
                            Designation
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {details.enrolled_users &&
                        details.enrolled_users.length > 0 ? (
                          details.enrolled_users.map((user, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                              <td className="px-3 py-2">
                                <img
                                  src={
                                    user.profile_pic &&
                                    !user.profile_pic.startsWith("src/")
                                      ? `${ip}/profile-pic/${user.profile_pic}`
                                      : icons[user.profile_pic] ||
                                        icons["src/assets/profile_default.svg"]
                                  }
                                  alt="User Profile"
                                  className="border w-10 h-10 bg-yellow-300 object-cover rounded"
                                />
                              </td>
                              <td className="px-3 py-2 truncate">
                                {user.student_id}
                              </td>
                              <td className="px-3 py-2 truncate">
                                {user.full_name}
                              </td>
                              <td className="px-3 py-2 truncate">
                                {user.designation}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-3 py-4 text-center text-gray-500"
                            >
                              No enrolled students in this section
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="text-sm px-4 py-2 grid border-t grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold">
                      Section Created
                    </label>
                    <div>{details.created_at}</div>
                  </div>
                  <div>
                    <label className="block font-semibold">
                      Section Updated
                    </label>
                    <div>{details.updated_at}</div>
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

ViewSectionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  refreshData: PropTypes.func,
};
