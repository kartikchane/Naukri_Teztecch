import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import JobCard from '../components/JobCard';
import { FaBookmark, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

const SavedJobs = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view saved jobs');
      navigate('/login');
      return;
    }
    fetchSavedJobs();
  }, [isAuthenticated, navigate]);

  const fetchSavedJobs = async () => {
    try {
      const { data } = await API.get('/users/saved-jobs');
      setSavedJobs(data);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
      toast.error('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = (jobId) => {
    setSavedJobs(savedJobs.filter(job => job._id !== jobId));
    fetchSavedJobs(); // Refresh the list
  };

  const filteredJobs = savedJobs.filter(job =>
    job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location?.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <FaBookmark className="text-primary text-xl" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Saved Jobs</h1>
                  <p className="text-gray-600 mt-1">
                    {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
                  </p>
                </div>
              </div>
            </div>

            {/* Search */}
            {savedJobs.length > 0 && (
              <div className="relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search saved jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            )}
          </div>

          {/* Jobs List */}
          {filteredJobs.length > 0 ? (
            <div className="space-y-6">
              {filteredJobs.map(job => (
                <JobCard
                  key={job._id}
                  job={job}
                  isSaved={true}
                  onSave={handleUnsave}
                />
              ))}
            </div>
          ) : savedJobs.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">Try adjusting your search</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <FaBookmark className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved jobs yet</h3>
              <p className="text-gray-600 mb-6">
                Start saving jobs you're interested in to view them here
              </p>
              <button
                onClick={() => navigate('/jobs')}
                className="btn-primary"
              >
                Browse Jobs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedJobs;
