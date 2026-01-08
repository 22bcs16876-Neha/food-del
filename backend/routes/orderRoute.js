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

// USER
router.post("/place", authMiddleware, placeOrder);
router.post("/verify", verifyOrder);
router.get("/userorders", authMiddleware, userOrders);

// ADMIN
router.get("/list", listOrders);
router.post("/status", updateStatus);

// MUST BE LAST
router.get("/:id", authMiddleware, getOrderById);

export default router;
