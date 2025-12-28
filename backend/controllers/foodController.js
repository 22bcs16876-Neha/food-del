import foodModel from "../models/foodModel.js";
import fs from "fs";

// ================= ADD FOOD =================
const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image not provided",
      });
    }

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const food = new foodModel({
      name,
      description,
      price: Number(price), // ✅ important
      category,
      image: req.file.filename,
    });

    await food.save();
    res.status(201).json({ success: true, message: "Food Added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ================= LIST FOOD =================
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ================= REMOVE FOOD =================
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findByIdAndDelete(req.body.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    if (food.image) {
      fs.unlink(`uploads/${food.image}`, (err) => {
        if (err) console.log("Image delete error:", err.message);
      });
    }

    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export { addFood, listFood, removeFood };
