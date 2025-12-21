import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import { FaBriefcase, FaMapMarkerAlt, FaClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf } from 'react-icons/fa';
import { toast } from 'react-toastify';

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await API.get('/applications/my');
      setApplications(data.applications);
    } catch (error) {
      toast.error('Failed to fetch applications');
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Applied':
        return <FaHourglassHalf className="text-blue-500" />;
      case 'Under Review':
        return <FaClock className="text-yellow-500" />;
      case 'Shortlisted':
        return <FaCheckCircle className="text-green-500" />;
      case 'Rejected':
        return <FaTimesCircle className="text-red-500" />;
      case 'Accepted':
        return <FaCheckCircle className="text-green-600" />;
      default:
        return <FaHourglassHalf className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'bg-blue-100 text-blue-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Shortlisted':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Accepted':
        return 'bg-green-200 text-green-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status === filter);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track all your job applications in one place</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-primary">{applications.length}</div>
            <div className="text-sm text-gray-600">Total Applied</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-blue-600">
              {applications.filter(a => a.status === 'Applied').length}
            </div>
            <div className="text-sm text-gray-600">Applied</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {applications.filter(a => a.status === 'Under Review').length}
            </div>
            <div className="text-sm text-gray-600">Under Review</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-green-600">
              {applications.filter(a => a.status === 'Shortlisted').length}
            </div>
            <div className="text-sm text-gray-600">Shortlisted</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <div className="text-2xl font-bold text-red-600">
              {applications.filter(a => a.status === 'Rejected').length}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex flex-wrap gap-2 p-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({applications.length})
            </button>
            <button
              onClick={() => setFilter('Applied')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'Applied' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Applied ({applications.filter(a => a.status === 'Applied').length})
            </button>
            <button
              onClick={() => setFilter('Under Review')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'Under Review' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Under Review ({applications.filter(a => a.status === 'Under Review').length})
            </button>
            <button
              onClick={() => setFilter('Shortlisted')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'Shortlisted' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Shortlisted ({applications.filter(a => a.status === 'Shortlisted').length})
            </button>
            <button
              onClick={() => setFilter('Rejected')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'Rejected' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected ({applications.filter(a => a.status === 'Rejected').length})
            </button>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((application) => {
              const resumeUrl = application.resume || application.applicant?.resume;
              return (
              <div key={application._id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Job Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Company Logo */}
                        <div className="flex-shrink-0">
                          {application.job?.company?.logo ? (
                            <>
                              <img
                                src={application.job.company.logo}
                                alt={application.job?.company?.name}
                                className="w-16 h-16 rounded-lg object-contain bg-gradient-to-br from-blue-100 to-purple-100 p-2"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="hidden w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg items-center justify-center text-white text-2xl font-bold">
                                {application.job?.company?.name?.charAt(0)}
                              </div>
                            </>
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                              {application.job?.company?.name?.charAt(0)}
                            </div>
                          )}
                        </div>

                        {/* Job Details */}
                        <div className="flex-1">
                          <Link
                            to={`/jobs/${application.job?._id}`}
                            className="text-xl font-semibold text-gray-900 hover:text-primary transition-colors"
                          >
                            {application.job?.title}
                          </Link>
                          <p className="text-gray-600 mb-2">{application.job?.company?.name}</p>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <FaMapMarkerAlt className="text-gray-400" />
                              {application.job?.location?.city && application.job?.location?.state
                                ? `${application.job.location.city}, ${application.job.location.state}`
                                : 'Location not specified'}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaBriefcase className="text-gray-400" />
                              {application.job?.employmentType}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaClock className="text-gray-400" />
                              Applied {formatDate(application.appliedAt)}
                            </span>
                          </div>

                          {/* Status Badge */}
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                              {getStatusIcon(application.status)}
                              {application.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Link
                        to={`/jobs/${application.job?._id}`}
                        className="btn-outline text-center"
                      >
                        View Job
                      </Link>
                      {resumeUrl ? (
                        <a
                          href={
                            resumeUrl.startsWith('http') 
                              ? resumeUrl 
                              : `http://localhost:5000/${resumeUrl}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-outline text-center bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-600"
                        >
                          View Resume
                        </a>
                      ) : (
                        <button
                          disabled
                          className="btn-outline text-center opacity-50 cursor-not-allowed"
                          title="No resume uploaded"
                        >
                          No Resume
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Cover Letter Preview */}
                  {application.coverLetter && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-1">Cover Letter:</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{application.coverLetter}</p>
                    </div>
                  )}
                </div>
              </div>
            );
            })
          ) : (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <div className="text-gray-400 mb-4">
                <FaBriefcase className="text-6xl mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {filter === 'all' ? 'No Applications Yet' : `No ${filter} Applications`}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? "Start applying to jobs to see them here" 
                  : `You don't have any applications with ${filter} status`}
              </p>
              {filter === 'all' && (
                <Link to="/jobs" className="btn-primary inline-block">
                  Browse Jobs
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
