import orderModel from "../models/orderModel.js";
import userModel from "../models/userModels.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

    // ✅ BACKEND AMOUNT CALCULATION (SECURITY)
    let calculatedAmount = 0;
    items.forEach((item) => {
      calculatedAmount += item.price * item.quantity;
    });

    const DELIVERY_FEE = 49;
    calculatedAmount += DELIVERY_FEE;

    // frontend sends amount in paise
    if (calculatedAmount * 100 !== amount) {
      return res.status(400).json({
        success: false,
        message: "Amount mismatch",
      });
    }

    // ✅ SAVE ORDER
    const order = await orderModel.create({
      userId,
      items,
      amount, // in paise
      address,
      payment: false,
      status: "Food Processing",
    });

    // clear cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // ✅ STRIPE SESSION
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Tomato Food Order",
            },
            unit_amount: amount, // already in paise
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/verify?orderId=${order._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/verify?orderId=${order._id}&success=false`,
    });

    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= VERIFY ORDER ================= */
export const verifyOrder = async (req, res) => {
  try {
    const { orderId, session_id } = req.body;

    if (!orderId || !session_id) {
      return res.status(400).json({
        success: false,
        message: "Missing data",
      });
    }

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      order.payment = true;
      await order.save();

      return res.json({ success: true });
    }

    return res.json({ success: false });
  } catch (error) {
    console.error("VERIFY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


/* ================= USER ORDERS ================= */
export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user.id });
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
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

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* ================= ADMIN ================= */
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateStatus = async (req, res) => {
  try {
    if (!req.admin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
