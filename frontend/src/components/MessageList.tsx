// frontend/src/components/MessageList.tsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../useAuth";
import axios from "axios";
import websocketService from "../services/websocket";

interface Conversation {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
}

const MessageList: React.FC = () => {
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial conversations
    loadConversations();
    
    // Listen for new messages
    websocketService.addMessageListener(handleNewMessage);
    
    return () => {
      websocketService.removeMessageListener(handleNewMessage);
    };
  }, [token]);

  const loadConversations = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      // In a real app, you would fetch conversations from an API
      // For now, we'll simulate with sample data
      const sampleConversations: Conversation[] = [
        {
          id: "1",
          userId: "user1",
          userName: "Alex Johnson",
          lastMessage: "Sure, let's schedule a call to discuss the details",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          unreadCount: 2,
          isOnline: true
        },
        {
          id: "2",
          userId: "user2",
          userName: "Sarah Miller",
          lastMessage: "Thanks for the proposal, I'll review it by tomorrow",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          unreadCount: 0,
          isOnline: false
        },
        {
          id: "3",
          userId: "user3",
          userName: "TechBrand Inc",
          lastMessage: "We've approved your collaboration request!",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          unreadCount: 1,
          isOnline: true
        }
      ];
      
      setConversations(sampleConversations);
    } catch (err) {
      console.error("Error loading conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewMessage = (message: any) => {
    if (message.type === 'message' && message.data) {
      // Update conversations with new message
      setConversations(prev => {
        const updated = [...prev];
        const convIndex = updated.findIndex(c => c.userId === message.data.senderId);
        
        if (convIndex !== -1) {
          // Update existing conversation
          updated[convIndex] = {
            ...updated[convIndex],
            lastMessage: message.data.content,
            timestamp: message.data.timestamp,
            unreadCount: updated[convIndex].unreadCount + 1
          };
        } else {
          // Add new conversation
          updated.unshift({
            id: Date.now().toString(),
            userId: message.data.senderId,
            userName: message.data.senderName,
            lastMessage: message.data.content,
            timestamp: message.data.timestamp,
            unreadCount: 1,
            isOnline: true
          });
        }
        
        // Sort by timestamp (newest first)
        return updated.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
      });
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
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
      {conversations.map((conversation) => (
        <Link
          key={conversation.id}
          to={`/messages?recipient=${conversation.userId}&name=${encodeURIComponent(conversation.userName)}`}
          className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
        >
          <div className="flex items-center">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-medium">
                  {conversation.userName.charAt(0).toUpperCase()}
                </span>
              </div>
              {conversation.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
              )}
            </div>
            
            <div className="ml-3 flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {conversation.userName}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatTime(conversation.timestamp)}
                </span>
              </div>
              
              <div className="flex items-center justify-between mt-1">
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {conversation.lastMessage}
                </p>
                {conversation.unreadCount > 0 && (
                  <span className="ml-2 flex-shrink-0 inline-flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-xs text-white">
                    {conversation.unreadCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
      ))}
      
      {conversations.length === 0 && (
        <div className="p-8 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No messages yet</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            When you start conversations, they'll appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default MessageList;