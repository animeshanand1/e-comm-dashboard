import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useGetOrdersAnalyticsQuery } from '../../store/api/apiSlice';
import styles from './SalesAnalytics.module.css';

const SalesAnalytics = () => {
  const [period, setPeriod] = useState('week');
  const [chartType, setChartType] = useState('line');
  
  const { data: analyticsData, isLoading, error } = useGetOrdersAnalyticsQuery(period);

  if (isLoading) {
    return (
      <div className={styles.analyticsContainer}>
        <div className={styles.analyticsHeader}>
          <h3>Sales Analytics</h3>
        </div>
        <div className={styles.loadingState}>Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.analyticsContainer}>
        <div className={styles.analyticsHeader}>
          <h3>Sales Analytics</h3>
        </div>
        <div className={styles.errorState}>
          Error loading analytics: {error?.data?.message || error.message}
        </div>
      </div>
    );
  }

  const chartData = analyticsData?.data || [];
  const summary = analyticsData?.summary || {};

  return (
    <div className={styles.analyticsContainer}>
      <div className={styles.analyticsHeader}>
        <h3>Sales Analytics</h3>
        <div className={styles.controls}>
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value)}
            className={styles.periodSelector}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="year">Last Year</option>
          </select>
          
          <div className={styles.chartTypeToggle}>
            <button 
              className={`${styles.toggleBtn} ${chartType === 'line' ? styles.active : ''}`}
              onClick={() => setChartType('line')}
            >
              Line
            </button>
            <button 
              className={`${styles.toggleBtn} ${chartType === 'bar' ? styles.active : ''}`}
              onClick={() => setChartType('bar')}
            >
              Bar
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.summaryStats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Orders</span>
          <span className={styles.statValue}>{summary.totalOrders || 0}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Sales</span>
          <span className={styles.statValue}>${(summary.totalSales || 0).toFixed(2)}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Avg Daily Orders</span>
          <span className={styles.statValue}>{(summary.avgDailyOrders || 0).toFixed(1)}</span>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={300}>
          {chartType === 'line' ? (
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
              <XAxis 
                dataKey="dayName" 
                stroke="#6b7280"
                fontSize={12}
                angle={period === 'month' ? -45 : 0}
                textAnchor={period === 'month' ? 'end' : 'middle'}
                height={period === 'month' ? 60 : 30}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [
                  name === 'count' ? `${value} orders` : `$${value.toFixed(2)}`,
                  name === 'count' ? 'Orders' : 'Sales'
                ]}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    const data = payload[0].payload;
                    return `${label} (${data.date})`;
                  }
                  return label;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: period === 'month' ? 2 : 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
              />
            </LineChart>
          ) : (
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e4e7" />
              <XAxis 
                dataKey="dayName" 
                stroke="#6b7280"
                fontSize={12}
                angle={period === 'month' ? -45 : 0}
                textAnchor={period === 'month' ? 'end' : 'middle'}
                height={period === 'month' ? 60 : 30}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value, name) => [
                  name === 'count' ? `${value} orders` : `$${value.toFixed(2)}`,
                  name === 'count' ? 'Orders' : 'Sales'
                ]}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    const data = payload[0].payload;
                    return `${label} (${data.date})`;
                  }
                  return label;
                }}
              />
              <Bar 
                dataKey="count" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {chartData.length === 0 && (
        <div className={styles.noDataState}>
          <p>No order data available for the selected period</p>
          <p>Create some sample orders to see analytics</p>
        </div>
      )}
    </div>
  );
};

export default SalesAnalytics;
