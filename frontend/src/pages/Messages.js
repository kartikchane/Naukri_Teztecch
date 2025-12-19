import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaSearch, FaCircle, FaUserCircle } from 'react-icons/fa';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      // Mock data for now - replace with actual API call
      const mockConversations = [
        {
          _id: '1',
          otherUser: {
            _id: 'user1',
            name: 'Tech Corp HR',
            avatar: null,
          },
          lastMessage: {
            content: 'Thank you for applying to our Senior Developer position',
            timestamp: new Date(Date.now() - 3600000),
            read: false,
          },
          unreadCount: 2,
        },
        {
          _id: '2',
          otherUser: {
            _id: 'user2',
            name: 'Startup Inc',
            avatar: null,
          },
          lastMessage: {
            content: 'We would like to schedule an interview',
            timestamp: new Date(Date.now() - 7200000),
            read: true,
          },
          unreadCount: 0,
        },
      ];
      setConversations(mockConversations);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      // Mock messages - replace with actual API call
      const mockMessages = [
        {
          _id: 'm1',
          sender: { _id: 'user1', name: 'Tech Corp HR' },
          content: 'Hello! Thank you for applying to our Senior Developer position.',
          timestamp: new Date(Date.now() - 7200000),
          read: true,
        },
        {
          _id: 'm2',
          sender: { _id: 'current-user', name: 'You' },
          content: 'Thank you! I am very interested in this opportunity.',
          timestamp: new Date(Date.now() - 3600000),
          read: true,
        },
        {
          _id: 'm3',
          sender: { _id: 'user1', name: 'Tech Corp HR' },
          content: 'Great! We would like to schedule an interview. Are you available next week?',
          timestamp: new Date(Date.now() - 1800000),
          read: false,
        },
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation._id);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // Add message optimistically
      const tempMessage = {
        _id: Date.now().toString(),
        sender: { _id: 'current-user', name: 'You' },
        content: newMessage,
        timestamp: new Date(),
        read: true,
      };
      setMessages([...messages, tempMessage]);
      setNewMessage('');

      // Here you would send the message to the server
      // await axios.post(`http://localhost:5000/api/messages`, { ... });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Messages</h1>

        <div className="bg-white rounded-lg shadow-md overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <div className="flex h-full">
            {/* Conversations List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <p>No conversations yet</p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation._id}
                      onClick={() => handleConversationSelect(conversation)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation?._id === conversation._id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start">
                        {conversation.otherUser.avatar ? (
                          <img
                            src={conversation.otherUser.avatar}
                            alt={conversation.otherUser.name}
                            className="w-12 h-12 rounded-full"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <FaUserCircle className="text-3xl text-blue-500" />
                          </div>
                        )}
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {conversation.otherUser.name}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className={`text-sm truncate ${conversation.lastMessage.read ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>
                              {conversation.lastMessage.content}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex items-center">
                      {selectedConversation.otherUser.avatar ? (
                        <img
                          src={selectedConversation.otherUser.avatar}
                          alt={selectedConversation.otherUser.name}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <FaUserCircle className="text-2xl text-blue-500" />
                        </div>
                      )}
                      <div className="ml-3">
                        <h2 className="font-semibold text-gray-900">
                          {selectedConversation.otherUser.name}
                        </h2>
                        <div className="flex items-center text-sm text-gray-500">
                          <FaCircle className="text-green-500 text-xs mr-1" />
                          Online
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {messages.map((message) => {
                      const isOwnMessage = message.sender._id === 'current-user';
                      return (
                        <div
                          key={message._id}
                          className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                            <div
                              className={`px-4 py-2 rounded-lg ${
                                isOwnMessage
                                  ? 'bg-blue-500 text-white'
                                  : 'bg-white text-gray-900 border border-gray-200'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 px-1">
                              {formatTime(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Input */}
                  <div className="p-4 bg-white border-t border-gray-200">
                    <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                      >
                        <FaPaperPlane className="mr-2" />
                        Send
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <FaPaperPlane className="mx-auto text-6xl text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      No conversation selected
                    </h3>
                    <p className="text-gray-500">
                      Select a conversation from the list to start messaging
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
