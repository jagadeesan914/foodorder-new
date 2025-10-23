import userModel from "../models/userModel.js";

// Add to Cart
const addToCart = async (req, res) => {
  try {
    const userId = req.userId; // ✅ use userId from auth middleware
    const { itemId } = req.body;

    if (!itemId) return res.status(400).json({ success: false, message: "Item ID required" });

    const userData = await userModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    // Initialize cartData if null
    let cartData = userData.cartData || {};

    // Add or increment item quantity
    cartData[itemId] = cartData[itemId] ? cartData[itemId] + 1 : 1;

    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });

    return res.json({ success: true, message: "Added to Cart", cartData });
  } catch (error) {
    console.log("Add to Cart Error:", error);
    return res.status(500).json({ success: false, message: "Error adding to cart", error: error.message });
  }
};

// Remove from Cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.userId;
    const { itemId } = req.body;

    if (!itemId) return res.status(400).json({ success: false, message: "Item ID required" });

    const userData = await userModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found" });

    let cartData = userData.cartData || {};

    if (cartData[itemId] > 0) {
      cartData[itemId] -= 1;
      // Optional: remove key if quantity is 0
      if (cartData[itemId] === 0) delete cartData[itemId];
    }

    await userModel.findByIdAndUpdate(userId, { cartData }, { new: true });

    return res.json({ success: true, message: "Removed from Cart", cartData });
  } catch (error) {
    console.log("Remove from Cart Error:", error);
    return res.status(500).json({ success: false, message: "Error removing from cart", error: error.message });
  }
};

// Get Cart
const getCart = async (req, res) => {
  try {
    const userId = req.userId;

    const userData = await userModel.findById(userId);
    if (!userData) return res.status(404).json({ success: false, message: "User not found", cartData: {} });

    const cartData = userData.cartData || {};

    return res.json({ success: true, cartData });
  } catch (error) {
    console.log("Get Cart Error:", error);
    return res.status(500).json({ success: false, message: "Error getting cart", error: error.message });
  }
};

export { addToCart, removeFromCart, getCart };
