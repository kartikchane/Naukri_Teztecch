
import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaUser, FaClipboardList, FaArrowRight } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ jobs: 0, users: 0, applications: 0 });
  const [recentJobs, setRecentJobs] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchRecentJobs();
    fetchRecentApplications();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/admin/stats');
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchRecentJobs = async () => {
    try {
      const { data } = await API.get('/admin/jobs?limit=5');
      setRecentJobs(data.jobs || []);
    } catch (error) {
      console.error('Error fetching recent jobs:', error);
    }
  };

  const fetchRecentApplications = async () => {
    try {
      const { data } = await API.get('/admin/applications?limit=5');
      setRecentApplications(data.applications || []);
    } catch (error) {
      console.error('Error fetching recent applications:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 fade-in">
      <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-4 md:mb-6 lg:mb-8 gradient-text tracking-tight">Admin Dashboard</h1>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl p-4 md:p-6 flex flex-col items-center justify-center transition-all duration-200 border border-gray-100">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <FaBriefcase className="text-2xl md:text-3xl text-blue-600" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-gray-800">{stats.jobs}</div>
          <div className="text-sm md:text-base text-gray-600 mt-1">Total Jobs</div>
        </div>
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl p-4 md:p-6 flex flex-col items-center justify-center transition-all duration-200 border border-gray-100">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-purple-100 rounded-full flex items-center justify-center mb-3">
            <FaUser className="text-2xl md:text-3xl text-purple-600" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-gray-800">{stats.users}</div>
          <div className="text-sm md:text-base text-gray-600 mt-1">Total Users</div>
        </div>
        <div className="bg-white rounded-xl shadow-md hover:shadow-xl p-4 md:p-6 flex flex-col items-center justify-center transition-all duration-200 border border-gray-100 sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <FaClipboardList className="text-2xl md:text-3xl text-green-600" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-gray-800">{stats.applications}</div>
          <div className="text-sm md:text-base text-gray-600 mt-1">Total Applications</div>
        </div>
      </div>

      {/* Recent Jobs & Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">Recent Jobs</h2>
            <Link to="/jobs" className="text-blue-600 hover:text-blue-700 hover:underline text-xs md:text-sm flex items-center gap-1 font-medium">
              View All <FaArrowRight className="text-xs" />
            </Link>
          </div>
          <ul className="space-y-3">
            {recentJobs.length === 0 && <li className="text-gray-400 text-sm py-4 text-center">No jobs found.</li>}
            {recentJobs.map((job, idx) => (
              <li key={job._id || idx} className="p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors">
                <div className="font-semibold text-sm md:text-base text-blue-700 truncate">{job.title || 'Unknown Job'}</div>
                <div className="text-xs md:text-sm text-gray-600 mt-1">{job.company?.name || 'Unknown Company'}</div>
                <div className="text-xs text-gray-400 mt-1">{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ''}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 md:p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800">Recent Applications</h2>
            <Link to="/applications" className="text-blue-600 hover:text-blue-700 hover:underline text-xs md:text-sm flex items-center gap-1 font-medium">
              View All <FaArrowRight className="text-xs" />
            </Link>
          </div>
          <ul className="space-y-3">
            {recentApplications.length === 0 && <li className="text-gray-400 text-sm py-4 text-center">No applications found.</li>}
            {recentApplications.map((app, idx) => (
              <li key={idx} className="p-3 rounded-lg bg-gray-50 hover:bg-purple-50 transition-colors">
                <div className="font-semibold text-sm md:text-base text-purple-700 truncate">{app.user || 'Unknown User'}</div>
                <div className="text-xs md:text-sm text-gray-600 mt-1 truncate">{app.job || 'Unknown Job'}</div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-400">{app.appliedOn ? new Date(app.appliedOn).toLocaleDateString() : ''}</span>
                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">{app.status || 'Applied'}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
