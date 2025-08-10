

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import styles from "./Header.module.css";

const Header = () => {
  const dispatch = useDispatch();
  const admin = useSelector((state) => state.auth.admin);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className={styles.header}>
      <h2 className={styles.headerTitle}>Products</h2>
      <div className={styles.headerActions}>
       
        <div className={styles.profileSection}>
          <i className={`fa-regular fa-bell ${styles.notificationBell}`}></i>
          <div className={styles.profileAvatar}>AD</div>
          {isAuthenticated && (
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i> Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;