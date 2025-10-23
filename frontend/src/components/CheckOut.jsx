// src/components/Checkout.jsx
import React, { useState } from "react";

import axios from "axios";
import "./Checkout.css";


const Checkout = ({ cartItems, userToken }) => {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const paymentMethod = "COD";

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload = {
        cartItems: cartItems.map((i) => ({
          productId: i.id, // or i._id if your products use _id
          name: i.name,
          price: i.price,
          qty: i.qty,
        })),
        amount: totalAmount,
        address,
        phone,
        paymentMethod, // "COD"
      };

      const res = await axios.post(
        "http://localhost:3000/api/order/place",
        payload,
        {
          headers: {
            token: userToken, // ✅ matches your backend auth.js
          },
        }
      );

      if (res.data.success) {
        setMessage({ type: "success", text: res.data.message });
      } else {
        setMessage({ type: "error", text: res.data.message || "Order failed" });
      }
    } catch (err) {
      console.error("Error placing order:", err);
      setMessage({ type: "error", text: "Something went wrong while placing the order" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-card">
      <h2>Checkout</h2>
      <form onSubmit={handlePlaceOrder}>
        <label>
          Delivery Address
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>

        <label>
          Phone Number
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </label>

        <div className="payment-method">
          <h3>Payment Method</h3>
          <label>
            <input type="radio" checked readOnly /> Cash on Delivery
          </label>
        </div>

        <div className="order-summary">
          <p>Items: {cartItems.length}</p>
          <p>Total: ₹{totalAmount.toFixed(2)}</p>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Placing Order..." : "Place Order — COD"}
        </button>
      </form>

      {message && (
        <div
          className={`message ${message.type}`}
          style={{
            marginTop: "10px",
            color: message.type === "success" ? "green" : "red",
          }}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default Checkout;

