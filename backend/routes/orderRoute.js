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

/* ================= USER ROUTES ================= */

// Place order (user must be logged in)
orderRouter.post("/place", authMiddleware, placeOrder);

// Verify payment (Stripe redirect)
orderRouter.post("/verify", verifyOrder);

// Get logged-in user's orders
orderRouter.post("/userorders", authMiddleware, userOrders);


/* ================= ADMIN ROUTES (NO LOGIN) ================= */

// List all orders (admin panel)
orderRouter.get("/list", listOrders);

// Update order status
orderRouter.post("/status", updateStatus);


/* ================= TRACK ORDER (Customer) ================= */

// ⚠️ Dynamic route hamesha LAST me
orderRouter.get("/:id", authMiddleware, getOrderById);

export default orderRouter;

