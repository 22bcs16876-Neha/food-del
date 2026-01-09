import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  placeOrder,
  verifyOrder,
  userOrders,
  // listOrders,
  // updateStatus,
} from "../controllers/orderController.js";

const router = express.Router();

// USER
router.post("/place", authMiddleware, placeOrder);
router.post("/verify", verifyOrder);
router.get("/userorders", authMiddleware, userOrders);

// // ADMIN
// router.get("/list", authMiddleware, listOrders);
// router.post("/status", authMiddleware, updateStatus);

export default router;
