import mongoose from 'mongoose';

const userConnectionSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  connectedAt: {
    type: Date,
    default: Date.now
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying of connections for a user
userConnectionSchema.index({ user1: 1 });
userConnectionSchema.index({ user2: 1 });

// Compound index for checking if connection exists between two users
userConnectionSchema.index({ user1: 1, user2: 1 });
userConnectionSchema.index({ user2: 1, user1: 1 });

const UserConnection = mongoose.model('UserConnection', userConnectionSchema);

export default UserConnection;