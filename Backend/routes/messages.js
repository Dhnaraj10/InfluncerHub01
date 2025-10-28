//backend/routes/messages.js
import express from "express";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// In-memory store (demo). Replace with DB if needed.
const messages = [];

router.get("/", auth, (req, res) => {
  res.json(messages.slice(-50));
});

router.post("/", auth, (req, res) => {
  const { content } = req.body;
  const msg = { id: Date.now(), senderId: req.user.id, sender: req.user.name, content, timestamp: new Date() };
  messages.push(msg);
  res.status(201).json(msg);
});

export default router;


