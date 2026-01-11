import orderModel from "../models/orderModel.js";
import userModel from "../models/userModels.js";
import foodModel from "../models/foodModel.js"; // ✅ IMPORTANT
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/* ================= PLACE ORDER ================= */
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, address } = req.body; // ❌ amount REMOVED

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // 🔒 SECURE BACKEND CALCULATION
    let subtotal = 0;

    for (const item of items) {
      const food = await foodModel.findById(item._id);
      if (!food) continue;

      subtotal += food.price * item.quantity;
    }

    const DELIVERY_FEE = 49;
    const DISCOUNT = 100; // same as frontend

    const totalAmount = subtotal + DELIVERY_FEE - DISCOUNT;

    // 💾 Save order with BACKEND amount
    const order = await orderModel.create({
      userId,
      items,
      amount: totalAmount * 100, // store in paise
      address,
      payment: false,
      status: "Food Processing",
    });

    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // 💳 Stripe session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Tomato Food Order" },
            unit_amount: totalAmount * 100, // ✅ SAME amount
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
