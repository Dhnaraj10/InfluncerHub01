// backend/routes/categories.js
import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// simple list
router.get("/", async (req, res) => {
  try {
    const cats = await Category.find();
    res.json(cats);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default router;
