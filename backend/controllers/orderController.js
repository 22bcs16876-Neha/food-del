import orderModel from "../models/orderModel.js";
import userModel from "../models/userModels.js";
import foodModel from "../models/foodModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ================= PLACE ORDER ================= */
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // 🔒 BACKEND PRICE CALCULATION (SECURE)
    let subtotal = 0;

    for (const item of items) {
      const food = await foodModel.findById(item._id);
      if (!food) continue;

      subtotal += food.price * item.quantity;
    }

    const DELIVERY_FEE = 49;
    const DISCOUNT = 100; // keep same as frontend

    const totalAmount = Math.max(subtotal + DELIVERY_FEE - DISCOUNT, 0);

    // 💾 CREATE ORDER
    const order = await orderModel.create({
      userId,
      items,
      amount: totalAmount * 100, // store in paise
      address,
      payment: false,
      status: "Food Processing",
    });

    // 🧹 Clear cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // 💳 STRIPE CHECKOUT
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
            unit_amount: totalAmount * 100,
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

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === "paid") {
      await orderModel.findByIdAndUpdate(orderId, {
        payment: true,
        status: "Order Placed",
      });

      return res.json({ success: true });
    }

    res.json({ success: false });
  } catch (error) {
    console.error("VERIFY ORDER ERROR:", error);
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
