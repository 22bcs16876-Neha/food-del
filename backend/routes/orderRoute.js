import express from "express";
import authMiddleware from "../middleware/auth.js";

import {
  placeOrder,
  userOrders,
  verifyOrder,
  listOrders,
  updateStatus,
  getOrderById,
} from "../controllers/orderController.js";

const orderRouter = express.Router();

// ================= USER ROUTES =================
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);

// ✅ TRACK ORDER (Customer)
orderRouter.get("/:id", authMiddleware, getOrderById);

// ================= ADMIN ROUTES =================
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateStatus);

export default orderRouter;
