import Order from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";
import { sendEmail } from "../utils/sendEmail.js";

// ================================
// 🧾 Place Order (User)
// ================================
export const placeOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { cartItems, amount, address, phone, paymentMethod } = req.body;

    if (!cartItems?.length)
      return res.status(400).json({ success: false, message: "Cart cannot be empty" });

    if (!address || !phone)
      return res.status(400).json({ success: false, message: "Address and phone are required" });

    const order = new Order({
      userId: new mongoose.Types.ObjectId(userId),
      items: cartItems.map(item => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
      amount,
      address,
      phone,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "PAID",
      orderStatus: "PLACED",
    });

    await order.save();

    // Add order reference to user (optional)
    if (userModel.schema.path("orders")) {
      await userModel.findByIdAndUpdate(userId, { $push: { orders: order._id } });
    }

    // ✅ Send order confirmation email
    const user = await userModel.findById(userId);
    if (user?.email) {
      const billItems = order.items
        .map(i => `<li>${i.name} x ${i.qty} = ₹${i.price * i.qty}</li>`)
        .join("");

      await sendEmail({
        to: user.email,
        subject: "Order Confirmation - Foodic 🍴",
        html: `<h3>Thank you for ordering with Foodic!</h3>
               <p>Your order has been placed successfully.</p>
               <h4>Order Details:</h4>
               <ul>${billItems}</ul>
               <p><strong>Total:</strong> ₹${order.amount}</p>
               <p><strong>Payment:</strong> ${order.paymentMethod}</p>
               <p><strong>Address:</strong> ${order.address}</p>
               <p>We’ll notify you once it’s out for delivery!</p>`,
      });
    }

    res.status(201).json({
      success: true,
      message:
        paymentMethod === "COD"
          ? "Order placed successfully! Pay cash on delivery."
          : "Order placed successfully!",
      order,
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ success: false, message: "Failed to place order" });
  }
};

// ================================
// 🧾 Get Orders for Logged-in User
// ================================
export const userOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error fetching user orders" });
  }
};

// ================================
// 📋 Get All Orders (Admin)
// ================================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

// ================================
// 🚚 Update Order Status (Admin)
// ================================
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["PLACED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status))
      return res.status(400).json({ success: false, message: "Invalid order status" });

    const order = await Order.findById(id).populate("userId", "email name");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.orderStatus = status;

    // ✅ Auto update COD as Paid when Delivered
    if (order.paymentMethod === "COD" && status === "DELIVERED") {
      order.paymentStatus = "PAID";
    }

    await order.save();

    // ✅ Send delivery confirmation email
    if (status === "DELIVERED" && order.userId?.email) {
      await sendEmail({
        to: order.userId.email,
        subject: "Order Delivered Successfully 🎉",
        html: `<h3>Hi ${order.userId.name || "Customer"},</h3>
               <p>Your order <b>${order._id}</b> has been <b>delivered successfully!</b></p>
               <p>We hope you enjoyed your meal. Thank you for choosing Foodic 🍱.</p>`,
      });
    }

    res.status(200).json({ success: true, message: "Order updated", data: order });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ success: false, message: "Failed to update order" });
  }
};

// ================================
// 💰 COD Payment Confirmation (User)
// ================================
export const payForOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    if (order.paymentMethod !== "COD" || order.paymentStatus !== "PENDING")
      return res.status(400).json({ success: false, message: "Payment not applicable" });

    order.paymentStatus = "PAID";
    await order.save();

    res.status(200).json({
      success: true,
      message: "COD payment completed successfully!",
      data: order,
    });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ success: false, message: "Payment failed" });
  }
};

// ================================
// 🗑️ Delete Order (Admin)
// ================================
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Order.findByIdAndDelete(id);

    if (!deleted)
      return res.status(404).json({ success: false, message: "Order not found" });

    return res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    return res.status(500).json({ success: false, message: "Failed to delete order", error: error.message });
  }
};










