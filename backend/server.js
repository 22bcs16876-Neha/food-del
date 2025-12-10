import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/UserRoutes.js";
import cartRouter from "./routes/cartRoute.js";
import "dotenv/config";

const app = express();

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// PORT for deployment
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cors());

// Serve uploaded images
app.use("/images", express.static("uploads"));

// Connect Database
connectDB();

// API Routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);

// ---------------- FRONTEND DEPLOYMENT ----------------

// Serve frontend/dist
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// ---------------- START SERVER ----------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
