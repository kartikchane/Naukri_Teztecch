import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaSearch, FaCircle, FaUserCircle, FaRobot, FaTimes, FaBars } from 'react-icons/fa';

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAIChat, setShowAIChat] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef(null);
  const aiMessagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollAiToBottom = () => {
    aiMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollAiToBottom();
  }, [aiMessages]);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      // No conversations yet - will be implemented when backend messaging is ready
      setConversations([]);
      setLoading(false);
      // Auto-open AI Assistant since there are no conversations
      setShowAIChat(true);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      // Will be implemented when backend messaging is ready
      setMessages([]);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    fetchMessages(conversation._id);
    setShowAIChat(false);
    // Close sidebar on mobile after selection
    setShowSidebar(false);
  };

  const handleAIQuestion = async (question) => {
    if (!question.trim()) return;

    // Add user message
    const userMessage = {
      _id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date(),
    };
    setAiMessages(prev => [...prev, userMessage]);
    setAiInput('');
    setAiTyping(true);

    // Simulate AI response (replace with actual AI API call)
    setTimeout(() => {
      const aiResponse = getAIResponse(question);
      const aiMessage = {
        _id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      };
      setAiMessages(prev => [...prev, aiMessage]);
      setAiTyping(false);
    }, 1500);
  };

  const getAIResponse = (question) => {
    const lowerQuestion = question.toLowerCase();
    
    // Company-related responses
    if (lowerQuestion.includes('company') || lowerQuestion.includes('about')) {
      return "I can help you with information about companies on our platform! You can browse company profiles, see their job openings, company culture, and employee reviews. What specific company information are you looking for?";
    }
    if (lowerQuestion.includes('job') || lowerQuestion.includes('opening')) {
      return "We have thousands of job openings across various industries! You can filter jobs by location, salary, experience level, and company. Would you like me to help you find specific job categories?";
    }
    if (lowerQuestion.includes('apply') || lowerQuestion.includes('application')) {
      return "To apply for a job: 1) Browse jobs and click on the position you're interested in. 2) Click 'Apply Now' button. 3) Fill in your application details. 4) Submit! You can track all your applications in the 'My Applications' section.";
    }
    if (lowerQuestion.includes('salary') || lowerQuestion.includes('pay')) {
      return "Salary information is displayed on each job listing. You can also filter jobs by salary range. Most companies also offer additional benefits like health insurance, PTO, and bonuses. Check individual job postings for specific details.";
    }
    if (lowerQuestion.includes('interview') || lowerQuestion.includes('preparation')) {
      return "Interview tips: 1) Research the company thoroughly. 2) Prepare answers for common questions. 3) Dress professionally. 4) Be punctual. 5) Prepare questions to ask the interviewer. 6) Follow up with a thank-you email. Good luck!";
    }
    if (lowerQuestion.includes('resume') || lowerQuestion.includes('cv')) {
      return "Make sure your resume is up-to-date! Include: relevant experience, skills matching the job description, education, certifications, and quantifiable achievements. Keep it concise (1-2 pages) and tailored to each application.";
    }
    if (lowerQuestion.includes('remote') || lowerQuestion.includes('work from home')) {
      return "We have many remote job opportunities! Use the 'Work Mode' filter and select 'Remote' to see all remote positions. Many companies also offer hybrid options combining office and remote work.";
    }
    if (lowerQuestion.includes('profile') || lowerQuestion.includes('account')) {
      return "You can update your profile by going to the Profile section. Add your skills, experience, education, and upload your resume. A complete profile increases your visibility to employers!";
    }
    
    // Default response
    return "I'm here to help with questions about our job platform! You can ask me about:\n• Finding companies and jobs\n• Application process\n• Profile management\n• Interview preparation\n• Salary information\n• Remote work opportunities\n\nWhat would you like to know?";
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
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Messages</h1>
          <button
            onClick={() => {
              setShowAIChat(!showAIChat);
              setSelectedConversation(null);
              setShowSidebar(false);
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md text-sm"
          >
            <FaRobot className="text-lg" />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto h-full">
          <div className="h-full bg-white md:mx-4 md:my-4 md:rounded-lg shadow-lg overflow-hidden">
            <div className="flex h-full relative">
              {/* Mobile Overlay */}
              {showSidebar && (
                <div 
                  className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                  onClick={() => setShowSidebar(false)}
                />
              )}

              {/* Mobile Menu Button */}
              {!showSidebar && selectedConversation && (
                <button
                  onClick={() => setShowSidebar(true)}
                  className="md:hidden absolute top-4 left-4 z-20 bg-white p-2 rounded-lg shadow-lg"
                >
                  <FaBars className="text-gray-600" />
                </button>
              )}

              {/* Conversations List - Mobile Responsive */}
              <div className={`${
                showSidebar ? 'translate-x-0' : '-translate-x-full'
              } md:translate-x-0 fixed md:relative inset-y-0 left-0 z-40 w-80 md:w-96 lg:w-1/3 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out h-full`}>
              {/* Search */}
              <div className="p-4 border-b border-gray-200 flex-shrink-0">
                <div className="flex items-center justify-between mb-3 md:hidden">
                  <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
                  <button
                    onClick={() => setShowSidebar(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <FaPaperPlane className="mx-auto text-5xl text-gray-300 mb-4" />
                    <p className="text-base font-medium text-gray-700 mb-2">No conversations yet</p>
                    <p className="text-sm text-gray-500">
                      When employers contact you, conversations will appear here
                    </p>
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <div
                      key={conversation._id}
                      onClick={() => handleConversationSelect(conversation)}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        selectedConversation?._id === conversation._id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
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
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <FaUserCircle className="text-3xl text-blue-500" />
                          </div>
                        )}
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {conversation.otherUser.name}
                            </h3>
                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                              {formatTime(conversation.lastMessage.timestamp)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <p className={`text-sm truncate ${conversation.lastMessage.read ? 'text-gray-600' : 'text-gray-900 font-semibold'}`}>
                              {conversation.lastMessage.content}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1 flex-shrink-0">
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

            {/* Overlay for mobile sidebar */}
            {showSidebar && (
              <div
                className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                onClick={() => setShowSidebar(false)}
              ></div>
            )}

            {/* Messages Area or AI Chat */}
            <div className="flex-1 flex flex-col w-full md:w-auto overflow-hidden">
              {showAIChat ? (
                /* AI Assistant Chat */
                <>
                  {/* AI Header */}
                  <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                          <FaRobot className="text-2xl text-purple-600" />
                        </div>
                        <div className="ml-3">
                          <h2 className="font-semibold text-white text-base md:text-lg">AI Assistant</h2>
                          <p className="text-xs text-purple-100">Ask me anything about jobs & companies</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowAIChat(false)}
                        className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                      >
                        <FaTimes className="text-xl" />
                      </button>
                    </div>
                  </div>

                  {/* AI Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-purple-50 to-blue-50">
                    {aiMessages.length === 0 && (
                      <div className="text-center py-8 px-4">
                        <FaRobot className="text-5xl md:text-6xl text-purple-300 mx-auto mb-4" />
                        <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
                          Hello! I'm your AI Assistant
                        </h3>
                        <p className="text-sm md:text-base text-gray-600 mb-4">
                          Ask me about companies, jobs, applications, or career advice!
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                          {['Tell me about companies', 'How to apply?', 'Remote jobs?', 'Interview tips?'].map((suggestion) => (
                            <button
                              key={suggestion}
                              onClick={() => handleAIQuestion(suggestion)}
                              className="px-3 py-2 bg-white text-purple-600 rounded-full text-xs md:text-sm hover:bg-purple-100 transition-colors shadow"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {aiMessages.map((message) => (
                      <div
                        key={message._id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs sm:max-w-md lg:max-w-lg ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                          {message.type === 'ai' && (
                            <div className="flex items-center mb-1">
                              <FaRobot className="text-purple-600 mr-2" />
                              <span className="text-xs text-gray-600">AI Assistant</span>
                            </div>
                          )}
                          <div
                            className={`px-4 py-3 rounded-lg ${
                              message.type === 'user'
                                ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                                : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-line">{message.content}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 px-1">
                            {formatTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    
                    {aiTyping && (
                      <div className="flex justify-start">
                        <div className="bg-white px-4 py-3 rounded-lg border border-gray-200 shadow-sm">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={aiMessagesEndRef} />
                  </div>

                  {/* AI Input */}
                  <div className="p-3 md:p-4 bg-white border-t border-gray-200 flex-shrink-0">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleAIQuestion(aiInput);
                      }}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        placeholder="Ask me anything..."
                        className="flex-1 px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm md:text-base"
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value)}
                      />
                      <button
                        type="submit"
                        disabled={aiTyping}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 md:px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                      >
                        <FaPaperPlane className="md:mr-2" />
                        <span className="hidden md:inline">Send</span>
                      </button>
                    </form>
                  </div>
                </>
              ) : selectedConversation ? (
                <>
                  {/* Header */}
                  <div className="p-3 md:p-4 border-b border-gray-200 bg-white flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {selectedConversation.otherUser.avatar ? (
                          <img
                            src={selectedConversation.otherUser.avatar}
                            alt={selectedConversation.otherUser.name}
                            className="w-10 h-10 rounded-full flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <FaUserCircle className="text-2xl text-blue-500" />
                          </div>
                        )}
                        <div className="ml-3 min-w-0">
                          <h2 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                            {selectedConversation.otherUser.name}
                          </h2>
                          <div className="flex items-center text-xs md:text-sm text-gray-500">
                            <FaCircle className="text-green-500 text-xs mr-1" />
                            Online
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowSidebar(true)}
                        className="md:hidden text-gray-600 p-2"
                      >
                        <FaBars />
                      </button>
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
                          <div className={`max-w-xs sm:max-w-md lg:max-w-lg ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                            <div
                              className={`px-4 py-2 rounded-lg break-words ${
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
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <div className="p-3 md:p-4 bg-white border-t border-gray-200 flex-shrink-0">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-1 px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center flex-shrink-0"
                      >
                        <FaPaperPlane className="md:mr-2" />
                        <span className="hidden md:inline">Send</span>
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50 p-4">
                  <div className="text-center max-w-sm">
                    <FaPaperPlane className="mx-auto text-5xl md:text-6xl text-gray-300 mb-4" />
                    <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
                      No conversation selected
                    </h3>
                    <p className="text-sm md:text-base text-gray-500">
                      Select a conversation from the list to start messaging
                    </p>
                    <button
                      onClick={() => setShowSidebar(true)}
                      className="mt-4 md:hidden bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Conversations
                    </button>
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
