import orderModel from "../models/orderModel.js";
import userModel from "../models/userModels.js";
import Stripe from "stripe";

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key missing");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

// ================= PLACE ORDER =================
const placeOrder = async (req, res) => {
  const frontend_url = "http://localhost:5174";
  const stripe = getStripe();

  try {
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      payment: false,
    });

    await newOrder.save();

    await userModel.findByIdAndUpdate(req.body.userId, {
      cartData: {},
    });

    const line_items = req.body.items.map((item) => ({
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
        unit_amount: 200,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Order failed" });
  }
};

// ================= VERIFY ORDER =================
const verifyOrder = async (req, res) => {
  const { success, orderId } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Payment verified" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

// ================= USER ORDERS =================
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
    });
  }
};

// ================= LIST ORDERS (ADMIN) =================
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching orders" });
  }
};

// ================= UPDATE STATUS =================
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(
      req.body.orderId,
      { status: req.body.status }
    );
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating status" });
  }
};

// ✅ EXPORTS
export {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
};
