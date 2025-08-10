import React from "react";
import styles from "./Modal.module.css";

const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
