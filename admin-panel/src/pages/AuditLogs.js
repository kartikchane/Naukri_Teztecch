import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { FaHistory, FaUser, FaCheck, FaTimes, FaSearch, FaFilter, FaDownload } from 'react-icons/fa';
import { toast } from 'react-toastify';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    action: 'all', // all, create, update, delete, approve, suspend
    admin: 'all',
    dateFrom: '',
    dateTo: '',
    searchTerm: ''
  });

  useEffect(() => {
    fetchAuditLogs();
  }, [filters]);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      // Mock data
      const mockLogs = [
        {
          _id: '1',
          timestamp: new Date(Date.now() - 3600000),
          admin: { name: 'Admin User', email: 'admin@naukri.com' },
          action: 'Job Approved',
          resource: { type: 'job', id: 'job123', name: 'Software Developer' },
          changes: { approved: false → true, status: "pending" → "active" },
          ipAddress: '192.168.1.1',
          status: 'success'
        },
        {
          _id: '2',
          timestamp: new Date(Date.now() - 7200000),
          admin: { name: 'Admin User', email: 'admin@naukri.com' },
          action: 'Company Verified',
          resource: { type: 'company', id: 'comp456', name: 'TechCorp' },
          changes: { verified: false → true },
          ipAddress: '192.168.1.1',
          status: 'success'
        },
        {
          _id: '3',
          timestamp: new Date(Date.now() - 10800000),
          admin: { name: 'Admin User', email: 'admin@naukri.com' },
          action: 'User Suspended',
          resource: { type: 'user', id: 'user789', name: 'John Doe' },
          changes: { suspended: false → true, reason: 'Spam content' },
          ipAddress: '192.168.1.2',
          status: 'success'
        },
        {
          _id: '4',
          timestamp: new Date(Date.now() - 14400000),
          admin: { name: 'Admin User', email: 'admin@naukri.com' },
          action: 'Job Rejected',
          resource: { type: 'job', id: 'job999', name: 'Invalid Posting' },
          changes: { approved: false, reason: 'Suspicious content' },
          ipAddress: '192.168.1.1',
          status: 'success'
        },
        {
          _id: '5',
          timestamp: new Date(Date.now() - 18000000),
          admin: { name: 'Admin User', email: 'admin@naukri.com' },
          action: 'User Deleted',
          resource: { type: 'user', id: 'user555', name: 'Spam Account' },
          changes: { deleted: true },
          ipAddress: '192.168.1.1',
          status: 'success'
        }
      ];

      let filtered = mockLogs;

      if (filters.action !== 'all') {
        filtered = filtered.filter(log =>
          log.action.toLowerCase().includes(filters.action.toLowerCase())
        );
      }

      if (filters.admin !== 'all') {
        filtered = filtered.filter(log =>
          log.admin.name.toLowerCase().includes(filters.admin.toLowerCase())
        );
      }

      if (filters.searchTerm) {
        filtered = filtered.filter(log =>
          log.resource.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          log.action.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );
      }

      setLogs(filtered);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      toast.error('Failed to load audit logs');
    } finally {
      setLoading(false);
    }
  };

  const downloadLogs = () => {
    const csv = [
      ['Timestamp', 'Admin', 'Action', 'Resource', 'Status', 'IP Address'].join(','),
      ...logs.map(log =>
        [
          log.timestamp.toISOString(),
          log.admin.name,
          log.action,
          `${log.resource.type}: ${log.resource.name}`,
          log.status,
          log.ipAddress
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getActionColor = (action) => {
    if (action.includes('Approved') || action.includes('Verified')) return 'green';
    if (action.includes('Rejected') || action.includes('Suspended') || action.includes('Deleted')) return 'red';
    return 'blue';
  };

  const getActionIcon = (action) => {
    if (action.includes('Approved') || action.includes('Verified')) return <FaCheck className="text-green-600" />;
    if (action.includes('Rejected') || action.includes('Suspended') || action.includes('Deleted')) return <FaTimes className="text-red-600" />;
    return <FaUser className="text-blue-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
              <FaHistory className="text-blue-600" />
              Audit Logs
            </h1>
            <p className="text-gray-600">Track all administrative actions and system changes</p>
          </div>
          <button
            onClick={downloadLogs}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <FaDownload /> Export Logs
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Action</label>
              <select
                value={filters.action}
                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="approve">Approve</option>
                <option value="suspend">Suspend</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Admin</label>
              <select
                value={filters.admin}
                onChange={(e) => setFilters({ ...filters, admin: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Admins</option>
                <option value="Admin User">Admin User</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">From Date</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">To Date</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Search</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={filters.searchTerm}
                  onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Logs Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaHistory className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">No audit logs found</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Timestamp</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Admin</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Resource</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {log.timestamp.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="font-semibold text-gray-900">{log.admin.name}</p>
                          <p className="text-gray-600 text-xs">{log.admin.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          <span className="font-semibold text-gray-900 text-sm">{log.action}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {log.resource.type}: {log.resource.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          log.status === 'success'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{log.ipAddress}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogs;
