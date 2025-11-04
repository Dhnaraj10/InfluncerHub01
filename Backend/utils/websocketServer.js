import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Message from "../models/Message.js";
import MessageRequest from "../models/MessageRequest.js";
import UserConnection from "../models/UserConnection.js";

// Placeholder for the WebSocket server instance
let wss;

// Store connected clients with their user IDs
const clients = new Map();

/**
 * Initialize WebSocket server and attach it to the HTTP server
 * @param {http.Server} server - The HTTP server instance
 */
export const initializeWebSocketServer = (server) => {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws, request) => {
    console.log("New client connected");
    
    // Extract token from query parameters or headers
    const url = new URL(request.url, `http://${request.headers.host}`);
    const token = url.searchParams.get('token') || 
                  (request.headers.authorization && request.headers.authorization.startsWith('Bearer ') 
                    ? request.headers.authorization.substring(7) 
                    : null);
    
    if (token) {
      // Authenticate user immediately upon connection
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        ws.userId = decoded.id;
        clients.set(ws.userId, ws);
        console.log(`User ${decoded.id} authenticated on connection`);
      } catch (err) {
        console.error("WebSocket authentication error:", err);
        ws.close();
        return;
      }
    }
    
    // Handle incoming messages from clients
    ws.on("message", async (data) => {
      try {
        const message = JSON.parse(data);
        
        if (message.type === 'auth' && message.token) {
          // Authenticate user
          try {
            const decoded = jwt.verify(message.token, process.env.JWT_SECRET);
            ws.userId = decoded.id;
            clients.set(ws.userId, ws);
            console.log(`User ${decoded.id} authenticated`);
          } catch (err) {
            console.error("WebSocket authentication error:", err);
            ws.close();
          }
        } else if (message.type === 'message' && ws.userId) {
          // Handle chat message
          const { content, recipientId } = message.data;
          
          // Add sender info
          message.data.senderId = ws.userId;
          message.data.timestamp = new Date().toISOString();
          
          // Save message to database
          try {
            const dbMessage = new Message({
              sender: ws.userId,
              recipient: recipientId,
              content: content
            });
            await dbMessage.save();
            
            // Populate sender info
            await dbMessage.populate('sender', 'name');
            message.data = { ...message.data, ...dbMessage.toObject() };
          } catch (err) {
            console.error("Error saving message to database:", err);
          }
          
          // Find recipient WebSocket
          const recipientWs = clients.get(recipientId);
          
          // Send to recipient if online
          if (recipientWs && recipientWs.readyState === recipientWs.OPEN) {
            recipientWs.send(JSON.stringify(message));
            
            // Update message status to delivered
            try {
              await Message.findByIdAndUpdate(message.data.id, { status: 'delivered' });
            } catch (err) {
              console.error("Error updating message status:", err);
            }
          }
          
          // Always send back to sender for confirmation
          if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify(message));
          }
          
          console.log(`Message from ${ws.userId} to ${recipientId}: ${content}`);
        } else if (message.type === 'messageRequest' && ws.userId) {
          // Handle message request
          const { content, recipientId } = message.data;
          
          // Add sender info
          message.data.senderId = ws.userId;
          message.data.timestamp = new Date().toISOString();
          
          // Save message request to database
          try {
            const dbRequest = new MessageRequest({
              from: ws.userId,
              to: recipientId,
              content: content
            });
            await dbRequest.save();
            
            // Populate sender info
            const sender = await User.findById(ws.userId, 'name');
            message.data.senderName = sender.name;
            message.data = { ...message.data, ...dbRequest.toObject() };
          } catch (err) {
            console.error("Error saving message request to database:", err);
          }
          
          // Find recipient WebSocket
          const recipientWs = clients.get(recipientId);
          
          // Send request notification to recipient if online
          if (recipientWs && recipientWs.readyState === recipientWs.OPEN) {
            recipientWs.send(JSON.stringify({
              type: 'messageRequest',
              data: message.data
            }));
          }
          
          // Send confirmation back to sender
          if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({
              type: 'messageRequestConfirmation',
              data: message.data
            }));
          }
          
          console.log(`Message request from ${ws.userId} to ${recipientId}: ${content}`);
        } else if (message.type === 'requestAccepted' && ws.userId) {
          // Handle request acceptance
          const { requestId, fromUserId } = message.data;
          
          try {
            // Update request status in database
            const request = await MessageRequest.findById(requestId);
            if (request && request.to.toString() === ws.userId) {
              request.status = 'accepted';
              await request.save();
              
              // Create connection if it doesn't exist
              const existingConnection = await UserConnection.findOne({
                $or: [
                  { user1: request.from, user2: request.to },
                  { user1: request.to, user2: request.from }
                ]
              });
              
              if (!existingConnection) {
                const connection = new UserConnection({
                  user1: request.from,
                  user2: request.to
                });
                await connection.save();
              }
            }
          } catch (err) {
            console.error("Error updating request in database:", err);
          }
          
          // Notify the requester
          const requesterWs = clients.get(fromUserId);
          if (requesterWs && requesterWs.readyState === requesterWs.OPEN) {
            requesterWs.send(JSON.stringify({
              type: 'requestAccepted',
              data: { requestId }
            }));
          }
          
          // Send confirmation back to accepter
          if (ws.readyState === ws.OPEN) {
            ws.send(JSON.stringify({
              type: 'requestAcceptedConfirmation',
              data: { requestId }
            }));
          }
        }
      } catch (err) {
        console.error("Error handling WebSocket message:", err);
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      // Remove client from map
      if (ws.userId) {
        clients.delete(ws.userId);
      }
    });
    
    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      if (ws.userId) {
        clients.delete(ws.userId);
      }
    });
  });
};

/**
 * Broadcast sponsorship update to connected clients
 * @param {Object} payload - Event payload
 */
export const publishSponsorshipUpdate = ({ event, data, recipient = null }) => {
  if (!wss) {
    console.warn("WebSocket server not initialized");
    return;
  }

  const message = JSON.stringify({ event, data, recipient });

  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN && (!recipient || client.userId === recipient)) {
      client.send(message);
    }
  });
};

// Attach userId to WebSocket connections (you can integrate this in your auth middleware)
export const setWebSocketUserId = (ws, userId) => {
  ws.userId = userId;
};