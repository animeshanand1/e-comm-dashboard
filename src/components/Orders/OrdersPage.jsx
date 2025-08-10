import React, { useState } from "react";
import { useGetOrdersQuery, useUpdateOrderStatusMutation } from "../../store/api/apiSlice";
import styles from "./Order.module.css";

const Orders = () => {
  const { data: ordersData, isLoading, error } = useGetOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [loadingOrderId, setLoadingOrderId] = useState(null);

  const orders = ordersData?.orders || [];

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoadingOrderId(orderId);
      await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
    } catch (error) {
      console.error('Failed to update order status:', error);
      alert('Failed to update order status');
    } finally {
      setLoadingOrderId(null);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return styles.statusDelivered;
      case "pending":
        return styles.statusPending;
      case "cancelled":
        return styles.statusCancelled;
      default:
        return "";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTotal = (total) => {
    return `$${Number(total).toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className={styles.ordersContainer}>
        <div className={styles.ordersCard}>
          <div className={styles.ordersHeader}>
            <h3 className={styles.ordersTitle}>All Orders</h3>
          </div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.ordersContainer}>
        <div className={styles.ordersCard}>
          <div className={styles.ordersHeader}>
            <h3 className={styles.ordersTitle}>All Orders</h3>
          </div>
          <p style={{ color: 'red' }}>
            Error loading orders: {error?.data?.message || error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.ordersContainer}>
      <div className={styles.ordersCard}>
        <div className={styles.ordersHeader}>
          <h3 className={styles.ordersTitle}>All Orders ({orders.length})</h3>
        </div>
        <div className={styles.ordersTableWrapper}>
          <table className={styles.ordersTable}>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    <strong>#{order._id.slice(-6)}</strong>
                  </td>
                  <td>{order.user?.name || order.user?.email || 'Unknown Customer'}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{formatTotal(order.total)}</td>
                  <td>
                    <span
                      className={`${styles.statusBadge} ${getStatusClass(order.status)}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      disabled={loadingOrderId === order._id}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        border: '1px solid #ddd',
                        fontSize: '12px'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              No orders found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
