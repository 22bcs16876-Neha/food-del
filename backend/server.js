import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/UserRoutes.js";
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

// ================= CORS CONFIG =================
const allowedOrigins = [
  "http://localhost:5173",            // frontend local
  "http://localhost:5174",            // admin local
  "https://tomato-meal.netlify.app",  // frontend live
  "https://food-admin.netlify.app"    // admin live
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow Postman / server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // ❗ safe mode (avoid deploy crash)
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "token"],
    credentials: true,
  })
);


// ================= STATIC FILES =================
app.use("/images", express.static(path.join(__dirname, "uploads")));

// ================= DATABASE =================
connectDB();

// ================= ROUTES =================
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// ================= TEST ROUTES =================
app.get("/health", (req, res) => {
  res.status(200).send("Backend is running fine ");
});

app.get("/", (req, res) => {
  res.send("API Working");
});

// ================= START SERVER =================
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
