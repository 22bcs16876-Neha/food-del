import userModel from "../models/userModels.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

/* ===================== CREATE TOKEN ===================== */
const createToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET not defined");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/* ===================== LOGIN USER ===================== */
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = createToken(user._id);
    res.status(200).json({ success: true, token });
  } catch (error) {
    console.log("LOGIN ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ===================== REGISTER USER ===================== */
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await new userModel({
      name,
      email,
      password: hashedPassword,
    }).save();

    const token = createToken(user._id);
    res.status(201).json({ success: true, token });
  } catch (error) {
    console.log("REGISTER ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export { loginUser, registerUser };
