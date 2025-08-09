import React from "react";
import styles from "./Pagination.module.css";
const Pagination = ({ totalItems }) => {
   
    return (
        <div className={styles.paginationControls}>
            <div>Showing 1 to {totalItems} of {totalItems} results</div>
            <div className={styles.pageNumbers}>
                <button className={styles.pageBtn} disabled><i className="fa-solid fa-chevron-left"></i></button>
                <button className={`${styles.pageBtn} ${styles.active}`}>1</button>
                <button className={styles.pageBtn}>2</button>
                <button className={styles.pageBtn}>3</button>
                <span className={styles.pageEllipsis}>...</span>
                <button className={styles.pageBtn}>10</button>
                <button className={styles.pageBtn}><i className="fa-solid fa-chevron-right"></i></button>
            </div>
        </div>
    );
};
export default Pagination;