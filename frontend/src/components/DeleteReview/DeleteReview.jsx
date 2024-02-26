import React from "react";
import "../DeleteSpot/ConfirmationModal";

function ConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="modal-container">
      <div className="modal">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this review?</p>
        <button onClick={onConfirm}>Yes (Delete Review)</button>
        <button onClick={onClose}>No (Keep Review)</button>
      </div>
    </div>
  );
}

export default ConfirmationModal;
