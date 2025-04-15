import { useState, useEffect, useContext, useRef } from "react";
import Modal from "../../components/ui/modal";
import PropTypes from "prop-types";
import NotificationPopup from "../../components/ui/NotificationPopup";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { IpContext } from "../../context/IpContext";
import configData from "../../data/sidebarConfig.json";

export default function UpdateAccountModal({
  isOpen,
  id,
  onClose,
  refreshData, // function to refresh AdminTableCard data after operations
}) {
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [designation, setDesignation] = useState("Member"); // default designation
  const [sections, setSections] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState("");
  const [notificationType, setNotificationType] = useState("success"); // or "error"
  // New state for generating a password
  const [generateNewPassword, setGenerateNewPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const ip = useContext(IpContext);

  // Refs for form controls and error message
  const fullNameRef = useRef(null);
  const studentIdRef = useRef(null);
  const emailRef = useRef(null);
  const sectionRef = useRef(null);
  const designationRef = useRef(null);
  const errorRef = useRef(null);

  // Get the designation options based on sidebar config.
  // For the group "Your Obligations", treat the "default" key as "Member".
  const designationOptions = Object.keys(
    configData.groups["Your Obligations"] || {}
  ).map((key) => (key === "default" ? "Member" : key));

  // Utility function to generate a random alphanumeric password of a given length.
  function generatePassword(length = 8) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  // Scroll error into view if exists
  useEffect(() => {
    if (errorMsg && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errorMsg]);

  // Fetch sections on mount when modal opens
  useEffect(() => {
    async function fetchSections() {
      try {
        const res = await fetch(`${ip}/fetch-sections`, {
          method: "GET",
        });
        const result = await res.json();
        if (result.status && result.data) {
          setSections(result.data);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      }
    }
    if (isOpen) fetchSections();
  }, [isOpen, ip]);

  // Fetch user details when modal opens and id is provided
  useEffect(() => {
    async function fetchUserDetails() {
      if (!id) {
        console.log(
          "UpdateAccountModal: No id provided, skipping fetchUserDetails."
        );
        return;
      }
      console.log("UpdateAccountModal: Fetching user details for id", id);
      try {
        const res = await fetch(`${ip}/fetch-user-details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error("Failed to fetch details");
        const result = await res.json();
        if (result.status && result.data) {
          const data = result.data;
          setFullName(data.full_name || "");
          setStudentId(data.student_id || "");
          setEmail(data.email || "");
          setSectionId(data.section_id || "");
          // If designation exists in the fetched data, use it; otherwise default to "Member"
          setDesignation(data.designation || "Member");
        } else {
          console.log(
            "UpdateAccountModal: No data returned from fetch-user-details"
          );
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
    if (isOpen) {
      console.log(
        "UpdateAccountModal: Modal is open, calling fetchUserDetails"
      );
      fetchUserDetails();
    }
  }, [isOpen, id, ip]);

  // Checks if user already exists
  async function checkUserExist() {
    try {
      const res = await fetch(`${ip}/check-user-exist-updated`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id, // send the current user's id to exclude from search
          full_name: fullName,
          student_id: studentId,
          email: email,
        }),
      });
      const result = await res.json();
      return result.exists; // returns true if another user exists with these details
    } catch (error) {
      console.error("Error checking user exist:", error);
      return false;
    }
  }

  // Handle account update with an optional new password
  async function handleUpdateAccount(e) {
    e.preventDefault();
    console.log("handleUpdateAccount triggered");
    setErrorMsg("");
    // Basic validation
    if (
      !fullName.trim() ||
      !studentId.trim() ||
      !email.trim() ||
      !sectionId ||
      !designation.trim()
    ) {
      setErrorMsg("All fields are required.");
      console.log("All fields are required");
      return;
    }
    // Check if user exists
    const exists = await checkUserExist();
    if (exists) {
      setErrorMsg("Full Name, Student ID, or Email already been used.");
      return;
    }
    // Prepare payload to update the user
    let payload = {
      id, // include user id for update
      full_name: fullName,
      student_id: studentId,
      email: email,
      section_id: sectionId,
      designation: designation,
    };
    if (generateNewPassword) {
      payload.new_password = newPassword;
    }
    try {
      const res = await fetch(`${ip}/update-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.status) {
        setNotificationMsg("Account updated successfully.");
        setNotificationType("success");
        setShowNotification(true);
        if (refreshData) refreshData();
        onClose();
      } else {
        setNotificationMsg(result.error || "Account update failed.");
        setNotificationType("error");
        setShowNotification(true);
      }
    } catch (error) {
      console.error("Error updating account:", error);
      setNotificationMsg("Account update failed due to an error.");
      setNotificationType("error");
      setShowNotification(true);
    }
  }

  // Handle checkbox change for generating a new password
  function handleGeneratePasswordChange(e) {
    const checked = e.target.checked;
    setGenerateNewPassword(checked);
    if (checked) {
      const generated = generatePassword();
      setNewPassword(generated);
    } else {
      setNewPassword("");
    }
  }

  // onBlur handlers to scroll to next field smoothly
  function handleFullNameBlur() {
    if (studentIdRef.current) {
      studentIdRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }
  function handleStudentIdBlur() {
    if (emailRef.current) {
      emailRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
  function handleEmailBlur() {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }
  function handleSectionBlur() {
    if (designationRef.current) {
      designationRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  if (!isOpen) return null;
  return (
    <>
      <Modal
        title="UPDATE ACCOUNT"
        isOpen={isOpen}
        onClose={onClose}
        w={"w-11/12 h-11/12 md:h-6/7 md:w-4/7 lg:w-3/7 xl:w-2/7"}
      >
        <form
          onSubmit={handleUpdateAccount}
          className="p-4 md:p-8 h-full w-full"
        >
          <div className="space-y-5 h-9/10 overflow-y-auto">
            <div className="mx-0.5">
              <label className="block text-sm font-semibold">Full Name</label>
              <Input
                ref={fullNameRef}
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={handleFullNameBlur}
                placeholder="Enter full name"
                className="rounded-md border border-black h-8 w-full"
              />
            </div>
            <div className="mx-0.5">
              <label className="block text-sm font-semibold">Student ID</label>
              <Input
                ref={studentIdRef}
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                onBlur={handleStudentIdBlur}
                placeholder="Enter student ID"
                className="rounded-md border border-black h-8 w-full"
              />
            </div>
            <div className="mx-0.5">
              <label className="block text-sm font-semibold">Email</label>
              <Input
                ref={emailRef}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                placeholder="Enter email"
                className="rounded-md border border-black h-8 w-full"
              />
            </div>
            <div className="mx-0.5">
              <label className="block text-sm font-semibold">Section</label>
              <select
                ref={sectionRef}
                className="w-full border rounded px-2 py-1 h-8"
                value={sectionId}
                onChange={(e) => setSectionId(e.target.value)}
                onBlur={handleSectionBlur}
              >
                <option value="">Select Section</option>
                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mx-0.5">
              <label className="block text-sm font-semibold">Designation</label>
              <select
                ref={designationRef}
                className="w-full border rounded px-2 py-1 h-8"
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              >
                {designationOptions.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {/* New option to generate a password */}
            <div className="mx-0.5 flex items-center space-x-2">
              <input
                id="generatePassword"
                type="checkbox"
                checked={generateNewPassword}
                onChange={handleGeneratePasswordChange}
                className="h-4 w-4"
              />
              <label
                htmlFor="generatePassword"
                className="text-sm font-semibold"
              >
                Generate New Password
              </label>
            </div>
            {generateNewPassword && (
              <div className="mx-0.5">
                <label className="block text-sm font-semibold">
                  New Password
                </label>
                <Input
                  type="text"
                  value={newPassword}
                  readOnly
                  className="rounded-md border border-gray-400 h-8 w-full bg-gray-200"
                />
              </div>
            )}
            {errorMsg && (
              <p ref={errorRef} className="text-red-600 text-sm">
                {errorMsg}
              </p>
            )}
          </div>
          <div className="flex place-self-end items-end h-1/10">
            <Button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded h-10 cursor-pointer transition-all duration-150 hover:bg-blue-800 transform hover:scale-105"
            >
              Update Account
            </Button>
          </div>
        </form>
      </Modal>
      {showNotification && (
        <NotificationPopup
          message={notificationMsg}
          type={notificationType}
          onClose={() => setShowNotification(false)}
        />
      )}
    </>
  );
}

UpdateAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fetchUrl: PropTypes.string,
  userData: PropTypes.object,
  refreshData: PropTypes.func,
};
