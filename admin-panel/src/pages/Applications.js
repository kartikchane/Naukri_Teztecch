import React, { useState, useEffect } from 'react';
import { FaFileAlt, FaTrash, FaSearch, FaDownload, FaEye, FaBuilding, FaMapMarkerAlt, FaGlobe } from 'react-icons/fa';
import { toast } from 'react-toastify';
import API from '../utils/api';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewingApp, setViewingApp] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/applications');
      console.log('📊 Admin: Total Applications:', data.applications.length);
      console.log('📊 Admin: Applications with resumes:', data.applications.filter(a => a.resume).length);
      console.log('📊 Admin: Sample data:', data.applications.slice(0, 2).map(a => ({ 
        id: a._id, 
        resume: a.resume,
        hasResume: !!a.resume 
      })));
      setApplications(data.applications || []);
    } catch (error) {
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (appId) => {
    if (!window.confirm('Delete this application?')) return;
    try {
      await API.delete(`/admin/applications/${appId}`);
      toast.success('Application deleted');
      fetchApplications();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleViewDetails = (app) => {
    setViewingApp(app);
    setShowDetailsModal(true);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.user?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.job?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Applied': return 'bg-blue-100 text-blue-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Shortlisted': return 'bg-purple-100 text-purple-800';
      case 'Accepted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Applications Management</h1>
        <p className="text-gray-600">Manage all job applications</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600">Showing {filteredApplications.length} of {applications.length} applications</p>
        </div>
      </div>

      {/* Applications Table */}
      {loading ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <FaFileAlt className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied On</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApplications.map((app, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{app.user || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{app.userEmail || ''}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{app.job || 'Unknown Job'}</div>
                      <div className="text-xs text-gray-500">{app.jobLocation || ''}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaBuilding className="text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">{app.company || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{app.companyIndustry || ''}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {app.appliedOn ? new Date(app.appliedOn).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleViewDetails(app)}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <FaEye className="inline text-lg" />
                        </button>
                        {app.resume && (
                          <a
                            href={app.resume.startsWith('http') ? app.resume : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${app.resume}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-900"
                            title="View Resume"
                          >
                            <FaDownload className="inline text-lg" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(app._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FaTrash className="inline text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && viewingApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Application Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Applicant Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Applicant Information</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Name:</span>
                      <p className="font-medium">{viewingApp.user || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Email:</span>
                      <p className="font-medium">{viewingApp.userEmail || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Phone:</span>
                      <p className="font-medium">{viewingApp.userPhone || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Applied On:</span>
                      <p className="font-medium">
                        {viewingApp.appliedOn ? new Date(viewingApp.appliedOn).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-sm text-gray-500">Status:</span>
                      <p>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(viewingApp.status)}`}>
                          {viewingApp.status}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Job Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Information</h3>
                <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Job Title:</span>
                    <p className="font-medium text-lg">{viewingApp.job || 'N/A'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Location:</span>
                      <p className="font-medium">{viewingApp.jobLocation || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Employment Type:</span>
                      <p className="font-medium">{viewingApp.jobType || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Salary:</span>
                      <p className="font-medium">{viewingApp.jobSalary || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Experience:</span>
                      <p className="font-medium">{viewingApp.jobExperience || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <FaBuilding className="text-blue-600" />
                  Company Information
                </h3>
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    {viewingApp.companyLogo ? (
                      <img 
                        src={viewingApp.companyLogo} 
                        alt={viewingApp.company} 
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FaBuilding className="text-blue-600 text-2xl" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900">{viewingApp.company || 'N/A'}</h4>
                      <p className="text-sm text-gray-600">{viewingApp.companyIndustry || 'Industry not specified'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <FaMapMarkerAlt /> Location:
                      </span>
                      <p className="font-medium">{viewingApp.companyLocation || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <FaGlobe /> Website:
                      </span>
                      {viewingApp.companyWebsite ? (
                        <a 
                          href={viewingApp.companyWebsite} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:underline truncate block"
                        >
                          {viewingApp.companyWebsite}
                        </a>
                      ) : (
                        <p className="font-medium">N/A</p>
                      )}
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Company Size:</span>
                      <p className="font-medium">{viewingApp.companySize || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Founded:</span>
                      <p className="font-medium">{viewingApp.companyFounded || 'N/A'}</p>
                    </div>
                  </div>

                  {viewingApp.companyDescription && (
                    <div className="mt-4">
                      <span className="text-sm text-gray-500">About Company:</span>
                      <p className="text-sm text-gray-700 mt-1">{viewingApp.companyDescription}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Resume */}
              {viewingApp.resume && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Resume</h3>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FaFileAlt className="text-green-600 text-2xl" />
                        <div>
                          <p className="font-medium text-gray-900">Resume Available</p>
                          <p className="text-sm text-gray-600">Click to view or download</p>
                        </div>
                      </div>
                      <a
                        href={viewingApp.resume.startsWith('http') ? viewingApp.resume : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${viewingApp.resume}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <FaDownload />
                        View Resume
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* Cover Letter */}
              {viewingApp.coverLetter && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Cover Letter</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{viewingApp.coverLetter}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
