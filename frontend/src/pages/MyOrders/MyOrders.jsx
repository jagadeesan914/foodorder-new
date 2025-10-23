import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import "./MyOrders.css";
import { assets } from "../../assets/assets";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${url}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (res.data.success) setOrders(res.data.data || []);
      else setError("Failed to fetch orders");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Function to mark COD as paid
  const handlePayNow = async (id) => {
    try {
      const res = await axios.put(`${url}/api/order/pay/${id}`, {}, { headers: { token } });
      if (res.data.success) {
        alert("Payment successful! COD completed.");
        fetchOrders();
      } else {
        alert("Payment failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error while paying.");
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="order-card">
            <img src={assets.parcel_icon} alt="parcel" />
            <h3>Order ID: {order._id}</h3>
            <p>
              <strong>Status:</strong> {order.orderStatus}
            </p>
            <p>
              <strong>Payment:</strong>{" "}
              {order.paymentMethod === "COD" && order.paymentStatus === "PENDING"
                ? "COD - Pending"
                : order.paymentMethod === "COD" && order.paymentStatus === "PAID"
                ? "COD Completed"
                : order.paymentStatus}
            </p>
            <p>
              <strong>Amount:</strong> ₹{order.amount}
            </p>
            <p>
              <strong>Delivery:</strong> {order.address}
            </p>
            <p>
              <strong>Placed on:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>

            {/* ✅ Pay Now Button */}
            {order.paymentMethod === "COD" && order.paymentStatus === "PENDING" && (
              <button
                className="pay-now-btn"
                onClick={() => handlePayNow(order._id)}
              >
                Pay Now
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;



