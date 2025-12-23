import React, { useEffect, useState } from 'react';
import API from '../../utils/api';

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await API.get('/admin/applications');
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">All Applications</h1>
      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Job</th>
              <th className="py-2 px-4 text-left">Applied On</th>
              <th className="py-2 px-4 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app, idx) => (
              <tr key={idx} className="border-b">
                <td className="py-2 px-4">{app.user || 'Unknown'}</td>
                <td className="py-2 px-4">{app.job || 'Unknown'}</td>
                <td className="py-2 px-4">{app.appliedOn ? new Date(app.appliedOn).toLocaleDateString() : 'Invalid Date'}</td>
                <td className="py-2 px-4">{app.status || 'Pending'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminApplications;
