import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/UserRoutes.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });


const app = express();
const PORT = process.env.PORT || 4000;

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.json());

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:5173",
      "https://food-app.netlify.app",
      "https://food-admin.netlify.app"
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "token"],
  credentials: true
};

app.use(cors(corsOptions));


// Serve uploaded images
app.use("/images", express.static(path.join(__dirname, "uploads")));

// Connect Database
connectDB();

// API Routes
app.use("/api/food", foodRouter);
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);

// Health check
app.get("/health", (req, res) => {
  res.send("Backend is running fine 🚀");
});

// Root test
app.get("/", (req, res) => {
  res.send("API Working");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
