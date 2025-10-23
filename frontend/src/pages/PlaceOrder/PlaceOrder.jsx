import React, { useContext, useState } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import "./PlaceOrder.css";

const PlaceOrder = () => {
  const { cartItems, foodList, getTotalCartAmount, url, token, clearCart } = useContext(StoreContext);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // ✅ Initialize navigate

  const handlePlaceOrder = async () => {
    if (!address || !phone) {
      setMessage("Please fill in all fields");
      return;
    }

    const cartArray = Object.keys(cartItems)
      .filter(id => cartItems[id] > 0)
      .map(id => {
        const item = foodList.find(f => f._id === id);
        if (!item) return null;
        return {
          productId: item._id,
          name: item.name,
          price: item.price,
          qty: cartItems[id],
        };
      })
      .filter(Boolean); // remove nulls

    if (cartArray.length === 0) {
      setMessage("Your cart is empty");
      return;
    }

    const totalAmount = getTotalCartAmount();

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/order/place",
        {
          cartItems: cartArray,
          amount: totalAmount,
          address,
          phone,
          paymentMethod: "COD",
        },
        { headers: { token } }
      );

      if (res.data.success) {
        setMessage(res.data.message);
        clearCart(); // ✅ clear cart after successful order

        // ✅ Navigate to order-success page with order data
        navigate("/order-success", { state: { order: res.data.order } });
      } else {
        setMessage(res.data.message || "Order failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error placing order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="place-order">
      <h2>Checkout — Cash on Delivery</h2>
      <div className="checkout-form">
        <input
          type="text"
          placeholder="Delivery Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <div className="order-summary">
          <p>Subtotal: ${getTotalCartAmount()}</p>
          <p>Delivery Fee: $2</p>
          <p><b>Total: ${getTotalCartAmount() + 2}</b></p>
        </div>
        <button onClick={handlePlaceOrder} disabled={loading}>
          {loading ? "Placing Order..." : "Place Order (Cash on Delivery)"}
        </button>
        {message && <p className="order-message">{message}</p>}
      </div>
    </div>
  );
};

export default PlaceOrder;



