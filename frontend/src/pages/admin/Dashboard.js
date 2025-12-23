
import React, { useEffect, useState } from 'react';
import API from '../../utils/api';
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 fade-in">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-8 gradient-text tracking-tight">Admin Dashboard</h1>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="card flex flex-col items-center justify-center hover-lift shadow-primary transition-all duration-200">
          <FaBriefcase className="text-3xl text-blue-600 mb-2" />
          <div className="text-3xl font-bold">{stats.jobs}</div>
          <div className="text-gray-600">Total Jobs</div>
        </div>
        <div className="card flex flex-col items-center justify-center hover-lift shadow-primary transition-all duration-200">
          <FaUser className="text-3xl text-purple-600 mb-2" />
          <div className="text-3xl font-bold">{stats.users}</div>
          <div className="text-gray-600">Total Users</div>
        </div>
        <div className="card flex flex-col items-center justify-center hover-lift shadow-primary transition-all duration-200">
          <FaClipboardList className="text-3xl text-green-600 mb-2" />
          <div className="text-3xl font-bold">{stats.applications}</div>
          <div className="text-gray-600">Total Applications</div>
        </div>
      </div>

      {/* Recent Jobs & Applications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="card shadow-primary hover-lift transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Jobs</h2>
            <Link to="/admin/jobs" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
              View All <FaArrowRight />
            </Link>
          </div>
          <ul>
            {recentJobs.length === 0 && <li className="text-gray-400 text-sm">No jobs found.</li>}
            {recentJobs.map((job, idx) => (
              <li key={job._id || idx} className="mb-3 pb-3 border-b last:border-b-0 last:mb-0 last:pb-0 flex flex-col gap-1">
                <span className="font-bold text-blue-700">{job.title || 'Unknown Job'}</span>
                <span className="text-sm text-gray-500">{job.company?.name || 'Unknown Company'}</span>
                <span className="text-xs text-gray-400">{job.createdAt ? new Date(job.createdAt).toLocaleString() : ''}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card shadow-primary hover-lift transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Applications</h2>
            <Link to="/admin/applications" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
              View All <FaArrowRight />
            </Link>
          </div>
          <ul>
            {recentApplications.length === 0 && <li className="text-gray-400 text-sm">No applications found.</li>}
            {recentApplications.map((app, idx) => (
              <li key={idx} className="mb-3 pb-3 border-b last:border-b-0 last:mb-0 last:pb-0 flex flex-col gap-1">
                <span className="font-bold text-purple-700">{app.user || 'Unknown User'}</span>
                <span className="text-sm text-gray-500">{app.job || 'Unknown Job'}</span>
                <span className="text-xs text-gray-400">{app.appliedOn ? new Date(app.appliedOn).toLocaleString() : ''}</span>
                <span className="text-xs text-gray-400">Status: {app.status || 'Applied'}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
