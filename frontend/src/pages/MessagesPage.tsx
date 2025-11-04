// frontend/src/pages/MessagesPage.tsx
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import websocketService from "../services/websocket";
import axios from "axios";
import MessageList from "../components/MessageList";
import MessageRequests from "../components/MessageRequests";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

const MessagesPage: React.FC = () => {
  const { user, token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [recipient, setRecipient] = useState<{ id: string; name: string } | null>(null);
  const [connected, setConnected] = useState(false);
  const [activeTab, setActiveTab] = useState<"messages" | "requests">("messages");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get recipient from URL query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const recipientId = searchParams.get("recipient");
    const recipientName = searchParams.get("name");
    
    if (recipientId && recipientName) {
      setRecipient({ id: recipientId, name: recipientName });
    } else {
      setRecipient(null);
    }
  }, [location.search]);

  // Connect to WebSocket
  useEffect(() => {
    if (token) {
      websocketService.connect(token);
      
      websocketService.addMessageListener(handleWebSocketMessage);
      websocketService.addConnectionListener(handleConnectionChange);
      
      // Load initial messages if we have a recipient
      if (recipient) {
        loadMessages();
      } else {
        setLoading(false);
      }
    }
    
    return () => {
      websocketService.removeMessageListener(handleWebSocketMessage);
      websocketService.removeConnectionListener(handleConnectionChange);
    };
  }, [token, recipient]);

  // Handle WebSocket messages
  const handleWebSocketMessage = (message: any) => {
    if (message.type === 'message' && message.data) {
      // Check if the message is from our recipient
      if (
        (message.data.senderId === recipient?.id && message.data.recipientId === user?._id) ||
        (message.data.senderId === user?._id && message.data.recipientId === recipient?.id)
      ) {
        setMessages(prev => [...prev, message.data]);
      }
    } else if (message.type === 'messageRequestConfirmation') {
      // Show confirmation that request was sent
      console.log("Message request sent successfully");
    } else if (message.type === 'requestAccepted') {
      // Reload messages when a request is accepted
      if (recipient) {
        loadMessages();
      }
    }
  };

  // Handle WebSocket connection status
  const handleConnectionChange = (connected: boolean) => {
    setConnected(connected);
  };

  // Load messages
  const loadMessages = async () => {
    if (!token || !recipient) return;
    
    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/messages?recipient=${recipient.id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setMessages(res.data);
    } catch (err) {
      console.error("Error loading messages:", err);
      // Fallback to sample data if API fails
      const sampleMessages: Message[] = [
        {
          id: "1",
          senderId: user?._id || "",
          senderName: user?.name || "You",
          content: "Hi there! I'm interested in your sponsorship offer.",
          timestamp: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: "2",
          senderId: recipient.id,
          senderName: recipient.name,
          content: "Hello! Thanks for your interest. Let's discuss the details.",
          timestamp: new Date(Date.now() - 1800000).toISOString()
        }
      ];
      setMessages(sampleMessages);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !token || !recipient) return;

    try {
      const messageData = {
        content: newMessage,
        recipientId: recipient.id,
        senderId: user?._id,
        senderName: user?.name || "You",
        timestamp: new Date().toISOString()
      };

      // Send via WebSocket for real-time delivery
      websocketService.send({
        type: 'message',
        data: messageData
      });

      // Also send to API for persistence
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/messages`,
        { content: newMessage, recipientId: recipient.id },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // If it's a request, show appropriate message
      if (res.data.type === 'request') {
        setNewMessage("");
        // Show a message that the request was sent
        alert("Message request sent! You'll be able to chat once they accept your request.");
        // Go back to message list
        navigate('/messages');
        return;
      }

      setNewMessage("");
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        alert("You've already sent a message request to this user. Please wait for them to accept.");
      } else {
        console.error("Error sending message:", err);
      }
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {};
  messages.forEach(message => {
    const date = formatDate(message.timestamp);
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  // If no recipient is selected, show the message list or requests
  if (!recipient) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card shadow-lg rounded-xl overflow-hidden">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h1>
              </div>
              
              {/* Tabs */}
              <div className="mt-4 flex border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setActiveTab("messages")}
                  className={`py-2 px-4 text-sm font-medium border-b-2 ${
                    activeTab === "messages"
                      ? "border-primary text-primary dark:text-primary-light"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  Messages
                </button>
                <button
                  onClick={() => setActiveTab("requests")}
                  className={`py-2 px-4 text-sm font-medium border-b-2 ${
                    activeTab === "requests"
                      ? "border-primary text-primary dark:text-primary-light"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  Requests
                </button>
              </div>
            </div>
            
            {/* Content */}
            {activeTab === "messages" ? <MessageList /> : <MessageRequests />}
          </div>
        </div>
      </div>
    );
  }

  // Show conversation view
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-6">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="rounded-full bg-gray-200 dark:bg-gray-700 h-10 w-10"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card shadow-lg rounded-xl overflow-hidden">
          {/* Chat header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center">
              <button 
                onClick={() => navigate('/messages')}
                className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition md:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">
                      {recipient?.name.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${connected ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {recipient?.name || "User"}
                  </h2>
                  <p className={`text-sm ${connected ? 'text-green-500' : 'text-gray-500'}`}>
                    {connected ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Messages container */}
          <div className="bg-gray-100 dark:bg-gray-800/50 h-[calc(100vh-220px)] overflow-y-auto p-4">
            {Object.entries(groupedMessages).map(([date, dateMessages]) => (
              <div key={date} className="mb-6">
                <div className="flex justify-center">
                  <span className="text-xs font-medium px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">
                    {date}
                  </span>
                </div>
                
                {dateMessages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex mt-4 ${message.senderId === user?._id ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.senderId !== user?._id && (
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                          <span className="text-secondary text-xs font-medium">
                            {message.senderName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <div className={`max-w-xs md:max-w-md lg:max-w-lg ${message.senderId === user?._id ? 'rounded-l-xl rounded-tr-xl bg-primary text-white' : 'rounded-r-xl rounded-tl-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white'} px-4 py-2`}>
                      {message.senderId !== user?._id && (
                        <div className="font-medium text-sm mb-1">{message.senderName}</div>
                      )}
                      <div className="text-sm">{message.content}</div>
                      <div className={`text-xs mt-1 ${message.senderId === user?._id ? 'text-primary-light' : 'text-gray-500 dark:text-gray-400'} text-right`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                    
                    {message.senderId === user?._id && (
                      <div className="flex-shrink-0 ml-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary text-xs font-medium">
                            {message.senderName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
            <form onSubmit={handleSendMessage} className="flex items-center">
              <div className="flex-1 mr-3">
                <div className="relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 dark:text-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={!newMessage.trim() || !connected}
                className="p-3 bg-primary hover:bg-primary-dark text-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;