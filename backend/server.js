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
app.use("/images", express.static(path.join(__dirname, "uploads")));

// Connect DB
connectDB();

// API Routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);

// ---------------- FRONTEND DEPLOYMENT ----------------

// Render par root = /opt/render/project/src
const frontendPath = path.join(__dirname, "../frontend/dist");

app.use(express.static(frontendPath));

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// ---------------- Start Server ----------------
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
