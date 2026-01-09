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

/* ================= USER ================= */

// Place order (needs login)
router.post("/place", authMiddleware, placeOrder);

// 🔥 VERIFY PAYMENT (NO authMiddleware)
router.post("/verify", verifyOrder);

// Get logged-in user's orders
router.get("/userorders", authMiddleware, userOrders);

/* ================= ADMIN ================= */
router.get("/list", authMiddleware, listOrders);
router.post("/status", authMiddleware, updateStatus);

/* ================= SINGLE ORDER ================= */
// MUST BE LAST
router.get("/:id", authMiddleware, getOrderById);

export default router;
