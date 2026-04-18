import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';
import { FaPaperPlane, FaArrowLeft, FaPhone, FaVideo, FaSearch, FaUser, FaTimes } from 'react-icons/fa';

const Messaging = () => {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchConversations();
    if (userId) {
      setSelectedConversation(userId);
      fetchMessages(userId);
    }
  }, [userId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await API.get('/messages/conversations');
      setConversations(response.data.conversations || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to fetch conversations');
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await API.get(`/messages/${userId}?limit=50`);
      setMessages(response.data.messages || []);

      // Get user details
      const userResponse = await API.get(`/users/${userId}`);
      setOtherUser(userResponse.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedConversation) {
      toast.warn('Please type a message');
      return;
    }

    setSending(true);
    try {
      const response = await API.post('/messages/send', {
        receiverId: selectedConversation,
        message: newMessage,
        type: 'text'
      });

      setMessages([...messages, response.data.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const selectConversation = (userId) => {
    setSelectedConversation(userId);
    navigate(`/messages/${userId}`);
    fetchMessages(userId);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.otherUser?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Conversations Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Messages</h2>

          {/* Search Box */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No conversations yet</p>
            </div>
          ) : (
            filteredConversations.map((conv, index) => (
              <div
                key={index}
                onClick={() => selectConversation(conv.otherUser._id)}
                className={`p-4 border-b border-gray-100 cursor-pointer transition-colors ${
                  selectedConversation === conv.otherUser._id
                    ? 'bg-blue-50 border-l-4 border-l-blue-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{conv.otherUser.name}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm text-gray-600 truncate">
                  {conv.lastMessage.message}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConversation && otherUser ? (
          <>
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate('/messages')}
                  className="hover:bg-white hover:bg-opacity-20 p-2 rounded-lg"
                >
                  <FaArrowLeft />
                </button>

                <div>
                  <h2 className="text-xl font-bold">{otherUser.name}</h2>
                  <p className="text-sm opacity-90">{otherUser.role}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg">
                  <FaPhone />
                </button>
                <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg">
                  <FaVideo />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message, index) => {
                const isOwn = message.sender._id === otherUser._id;

                return (
                  <div
                    key={index}
                    className={`flex ${isOwn ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        isOwn
                          ? 'bg-gray-100 text-gray-900'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwn ? 'text-gray-500' : 'text-blue-100'
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form
              onSubmit={handleSendMessage}
              className="p-6 border-t border-gray-200 flex gap-2"
            >
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
              >
                {sending ? '...' : <FaPaperPlane />}
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <FaUser className="text-6xl mb-4 opacity-20 mx-auto" />
              <p className="text-lg">Select a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messaging;
