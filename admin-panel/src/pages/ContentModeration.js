import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { FaFlag, FaCheck, FaTimes, FaTrash, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ContentModeration = () => {
  const [flaggedContent, setFlaggedContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFlaggedContent();
  }, [filter]);

  const fetchFlaggedContent = async () => {
    setLoading(true);
    try {
      // This would be a real API call
      // For now, using mock data
      const mockData = [
        {
          _id: '1',
          type: 'job',
          title: 'Suspicious Job Posting',
          content: 'Software Developer role with unrealistic salary',
          reportedBy: 5,
          reason: 'Potentially scam',
          status: 'pending',
          createdAt: new Date(),
          relatedId: 'job123'
        },
        {
          _id: '2',
          type: 'company',
          title: 'Company Name Verification Issue',
          content: 'Company claims fake credentials',
          reportedBy: 3,
          reason: 'Unverified company',
          status: 'pending',
          createdAt: new Date(),
          relatedId: 'company456'
        }
      ];
      setFlaggedContent(mockData.filter(item => item.status === filter));
    } catch (error) {
      console.error('Error fetching flagged content:', error);
      toast.error('Failed to load flagged content');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      // API call would go here
      toast.success('Content approved');
      setFlaggedContent(flaggedContent.filter(item => item._id !== id));
    } catch (error) {
      toast.error('Failed to approve content');
    }
  };

  const handleReject = async (id) => {
    try {
      // API call would go here
      toast.success('Content rejected and removed');
      setFlaggedContent(flaggedContent.filter(item => item._id !== id));
    } catch (error) {
      toast.error('Failed to reject content');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
            <FaFlag className="text-red-600" />
            Content Moderation
          </h1>
          <p className="text-gray-600">Review and manage flagged content</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 bg-white rounded-lg shadow p-1">
          {['pending', 'approved', 'rejected'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`flex-1 py-2 px-4 rounded font-semibold transition ${
                filter === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search flagged content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Content List */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : flaggedContent.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No flagged content in this category</p>
          </div>
        ) : (
          <div className="space-y-4">
            {flaggedContent.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-2">
                      {item.type.toUpperCase()}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 mt-2">{item.title}</h3>
                    <p className="text-gray-600 mt-2">{item.content}</p>
                    <div className="mt-4 flex gap-4 text-sm text-gray-500">
                      <span>Reported by {item.reportedBy} users</span>
                      <span>Reason: {item.reason}</span>
                    </div>
                  </div>
                </div>

                {filter === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(item._id)}
                      className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                      <FaCheck /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(item._id)}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      <FaTimes /> Reject & Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentModeration;
