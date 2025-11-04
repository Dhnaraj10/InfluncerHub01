//backend/routes/messages.js
import express from "express";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

// In-memory store (demo). Replace with DB if needed.
let messages = [];
let messageRequests = [];
let userConnections = [];

// Get messages between two users
router.get("/", auth, (req, res) => {
  const { recipient } = req.query;
  
  if (!recipient) {
    return res.status(400).json({ error: "Recipient ID is required" });
  }
  
  // Check if there's a connection between users
  const connection = userConnections.find(conn => 
    (conn.user1 === req.user.id && conn.user2 === recipient) ||
    (conn.user1 === recipient && conn.user2 === req.user.id)
  );
  
  if (!connection) {
    // Check if there's a message request
    const request = messageRequests.find(req => 
      req.from === req.user.id && req.to === recipient
    );
    
    if (!request) {
      return res.json([]);
    }
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
  
  // Check if there's a connection between users
  const connection = userConnections.find(conn => 
    (conn.user1 === req.user.id && conn.user2 === recipientId) ||
    (conn.user1 === recipientId && conn.user2 === req.user.id)
  );
  
  // Check if there's a message request
  const existingRequest = messageRequests.find(req => 
    req.from === req.user.id && req.to === recipientId
  );
  
  if (!connection) {
    // If no connection, create a message request instead
    if (!existingRequest) {
      const request = {
        id: Date.now().toString(),
        from: req.user.id,
        to: recipientId,
        content: content,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };
      
      messageRequests.push(request);
      return res.status(201).json({ 
        ...request, 
        type: 'request',
        message: 'Message request sent successfully' 
      });
    } else {
      return res.status(400).json({ 
        error: 'Message request already sent. Waiting for acceptance.' 
      });
    }
  }
  
  // If there's a connection, send the message normally
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
  
  res.status(201).json({ ...msg, type: 'message' });
});

// Get message requests for a user
router.get("/requests", auth, (req, res) => {
  const requests = messageRequests.filter(req => req.to === req.user.id);
  res.json(requests);
});

// Accept a message request
router.post("/requests/:requestId/accept", auth, (req, res) => {
  const { requestId } = req.params;
  
  const requestIndex = messageRequests.findIndex(req => 
    req.id === requestId && req.to === req.user.id
  );
  
  if (requestIndex === -1) {
    return res.status(404).json({ error: "Message request not found" });
  }
  
  const request = messageRequests[requestIndex];
  
  // Create connection between users
  userConnections.push({
    user1: request.from,
    user2: request.to,
    connectedAt: new Date().toISOString()
  });
  
  // Remove the request
  messageRequests.splice(requestIndex, 1);
  
  // Send the original message as the first message
  const msg = {
    id: Date.now().toString(),
    senderId: request.from,
    senderName: request.senderName || "User",
    recipientId: request.to,
    content: request.content,
    timestamp: request.timestamp
  };
  
  messages.push(msg);
  
  res.json({ 
    message: "Message request accepted", 
    firstMessage: msg 
  });
});

// Reject a message request
router.post("/requests/:requestId/reject", auth, (req, res) => {
  const { requestId } = req.params;
  
  const requestIndex = messageRequests.findIndex(req => 
    req.id === requestId && req.to === req.user.id
  );
  
  if (requestIndex === -1) {
    return res.status(404).json({ error: "Message request not found" });
  }
  
  messageRequests.splice(requestIndex, 1);
  
  res.json({ message: "Message request rejected" });
});

export default router;