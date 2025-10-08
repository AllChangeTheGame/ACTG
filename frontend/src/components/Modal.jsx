import React from "react";
import ReactDOM from "react-dom";
import './MoneyTracker.css';

const Modal = ({ children, onClose }) => {
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return ReactDOM.createPortal(
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <button className="modalClose" onClick={onClose}>✖</button>
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
