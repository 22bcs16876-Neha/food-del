import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ===== fix __dirname (ESM) =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== ensure uploads folder exists (🔥 REQUIRED) =====
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// ===== middlewares =====
app.use(express.json());

// ===== CORS (FIXED) =====
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://tomato-meal.netlify.app",
    "https://tomato-meal-admin.netlify.app",
    "http://localhost:5173",
    "http://localhost:5174",
  ];

  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, token"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ===== STATIC IMAGES =====
app.use("/uploads", express.static(uploadPath));

// ===== DB (FAIL SAFE) =====
connectDB().catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
  process.exit(1);
});

// ===== ROUTES =====
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// ===== health =====
app.get("/health", (req, res) => {
  res.json({ success: true, message: "Backend running 🚀" });
});
app.get("/", (req, res) => {
  res.send("Food backend is live 🚀");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
