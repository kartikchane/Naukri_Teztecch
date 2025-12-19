import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaPaperPlane } from 'react-icons/fa';

const Messages = () => {
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const aiMessagesEndRef = useRef(null);

  const scrollAiToBottom = () => {
    aiMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollAiToBottom();
  }, [aiMessages]);

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    if (!aiInput.trim() || aiTyping) return;

    const userMessage = aiInput.trim();
    setAiMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setAiInput('');
    setAiTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = getAiResponse(userMessage);
      setAiMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      setAiTyping(false);
    }, 1000);
  };

  const getAiResponse = (message) => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('job') || lowerMessage.includes('position') || lowerMessage.includes('opening')) {
      return "I can help you find jobs! You can browse available positions on our Jobs page. What type of role are you interested in?";
    } else if (lowerMessage.includes('company') || lowerMessage.includes('employer')) {
      return "You can explore companies on our Companies page. Each company has detailed profiles with job openings. Would you like help finding companies in a specific industry?";
    } else if (lowerMessage.includes('apply') || lowerMessage.includes('application')) {
      return "To apply for jobs, simply browse our job listings and click 'Apply Now' on positions that interest you. You can track all your applications in the 'My Applications' section. Need help with your application?";
    } else if (lowerMessage.includes('profile') || lowerMessage.includes('resume')) {
      return "Keep your profile updated! Go to your Profile page to add your skills, experience, and education. A complete profile increases your chances of getting noticed by employers.";
    } else if (lowerMessage.includes('salary') || lowerMessage.includes('pay')) {
      return "Salary information is typically included in job postings. You can also filter jobs by salary range on our Jobs page. Remember, salary can often be negotiated based on your experience and skills!";
    } else if (lowerMessage.includes('remote') || lowerMessage.includes('work from home')) {
      return "We have many remote job opportunities! Use the location filter on the Jobs page and select 'Remote' to see all work-from-home positions.";
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm here to help you with anything related to jobs, companies, applications, or your career. What would you like to know?";
    } else if (lowerMessage.includes('help')) {
      return "I can assist you with:\n• Finding jobs and companies\n• Understanding the application process\n• Tips for your profile\n• Information about salaries\n• Remote work opportunities\n\nWhat would you like help with?";
    } else {
      return "I'm your career assistant! I can help you with job searches, company information, application tips, and more. Feel free to ask me anything about your career journey!";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-[calc(100vh-120px)]">
          {/* AI Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 flex-shrink-0">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <FaRobot className="text-3xl text-purple-600" />
              </div>
              <div className="ml-3">
                <h2 className="font-semibold text-white text-lg">AI Career Assistant</h2>
                <p className="text-sm text-purple-100">Ask me anything about jobs & companies</p>
              </div>
            </div>
          </div>

          {/* AI Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-br from-purple-50 to-blue-50">
            {aiMessages.length === 0 && (
              <div className="text-center py-12">
                <FaRobot className="text-6xl text-purple-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Hello! I'm your AI Career Assistant
                </h3>
                <p className="text-gray-600 mb-6">
                  Ask me about companies, jobs, applications, or career advice!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                  <button
                    onClick={() => setAiInput("How do I find remote jobs?")}
                    className="p-3 bg-white rounded-lg hover:shadow-md transition-shadow text-left text-sm text-gray-700"
                  >
                    💼 How do I find remote jobs?
                  </button>
                  <button
                    onClick={() => setAiInput("What companies are hiring?")}
                    className="p-3 bg-white rounded-lg hover:shadow-md transition-shadow text-left text-sm text-gray-700"
                  >
                    🏢 What companies are hiring?
                  </button>
                  <button
                    onClick={() => setAiInput("How can I improve my profile?")}
                    className="p-3 bg-white rounded-lg hover:shadow-md transition-shadow text-left text-sm text-gray-700"
                  >
                    📝 How can I improve my profile?
                  </button>
                  <button
                    onClick={() => setAiInput("Tell me about the application process")}
                    className="p-3 bg-white rounded-lg hover:shadow-md transition-shadow text-left text-sm text-gray-700"
                  >
                    ✅ Tell me about the application process
                  </button>
                </div>
              </div>
            )}

            {aiMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex items-center mb-1">
                      <FaRobot className="text-purple-600 mr-2" />
                      <span className="text-xs font-semibold text-purple-600">AI Assistant</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-line">{msg.content}</p>
                </div>
              </div>
            ))}

            {aiTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-lg rounded-bl-none shadow-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={aiMessagesEndRef} />
          </div>

          {/* AI Input */}
          <div className="p-4 border-t border-gray-200 bg-white flex-shrink-0">
            <form onSubmit={handleAiSubmit} className="flex space-x-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={aiTyping}
              />
              <button
                type="submit"
                disabled={!aiInput.trim() || aiTyping}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPaperPlane />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
