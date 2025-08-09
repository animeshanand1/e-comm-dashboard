import React from "react";
import styles from "./Analytics.module.css";
const Analytics = () => {
  const analyticsMetrics = [
    { metric: "Page Views", value: "1.2M", change: "+12.5%" },
    { metric: "Unique Visitors", value: "750K", change: "+8.2%" },
    { metric: "Conversion Rate", value: "3.4%", change: "-0.5%" },
    { metric: "Bounce Rate", value: "28.1%", change: "+2.1%" },
  ];

  return (
    <div className={styles.analyticsContainer}>
      <div className={styles.analyticsHeader}>
        <button className={styles.dateRangePicker}>
          <i className="fa-solid fa-calendar-days"></i> Last 30 Days
        </button>
      </div>
      <div className={styles.analyticsGrid}>
        <div className={`${styles.chartCard} ${styles.salesChart}`}>
          <h4 className={styles.cardTitle}>Sales Over Time</h4>
          <div className={styles.chartPlaceholder}>Line Chart</div>
        </div>
        <div className={`${styles.chartCard} ${styles.trafficChart}`}>
          <h4 className={styles.cardTitle}>Traffic Sources</h4>
          <div className={styles.chartPlaceholder}>Donut Chart</div>
        </div>
        <div className={`${styles.chartCard} ${styles.topProductsChart}`}>
          <h4 className={styles.cardTitle}>Top Selling Products</h4>
          <div className={styles.chartPlaceholder}>Bar Chart</div>
        </div>
        <div className={`${styles.chartCard} ${styles.metricsTable}`}>
          <h4 className={styles.cardTitle}>Key Metrics</h4>
          <table className={styles.dataTable}>
            <tbody>
              {analyticsMetrics.map((metric) => (
                <tr key={metric.metric}>
                  <td>{metric.metric}</td>
                  <td>
                    <strong>{metric.value}</strong>
                  </td>
                  <td
                    className={`${styles.metricChange} ${
                      metric.change.startsWith("+")
                        ? styles.positive
                        : styles.negative
                    }`}
                  >
                    {metric.change}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Analytics;
