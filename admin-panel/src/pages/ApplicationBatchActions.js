import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { FaCheckDouble, FaTrash, FaFilter, FaSearch, FaEnvelope } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ApplicationBatchActions = () => {
  const [applications, setApplications] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: 'all', dateFrom: '', dateTo: '' });

  useEffect(() => {
    fetchApplications();
  }, [filters]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/applications');
      let filtered = data.applications || [];
      if (filters.status !== 'all') filtered = filtered.filter(a => a.status === filters.status);
      setApplications(filtered);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAll = () => {
    if (selected.size === applications.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(applications.map(a => a._id)));
    }
  };

  const handleSelectOne = (id) => {
    const newSelected = new Set(selected);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelected(newSelected);
  };

  const handleBulkStatusUpdate = async (newStatus) => {
    if (selected.size === 0) {
      toast.warning('Please select applications first');
      return;
    }
    try {
      for (const id of selected) {
        await API.put(`/admin/applications/${id}/status`, { status: newStatus });
      }
      toast.success(`Updated ${selected.size} applications to ${newStatus}`);
      setSelected(new Set());
      fetchApplications();
    } catch (error) {
      toast.error('Failed to update applications');
    }
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0 || !window.confirm(`Delete ${selected.size} applications?`)) return;
    try {
      for (const id of selected) {
        await API.delete(`/admin/applications/${id}`);
      }
      toast.success(`Deleted ${selected.size} applications`);
      setSelected(new Set());
      fetchApplications();
    } catch (error) {
      toast.error('Failed to delete applications');
    }
  };

  const handleSendBulkEmail = async () => {
    if (selected.size === 0) {
      toast.warning('Please select applications first');
      return;
    }
    toast.info(`Email to be sent to ${selected.size} applicants`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <FaCheckDouble className="text-blue-600" />
          Batch Application Management
        </h1>

        {/* Filters & Bulk Actions */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="border border-gray-300 rounded-lg p-2 text-sm"
            >
              <option value="all">All Status</option>
              <option value="Applied">Applied</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {selected.size > 0 && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleBulkStatusUpdate('Accepted')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
              >
                ✓ Accept Selected ({selected.size})
              </button>
              <button
                onClick={() => handleBulkStatusUpdate('Rejected')}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
              >
                ✗ Reject Selected ({selected.size})
              </button>
              <button
                onClick={handleSendBulkEmail}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm flex items-center gap-2"
              >
                <FaEnvelope /> Send Email ({selected.size})
              </button>
              <button
                onClick={handleBulkDelete}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm flex items-center gap-2"
              >
                <FaTrash /> Delete ({selected.size})
              </button>
            </div>
          )}
        </div>

        {/* Applications Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selected.size === applications.length && applications.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Applicant</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Job</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {applications.map((app) => (
                  <tr key={app._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(app._id)}
                        onChange={() => handleSelectOne(app._id)}
                        className="w-4 h-4"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <p className="font-semibold text-gray-900">{app.user}</p>
                      <p className="text-gray-600">{app.userEmail}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{app.job}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        app.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                        app.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(app.appliedOn).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationBatchActions;
