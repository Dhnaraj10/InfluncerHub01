// bakend/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// Import routes
import authRoutes from "./routes/auth.js";
import influencerRoutes from "./routes/influencers.js";
import sponsorshipRoutes from "./routes/sponsorships.js";
import categoryRoutes from "./routes/categories.js";
import analyticsRoutes from "./routes/analytics.js";
import earningsRoutes from "./routes/earnings.js";
import messagesRoutes from "./routes/messages.js";
import uploadRoutes from "./routes/upload.js";
import brandRoutes from "./routes/brands.js"; // Add this line

// Import WebSocket server
import { initializeWebSocketServer } from "./utils/websocketServer.js";

dotenv.config();
const app = express();
app.use(express.json());

// Configure CORS to allow frontend requests
const corsOptions = {
  origin: [
    process.env.FRONTEND_ORIGIN || "http://localhost:3000",
    // Add your deployed frontend URL here after deployment
    "https://your-app-name.vercel.app" // Replace with your actual Vercel URL
  ],
  credentials: true
};

app.use(cors(corsOptions));

// connect DB
connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/influencers", influencerRoutes);
app.use("/api/sponsorships", sponsorshipRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/earnings", earningsRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/brands", brandRoutes); // Add this line

// error middleware (must come after routes)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Initialize WebSocket server
initializeWebSocketServer(server);