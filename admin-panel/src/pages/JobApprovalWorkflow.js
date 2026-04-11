import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { FaBriefcase, FaCheckCircle, FaTimesCircle, FaClock, FaStar, FaEye, FaSearch } from 'react-icons/fa';
import { toast } from 'react-toastify';

const JobApprovalWorkflow = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, approved, rejected
  const [selectedJob, setSelectedJob] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/jobs');
      let filtered = data.jobs || [];

      if (filter === 'pending') {
        filtered = filtered.filter(j => j.status === 'pending' || !j.approved);
      } else if (filter === 'approved') {
        filtered = filtered.filter(j => j.approved === true);
      } else if (filter === 'rejected') {
        filtered = filtered.filter(j => j.approved === false && j.rejectionReason);
      }

      if (searchTerm) {
        filtered = filtered.filter(
          j => j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
               j.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setJobs(filtered);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (jobId) => {
    try {
      await API.put(`/admin/jobs/${jobId}`, {
        approved: true,
        status: 'active',
        approvedAt: new Date(),
        rejectionReason: null
      });
      toast.success('Job approved successfully! Email sent to employer.');
      fetchJobs();
    } catch (error) {
      toast.error('Failed to approve job');
    }
  };

  const handleReject = async (jobId, reason) => {
    if (!reason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }
    try {
      await API.put(`/admin/jobs/${jobId}`, {
        approved: false,
        status: 'rejected',
        rejectionReason: reason,
        rejectedAt: new Date()
      });
      toast.success('Job rejected. Email sent to employer.');
      setSelectedJob(null);
      setRejectionReason('');
      fetchJobs();
    } catch (error) {
      toast.error('Failed to reject job');
    }
  };

  const ChecklistItem = ({ completed, text }) => (
    <div className="flex items-center gap-2 mb-2">
      <input
        type="checkbox"
        checked={completed}
        readOnly
        className="w-4 h-4"
      />
      <span className={completed ? 'text-gray-500 line-through' : 'text-gray-700'}>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
            <FaBriefcase className="text-blue-600" />
            Job Approval Workflow
          </h1>
          <p className="text-gray-600">Review and approve job postings before they go live</p>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="flex gap-2 bg-white rounded-lg shadow p-1">
            {['pending', 'approved', 'rejected'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex-1 py-2 px-4 rounded font-semibold transition ${
                  filter === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab === 'pending' && <FaClock className="mr-2 inline" />}
                {tab === 'approved' && <FaCheckCircle className="mr-2 inline" />}
                {tab === 'rejected' && <FaTimesCircle className="mr-2 inline" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by job title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onBlur={fetchJobs}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaBriefcase className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">No jobs in this category</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job._id}
                className={`bg-white rounded-lg shadow p-6 border-l-4 ${
                  filter === 'pending'
                    ? 'border-yellow-500'
                    : filter === 'approved'
                    ? 'border-green-500'
                    : 'border-red-500'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                      {filter === 'approved' && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                          Approved
                        </span>
                      )}
                      {filter === 'rejected' && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                          Rejected
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mb-2">{job.company?.name}</p>
                    <p className="text-gray-700 mb-3">{job.description.substring(0, 200)}...</p>

                    <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                      <div>📍 {job.location?.city || 'N/A'}</div>
                      <div>💼 {job.employmentType}</div>
                      <div>💰 ₹{(job.salary?.min / 100000).toFixed(1)}L - ₹{(job.salary?.max / 100000).toFixed(1)}L</div>
                      <div>⏱️ {new Date(job.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>

                  {filter === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedJob(job)}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm flex items-center gap-1"
                      >
                        <FaEye /> Review
                      </button>
                    </div>
                  )}
                </div>

                {filter === 'rejected' && job.rejectionReason && (
                  <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-800 mb-3">
                    <strong>Rejection Reason:</strong> {job.rejectionReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Job Review Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                <p className="text-gray-600">{selectedJob.company?.name}</p>
              </div>

              <div className="p-6 space-y-4">
                {/* Verification Checklist */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="font-bold text-gray-900 mb-3">Approval Checklist</h3>
                  <ChecklistItem completed={!!selectedJob.title} text="Job title is clear and professional" />
                  <ChecklistItem completed={!!selectedJob.description} text="Job description is detailed" />
                  <ChecklistItem completed={!!selectedJob.salary} text="Salary range is specified" />
                  <ChecklistItem completed={selectedJob.skills?.length > 0} text="Required skills listed" />
                  <ChecklistItem completed={selectedJob.company?.verified} text="Company is verified" />
                  <ChecklistItem completed={!selectedJob.description.toLowerCase().includes('spam')} text="No spam or suspicious content" />
                </div>

                {/* Job Details */}
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 font-semibold">Employment Type</p>
                    <p className="text-gray-900">{selectedJob.employmentType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Work Mode</p>
                    <p className="text-gray-900">{selectedJob.workMode}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Experience Required</p>
                    <p className="text-gray-900">{selectedJob.experience?.min} - {selectedJob.experience?.max} years</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Openings</p>
                    <p className="text-gray-900">{selectedJob.openings || 1}</p>
                  </div>
                </div>

                {/* Rejection Reason */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Rejection Reason (if rejecting)
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explain why this job is being rejected (e.g., misleading salary, spam content, etc.)"
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500"
                    rows="3"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2 justify-end pt-4 border-t">
                  <button
                    onClick={() => setSelectedJob(null)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleReject(selectedJob._id, rejectionReason)}
                    className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
                  >
                    <FaTimesCircle /> Reject Job
                  </button>
                  <button
                    onClick={() => handleApprove(selectedJob._id)}
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
                  >
                    <FaCheckCircle /> Approve Job
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

export default JobApprovalWorkflow;
