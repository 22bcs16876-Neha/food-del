import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    items: {
      type: Array,
      required: true,
    },

    amount: {
      type: Number, // paise
      required: true,
    },

    address: {
      type: Object,
      required: true,
    },

    status: {
      type: String,
      default: "Food Processing",
      enum: [
        "Food Processing",
        "Out for delivery",
        "Delivered",
        "Cancelled",
      ],
    },

    payment: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ✅ SAFE MODEL
const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;
