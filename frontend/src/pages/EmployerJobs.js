import React, { useEffect, useState } from 'react';
import API from '../utils/api';
import EmployerApplicants from './EmployerApplicants';
import { useAuth } from '../context/AuthContext';

const EmployerJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
    // eslint-disable-next-line
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/jobs', { params: { postedBy: user?._id } });
      setJobs(data.jobs || []);
    } catch (err) {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">My Posted Jobs</h1>
      {loading ? (
        <div>Loading...</div>
      ) : jobs.length === 0 ? (
        <div>No jobs posted yet.</div>
      ) : (
        <div className="bg-white rounded shadow p-4 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 text-left">Title</th>
                <th className="py-2 px-4 text-left">Company</th>
                <th className="py-2 px-4 text-left">Posted</th>
                <th className="py-2 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job._id} className="border-b">
                  <td className="py-2 px-4 font-semibold">{job.title}</td>
                  <td className="py-2 px-4">{job.company?.name || 'Unknown'}</td>
                  <td className="py-2 px-4">{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : ''}</td>
                  <td className="py-2 px-4">
                    <button className="btn-primary" onClick={() => setSelectedJob(job._id)}>
                      View Applicants
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selectedJob && (
        <EmployerApplicants jobId={selectedJob} onClose={() => setSelectedJob(null)} />
      )}
    </div>
  );
};

export default EmployerJobs;
