import React, { useState } from "react";
import { useGetOrdersQuery, useUpdateOrderStatusMutation, useCreateSampleOrdersMutation } from "../../store/api/apiSlice";
import styles from "./Order.module.css";

const Orders = () => {
  const { data: ordersData, isLoading, error } = useGetOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const [createSampleOrders] = useCreateSampleOrdersMutation();
  const [loadingOrderId, setLoadingOrderId] = useState(null);
  const [creatingOrders, setCreatingOrders] = useState(false);

  const orders = ordersData?.data?.orders || [];
  const pagination = ordersData?.data?.pagination || {};

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setLoadingOrderId(orderId);
      console.log(`Updating order ${orderId} status to: ${newStatus}`);
      
      const result = await updateOrderStatus({ id: orderId, status: newStatus }).unwrap();
      console.log('Status update result:', result);
      
      // Show success message
      alert(`Order status updated to ${newStatus} successfully!`);
      
    } catch (error) {
      console.error('Failed to update order status:', error);
      
      const errorMessage = error?.data?.message || error?.message || 'Unknown error occurred';
      alert(`Failed to update order status: ${errorMessage}`);
    } finally {
      setLoadingOrderId(null);
    }
  };

  const handleCreateSampleOrders = async () => {
    try {
      setCreatingOrders(true);
      await createSampleOrders().unwrap();
      alert('Sample orders created successfully!');
    } catch (error) {
      console.error('Failed to create sample orders:', error);
      alert('Failed to create sample orders: ' + (error?.data?.message || error.message));
    } finally {
      setCreatingOrders(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "delivered":
        return styles.statusDelivered;
      case "pending":
        return styles.statusPending;
      case "cancelled":
        return styles.statusCancelled;
      case "shipped":
        return styles.statusShipped;
      case "confirmed":
      case "processing":
        return styles.statusPending; // Use pending style for intermediate statuses
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
          <h3 className={styles.ordersTitle}>
            All Orders ({pagination.total || orders.length})
          </h3>
          {orders.length === 0 && (
            <button 
              onClick={handleCreateSampleOrders}
              disabled={creatingOrders}
              style={{
                padding: '8px 16px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {creatingOrders ? 'Creating...' : 'Create Sample Orders'}
            </button>
          )}
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
                  <td>{order.user?.firstName && order.user?.lastName 
                    ? `${order.user.firstName} ${order.user.lastName}`
                    : order.user?.email || 'Unknown Customer'}</td>
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
                      className={styles.statusSelect}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        fontSize: '12px',
                        backgroundColor: loadingOrderId === order._id ? '#f5f5f5' : 'white',
                        cursor: loadingOrderId === order._id ? 'not-allowed' : 'pointer',
                        minWidth: '100px'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {loadingOrderId === order._id && (
                      <div style={{ 
                        fontSize: '10px', 
                        color: '#666', 
                        marginTop: '2px',
                        textAlign: 'center'
                      }}>
                        Updating...
                      </div>
                    )}
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
