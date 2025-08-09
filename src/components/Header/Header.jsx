
import React from "react";
import styles from "./Header.module.css";
const Header = () => {
  return (
    <header className={styles.header}>
      <h2 className={styles.headerTitle}>Products</h2>
      <div className={styles.headerActions}>
        <div className={styles.searchBar}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search products..."
            className={styles.searchInput}
          />
        </div>
        <div className={styles.profileSection}>
          <i className={`fa-regular fa-bell ${styles.notificationBell}`}></i>
          <div className={styles.profileAvatar}>AD</div>
        </div>
      </div>
    </header>
  );
};
export default Header;