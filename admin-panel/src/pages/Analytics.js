import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import {
  FaArrowUp,
  FaUsers,
  FaBriefcase,
  FaFileAlt,
  FaChartLine,
  FaChartBar,
  FaCalendarAlt,
  FaEye
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30days'); // 7days, 30days, 90days, 1year

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/stats/detailed');
      setStats(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtext, color = 'blue' }) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200 text-blue-600',
      green: 'bg-green-50 border-green-200 text-green-600',
      purple: 'bg-purple-50 border-purple-200 text-purple-600',
      red: 'bg-red-50 border-red-200 text-red-600',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    };

    return (
      <div className={`border rounded-lg p-6 ${colors[color]}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
          <Icon className="text-2xl" />
        </div>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600 mt-2">{subtext}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
              <FaChartLine className="text-blue-600" />
              Analytics & Insights
            </h1>
            <p className="text-gray-600">Real-time platform metrics and performance data</p>
          </div>

          <div className="flex gap-2">
            {['7days', '30days', '90days', '1year'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg transition ${
                  dateRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {range === '7days' && 'Last 7 Days'}
                {range === '30days' && 'Last 30 Days'}
                {range === '90days' && 'Last 90 Days'}
                {range === '1year' && '1 Year'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : stats ? (
          <>
            {/* Main Metrics Grid */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={FaBriefcase}
                title="Total Jobs"
                value={stats.stats?.jobs?.total || 0}
                subtext={`${stats.stats?.jobs?.active || 0} active`}
                color="blue"
              />
              <StatCard
                icon={FaUsers}
                title="Total Users"
                value={stats.stats?.users?.total || 0}
                subtext={`${stats.stats?.users?.employers || 0} employers`}
                color="purple"
              />
              <StatCard
                icon={FaFileAlt}
                title="Applications"
                value={stats.stats?.applications?.total || 0}
                subtext={`${stats.stats?.applications?.pending || 0} pending`}
                color="green"
              />
              <StatCard
                icon={FaUsers}
                title="Companies"
                value={stats.stats?.companies || 0}
                subtext="Registered companies"
                color="yellow"
              />
            </div>

            {/* Secondary Metrics */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaArrowUp className="text-green-600" />
                  Job Seeker Metrics
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Job Seekers</span>
                    <span className="font-bold text-gray-900">{stats.stats?.users?.jobSeekers || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Profile Completion Rate</span>
                    <span className="font-bold text-gray-900">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Active in Last 30 Days</span>
                    <span className="font-bold text-gray-900">2,450</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaArrowUp className="text-purple-600" />
                  Employer Engagement
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Total Employers</span>
                    <span className="font-bold text-gray-900">{stats.stats?.users?.employers || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Jobs Posted This Month</span>
                    <span className="font-bold text-gray-900">342</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Avg. Applications Per Job</span>
                    <span className="font-bold text-gray-900">12.5</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaUsers className="text-blue-600" />
                  Recent Users
                </h2>
                <div className="space-y-3">
                  {stats.recentActivities?.users?.map((user, index) => (
                    <div key={index} className="flex items-center justify-between pb-2 border-b">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{user.name}</p>
                        <p className="text-xs text-gray-600">{user.role}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )) || <p className="text-gray-600 text-sm">No recent users</p>}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaBriefcase className="text-green-600" />
                  Recent Jobs
                </h2>
                <div className="space-y-3">
                  {stats.recentActivities?.jobs?.map((job, index) => (
                    <div key={index} className="flex items-start justify-between pb-2 border-b">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{job.title}</p>
                        <p className="text-xs text-gray-600">{job.company?.name}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )) || <p className="text-gray-600 text-sm">No recent jobs</p>}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaFileAlt className="text-orange-600" />
                  Recent Applications
                </h2>
                <div className="space-y-3">
                  {stats.recentActivities?.applications?.map((app, index) => (
                    <div key={index} className="flex items-start justify-between pb-2 border-b">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{app.applicant?.name}</p>
                        <p className="text-xs text-gray-600">{app.job?.title}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )) || <p className="text-gray-600 text-sm">No recent applications</p>}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 text-lg">Failed to load analytics data</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
