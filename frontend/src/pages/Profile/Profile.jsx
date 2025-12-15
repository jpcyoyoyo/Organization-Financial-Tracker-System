import { useState, useEffect, useContext } from "react";
import { icons } from "../../assets/icons";
import { motion } from "framer-motion";
import { IpContext } from "../../context/IpContext";
import MainContent from "../../components/ui/maincontent";
import NotificationPopup from "../../components/ui/notificationpopup";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showChangeProfilePic, setShowChangeProfilePic] = useState(false);

  const ip = useContext(IpContext);

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      setUserData(user);
    }
  }, []);

  const handleProfilePicChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("profilePic", file);
    formData.append("userId", userData.id);

    try {
      const response = await fetch(`${ip}/upload-profile-pic`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.status && result.data) {
        // Update session storage with new user details
        sessionStorage.setItem("user", JSON.stringify(result.data));
        setUserData(result.data);

        // Dispatch event to update sidebar and other components
        window.dispatchEvent(new Event("userUpdated"));

        setNotification({
          message: "Profile picture updated successfully!",
          type: "success",
        });
      } else {
        setNotification({
          message: result.error || "Failed to upload profile picture",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setNotification({
        message: "Error uploading profile picture",
        type: "error",
      });
    } finally {
      setIsUploading(false);
      setShowChangeProfilePic(false);
    }
  };

  return (
    <MainContent
      titletab="PROFILE - Organization Financial Tracker"
      contentName="PROFILE"
      textFormat="text-3xl pt-1"
    >
      {notification && (
        <NotificationPopup
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {userData ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="p-6 w-full mx-auto bg-white rounded-lg shadow-lg"
        >
          <div className="space-y-4">
            {/* Header Section: Stack vertically on mobile */}
            <div className="flex flex-col sm:flex-row w-full items-start sm:items-center gap-4">
              {/* Profile Picture with change overlay */}
              <div
                className="relative w-32 h-32 flex-shrink-0 cursor-pointer"
                onMouseEnter={() => setShowChangeProfilePic(true)}
                onMouseLeave={() => setShowChangeProfilePic(false)}
              >
                <img
                  src={
                    icons[userData.profile_pic] ||
                    `${ip}/profile-pic/${userData.profile_pic}`
                  }
                  alt="Profile"
                  className="w-32 h-32 bg-yellow-300 object-cover rounded border"
                />
                {showChangeProfilePic && (
                  <div className="transition-all duration-300 opacity-0 hover:opacity-100 absolute inset-0 hover:bg-[#000000c7] rounded flex items-center justify-center">
                    <label className="cursor-pointer flex flex-col items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-white text-xs mt-1">
                        {isUploading ? "Uploading..." : "Change"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePicChange}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div>
                  <p className="text-xl font-bold">{userData.full_name}</p>
                  <p>{userData.student_id}</p>
                  <p>{userData.designation}</p>
                </div>
                <div className="flex items-center mt-2 justify-center sm:justify-start">
                  <p
                    className={`text-lg mr-2 ${
                      userData.is_online === 1
                        ? "text-green-600"
                        : "text-red-600"
                    } font-extrabold`}
                  >
                    {userData.is_online === 1 ? "Online" : "Offline"}
                  </p>
                  {userData.is_login_web === 1 && (
                    <img
                      src={icons["src/assets/web_online.svg"]}
                      alt="Web Online"
                      className="w-5 h-5 object-cover mr-1"
                    />
                  )}
                  {userData.is_login_mobile === 1 && (
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
                  icons[userData.qr_code] ||
                  icons["src/assets/sample_qrcode.svg"]
                }
                alt="QR Code"
                className="hidden sm:flex w-24 h-24 flex-shrink-0 bg-yellow-300 object-cover rounded"
              />
            </div>

            {/* Grid displaying the remaining data with label above (responsive) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div>
                <label className="block font-semibold">User ID</label>
                <div>{userData.id}</div>
              </div>
              <div>
                <label className="block font-semibold">Email</label>
                <div>{userData.email}</div>
              </div>
              <div>
                <label className="block font-semibold">Account Created</label>
                <div>{userData.created_at}</div>
              </div>
              <div>
                <label className="block font-semibold">Account Updated</label>
                <div>{userData.updated_at}</div>
              </div>
              <div>
                <label className="block font-semibold">Password</label>
                <div>
                  {userData.initial_password
                    ? userData.initial_password
                    : "Password Changed"}
                </div>
              </div>
              <div>
                <label className="block font-semibold">Section</label>
                <div>
                  {userData.section_name
                    ? userData.section_name
                    : "Not Yet Assigned"}
                </div>
              </div>
              <div>
                <label className="block font-semibold">Status</label>
                <div>{userData.status}</div>
              </div>
              <div>
                <label className="block font-semibold">Servicing Points</label>
                <div>{userData.servicing_points}</div>
              </div>
            </div>

            <div className="block sm:hidden mt-6 place-items-center w-full">
              <img
                src={
                  icons[userData.qr_code] ||
                  icons["src/assets/sample_qrcode.svg"]
                }
                alt="QR Code"
                className="w-32 h-32 bg-yellow-300 object-cover rounded"
              />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-lg mt-6 text-center"
        >
          Loading user profile...
        </motion.div>
      )}
    </MainContent>
  );
}
