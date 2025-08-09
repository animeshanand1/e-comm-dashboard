import React from "react";
import styles from "./FilterBar.module.css";
const FilterBar = () => {
  return (
    <div className={styles.filterBar}>
      <h3 className={styles.filterBarTitle}>Product List</h3>
      <div className={styles.filterActions}>
        <button className={styles.actionBtn}>
          <i className="fa-solid fa-filter"></i>
          <span>Filter</span>
        </button>
        <button className={styles.actionBtn}>
          <i className="fa-solid fa-upload"></i>
          <span>Export</span>
        </button>
        <button className={`${styles.actionBtn} ${styles.primary}`}>
          <i className="fa-solid fa-plus"></i>
          <span>Add Product</span>
        </button>
      </div>
    </div>
  );
};
export default FilterBar;
