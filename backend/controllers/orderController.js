import orderModel from "../models/orderModel.js";
import userModel from "../models/userModels.js";
import Stripe from "stripe";

/* ================== PLACE ORDER ================== */
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { items, amount, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    if (!process.env.STRIPE_SECRET_KEY || !process.env.FRONTEND_URL) {
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    /* CREATE ORDER */
    const order = await orderModel.create({
      userId,
      items,
      amount,
      address,
      payment: false,
      status: "Food Processing",
    });

    /* CLEAR USER CART */
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    /* STRIPE LINE ITEMS */
    const line_items = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    /* DELIVERY CHARGE */
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 49 * 100,
      },
      quantity: 1,
    });

    /* STRIPE SESSION */
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${process.env.FRONTEND_URL}/verify?success=true&orderId=${order._id}`,
      cancel_url: `${process.env.FRONTEND_URL}/verify?success=false&orderId=${order._id}`,
    });

    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error.message);
    res.status(500).json({ success: false, message: "Order placement failed" });
  }
};

/* ================== VERIFY PAYMENT ================== */
export const verifyOrder = async (req, res) => {
  try {
    const { success, orderId } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (success === true || success === "true") {
      order.payment = true;
      await order.save();
      return res.json({ success: true, message: "Payment verified" });
    }

    await orderModel.findByIdAndDelete(orderId);
    res.json({ success: false, message: "Payment failed, order removed" });
  } catch (error) {
    console.error("VERIFY ORDER ERROR:", error.message);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

/* ================== USER ORDERS ================== */
export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user.id });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: "Unable to fetch orders" });
  }
};

/* ================== TRACK SINGLE ORDER ================== */
export const getOrderById = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    /* SECURITY CHECK */
    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching order" });
  }
};

/* ================== ADMIN : LIST ALL ORDERS ================== */
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

/* ================== ADMIN : UPDATE STATUS ================== */
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status updated" });
  } catch {
    res.status(500).json({ success: false, message: "Status update failed" });
  }
};
