import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Helper: Create JWT Token
const createToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || "secret123", // fallback for local dev
    { expiresIn: "7d" } // expires in 7 days
  );
};

// ✅ REGISTER USER
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validate email
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Please enter a valid email" });
    }

    // Validate password
    if (password.length < 8) {
      return res.json({ success: false, message: "Password must be at least 8 characters long" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: role || "user", // default role = user
    });

    const user = await newUser.save();

    // Create token
    const token = createToken(user._id, user.role);

    res.json({
      success: true,
      message: "Registration successful",
      token,
      role: user.role,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.json({ success: false, message: "Server error during registration" });
  }
};

// ✅ LOGIN USER
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check user existence
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't exist" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Generate token
    const token = createToken(user._id, user.role);

    res.json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.json({ success: false, message: "Server error during login" });
  }
};

export { loginUser, registerUser };


