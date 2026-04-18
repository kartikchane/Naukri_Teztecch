import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { FaUser, FaLock, FaUnlock, FaTrash, FaSearch, FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';

const UserControl = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active'); // active, suspended, all
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/users');
      let filtered = data.users || [];

      if (filter === 'active') {
        filtered = filtered.filter(u => !u.suspended);
      } else if (filter === 'suspended') {
        filtered = filtered.filter(u => u.suspended);
      }

      if (searchTerm) {
        filtered = filtered.filter(
          u =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setUsers(filtered);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (userId, reason) => {
    try {
      await API.put(`/admin/users/${userId}`, {
        suspended: true,
        suspensionReason: reason
      });
      toast.success('User suspended successfully');
      setSelectedUser(null);
      setSuspensionReason('');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to suspend user');
    }
  };

  const handleUnsuspend = async (userId) => {
    try {
      await API.put(`/admin/users/${userId}`, {
        suspended: false,
        suspensionReason: null
      });
      toast.success('User unsuspended');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to unsuspend user');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to permanently delete this user?')) {
      try {
        await API.delete(`/admin/users/${userId}`);
        toast.success('User deleted permanently');
        fetchUsers();
      } catch (error) {
        toast.error('Failed to delete user');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
            <FaShieldAlt className="text-blue-600" />
            User Control & Management
          </h1>
          <p className="text-gray-600">Manage user accounts, suspension, and security</p>
        </div>

        {/* Filter & Search */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="flex gap-2 bg-white rounded-lg shadow p-1">
            {['active', 'suspended', 'all'].map((tab) => (
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

          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={fetchUsers}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaUser className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">No users found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Joined</th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.suspended ? (
                        <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <FaLock /> Suspended
                        </span>
                      ) : (
                        <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {!user.suspended ? (
                          <button
                            onClick={() => setSelectedUser(user)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center gap-1"
                          >
                            <FaLock /> Suspend
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUnsuspend(user._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 flex items-center gap-1"
                          >
                            <FaUnlock /> Unsuspend
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 flex items-center gap-1"
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Suspension Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FaExclamationTriangle className="text-red-600" />
                  Suspend User
                </h2>
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to suspend <span className="font-bold">{selectedUser.name}</span>?
                </p>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Suspension Reason
                  </label>
                  <textarea
                    value={suspensionReason}
                    onChange={(e) => setSuspensionReason(e.target.value)}
                    placeholder="Enter reason for suspension (e.g., Spam, Inappropriate content, etc.)"
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSuspend(selectedUser._id, suspensionReason)}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                  >
                    Suspend User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserControl;
