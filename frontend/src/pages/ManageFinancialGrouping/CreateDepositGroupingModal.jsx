import { useState, useEffect, useContext, useRef } from "react";
import Modal from "../../components/ui/modal";
import PropTypes from "prop-types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useOutletContext } from "react-router-dom";
import { IpContext } from "../../context/IpContext";

export default function CreateDepositGroupingModal({
  isOpen,
  onClose,
  refreshData, // function to refresh AdminTableCard data after operations
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { handleShowNotification } = useOutletContext();
  const ip = useContext(IpContext);

  // Refs for inputs and error message
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const errorRef = useRef(null);

  const userData = sessionStorage.getItem("user");

  // Scroll error into view if errorMsg changes
  useEffect(() => {
    if (errorMsg && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errorMsg]);

  // Checks if user already exists
  async function checkRecordGroupExist() {
    try {
      const res = await fetch(`${ip}/check-record-group-exist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          tab: "deposit",
        }),
      });
      const result = await res.json();
      return result.exists;
    } catch (error) {
      console.error("Error checking record group for deposit exist:", error);
      return false;
    }
  }

  // Handle account creation
  async function handleCreateRecordGroup(e) {
    e.preventDefault();
    setErrorMsg("");
    if (!name.trim() || !description.trim()) {
      setErrorMsg("All fields are required.");
      return;
    }
    const exists = await checkRecordGroupExist();
    if (exists) {
      setErrorMsg("Record group for deposit already exists.");
      return;
    }
    try {
      const res = await fetch(`${ip}/create-record-group`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_data: userData,
          name: name,
          description: description,
          tab: "deposit",
        }),
      });
      const result = await res.json();
      if (result.status) {
        handleShowNotification(
          "Record group for deposit created successfully.",
          "success"
        );
        if (refreshData) refreshData();
        resetForm();
        onClose();
      } else {
        handleShowNotification(
          result.error || "Record group for deposit creation failed.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error creating account:", error);
      handleShowNotification(
        "Record group for deposit creation failed due to an error.",
        "error"
      );
    }
  }

  function resetForm() {
    setName("");
    setDescription("");
  }

  // onBlur handlers to scroll to next field smoothly
  function handleNameBlur() {
    if (description.current) {
      description.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }

  if (!isOpen) return null;
  return (
    <>
      <Modal
        title="CREATE DEPOSIT SOURCE"
        isOpen={isOpen}
        onClose={onClose}
        w={"w-11/12 h-11/12 md:h-6/7 md:w-4/7 lg:w-3/7 xl:w-3/7"}
      >
        <form
          onSubmit={handleCreateRecordGroup}
          className="p-4 md:p-10 h-full w-full"
        >
          <div className="space-y-10 h-4/5 overflow-y-auto">
            <div className="mx-0.5">
              <label className="block text-sm font-semibold">Source Name</label>
              <Input
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleNameBlur}
                placeholder="Enter deposit source name"
                className="rounded-md border border-black h-8 w-full"
              />
            </div>
            <div className="mx-0.5">
              <label className="block text-sm font-semibold">Description</label>
              <textarea
                ref={descriptionRef}
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="rounded-md border border-black h-40 p-1.5 w-full resize-none"
              />
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
              Create Group
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

CreateDepositGroupingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  fetchUrl: PropTypes.string,
  userData: PropTypes.object,
  refreshData: PropTypes.func,
};
