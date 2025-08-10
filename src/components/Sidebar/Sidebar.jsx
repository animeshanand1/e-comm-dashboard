import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Sidebar.module.css";


const navItems = [
  { name: "Dashboard", icon: <i className="fas fa-chart-pie"></i>, path: "/dashboard" },
  { name: "Products", icon: <i className="fas fa-box-archive"></i>, path: "/products" },
  { name: "Inventory", icon: <i className="fas fa-warehouse"></i>, path: "/inventory" },
  { name: "Orders", icon: <i className="fas fa-receipt"></i>, path: "/orders" },
  { name: "Analytics", icon: <i className="fas fa-chart-line"></i>, path: "/analytics" },
  { name: "Settings", icon: <i className="fas fa-cog"></i>, path: "/settings" },
];


const Sidebar = () => {
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
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                }
                end
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
