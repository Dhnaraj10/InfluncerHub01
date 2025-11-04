import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import authRoutes from './routes/auth.js';
import influencerRoutes from './routes/influencers.js';
import brandRoutes from './routes/brands.js';
import sponsorshipRoutes from './routes/sponsorships.js';
import categoryRoutes from './routes/categories.js';
import uploadRoutes from './routes/upload.js';
import messageRoutes from './routes/messages.js';
import analyticsRoutes from './routes/analytics.js';
import earningsRoutes from './routes/earnings.js';

// Import middleware
import { errorHandler } from './middleware/errorMiddleware.js';

// Import WebSocket server
import { createServer } from 'http';
import { initializeWebSocketServer } from './utils/websocketServer.js';

// Import models to ensure they are registered
import './models/User.js';
import './models/InfluencerProfile.js';
import './models/BrandProfile.js';
import './models/Sponsorship.js';
import './models/Category.js';
import './models/Message.js';
import './models/MessageRequest.js';
import './models/UserConnection.js';

const app = express();
const server = createServer(app);

// Initialize WebSocket server
initializeWebSocketServer(server);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/influencers', influencerRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/sponsorships', sponsorshipRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/earnings', earningsRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('Database connection error:', err);
});

export default app;