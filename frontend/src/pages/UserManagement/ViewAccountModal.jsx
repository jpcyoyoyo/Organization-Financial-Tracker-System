import { useState, useEffect, useContext } from "react";
import Modal from "../../components/ui/modal";
import PropTypes from "prop-types";
import { Button } from "../../components/ui/button";
import { IpContext } from "../../context/IpContext";
import { icons } from "../../assets/icons";

export default function ViewAccountModal({
  isOpen,
  onClose,
  onGoBack,
  rowData,
  id,
  updateModal: UpdateModal,
  deleteModal: DeleteModal,
  refreshData,
}) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const ip = useContext(IpContext);

  // Fetch detailed info when modal is open and id exists.
  useEffect(() => {
    async function fetchDetails() {
      if (!id) return;
      setLoading(true);
      setDetails(null);
      try {
        const response = await fetch(`${ip}/fetch-user-details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) throw new Error("Failed to fetch details");
        const result = await response.json();
        console.log("Fetched user details:", result);
        if (
          result.status &&
          result.data &&
          Object.keys(result.data).length > 0
        ) {
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

  return (
    <>
      <Modal
        title="VIEW ACCOUNT"
        isOpen={isOpen}
        onClose={() => {
          onClose();
          if (refreshData) {
            refreshData();
          }
        }}
        w="w-11/12 h-11/12 sm:w-5/7 lg:w-4/7"
      >
        {loading ? (
          <div className="p-4 h-full w-full flex items-center justify-center">
            <p>Loading...</p>
          </div>
        ) : details && Object.keys(details).length > 0 ? (
          <div className="p-4 h-full w-full">
            <div className="space-y-2 h-9/10 overflow-y-auto text-sm sm:text-base">
              {/* Header Section: Stack vertically on mobile */}
              <div className="flex flex-col sm:flex-row w-full items-center">
                <img
                  src={icons[details.profile_pic] || details.profile_pic}
                  alt="Profile"
                  className="w-32 h-32 bg-yellow-300 object-cover rounded"
                />
                <div className="w-full justify-items-center sm:justify-items-start sm:ml-4 mt-4 sm:mt-0">
                  <div className="justify-items-center sm:justify-items-start">
                    <p className="text-xl font-bold">{details.full_name}</p>
                    <p>{details.student_id}</p>
                    <p>{details.designation}</p>
                  </div>
                  <div className="flex items-center mt-2">
                    <p
                      className={`text-lg mr-2 ${
                        details.is_online === 1
                          ? "text-green-600"
                          : "text-red-600"
                      } font-extrabold`}
                    >
                      {details.is_online === 1 ? "Online" : "Offline"}
                    </p>
                    {details.is_login_web === 1 && (
                      <img
                        src={icons["src/assets/web_online.svg"]}
                        alt="Web Online"
                        className="w-5 h-5 object-cover mr-1"
                      />
                    )}
                    {details.is_login_mobile === 1 && (
                      <img
                        src={icons["src/assets/mobile_online.svg"]}
                        alt="Mobile Online"
                        className="w-4 h-4 object-cover"
                      />
                    )}
                  </div>
                </div>
                <img
                  src={
                    icons[details.qr_code] ||
                    icons["src/assets/sample_qrcode.svg"]
                  }
                  alt="QR Code"
                  className="hidden sm:flex w-24 h-24 bg-yellow-300 object-cover rounded self-start"
                />
              </div>
              {/* Grid displaying the remaining data with label above (responsive) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block font-semibold">User ID</label>
                  <div>{details.id}</div>
                </div>
                <div>
                  <label className="block font-semibold">Email</label>
                  <div>{details.email}</div>
                </div>
                <div>
                  <label className="block font-semibold">Account Created</label>
                  <div>{details.created_at}</div>
                </div>
                <div>
                  <label className="block font-semibold">Account Updated</label>
                  <div>{details.updated_at}</div>
                </div>
                <div>
                  <label className="block font-semibold">Password</label>
                  <div>
                    {details.initial_password
                      ? details.initial_password
                      : "Password Change"}
                  </div>
                </div>
                <div>
                  <label className="block font-semibold">Section</label>
                  <div>
                    {details.section_name
                      ? details.section_name
                      : "Not Yet Assigned"}
                  </div>
                </div>
                <div>
                  <label className="block font-semibold">
                    Servicing Points
                  </label>
                  <div>{details.servicing_points}</div>
                </div>
              </div>
              <div className="block sm:hidden mt-4 sm:mt-0 place-items-center w-full">
                <img
                  src={
                    icons[details.qr_code] ||
                    icons["src/assets/sample_qrcode.svg"]
                  }
                  alt="QR Code"
                  className="w-32 h-32 bg-yellow-300 object-cover rounded"
                />
              </div>
            </div>
            {/* Buttons area */}
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

ViewAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onGoBack: PropTypes.func,
  rowData: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  updateModal: PropTypes.elementType,
  deleteModal: PropTypes.elementType,
  refreshData: PropTypes.func,
};
