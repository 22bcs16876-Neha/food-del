import express from "express";
import path from "path";
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

// ===== middlewares =====
app.use(express.json());

// ===== CORS =====
app.use((req, res, next) => {
  const allowedOrigins = [
    "https://tomato-meal.netlify.app",
    "https://tomato-meal-admin.netlify.app",
    "http://localhost:5173",
    "http://localhost:5174",
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
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
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ===== DB =====
connectDB();

// ===== ROUTES =====
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// ===== health =====
app.get("/health", (req, res) => {
  res.json({ success: true, message: "Backend running 🚀" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
