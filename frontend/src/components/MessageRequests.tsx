// frontend/src/components/MessageRequests.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../useAuth";
import axios from "axios";
import websocketService from "../services/websocket";
import { useNavigate } from "react-router-dom";

interface MessageRequest {
  id: string;
  from: string;
  to: string;
  content: string;
  timestamp: string;
  status: string;
  senderName?: string;
}

const MessageRequests: React.FC = () => {
  const { user, token } = useAuth();
  const [requests, setRequests] = useState<MessageRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load requests
  const loadRequests = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/messages/requests`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setRequests(res.data);
    } catch (err) {
      console.error("Error loading message requests:", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
    
    // Listen for new message requests
    const handleWebSocketMessage = (message: any) => {
      if (message.type === 'messageRequest') {
        // Add new request to the list
        setRequests(prev => [...prev, message.data]);
      }
    };
    
    websocketService.addMessageListener(handleWebSocketMessage);
    
    return () => {
      websocketService.removeMessageListener(handleWebSocketMessage);
    };
  }, [token, loadRequests]);

  const handleAccept = async (requestId: string, fromUserId: string) => {
    if (!token) return;
    
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/messages/requests/${requestId}/accept`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Remove the request from the list
      setRequests(prev => prev.filter(req => req.id !== requestId));
      
      // Notify via WebSocket
      websocketService.send({
        type: 'requestAccepted',
        data: { requestId, fromUserId }
      });
      
      // Redirect to messages with the newly connected user
      if (res.data.firstMessage) {
        const message = res.data.firstMessage;
        const otherUserId = message.senderId === user?._id ? message.recipientId : message.senderId;
        const otherUserName = message.senderId === user?._id ? message.recipientName : message.senderName;
        navigate(`/messages?recipient=${otherUserId}&name=${encodeURIComponent(otherUserName || 'Unknown User')}`);
      }
    } catch (err) {
      console.error("Error accepting message request:", err);
      alert("Failed to accept message request. Please try again.");
    }
  };

  const handleReject = async (requestId: string) => {
    if (!token) return;
    
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/messages/requests/${requestId}/reject`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Remove the request from the list
      setRequests(prev => prev.filter(req => req.id !== requestId));
    } catch (err) {
      console.error("Error rejecting message request:", err);
      alert("Failed to reject message request. Please try again.");
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
              <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-12 w-12"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {requests.length === 0 ? (
        <div className="p-8 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No message requests</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            When someone wants to message you, their request will appear here.
          </p>
        </div>
      ) : (
        requests.map((request) => (
          <div key={request.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-medium">
                    {request.senderName?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
              </div>
              
              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {request.senderName || "Unknown User"}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(request.timestamp)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                  {request.content}
                </p>
                
                <div className="flex space-x-3 mt-3">
                  <button
                    onClick={() => handleAccept(request.id, request.from)}
                    className="px-3 py-1 bg-primary hover:bg-primary-dark text-white text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-700 dark:text-white text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageRequests;