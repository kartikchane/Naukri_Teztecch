import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { FaFlag, FaToggleOn, FaToggleOff, FaHistory, FaSearch, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';

const FeatureFlagsManagement = () => {
  const [flags, setFlags] = useState([
    { _id: 1, name: 'jobApprovalWorkflow', description: 'Enable/disable job approval workflow', enabled: true, category: 'job_posting', rolloutPercentage: 100, lastModified: new Date(Date.now() - 86400000), modifiedBy: 'admin1' },
    { _id: 2, name: 'emailNotifications', description: 'Enable email notifications for users', enabled: true, category: 'notifications', rolloutPercentage: 100, lastModified: new Date(Date.now() - 172800000), modifiedBy: 'admin2' },
    { _id: 3, name: 'smsNotifications', description: 'Enable SMS notifications', enabled: false, category: 'notifications', rolloutPercentage: 25, lastModified: new Date(Date.now() - 259200000), modifiedBy: 'admin1' },
    { _id: 4, name: 'videoInterviews', description: 'Enable video interview feature', enabled: false, category: 'features', rolloutPercentage: 10, lastModified: new Date(Date.now() - 345600000), modifiedBy: 'admin3' },
    { _id: 5, name: 'companyVerification', description: 'Require company verification', enabled: true, category: 'company', rolloutPercentage: 100, lastModified: new Date(), modifiedBy: 'admin1' },
    { _id: 6, name: 'userReviews', description: 'Allow user reviews on jobs and companies', enabled: true, category: 'features', rolloutPercentage: 100, lastModified: new Date(Date.now() - 604800000), modifiedBy: 'admin2' },
    { _id: 7, name: 'twoFactorAuth', description: 'Enable two-factor authentication', enabled: false, category: 'security', rolloutPercentage: 30, lastModified: new Date(Date.now() - 1209600000), modifiedBy: 'admin1' },
    { _id: 8, name: 'advancedSearch', description: 'Advanced job search filters', enabled: false, category: 'search', rolloutPercentage: 50, lastModified: new Date(Date.now() - 432000000), modifiedBy: 'admin3' }
  ]);

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editingFlag, setEditingFlag] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [rolloutPercentage, setRolloutPercentage] = useState(100);
  const [loading, setLoading] = useState(false);

  const categories = ['all', 'job_posting', 'notifications', 'features', 'company', 'security', 'search'];

  const filteredFlags = flags.filter(flag => {
    const matchesSearch = flag.name.toLowerCase().includes(search.toLowerCase()) ||
                         flag.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || flag.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFlag = async (flag) => {
    try {
      const updatedFlag = { ...flag, enabled: !flag.enabled, lastModified: new Date(), modifiedBy: 'admin1' };
      setFlags(flags.map(f => f._id === flag._id ? updatedFlag : f));
      toast.success(`${flag.name} ${!flag.enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to toggle feature flag');
    }
  };

  const startEditFlag = (flag) => {
    setEditingFlag(flag);
    setRolloutPercentage(flag.rolloutPercentage);
    setShowEditModal(true);
  };

  const saveRollout = async () => {
    if (!editingFlag) return;
    setLoading(true);
    try {
      const updatedFlag = {
        ...editingFlag,
        rolloutPercentage,
        lastModified: new Date(),
        modifiedBy: 'admin1'
      };
      setFlags(flags.map(f => f._id === editingFlag._id ? updatedFlag : f));
      setShowEditModal(false);
      setEditingFlag(null);
      toast.success(`${editingFlag.name} rollout updated to ${rolloutPercentage}%`);
    } catch (error) {
      toast.error('Failed to update rollout percentage');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
            <FaFlag className="text-blue-600" />
            Feature Flags Management
          </h1>
          <p className="text-gray-600">Control feature rollout and enable/disable functionality</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search flags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 pl-10 text-sm"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 text-sm"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>

            {/* Stats */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-600">Active Flags</p>
                <p className="text-2xl font-bold text-blue-600">{flags.filter(f => f.enabled).length}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-600">Total</p>
                <p className="text-2xl font-bold text-blue-600">{flags.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Flags Grid */}
        <div className="grid gap-4">
          {filteredFlags.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center text-gray-600">
              No feature flags found
            </div>
          ) : (
            filteredFlags.map(flag => (
              <div key={flag._id} className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{flag.name}</h3>
                    <p className="text-sm text-gray-600">{flag.description}</p>
                    <div className="flex gap-3 mt-2 text-xs">
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {flag.category.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded ${flag.enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        Rollout: {flag.rolloutPercentage}%
                      </span>
                    </div>
                  </div>

                  {/* Toggle & Edit */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEditFlag(flag)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-blue-600"
                      title="Edit rollout percentage"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => toggleFlag(flag)}
                      className={`text-3xl transition ${flag.enabled ? 'text-green-600' : 'text-gray-400'}`}
                    >
                      {flag.enabled ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  </div>
                </div>

                {/* Metadata */}
                <div className="pt-3 border-t text-xs text-gray-500 flex justify-between">
                  <span>Modified by {flag.modifiedBy}</span>
                  <span>{flag.lastModified.toLocaleDateString()} {flag.lastModified.toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Edit Rollout Modal */}
        {showEditModal && editingFlag && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Edit Rollout: {editingFlag.name}
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Rollout Percentage
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={rolloutPercentage}
                  onChange={(e) => setRolloutPercentage(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-2xl font-bold text-blue-600 mt-2 text-center">{rolloutPercentage}%</p>
                <p className="text-xs text-gray-600 mt-2">
                  This percentage applies to random user sampling for gradual rollout
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={saveRollout}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeatureFlagsManagement;
