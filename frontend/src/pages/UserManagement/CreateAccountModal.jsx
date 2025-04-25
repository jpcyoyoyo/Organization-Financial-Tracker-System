import { useState, useEffect, useContext, useRef } from "react";
import Modal from "../../components/ui/modal";
import PropTypes from "prop-types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useOutletContext } from "react-router-dom";
import { IpContext } from "../../context/IpContext";

export default function CreateAccountModal({
  isOpen,
  onClose,
  refreshData, // function to refresh AdminTableCard data after operations
}) {
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [sections, setSections] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const { handleShowNotification } = useOutletContext();
  const ip = useContext(IpContext);

  // Refs for inputs and error message
  const fullNameRef = useRef(null);
  const studentIdRef = useRef(null);
  const emailRef = useRef(null);
  const sectionRef = useRef(null);
  const errorRef = useRef(null);

  // Scroll error into view if errorMsg changes
  useEffect(() => {
    if (errorMsg && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errorMsg]);

  // Fetch sections on mount when modal opens
  useEffect(() => {
    async function fetchSections() {
      try {
        const res = await fetch(`${ip}/fetch-section-options`, {
          method: "POST",
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

  // Checks if user already exists
  async function checkUserExist() {
    try {
      const res = await fetch(`${ip}/check-user-exist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          student_id: studentId,
          email: email,
        }),
      });
      const result = await res.json();
      return result.exists;
    } catch (error) {
      console.error("Error checking user exist:", error);
      return false;
    }
  }

  // Handle account creation
  async function handleCreateAccount(e) {
    e.preventDefault();
    setErrorMsg("");
    if (!fullName.trim() || !studentId.trim() || !email.trim() || !sectionId) {
      setErrorMsg("All fields are required.");
      return;
    }
    const exists = await checkUserExist();
    if (exists) {
      setErrorMsg("User already exists.");
      return;
    }
    try {
      const res = await fetch(`${ip}/create-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          student_id: studentId,
          email: email,
          section_id: sectionId,
        }),
      });
      const result = await res.json();
      if (result.status) {
        handleShowNotification("Account created successfully.", "success");
        if (refreshData) refreshData();
        onClose();
      } else {
        handleShowNotification(
          result.error || "Account creation failed.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error creating account:", error);
      handleShowNotification(
        "Account creation failed due to an error.",
        "error"
      );
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

  if (!isOpen) return null;
  return (
    <>
      <Modal
        title="CREATE ACCOUNT"
        isOpen={isOpen}
        onClose={onClose}
        w={"w-11/12 h-11/12 md:h-6/7 md:w-4/7 lg:w-3/7 xl:w-2/7"}
      >
        <form
          onSubmit={handleCreateAccount}
          className="p-4 md:p-10 h-full w-full"
        >
          <div className="space-y-10 h-4/5 overflow-y-auto">
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
              >
                {sections.length === 0 && (
                  <option value="" disabled>
                    No sections available - Create a section first
                  </option>
                )}

                {sections.length > 0 && (
                  <option value="" disabled>
                    Select section
                  </option>
                )}

                {sections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.name}
                  </option>
                ))}
              </select>
            </div>
            {errorMsg && (
              <p ref={errorRef} className="text-red-600 text-sm">
                {errorMsg}
              </p>
            )}
          </div>

          <div className="flex place-self-end items-end h-1/5">
            <Button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded h-10 cursor-pointer transition-all duration-150 hover:bg-green-800 transform hover:scale-105"
            >
              Create Account
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

CreateAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fetchUrl: PropTypes.string,
  userData: PropTypes.object,
  refreshData: PropTypes.func,
};
