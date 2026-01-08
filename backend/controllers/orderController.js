import orderModel from "../models/orderModel.js";
import userModel from "../models/userModels.js";
import Stripe from "stripe";

/* ================= PLACE ORDER ================= */
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const order = await orderModel.create({
      userId,
      items,
      amount,
      address,
      payment: false,
      status: "Food Processing",
    });

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
      success_url: `${process.env.FRONTEND_URL}/verify?success=true&orderId=${order._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&orderId=${order._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false });
  }
};

/* ================= VERIFY ORDER ================= */
export const verifyOrder = async (req, res) => {
  try {
    const { success, orderId } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false });
    }

    if (success === true || success === "true") {
      order.payment = true;
      await order.save();
      return res.json({ success: true });
    }

    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: false });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

/* ================= USER ORDERS ================= */
export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user.id });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

/* ================= GET SINGLE ORDER ================= */
export const getOrderById = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

/* ================= ADMIN ================= */
/* ================= ADMIN ================= */
export const listOrders = async (req, res) => {
  try {

    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};

export const updateStatus = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
