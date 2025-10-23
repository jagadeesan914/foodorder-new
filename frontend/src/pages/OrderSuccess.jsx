// src/pages/OrderSuccess.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();
  return (
    <div className="order-success">
      <h2>🎉 Order Placed Successfully!</h2>
      <p>Your food will be delivered soon.</p>
      <button onClick={() => navigate("/")}>Back to Home</button>
    </div>
  );
};

export default OrderSuccess;
