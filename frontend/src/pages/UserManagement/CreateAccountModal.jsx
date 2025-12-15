import { useState, useEffect, useContext, useRef } from "react";
import Modal from "../../components/ui/modal";
import PropTypes from "prop-types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useOutletContext } from "react-router-dom";
import { IpContext } from "../../context/IpContext";
import * as XLSX from "xlsx";
import axios from "axios";

export default function CreateAccountModal({
  isOpen,
  onClose,
  refreshData, // function to refresh AdminTableCard data after operations
}) {
  // Manual account states
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

  // Excel uploader states
  const [excelData, setExcelData] = useState([]);
  const [isBulk, setIsBulk] = useState(false);
  const fileInputRef = useRef(null);
  const [excelError, setExcelError] = useState("");

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

  // Handle manual account creation
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
        resetForm();
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

  function resetForm() {
    setFullName("");
    setStudentId("");
    setEmail("");
    setSectionId("");
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

  // Excel uploader handlers
  // Modify handleFileUpload as follows:
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();

    reader.onload = (evt) => {
      const arrayBuffer = evt.target.result;
      const wb = XLSX.read(arrayBuffer, { type: "array" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const parsedData = XLSX.utils.sheet_to_json(ws, { defval: "" });

      if (parsedData.length === 0) {
        setExcelError("Excel file is empty.");
        setExcelData([]);
        return;
      }

      // List of required columns
      const requiredColumns = [
        "StudentNo",
        "First Name",
        "Middle Name",
        "Surname",
        "Email",
        "Year",
        "Section",
        "Status",
      ];

      const firstRow = parsedData[0];
      let missingColumns = requiredColumns.filter(
        (col) => !Object.prototype.hasOwnProperty.call(firstRow, col)
      );
      // Check if at least one of "Last Name" or "Surname" exists.
      if (!("Last Name" in firstRow) && !("Surname" in firstRow)) {
        missingColumns.push("Last Name/Surname");
      }

      if (missingColumns.length > 0) {
        setExcelError("Missing required columns: " + missingColumns.join(", "));
        setExcelData([]);
        return;
      } else {
        setExcelError("");
      }

      // Process the data: Concatenate first name, middle initial, last name,
      // and also create a YearSection property like year + "0" + section.
      const processedData = parsedData.map((row) => {
        const first = row["First Name"] || "";
        const middleName = row["Middle Name"] ? row["Middle Name"].trim() : "";
        const middleInitial = middleName ? middleName.charAt(0) + "." : "";
        const last = row["Last Name"] || row["Surname"] || "";
        const fullName = [first, middleInitial, last].filter(Boolean).join(" ");
        // Concatenate Year and Section: year + "0" + section
        const year = row["Year"] || "";
        const section = row["Section"] || "";
        const yearSection = `${year}0${section}`;
        return {
          StudentID: row["StudentNo"],
          FullName: fullName,
          Section: yearSection,
          Status: row["Status"],
          Email: row["Email"],
        };
      });
      setExcelData(processedData);
    };

    reader.readAsArrayBuffer(file);
  };

  const sendExcelToServer = async () => {
    try {
      // Change the endpoint as required
      const response = await axios.post(
        `${ip}/bulk-create-accounts`,
        excelData
      );
      console.log("Data sent successfully", response.data);
      handleShowNotification("Bulk accounts created successfully", "success");
      if (refreshData) refreshData();
      setExcelData([]);
      onClose();
    } catch (error) {
      console.error("Error sending data", error);
      handleShowNotification("Error sending bulk data", "error");
    }
  };

  if (!isOpen) return null;
  return (
    <>
      <Modal
        title="CREATE ACCOUNT"
        isOpen={isOpen}
        onClose={onClose}
        w={"w-11/12 h-11/12 md:h-6/7 md:w-4/7 lg:w-3/7 xl:w-2/7"}
      >
        <div className="p-4 md:p-10 h-full w-full">
          {/* Toggle between manual and bulk upload */}
          <div className="h-1/7">
            <Button
              type="button"
              onClick={() => setIsBulk((prev) => !prev)}
              className="bg-blue-600 text-white px-4 py-2 rounded h-10 cursor-pointer transition-all duration-150 hover:bg-blue-800 transform hover:scale-105"
            >
              {isBulk ? "Switch to Manual Entry" : "Bulk Upload via Excel"}
            </Button>
          </div>
          {!isBulk ? (
            // Manual account creation form
            <form onSubmit={handleCreateAccount} className="h-full">
              <div className="space-y-10 h-5/7 overflow-y-auto">
                <div className="mx-0.5">
                  <label className="block text-sm font-semibold">
                    Full Name
                  </label>
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
                  <label className="block text-sm font-semibold">
                    Student ID
                  </label>
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
              <div className="flex place-self-end items-end h-1/7">
                <Button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded h-10 cursor-pointer transition-all duration-150 hover:bg-green-800 transform hover:scale-105"
                >
                  Create Account
                </Button>
              </div>
            </form>
          ) : (
            // Bulk upload view
            <div className="h-6/7 w-full flex flex-col">
              <div className="h-4/5 space-y-2">
                {/* Hidden file input */}
                <input
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />
                <Button
                  type="button"
                  onClick={() =>
                    fileInputRef.current && fileInputRef.current.click()
                  }
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-md cursor-pointer transition-all duration-150 hover:bg-green-800 transform hover:scale-105 flex items-center space-x-3"
                >
                  {/* Replace the src with the correct Excel logo path */}
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/f/f3/.xlsx_icon.svg"
                    alt="Excel Logo"
                    className="w-8 h-8"
                  />
                  <span>Upload Excel File</span>
                </Button>
                {excelError ? (
                  <div className="h-4/5 w-full border flex items-center justify-center">
                    <p className="text-xs text-red-500">{excelError}</p>
                  </div>
                ) : excelData && excelData.length > 0 ? (
                  <div className="overflow-x-auto overflow-y-auto h-4/5 border w-full">
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr>
                          {Object.keys(excelData[0]).map((key) => (
                            <th
                              key={key}
                              className="sticky top-0 border p-2 text-xs font-bold text-left bg-gray-200 z-10 whitespace-nowrap"
                            >
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {excelData.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {Object.keys(row).map((col) => (
                              <td
                                key={col}
                                className="border p-2 text-xs whitespace-nowrap"
                              >
                                {row[col]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="h-4/5 w-full border flex items-center justify-center">
                    <p className="text-xs text-gray-500">
                      No Excel file uploaded yet
                    </p>
                  </div>
                )}
              </div>
              <div className="flex place-self-end space-x-2 items-end h-1/5">
                <Button
                  type="button"
                  onClick={sendExcelToServer}
                  className="bg-green-600 text-white px-4 py-2 rounded h-10 cursor-pointer transition-all duration-150 hover:bg-green-800 transform hover:scale-105"
                >
                  Process Users
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setIsBulk(false);
                    setExcelData([]);
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded h-10 cursor-pointer transition-all duration-150 hover:bg-red-800 transform hover:scale-105"
                >
                  Cancel Bulk Upload
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}

CreateAccountModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refreshData: PropTypes.func,
};
