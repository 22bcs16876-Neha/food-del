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

router.post("/place", authMiddleware, placeOrder);
router.post("/verify", verifyOrder);
router.get("/userorders", authMiddleware, userOrders);
router.get("/:id", authMiddleware, getOrderById);
router.get("/", listOrders);
router.post("/status", updateStatus);

export default router;
