import express from "express";
import cors from "cors";
import path from "path";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/UserRoutes.js";
import cartRouter from "./routes/cartRoute.js";
import "dotenv/config";

const app = express();

// PORT for deployment
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(express.json());
app.use(cors());

// Serve uploaded images correctly
app.use("/images", express.static("uploads"));

// Connect Database
connectDB();

// API Routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);

// ---------------- FRONTEND DEPLOYMENT (VITE BUILD) ----------------
const __dirname = path.resolve();

// Serve Vite build inside frontend/dist
app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});


// ------------------------------------------------------------------

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
