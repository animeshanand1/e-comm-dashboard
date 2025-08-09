import React, { useState } from "react";
import styles from "./Sidebar.module.css";


const Sidebar = ({ activeLink, setActiveLink }) => {

  const navItems = [
    { name: "Dashboard", icon: "fa-solid fa-chart-pie" },
    { name: "Products", icon: "fa-solid fa-box-archive" },
    { name: "Categories", icon: "fa-solid fa-tags" },
    { name: "Orders", icon: "fa-solid fa-receipt" },
    { name: "Analytics", icon: "fa-solid fa-chart-line" },
    { name: "Settings", icon: "fa-solid fa-gear" },
  ];


  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <div className={styles.sidebarLogo}>
          <i className="fa-solid fa-store"></i>
        </div>
        <h1 className={styles.sidebarTitle}>Veridian</h1>
      </div>
      <nav className={styles.sidebarNav}>
        <ul className={styles.navList}>
          {navItems.map((item) => (
            <li className={styles.navItem} key={item.name}>
              <a
                href="#"
                className={
                  activeLink === item.name
                    ? `${styles.navLink} ${styles.active}`
                    : styles.navLink
                }
                onClick={e => {
                  e.preventDefault();
                  setActiveLink(item.name);
                }}
              >
                <i className={item.icon}></i>
                <span>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
