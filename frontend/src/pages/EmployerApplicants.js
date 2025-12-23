
import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import { toast } from 'react-toastify';

const EmployerApplicants = ({ jobId, onClose }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchApplicants();
    // eslint-disable-next-line
  }, [jobId]);

  const fetchApplicants = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get(`/applications/job/${jobId}`);
      setApplicants(data);
    } catch (err) {
      setError('Failed to fetch applicants');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        <button className="absolute top-2 right-2 text-xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4">Applicants</h2>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : applicants.length === 0 ? (
          <div>No applicants yet.</div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {applicants.map(app => (
              <div key={app._id} className="border rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <div className="font-semibold text-lg">{app.applicant?.name}</div>
                  <div className="text-gray-600 text-sm">{app.applicant?.email}</div>
                  <div className="text-gray-500 text-xs">Applied: {new Date(app.appliedAt).toLocaleDateString()}</div>
                  <div className="mt-2 text-sm">Status: <span className="font-bold">{app.status}</span></div>
                  {app.coverLetter && <div className="mt-1 text-xs text-gray-700">Cover: {app.coverLetter}</div>}
                  {app.resume && <a href={app.resume.startsWith('http') ? app.resume : `http://localhost:5000/${app.resume}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">View Resume</a>}
                </div>
                {/* Status update UI */}
                <div className="flex flex-col gap-2 min-w-[180px]">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setUpdatingId(app._id);
                      const form = e.target;
                      const status = form.status.value;
                      const notes = form.notes.value;
                      try {
                        await API.put(`/applications/${app._id}/status`, { status, notes });
                        toast.success('Status updated successfully!');
                        fetchApplicants();
                      } catch (err) {
                        toast.error('Failed to update status');
                      } finally {
                        setUpdatingId(null);
                      }
                    }}
                  >
                    <select name="status" defaultValue={app.status} className="input-field mb-1">
                      <option value="Applied">Applied</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Accepted">Accepted</option>
                    </select>
                    <input
                      name="notes"
                      className="input-field mb-1"
                      placeholder="Notes/Reply (optional)"
                      defaultValue={app.notes || ''}
                    />
                    <button className="btn-primary w-full" type="submit" disabled={updatingId === app._id}>
                      {updatingId === app._id ? 'Updating...' : 'Update'}
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerApplicants;
