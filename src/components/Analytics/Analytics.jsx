import React, { useMemo, useState } from "react";
import { useGetAnalyticsQuery, useCreateSampleOrdersMutation } from "../../store/api/apiSlice";
import styles from "./Analytics.module.css";
const Analytics = () => {
  const [range, setRange] = useState('30d');
  const [status, setStatus] = useState('completed');
  const [interval, setInterval] = useState('day');
  const [createSampleOrders, { isLoading: isCreatingSamples }] = useCreateSampleOrdersMutation();

  const { startDate, endDate } = useMemo(() => {
    const end = new Date();
    let start = new Date();
    if (range === '7d') start.setDate(end.getDate() - 7);
    else if (range === '30d') start.setDate(end.getDate() - 30);
    else if (range === '90d') start.setDate(end.getDate() - 90);
    return {
      startDate: start.toISOString(),
      endDate: end.toISOString()
    };
  }, [range]);

  const { data, isLoading, error, refetch } = useGetAnalyticsQuery({ startDate, endDate, status, interval });

  const summary = data?.summary || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0, itemsSold: 0 };
  const salesOverTime = data?.salesOverTime || [];
  const topProducts = data?.topProducts || [];

  const handleCreateSampleOrders = async () => {
    try {
      const result = await createSampleOrders().unwrap();
      alert(` ${result.message}`);
      refetch(); 
    } catch (error) {
      alert(` Failed to create sample orders: ${error?.data?.message || error.message}`);
    }
  };

  return (
    <div className={styles.analyticsContainer}>
      <div className={styles.analyticsHeader}>
        <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Analytics Dashboard</h2>
        <div className={styles.controls}>
          <button 
            onClick={handleCreateSampleOrders}
            disabled={isCreatingSamples}
            className={styles.dateRangePicker}
            style={{ backgroundColor: '#4a90e2', color: 'white', border: 'none' }}
          >
            {isCreatingSamples ? '⏳ Creating...' : ' Add Sample Orders'}
          </button>
          <select value={range} onChange={(e) => setRange(e.target.value)} className={styles.dateRangePicker}>
            <option value="7d">📅 Last 7 Days</option>
            <option value="30d">📅 Last 30 Days</option>
            <option value="90d">📅 Last 90 Days</option>
          </select>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={styles.dateRangePicker}>
            <option value="completed"> Completed</option>
            <option value="pending">⏳ Pending</option>
            <option value="cancelled"> Cancelled</option>
            <option value="all">📊 All Status</option>
          </select>
          <select value={interval} onChange={(e) => setInterval(e.target.value)} className={styles.dateRangePicker}>
            <option value="day">📈 Daily</option>
            <option value="month">📈 Monthly</option>
          </select>
        </div>
      </div>
      
      {isLoading && (
        <div className={styles.loadingState}>
          <div>📊 Loading analytics data...</div>
        </div>
      )}
      
      {error && (
        <div className={styles.chartCard}>
          <h4 className={styles.cardTitle}>❌ Error</h4>
          <div style={{ color: 'red', padding: '1rem' }}>
            Error loading analytics: {error?.data?.message || error.message}
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <>
          {/* Summary Cards */}
          <div className={styles.analyticsGrid}>
            <div className={styles.chartCard}>
              <h4 className={styles.cardTitle}>📊 Summary Overview</h4>
              <div className={styles.summaryGrid}>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryValue}>${summary.totalRevenue?.toFixed(2) || '0.00'}</div>
                  <div className={styles.summaryLabel}>Total Revenue</div>
                </div>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryValue}>{summary.totalOrders || 0}</div>
                  <div className={styles.summaryLabel}>Total Orders</div>
                </div>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryValue}>${summary.avgOrderValue?.toFixed(2) || '0.00'}</div>
                  <div className={styles.summaryLabel}>Avg Order Value</div>
                </div>
                <div className={styles.summaryCard}>
                  <div className={styles.summaryValue}>{summary.itemsSold || 0}</div>
                  <div className={styles.summaryLabel}>Items Sold</div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className={styles.analyticsGrid}>
            <div className={`${styles.chartCard} ${styles.salesChart}`}>
              <h4 className={styles.cardTitle}>📈 Sales Over Time</h4>
              <div className={styles.chartPlaceholder}>
                {salesOverTime.length === 0 ? (
                  <div className={styles.emptyState}>
                    📭 No sales data available for the selected period
                  </div>
                ) : (
                  <ul className={styles.dataList}>
                    {salesOverTime.map((pt) => (
                      <li key={pt._id} className={styles.dataListItem}>
                        <span><strong>{pt._id}</strong></span>
                        <span>${pt.revenue?.toFixed(2)} ({pt.orders} orders)</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            <div className={`${styles.chartCard} ${styles.topProductsChart}`}>
              <h4 className={styles.cardTitle}>🏆 Top Selling Products</h4>
              <div className={styles.chartPlaceholder}>
                {topProducts.length === 0 ? (
                  <div className={styles.emptyState}>
                    📭 No product data available
                  </div>
                ) : (
                  <ul className={styles.dataList}>
                    {topProducts.map((p, index) => (
                      <li key={p._id} className={styles.dataListItem}>
                        <span>
                          <strong>#{index + 1}</strong> {p.productName || p.sku || p._id}
                        </span>
                        <span>{p.quantity} sold (${p.revenue?.toFixed(2)})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Analytics;
