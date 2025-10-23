import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const authMiddleware = async (req, res, next) => {
  const token = req.headers.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, message: "Not Authorized. Login Again" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    // Optional: check if admin
    const user = await userModel.findById(req.userId);
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    req.userRole = user.role || "user"; // save role for later checks
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: "Error verifying token" });
  }
};

export default authMiddleware;

