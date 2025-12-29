import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// routes
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js"; 
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ================= FIX __dirname (ESM) =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= MIDDLEWARES =================
app.use(express.json());

// ================= CORS =================
const allowedOrigins = [
  "https://tomato-meal.netlify.app",
  "https://tomato-meal-admin.netlify.app",
  "http://localhost:5173",
  "http://localhost:5174",
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // 🔥 THIS FIXES PREFLIGHT
  }

  next();
});

// ================= STATIC FILES =================
app.use("/images", express.static(path.join(__dirname, "uploads")));

// ================= DATABASE =================
connectDB();

// ================= ROUTES =================
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// ================= HEALTH CHECK =================
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running fine 🚀",
  });
});

app.get("/", (req, res) => {
  res.send("API Working");
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
