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
const PORT = process.env.PORT || 4000;

// Fix __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());
app.use(cors());

// Serve uploaded images
app.use("/images", express.static(path.join(__dirname, "uploads")));

// Connect Database
connectDB();

// API Routes
app.use("/api/food", foodRouter);
app.use("/images",express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);

// Test Route
app.get("/", (req, res) => {
  res.send("API Working");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
