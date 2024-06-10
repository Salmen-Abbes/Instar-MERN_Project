import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  const handleClose = () => {
    onCancel(); // Close the modal when clicking on "Yes" or "No"
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Are you sure?</h2>
        <div className="buttons">
          <button onClick={() => { onConfirm(); handleClose(); }}>Yes</button>
          <button onClick={() => { onCancel(); handleClose(); }}>No</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
