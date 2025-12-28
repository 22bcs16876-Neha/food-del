import userModel from "../models/userModels.js";

// ================= ADD TO CART =================
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ from auth middleware
    const { itemId } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    if (!cartData[itemId]) {
      cartData[itemId] = 1;
    } else {
      cartData[itemId] += 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added to cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
};

// ================= REMOVE FROM CART =================
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ secure
    const { itemId } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = userData.cartData || {};

    if (cartData[itemId] > 1) {
      cartData[itemId] -= 1;
    } else {
      delete cartData[itemId]; // ✅ no negative values
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Removed from cart" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error removing from cart" });
  }
};

// ================= GET CART =================
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const userData = await userModel.findById(userId);
    res.json({
      success: true,
      cartData: userData.cartData || {},
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error fetching cart" });
  }
};

export { addToCart, removeFromCart, getCart };
