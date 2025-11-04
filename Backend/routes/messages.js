import express from "express";
import auth from "../middleware/authMiddleware.js";
import Message from "../models/Message.js";
import MessageRequest from "../models/MessageRequest.js";
import UserConnection from "../models/UserConnection.js";
import User from "../models/User.js";

const router = express.Router();

// Get messages between two users
router.get("/", auth, async (req, res) => {
  try {
    const { recipient } = req.query;
    
    if (!recipient) {
      return res.status(400).json({ error: "Recipient ID is required" });
    }
    
    // Check if there's a connection between users
    const connection = await UserConnection.findOne({
      $or: [
        { user1: req.user.id, user2: recipient },
        { user1: recipient, user2: req.user.id }
      ]
    });
    
    // If there's no connection, check if there's a message request
    if (!connection) {
      const request = await MessageRequest.findOne({
        $or: [
          { from: req.user.id, to: recipient },
          { from: recipient, to: req.user.id }
        ]
      });
      
      // If there's no request, return empty array
      if (!request) {
        return res.json([]);
      }
    }
    
    // Get messages between current user and recipient
    const userMessages = await Message.find({
      $or: [
        { sender: req.user.id, recipient: recipient },
        { sender: recipient, recipient: req.user.id }
      ]
    })
    .sort({ timestamp: 1 })
    .populate('sender', 'name')
    .populate('recipient', 'name');
    
    // Format messages for frontend
    const formattedMessages = userMessages.map(msg => ({
      ...msg.toObject(),
      senderName: msg.sender.name,
      recipientName: msg.recipient.name
    }));
    
    res.json(formattedMessages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Get conversations for a user (list of users they've messaged or who've messaged them)
router.get("/conversations", auth, async (req, res) => {
  try {
    // Get all messages where the user is either sender or recipient
    const messages = await Message.find({
      $or: [
        { sender: req.user.id },
        { recipient: req.user.id }
      ]
    })
    .sort({ timestamp: -1 })
    .populate('sender', 'name')
    .populate('recipient', 'name');
    
    // Group messages by conversation partner
    const conversations = {};
    
    messages.forEach(message => {
      // Safely get partner ID
      const partnerId = message.sender && message.sender.toString() === req.user.id ? 
        (message.recipient && message.recipient.toString()) : 
        (message.sender && message.sender.toString());
      
      // Skip if partnerId is not available
      if (!partnerId) return;
      
      // Safely get partner name
      const partnerName = message.sender && message.sender.toString() === req.user.id ? 
        (message.recipient && message.recipient.name) : 
        (message.sender && message.sender.name);
      
      // If this is the first message in this conversation, or if this message is more recent
      if (!conversations[partnerId] || 
          new Date(message.timestamp) > new Date(conversations[partnerId].timestamp)) {
        conversations[partnerId] = {
          id: partnerId,
          userId: partnerId,
          userName: partnerName,
          lastMessage: message.content,
          timestamp: message.timestamp,
          unreadCount: message.recipient?.toString() === req.user.id && !message.status ? 1 : 0
        };
      } else if (message.recipient?.toString() === req.user.id && !message.status) {
        // Increment unread count for received messages
        conversations[partnerId].unreadCount += 1;
      }
    });
    
    // Convert to array and sort by timestamp
    const conversationsArray = Object.values(conversations)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    res.json(conversationsArray);
  } catch (err) {
    console.error("Error fetching conversations:", err);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// Send a new message
router.post("/", auth, async (req, res) => {
  try {
    const { content, recipientId } = req.body;
    
    if (!content || !recipientId) {
      return res.status(400).json({ error: "Content and recipientId are required" });
    }
    
    // Check if there's a connection between users
    const connection = await UserConnection.findOne({
      $or: [
        { user1: req.user.id, user2: recipientId },
        { user1: recipientId, user2: req.user.id }
      ]
    });
    
    // Check if there's an existing message request
    const existingRequest = await MessageRequest.findOne({
      from: req.user.id,
      to: recipientId,
      status: 'pending'
    });
    
    // Check if there's a sponsorship relationship
    const Sponsorship = (await import('../models/Sponsorship.js')).default;
    const sponsorship = await Sponsorship.findOne({
      $or: [
        { brand: req.user.id, influencer: recipientId },
        { brand: recipientId, influencer: req.user.id }
      ],
      status: { $in: ['accepted', 'pending'] } // Only active sponsorships
    });
    
    const hasSponsorship = !!sponsorship;
    
    if (!connection && !hasSponsorship) {
      // If no connection and no sponsorship, create a message request instead
      if (!existingRequest) {
        const request = new MessageRequest({
          from: req.user.id,
          to: recipientId,
          content: content
        });
        
        await request.save();
        return res.status(201).json({ 
          ...request.toObject(), 
          type: 'request',
          message: 'Message request sent successfully' 
        });
      } else {
        return res.status(400).json({ 
          error: 'Message request already sent. Waiting for acceptance.' 
        });
      }
    }
    
    // If there's a connection or sponsorship, send the message normally
    const message = new Message({
      sender: req.user.id,
      recipient: recipientId,
      content: content
    });
    
    await message.save();
    
    // Populate sender info for response
    await message.populate('sender', 'name');
    
    res.status(201).json({ ...message.toObject(), type: 'message' });
  } catch (err) {
    console.error("Error sending message:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Get message requests for a user
router.get("/requests", auth, async (req, res) => {
  try {
    const requests = await MessageRequest.find({ 
      to: req.user.id,
      status: 'pending'
    });
    res.json(requests);
  } catch (err) {
    console.error("Error fetching message requests:", err);
    res.status(500).json({ error: "Failed to fetch message requests" });
  }
});

// Accept a message request
router.post("/requests/:requestId/accept", auth, async (req, res) => {
  try {
    const { requestId } = req.params;
    
    // Validate request ID
    if (!requestId || requestId === 'undefined') {
      return res.status(400).json({ error: "Valid request ID is required" });
    }
    
    const request = await MessageRequest.findOne({
      _id: requestId,
      to: req.user.id,
      status: 'pending'
    });
    
    if (!request) {
      return res.status(404).json({ error: "Message request not found" });
    }
    
    // Update request status
    request.status = 'accepted';
    await request.save();
    
    // Create connection between users
    const existingConnection = await UserConnection.findOne({
      $or: [
        { user1: request.from, user2: request.to },
        { user1: request.to, user2: request.from }
      ]
    });
    
    if (!existingConnection) {
      const connection = new UserConnection({
        user1: request.from.toString(), // Ensure it's a string ID
        user2: request.to.toString()     // Ensure it's a string ID
      });
      await connection.save();
    }
    
    // Create the first message from the request
    const message = new Message({
      sender: request.from.toString(),    // Ensure it's a string ID
      recipient: request.to.toString(),   // Ensure it's a string ID
      content: request.content
    });
    
    await message.save();
    
    // Populate sender info for response
    await message.populate('sender', 'name');
    await message.populate('recipient', 'name');
    
    res.json({ 
      message: "Message request accepted", 
      firstMessage: {
        ...message.toObject(),
        senderName: message.sender.name,
        recipientName: message.recipient.name
      }
    });
  } catch (err) {
    console.error("Error accepting message request:", err);
    res.status(500).json({ error: "Failed to accept message request" });
  }
});

// Reject a message request
router.post("/requests/:requestId/reject", auth, async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const request = await MessageRequest.findOne({
      _id: requestId,
      to: req.user.id,
      status: 'pending'
    });
    
    if (!request) {
      return res.status(404).json({ error: "Message request not found" });
    }
    
    // Update request status
    request.status = 'rejected';
    await request.save();
    
    res.json({ message: "Message request rejected" });
  } catch (err) {
    console.error("Error rejecting message request:", err);
    res.status(500).json({ error: "Failed to reject message request" });
  }
});

export default router;