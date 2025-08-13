import React from "react";
import { useGetDashboardQuery, useGetRecentActivityQuery } from "../../store/api/apiSlice";
import SalesAnalytics from "../SalesAnalytics/SalesAnalytics";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const { data: dashboardData, isLoading, error } = useGetDashboardQuery();
  const { data: recentActivityData, isLoading: activityLoading, error: activityError } = useGetRecentActivityQuery();

  if (isLoading) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.loadingSpinner}>Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboardContainer}>
        <div className={styles.errorMessage}>
          Error loading dashboard: {error?.data?.message || error.message}
        </div>
      </div>
    );
  }

  const summary = dashboardData?.summary || {};
  
  const dashboardStats = [
    {
      value: `$${summary.salesTotal?.toLocaleString() || '0'}`,
      label: "Total Sales",
      icon: "fa-solid fa-dollar-sign",
      color: "iconPurple",
    },
    {
      value: summary.orderCount?.toLocaleString() || '0',
      label: "Total Orders",
      icon: "fa-solid fa-receipt",
      color: "iconGreen",
    },
    {
      value: summary.productCount?.toLocaleString() || '0',
      label: "Total Products",
      icon: "fa-solid fa-box-archive",
      color: "iconOrange",
    },
    {
      value: summary.lowStockProducts?.length || '0',
      label: "Low Stock Items",
      icon: "fa-solid fa-circle-xmark",
      color: "iconRed",
    },
  ];

  // Use dynamic recent activity data, fallback to static if loading or error
  const recentActivities = recentActivityData?.activities || [
    {
      text: "New order #11231 received from John D.",
      time: "20 mins ago",
      icon: "fa-solid fa-receipt",
      color: "iconGreen",
    },
    {
      text: 'Product "Minimalist Oak Desk" is low on stock.',
      time: "1 hour ago",
      icon: "fa-solid fa-triangle-exclamation",
      color: "iconOrange",
    },
    {
      text: 'New user "Alice" registered.',
      time: "3 hours ago",
      icon: "fa-solid fa-user-plus",
      color: "iconPurple",
    },
    {
      text: "Order #11230 has been shipped.",
      time: "5 hours ago",
      icon: "fa-solid fa-truck-fast",
      color: "iconGreen",
    },
    {
      text: "Server maintenance scheduled for tomorrow.",
      time: "1 day ago",
      icon: "fa-solid fa-gear",
      color: "iconRed",
    },
    {
      text: 'New review for "Plush Velvet Armchair" posted.',
      time: "2 days ago",
      icon: "fa-solid fa-star",
      color: "iconOrange",
    },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardGrid}>
        {dashboardStats.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles[stat.color]}`}>
              <i className={stat.icon}></i>
            </div>
            <div className={styles.statInfo}>
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}

        <div className={styles.mainChartCard}>
          <SalesAnalytics />
        </div>

        <div className={styles.recentActivityCard}>
          <h3 className={styles.cardHeader}>
            Recent Activity
            {activityLoading && <span className={styles.loadingText}> (Loading...)</span>}
          </h3>
          <ul className={styles.activityList}>
            {recentActivities.map((activity, index) => (
              <li key={index} className={styles.activityItem}>
                <div
                  className={`${styles.activityIcon} ${styles[activity.color]}`}
                >
                  <i className={activity.icon}></i>
                </div>
                <div className={styles.activityDetails}>
                  <p>{activity.text}</p>
                  <span>{activity.time}</span>
                </div>
              </li>
            ))}
          </ul>
          {activityError && (
            <div className={styles.errorText}>
              Unable to load recent activity. Using fallback data.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
