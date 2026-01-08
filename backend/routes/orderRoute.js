import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  placeOrder,
  verifyOrder,
  userOrders,
  getOrderById,
  listOrders,
  updateStatus,
} from "../controllers/orderController.js";

const router = express.Router();

// USER ROUTES
router.post("/place", authMiddleware, placeOrder);
router.post("/verify", verifyOrder);
router.get("/userorders", authMiddleware, userOrders);

// ADMIN ROUTES
router.get("/list", listOrders);        // 🔥 ADD THIS
router.post("/status", updateStatus);   // 🔥 ADMIN

// MUST BE LAST
router.get("/:id", authMiddleware, getOrderById);

export default router;
