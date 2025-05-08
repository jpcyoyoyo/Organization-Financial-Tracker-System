import { useState, useEffect, useContext, useRef } from "react";
import Modal from "../../components/ui/modal";
import PropTypes from "prop-types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useOutletContext } from "react-router-dom";
import { IpContext } from "../../context/IpContext";

export default function UpdateManageFinancialGroupingModal({
  isOpen,
  id,
  onClose,
  refreshData, // function to refresh AdminTableCard data after operations
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tab, setTab] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { handleShowNotification } = useOutletContext();
  const ip = useContext(IpContext);

  // Refs for inputs and error message
  const nameRef = useRef(null);
  const descriptionRef = useRef(null);
  const errorRef = useRef(null);

  // Scroll error into view if errorMsg changes
  useEffect(() => {
    if (errorMsg && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errorMsg]);

  // Checks if user already exists
  async function checkRecordGroupExist() {
    try {
      const res = await fetch(`${ip}/check-record-group-exist-updated`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
          name: name,
          tab: tab,
        }),
      });
      const result = await res.json();
      return result.exists;
    } catch (error) {
      console.error("Error checking record group for deposit exist:", error);
      return false;
    }
  }

  useEffect(() => {
    async function fetchRecordGroupDetails() {
      if (!id) {
        console.log(
          "UpdateRecordGroupModal: No id provided, skipping fetchRecordGroupDetails."
        );
        return;
      }
      console.log(
        "UpdateRecordGroupModal: Fetching record group details for id",
        id
      );
      try {
        const res = await fetch(`${ip}/fetch-record-group-details`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        if (!res.ok) throw new Error("Failed to fetch details");
        const result = await res.json();
        if (result.status && result.data) {
          const data = result.data;
          setName(data.name || "");
          setDescription(data.description || "");
          setTab(data.tab || "");
        } else {
          console.log(
            "UpdateRecordGroupModal: No data returned from fetch-record-group-details"
          );
        }
      } catch (error) {
        console.error("Error fetching record group details:", error);
      }
    }
    if (isOpen) {
      console.log(
        "UpdateRecordGroupModal: Modal is open, calling fetchRecordGroupDetails"
      );
      fetchRecordGroupDetails();
    }
  }, [isOpen, id, ip]);

  // Handle account creation
  async function handleUpdateRecordGroup(e) {
    e.preventDefault();
    setErrorMsg("");
    if (!name.trim() || !description.trim()) {
      setErrorMsg("All fields are required.");
      return;
    }
    const exists = await checkRecordGroupExist();
    if (exists) {
      setErrorMsg("Record group already exists.");
      return;
    }
    try {
      const res = await fetch(`${ip}/update-record-group`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id,
          name: name,
          description: description,
        }),
      });
      const result = await res.json();
      if (result.status) {
        handleShowNotification("Record group updated successfully.", "success");
        if (refreshData) refreshData();
        resetForm();
        onClose();
      } else {
        handleShowNotification(
          result.error || "Record group update failed.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error updating account:", error);
      handleShowNotification(
        "Record group update failed due to an error.",
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
        title="UPDATE RECORD GROUP"
        isOpen={isOpen}
        onClose={onClose}
        w={"w-11/12 h-11/12 md:h-6/7 md:w-4/7 lg:w-3/7 xl:w-3/7"}
      >
        <form
          onSubmit={handleUpdateRecordGroup}
          className="p-4 md:p-10 h-full w-full"
        >
          <p className="block font-semibold h-1/17">{`UPDATING ${
            tab === "deposit" ? "DEPOSIT SOURCE" : "EXPENSE CATEGORY"
          }`}</p>
          <div className="space-y-10 h-13/17 overflow-y-auto">
            <div className="mx-0.5">
              <label className="block text-sm font-semibold">
                {`${tab === "deposit" ? "Source" : "Category"} Name`}
              </label>
              <Input
                ref={nameRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleNameBlur}
                placeholder={`Enter ${
                  tab === "deposit" ? "deposit source" : "expense category"
                } name`}
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

          <div className="flex place-self-end items-end h-3/17">
            <Button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded h-10 cursor-pointer transition-all duration-150 hover:bg-green-800 transform hover:scale-105"
            >
              Update Group
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

UpdateManageFinancialGroupingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fetchUrl: PropTypes.string,
  userData: PropTypes.object,
  refreshData: PropTypes.func,
};
