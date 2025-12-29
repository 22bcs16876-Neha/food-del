import orderModel from "../models/orderModel.js";
import userModel from "../models/userModels.js";
import Stripe from "stripe";

/* ================= PLACE ORDER ================= */
const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ success: false, message: "Stripe key missing" });
    }
    if (!process.env.FRONTEND_URL) {
      return res.status(500).json({ success: false, message: "Frontend URL missing" });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { items, amount, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart empty" });
    }

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: false,
    });

    await newOrder.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: { name: "Delivery Charges" },
        unit_amount: 49 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${process.env.FRONTEND_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (err) {
    console.log("PLACE ORDER ERROR:", err.message);
    res.status(500).json({ success: false, message: "Order failed" });
  }
};

/* ================= VERIFY ORDER ================= */
const verifyOrder = async (req, res) => {
  try {
    const { success, orderId } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ success: false });

    if (success === true || success === "true") {
      order.payment = true;
      await order.save();
      res.json({ success: true, message: "Payment verified" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

/* ================= USER ORDERS ================= */
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user.id });
    res.json({ success: true, data: orders });
  } catch {
    res.status(500).json({ success: false });
  }
};

/* ================= TRACK ORDER ================= */
const getOrderById = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // 🔐 security: user can see only own order
    if (order.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    res.json({ success: true, data: order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching order" });
  }
};

/* ================= ADMIN ================= */
const listOrders = async (req, res) => {
  const orders = await orderModel.find({});
  res.json({ success: true, data: orders });
};

const updateStatus = async (req, res) => {
  await orderModel.findByIdAndUpdate(req.body.orderId, {
    status: req.body.status,
  });
  res.json({ success: true });
};

export {
  placeOrder,
  verifyOrder,
  userOrders,
  getOrderById,
  listOrders,
  updateStatus,
};
