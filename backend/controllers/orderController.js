import orderModel from "../models/orderModel.js";
import userModel from "../models/userModels.js";
import Stripe from "stripe";

// ================= PLACE ORDER =================
const placeOrder = async (req, res) => {
  try {
    // 🔐 auth middleware se aata hai
    const userId = req.user.id;

    // 🔴 ENV checks (VERY IMPORTANT)
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: "Stripe secret key missing",
      });
    }

    if (!process.env.FRONTEND_URL) {
      return res.status(500).json({
        success: false,
        message: "Frontend URL missing",
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const frontend_url = process.env.FRONTEND_URL;

    const { items, amount, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // create order
    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      payment: false,
    });

    await newOrder.save();

    // clear cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // stripe line items
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // delivery fee
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
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    return res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.log("❌ PLACE ORDER ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Order failed",
    });
  }
};

// ================= VERIFY ORDER =================
const verifyOrder = async (req, res) => {
  try {
    const { success, orderId } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (success === "true") {
      order.payment = true;
      await order.save();
      return res.json({ success: true, message: "Payment verified" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      return res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.log("❌ VERIFY ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};

// ================= USER ORDERS =================
const userOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderModel.find({ userId });
    return res.json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
};

// ================= ADMIN =================
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    return res.json({ success: true, data: orders });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
};

const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    return res.json({ success: true, message: "Status updated" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating status",
    });
  }
};

export {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
};
