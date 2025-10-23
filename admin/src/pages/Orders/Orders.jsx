// src/pages/Orders/Orders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Status mapping (button text → backend status)
  const statusMap = {
    Accept: "PREPARING",
    "Out for Delivery": "OUT_FOR_DELIVERY",
    Delivered: "DELIVERED",
    Cancel: "CANCELLED",
  };

  // ✅ Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/order/all");
      if (res.data.success) {
        setOrders(res.data.data);
      } else {
        setError("Failed to load orders");
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update order status
  const updateStatus = async (id, status) => {
  try {
    const backendStatus = statusMap[status];
    if (!backendStatus) return alert("Invalid status");

    // ✅ Get token from localStorage or context
    const token = localStorage.getItem("token"); // or wherever you store it
    if (!token) return alert("Not logged in. Please login again.");

    const res = await axios.put(
      `http://localhost:3000/api/order/update/${id}`,
      { status: backendStatus },
      {
        headers: {
          Authorization: `Bearer ${token}` // send JWT token
        }
      }
    );

    if (res.data.success) {
      alert(`Order status updated to ${status}`);
      fetchOrders();
    } else {
      alert(res.data.message || "Failed to update order status");
    }
  } catch (err) {
    console.error("Update Error:", err);
    alert(err.response?.data?.message || "Failed to update order status");
  }
};


  // ✅ Delete order
  const deleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      const res = await axios.delete(`http://localhost:3000/api/order/delete/${id}`);
      if (res.data.success) {
        alert("Order deleted successfully");
        fetchOrders();
      } else {
        alert("Failed to delete order");
      }
    } catch (err) {
      console.error("Delete Error:", err);
      alert("Failed to delete order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="loading">Loading orders...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="orders-page">
      <h2>All Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order.userId?.name || "N/A"}</td>
                <td>{order.phone}</td>
                <td>{order.address}</td>

                {/* List ordered items */}
                <td>
                  {order.items.map((item, idx) => (
                    <div key={idx}>
                      {item.name} × {item.qty}
                    </div>
                  ))}
                </td>

                <td>₹{order.amount}</td>

                {/* Payment status */}
                <td>
                  {order.paymentMethod === "COD" && order.paymentStatus === "PAID"
                    ? "COD Completed"
                    : `${order.paymentMethod} - ${order.paymentStatus}`}
                </td>

                <td>{order.orderStatus}</td>

                {/* Actions */}
                <td className="actions">
                  {order.orderStatus === "PLACED" && (
                    <button
                      className="status-btn accept"
                      onClick={() => updateStatus(order._id, "Accept")}
                    >
                      Accept
                    </button>
                  )}

                  {order.orderStatus === "PREPARING" && (
                    <button
                      className="status-btn out"
                      onClick={() => updateStatus(order._id, "Out for Delivery")}
                    >
                      Out for Delivery
                    </button>
                  )}

                  {order.orderStatus === "OUT_FOR_DELIVERY" && (
                    <button
                      className="status-btn deliver"
                      onClick={() => updateStatus(order._id, "Delivered")}
                    >
                      Delivered
                    </button>
                  )}

                  {/* Cancel button */}
                  {order.orderStatus !== "DELIVERED" &&
                    order.orderStatus !== "CANCELLED" && (
                      <button
                        className="status-btn cancel"
                        onClick={() => updateStatus(order._id, "Cancel")}
                      >
                        Cancel
                      </button>
                    )}

                  {/* Delete button */}
                  <button className="delete-btn" onClick={() => deleteOrder(order._id)}>
                    Delete
                  </button>
                </td>

                {/* Order Date */}
                <td>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;






