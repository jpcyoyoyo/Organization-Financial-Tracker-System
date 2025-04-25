import { useState, useEffect, useContext, useRef } from "react";
import Modal from "../../components/ui/modal";
import PropTypes from "prop-types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useOutletContext } from "react-router-dom";
import { IpContext } from "../../context/IpContext";

export default function CreateSectionModal({ isOpen, onClose, refreshData }) {
  const [sectionNo, setSectionNo] = useState("");
  const [year, setYear] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { handleShowNotification } = useOutletContext();
  const ip = useContext(IpContext);

  // Refs for inputs and error message
  const sectionNoRef = useRef(null);
  const yearRef = useRef(null);
  const errorRef = useRef(null);

  const userData = sessionStorage.getItem("user");

  // Scroll error into view if errorMsg changes
  useEffect(() => {
    if (errorMsg && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errorMsg]);

  // Checks if user already exists
  async function checkUserExist() {
    try {
      const res = await fetch(`${ip}/check-section-exist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          section_no: sectionNo,
          year: year,
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
  async function handleCreateSecion(e) {
    e.preventDefault();
    setErrorMsg("");
    if (!sectionNo.trim() || !year) {
      setErrorMsg("All fields are required.");
      return;
    }
    const exists = await checkUserExist();
    if (exists) {
      setErrorMsg("Section already exists.");
      return;
    }

    if (!/^\d$/.test(sectionNo)) {
      setErrorMsg("Section number must be a single digit.");
      return;
    }

    try {
      const res = await fetch(`${ip}/create-section`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_data: userData,
          section_no: sectionNo,
          year: year,
        }),
      });
      const result = await res.json();
      if (result.status) {
        handleShowNotification("Section created successfully.", "success");
        if (refreshData) refreshData();
        onClose();
      } else {
        handleShowNotification(
          result.error || "Section creation failed.",
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

  function handleSectionNoBlur() {
    if (yearRef.current) {
      yearRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  if (!isOpen) return null;
  return (
    <>
      <Modal
        title="CREATE SECTION"
        isOpen={isOpen}
        onClose={onClose}
        w={"w-11/12 h-6/12 md:h-4/7 md:w-4/7 lg:w-3/7 xl:w-2/7"}
        modalCenter={true}
      >
        <form
          onSubmit={handleCreateSecion}
          className="p-4 md:p-10 h-full w-full"
        >
          <div className="space-y-10 h-4/5 overflow-y-auto">
            <div className="mx-0.5">
              <label className="block text-sm font-semibold">
                Section Number
              </label>
              <Input
                ref={sectionNoRef}
                type="text"
                value={sectionNo}
                onChange={(e) => setSectionNo(e.target.value)}
                onBlur={handleSectionNoBlur}
                placeholder="Enter student number"
                className="rounded-md border border-black h-8 w-full"
              />
            </div>
            <div className="mx-0.5">
              <label className="block text-sm font-semibold">
                Section Year
              </label>
              <select
                ref={yearRef}
                className="w-full border rounded px-2 py-1 h-8"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="" disabled>
                  Select section year
                </option>
                <option value="1">1 - Freshmen</option>
                <option value="2">2 - Sophomore</option>
                <option value="3">3 - Junior</option>
                <option value="4">4 - Senior</option>
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
              Create Section
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

CreateSectionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fetchUrl: PropTypes.string,
  userData: PropTypes.object,
  refreshData: PropTypes.func,
};
