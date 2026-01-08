
import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaUser, FaClipboardList, FaArrowRight, FaBuilding } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ 
    jobs: 0, 
    users: 0, 
    applications: 0, 
    companies: 0
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch basic stats
      const statsRes = await API.get('/admin/stats');
      console.log('Stats Response:', statsRes.data);
      setStats(statsRes.data);
      
      // Fetch recent jobs
      try {
        const jobsRes = await API.get('/admin/jobs?limit=5');
        console.log('Jobs Response:', jobsRes.data);
        setRecentJobs(jobsRes.data.jobs || []);
      } catch (err) {
        console.error('Jobs fetch error:', err);
      }
      
      // Fetch recent applications
      try {
        const appsRes = await API.get('/admin/applications?limit=5');
        console.log('Applications Response:', appsRes.data);
        setRecentApplications(appsRes.data.applications || []);
      } catch (err) {
        console.error('Applications fetch error:', err);
      }
      
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data');
      
      // If unauthorized, logout
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.clear();
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 fade-in p-4 md:p-6 lg:p-8">
      {/* Header with gradient */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 text-sm md:text-base">Welcome back! Here's what's happening today.</p>
      </div>
      
      {/* Not seeing data alert */}
      {!loading && !error && stats.jobs === 0 && stats.users === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800 font-semibold mb-2">🔄 Not seeing data?</p>
          <p className="text-yellow-700 text-sm mb-3">If the dashboard shows zeros but data exists, try clearing your session:</p>
          <button 
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.href = '/login';
            }}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 text-sm font-medium"
          >
            Clear Session & Re-login
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 font-semibold mb-2">Error Loading Dashboard</p>
          <p className="text-gray-600 text-sm">{error}</p>
          <button 
            onClick={fetchAllData}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <>
          {/* Stats Cards with Gradient */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            {/* Jobs Card */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl hover:shadow-2xl p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FaBriefcase className="text-3xl text-white" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-white">{stats.jobs}</div>
                </div>
              </div>
              <div className="text-white text-opacity-90 font-semibold text-lg">Total Jobs</div>
              <div className="text-white text-opacity-70 text-sm mt-1">Active listings</div>
            </div>

            {/* Users Card */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl hover:shadow-2xl p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FaUser className="text-3xl text-white" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-white">{stats.users}</div>
                </div>
              </div>
              <div className="text-white text-opacity-90 font-semibold text-lg">Total Users</div>
              <div className="text-white text-opacity-70 text-sm mt-1">Registered members</div>
            </div>

            {/* Applications Card */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl hover:shadow-2xl p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FaClipboardList className="text-3xl text-white" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-white">{stats.applications}</div>
                </div>
              </div>
              <div className="text-white text-opacity-90 font-semibold text-lg">Applications</div>
              <div className="text-white text-opacity-70 text-sm mt-1">Total submissions</div>
            </div>

            {/* Companies Card */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-xl hover:shadow-2xl p-6 transform hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FaBuilding className="text-3xl text-white" />
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-white">{stats.companies || 0}</div>
                </div>
              </div>
              <div className="text-white text-opacity-90 font-semibold text-lg">Companies</div>
              <div className="text-white text-opacity-70 text-sm mt-1">Hiring partners</div>
            </div>
          </div>

          {/* Recent Jobs & Applications with Better Design */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Jobs */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-blue-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <FaBriefcase className="text-white text-lg" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Recent Jobs</h2>
                </div>
                <Link 
                  to="/jobs" 
                  className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-2 font-semibold hover:gap-3 transition-all"
                >
                  View All <FaArrowRight className="text-xs" />
                </Link>
              </div>
              <ul className="space-y-3">
                {(!recentJobs || recentJobs.length === 0) && (
                  <li className="text-gray-400 text-center py-8 bg-gray-50 rounded-xl">
                    <FaBriefcase className="text-4xl mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No jobs found</p>
                  </li>
                )}
                {recentJobs && recentJobs.map((job, idx) => (
                  <li 
                    key={job._id || idx} 
                    className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="font-bold text-blue-700 truncate">{job.title || 'Unknown Job'}</div>
                    <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                      <FaBuilding className="text-xs text-gray-400" />
                      {job.company?.name || 'Unknown Company'}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ''}</div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Applications */}
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <FaClipboardList className="text-white text-lg" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Recent Applications</h2>
                </div>
                <Link 
                  to="/applications" 
                  className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-2 font-semibold hover:gap-3 transition-all"
                >
                  View All <FaArrowRight className="text-xs" />
                </Link>
              </div>
              <ul className="space-y-3">
                {(!recentApplications || recentApplications.length === 0) && (
                  <li className="text-gray-400 text-center py-8 bg-gray-50 rounded-xl">
                    <FaClipboardList className="text-4xl mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No applications found</p>
                  </li>
                )}
                {recentApplications && recentApplications.map((app, idx) => (
                  <li 
                    key={idx} 
                    className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 hover:shadow-md transition-all cursor-pointer"
                  >
                    <div className="font-bold text-purple-700 truncate">{app.user || 'Unknown User'}</div>
                    <div className="text-sm text-gray-600 mt-1 truncate">{app.job || 'Unknown Job'}</div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">{app.appliedOn ? new Date(app.appliedOn).toLocaleDateString() : ''}</span>
                      <span className="text-xs px-3 py-1 bg-green-500 text-white rounded-full font-semibold shadow-sm">
                        {app.status || 'Applied'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
