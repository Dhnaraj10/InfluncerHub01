//backend/routes/messages.js
import express from "express";
import auth from "../middleware/authMiddleware.js";
import { publishSponsorshipUpdate } from "../utils/websocketServer.js";

const router = express.Router();

// In-memory store (demo). Replace with DB if needed.
let messages = [];

// Get messages between two users
router.get("/", auth, (req, res) => {
  const { recipient } = req.query;
  
  if (!recipient) {
    return res.status(400).json({ error: "Recipient ID is required" });
  }
  
  // Filter messages between current user and recipient
  const userMessages = messages.filter(msg => 
    (msg.senderId === req.user.id && msg.recipientId === recipient) ||
    (msg.senderId === recipient && msg.recipientId === req.user.id)
  );
  
  // Sort by timestamp
  userMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  res.json(userMessages);
});

// Send a new message
router.post("/", auth, (req, res) => {
  const { content, recipientId } = req.body;
  
  if (!content || !recipientId) {
    return res.status(400).json({ error: "Content and recipientId are required" });
  }
  
  const msg = { 
    id: Date.now().toString(),
    senderId: req.user.id, 
    senderName: req.user.name,
    recipientId,
    content, 
    timestamp: new Date().toISOString() 
  };
  
  messages.push(msg);
  
  // Keep only last 100 messages in memory
  if (messages.length > 100) {
    messages = messages.slice(-100);
  }
  
  res.status(201).json(msg);
});

export default router;