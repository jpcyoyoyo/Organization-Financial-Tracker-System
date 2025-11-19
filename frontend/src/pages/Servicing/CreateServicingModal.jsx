import { useState, useEffect, useContext, useRef } from "react";
import Modal from "../../components/ui/modal";
import PropTypes from "prop-types";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useOutletContext } from "react-router-dom";
import { IpContext } from "../../context/IpContext";

export default function CreateServicingModal({
  isOpen,
  onClose,
  refreshData, // function to refresh data after operations
}) {
  // New servicing states
  const [studentUserId, setStudentUserId] = useState("");
  const [points, setPoints] = useState("");
  const [reason, setReason] = useState("");
  const [users, setUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");

  const { handleShowNotification } = useOutletContext();
  const ip = useContext(IpContext);

  const userData = sessionStorage.getItem("user");

  // Refs for inputs and error message
  const studentUserIdRef = useRef(null);
  const pointsRef = useRef(null);
  const reasonRef = useRef(null);
  const errorRef = useRef(null);

  // Scroll error into view when errorMsg changes.
  useEffect(() => {
    if (errorMsg && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errorMsg]);

  // Fetch available users when modal opens
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(`${ip}/fetch-user-options`, {
          method: "POST",
        });
        const result = await res.json();
        if (result.status && result.data) {
          setUsers(result.data);
        }
      } catch (error) {
        console.error("Error fetching user options:", error);
      }
    }
    if (isOpen) fetchUsers();
  }, [isOpen, ip]);

  // Handle servicing record creation
  async function handleCreateServicing(e) {
    e.preventDefault();
    setErrorMsg("");
    if (!studentUserId || !points.trim() || !reason.trim()) {
      setErrorMsg("All fields are required.");
      return;
    }
    try {
      const res = await fetch(`${ip}/create-servicing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_user_id: studentUserId,
          points: points,
          reason: reason,
          user_data: userData,
        }),
      });
      const result = await res.json();
      if (result.status) {
        handleShowNotification(
          "Servicing record created successfully.",
          "success"
        );
        if (refreshData) refreshData();
        resetForm();
        onClose();
      } else {
        handleShowNotification(result.error || "Creation failed.", "error");
      }
    } catch (error) {
      console.error("Error creating servicing record:", error);
      handleShowNotification("Creation failed due to an error.", "error");
    }
  }

  function resetForm() {
    setStudentUserId("");
    setPoints("");
    setReason("");
  }

  return (
    <Modal
      title="CREATE SERVICING RECORD"
      isOpen={isOpen}
      onClose={onClose}
      w={"w-11/12 h-11/12 md:h-6/7 md:w-4/7 lg:w-3/7 xl:w-2/7"}
    >
      <div className="p-4 md:p-10 h-full w-full">
        <form onSubmit={handleCreateServicing} className="h-full">
          <div className="space-y-6 h-4/5 overflow-y-auto">
            <div className="mx-0.5">
              <label className="block text-sm font-semibold">User</label>
              <select
                ref={studentUserIdRef}
                className="w-full border rounded px-2 py-1 h-10"
                value={studentUserId}
                onChange={(e) => setStudentUserId(e.target.value)}
              >
                {users.length === 0 && (
                  <option value="" disabled>
                    No users available
                  </option>
                )}
                {users.length > 0 && (
                  <option value="" disabled>
                    Select User
                  </option>
                )}
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mx-0.5">
              <label className="block text-sm font-semibold">Points</label>
              <Input
                ref={pointsRef}
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="Enter points"
                className="rounded-md border border-black h-10 w-full"
              />
            </div>
            <div className="mx-0.5">
              <label className="block text-sm font-semibold">Reason</label>
              <textarea
                ref={reasonRef}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason"
                className="rounded-md border border-black h-20 w-full resize-none p-2"
              />
            </div>
            {errorMsg && (
              <p ref={errorRef} className="text-red-600 text-sm">
                {errorMsg}
              </p>
            )}
          </div>
          <div className="flex justify-end items-end">
            <Button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded h-10 cursor-pointer transition-all duration-150 hover:bg-green-800 transform hover:scale-105"
            >
              Create Servicing Record
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

CreateServicingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  refreshData: PropTypes.func,
};
