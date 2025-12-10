import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://greatstack:33858627@cluster0.sonombx.mongodb.net/food-del");
    console.log("DB Connected");
  } catch (error) {
    console.log("DB Connection Error:", error);
  }
};
