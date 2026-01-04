import express from "express";
import {
  placeOrder,
  verifyOrder,
  userOrders,
  getOrderById,
  listOrders,
  updateStatus,
} from "../controllers/orderController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/place", authMiddleware, placeOrder);
router.post("/verify", verifyOrder);

// 🔥 THIS WAS MISSING
router.get("/userorders", authMiddleware, userOrders);

router.get("/:id", authMiddleware, getOrderById);

// admin routes
router.get("/", listOrders);
router.post("/status", updateStatus);

export default router;
