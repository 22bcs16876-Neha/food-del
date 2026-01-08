import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import cors from "cors";

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

// ================= ENSURE UPLOADS FOLDER =================
const uploadPath = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

// ================= MIDDLEWARES =================
app.use(express.json());

// ================= CORS (🔥 FINAL & CORRECT) =================
app.use(
  cors({
    origin: [
      "http://localhost:5173",               // frontend local
      "http://localhost:5174",               // admin local
      "https://tomato-meal.netlify.app",      // frontend prod
      "https://tomato-meal-admin.netlify.app" // admin prod (agar alag hai)
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 🔥 PREFLIGHT (MOST IMPORTANT)
app.options("*", cors());

// ================= STATIC FILES =================
app.use("/uploads", express.static(uploadPath));

// ================= DATABASE =================
connectDB()
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// ================= ROUTES =================
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// ================= HEALTH CHECK =================
app.get("/health", (req, res) => {
  res.json({ success: true, message: "Backend running 🚀" });
});

app.get("/", (req, res) => {
  res.send("Food backend is live 🚀");
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
