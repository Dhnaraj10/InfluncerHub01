import { WebSocketServer } from "ws";

// Placeholder for the WebSocket server instance
let wss;

/**
 * Initialize WebSocket server and attach it to the HTTP server
 * @param {http.Server} server - The HTTP server instance
 */
export const initializeWebSocketServer = (server) => {
  wss = new WebSocketServer({ server });

  wss.on("connection", (ws) => {
    console.log("New client connected");
    ws.on("close", () => {
      console.log("Client disconnected");
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