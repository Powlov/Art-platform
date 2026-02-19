import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertCircle, Send, Search, ArrowLeft, CheckCheck, Clock, Loader2 } from 'lucide-react';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useWebSocket } from '@/_core/hooks/useWebSocket';

export default function Messenger() {
  const [, setLocation] = useLocation();
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchUsername, setSearchUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = currentUser?.id?.toString();
  
  // WebSocket hook
  const { isConnected, messages: wsMessages, sendMessage, sendTyping } = useWebSocket(userId);

  // Handle incoming WebSocket messages
  useEffect(() => {
    wsMessages.forEach((msg) => {
      if (msg.type === 'message') {
        const newMsg = {
          id: `${Date.now()}`,
          senderId: msg.data.senderId,
          senderName: msg.data.senderName,
          content: msg.data.content,
          timestamp: new Date(msg.data.timestamp),
          status: 'read',
        };
        setMessages((prev) => [...prev, newMsg]);
      } else if (msg.type === 'typing') {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          newSet.add(msg.data.senderId);
          return newSet;
        });
        setTimeout(() => {
          setTypingUsers((prev) => {
            const newSet = new Set(prev);
            newSet.delete(msg.data.senderId);
            return newSet;
          });
        }, 3000);
      }
    });
  }, [wsMessages]);

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        // Mock data - in production would fetch from tRPC
        setConversations([
          { 
            id: 1, 
            username: 'artist_john', 
            name: 'John Artist', 
            avatar: '👨‍🎨', 
            lastMessage: 'Interested in your work...', 
            timestamp: new Date(Date.now() - 3600000),
            unreadCount: 2
          },
          { 
            id: 2, 
            username: 'collector_jane', 
            name: 'Jane Collector', 
            avatar: '👩‍💼', 
            lastMessage: 'How much for this piece?', 
            timestamp: new Date(Date.now() - 7200000),
            unreadCount: 0
          },
        ]);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        toast.error('Failed to load conversations');
      }
    };
    fetchConversations();
  }, []);

  // Fetch messages for selected conversation
  useEffect(() => {
    if (selectedConversation) {
      // Mock messages - in production would fetch from tRPC
      setMessages([
        { 
          id: '1',
          senderId: 1, 
          senderName: 'John Artist', 
          content: 'Hi there!', 
          timestamp: new Date(Date.now() - 3600000),
          status: 'read'
        },
        { 
          id: '2',
          senderId: currentUser.id, 
          senderName: currentUser.name, 
          content: 'Hello! How are you?', 
          timestamp: new Date(Date.now() - 3500000),
          status: 'read'
        },
        { 
          id: '3',
          senderId: 1, 
          senderName: 'John Artist', 
          content: 'I\'m doing great! Interested in my latest artwork?', 
          timestamp: new Date(Date.now() - 3400000),
          status: 'read'
        },
      ]);
    }
  }, [selectedConversation]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const recipientId = selectedConversation.toString();
    const message = {
      id: `${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: newMessage,
      timestamp: new Date(),
      status: 'sending',
    };

    // Optimistic update
    setMessages((prev) => [...prev, message]);
    setNewMessage('');

    try {
      // Send via WebSocket
      sendMessage(recipientId, newMessage);
      
      // Update message status
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, status: 'sent' } : msg
        )
      );

      toast.success('Message sent');
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove failed message
      setMessages((prev) => prev.filter((msg) => msg.id !== message.id));
      setNewMessage(newMessage); // Restore text
      toast.error('Failed to send message');
    }
  };

  const handleTyping = () => {
    if (selectedConversation) {
      sendTyping(selectedConversation.toString());
    }
  };

  const handleSearchUser = async () => {
    if (!searchUsername.trim()) return;

    setIsLoading(true);
    try {
      // In production, would search via tRPC
      toast.success(`Searching for user: ${searchUsername}`);
      // Mock: create new conversation
      const newConversation = {
        id: conversations.length + 1,
        username: searchUsername,
        name: searchUsername.replace('_', ' ').toUpperCase(),
        avatar: '👤',
        lastMessage: 'New conversation',
        timestamp: new Date(),
        unreadCount: 0,
      };
      setConversations((prev) => [newConversation, ...prev]);
      setSearchUsername('');
    } catch (error) {
      toast.error('User not found');
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedConversation) {
    const conversation = conversations.find((c) => c.id === selectedConversation);
    const isTyping = typingUsers.has(conversation?.id || 0);

    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedConversation(null)}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={20} />
              Back
            </Button>
            <div>
              <h2 className="text-xl font-bold">{conversation?.name}</h2>
              <p className="text-sm text-gray-500">@{conversation?.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                Online
              </div>
            ) : (
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                Offline
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.senderId === currentUser.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <p className="text-xs opacity-70">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                    {msg.senderId === currentUser.id && (
                      <div className="flex items-center gap-0.5">
                        {msg.status === 'sending' && (
                          <Clock size={12} className="opacity-70" />
                        )}
                        {msg.status === 'sent' && (
                          <CheckCheck size={12} className="opacity-70" />
                        )}
                        {msg.status === 'read' && (
                          <CheckCheck size={12} className="opacity-100" />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t p-4 flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1"
            disabled={!isConnected}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !newMessage.trim() || !isConnected}
            className="flex items-center gap-2"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            Send
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Messages</h1>
            <div className="flex items-center gap-2 text-sm">
              {isConnected ? (
                <div className="flex items-center gap-1 text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  Connected
                </div>
              ) : (
                <div className="flex items-center gap-1 text-gray-400">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Disconnected
                </div>
              )}
            </div>
          </div>

          {/* Search User */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Start New Conversation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  placeholder="Enter username (e.g., artist_john)"
                  className="flex-1"
                />
            <Button
              onClick={handleSearchUser}
              disabled={isLoading || !searchUsername.trim()}
              className="flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Search size={18} />
              )}
              Search
            </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Conversations List */}
        <div className="space-y-2">
          {conversations.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-gray-500">
                  <AlertCircle size={18} />
                  No conversations yet
                </div>
              </CardContent>
            </Card>
          ) : (
            conversations.map((conv) => (
              <Card
                key={conv.id}
                className={`cursor-pointer hover:border-blue-500 transition-all ${
                  conv.unreadCount && conv.unreadCount > 0 ? 'border-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedConversation(conv.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{conv.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold">{conv.name}</h3>
                        {conv.unreadCount && conv.unreadCount > 0 && (
                          <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">@{conv.username}</p>
                      <p className="text-sm text-gray-600 mt-1">{conv.lastMessage}</p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {conv.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
