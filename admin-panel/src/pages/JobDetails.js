import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBriefcase, FaMapMarkerAlt, FaDollarSign, FaClock, FaUsers, FaStar, FaRegStar, FaBuilding, FaCalendar, FaUserTie, FaCheckCircle, FaListUl, FaGift, FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import API from '../utils/api';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetchJobDetails();
    fetchApplications();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/admin/jobs/${id}`);
      setJob(data.job);
    } catch (error) {
      toast.error('Failed to fetch job details');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    try {
      const { data } = await API.get(`/admin/applications?job=${id}`);
      setApplications(data.applications || []);
    } catch (error) {
      console.error('Failed to fetch applications');
    }
  };

  const toggleFeatured = async () => {
    try {
      await API.put(`/admin/jobs/${id}/feature`);
      toast.success(job.featured ? 'Job unfeatured successfully' : 'Job featured successfully');
      fetchJobDetails();
    } catch (error) {
      toast.error('Failed to update job');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${job.title}"?`)) return;
    try {
      await API.delete(`/admin/jobs/${id}`);
      toast.success('Job deleted successfully');
      navigate('/jobs');
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-12 text-center">
          <p className="text-gray-600">Job not found</p>
        </div>
      </div>
    );
  }

  const locationStr = typeof job.location === 'string' 
    ? job.location 
    : `${job.location?.city || ''}${job.location?.state ? ', ' + job.location.state : ''}${job.location?.country ? ', ' + job.location.country : ''}`;

  const salaryStr = job.salary?.min && job.salary?.max 
    ? `₹${job.salary.min.toLocaleString('en-IN')} - ₹${job.salary.max.toLocaleString('en-IN')} ${job.salary.period || 'Yearly'}`
    : 'Not disclosed';

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/jobs')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <FaArrowLeft /> Back to Jobs
        </button>
      </div>

      {/* Job Header Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {job.featured && (
              <div className="mb-3">
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 w-fit">
                  <FaStar /> FEATURED JOB
                </span>
              </div>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{job.title}</h1>
            <div className="flex items-center gap-4 text-gray-600 mb-2">
              <div className="flex items-center gap-2">
                <FaBuilding />
                <span className="text-lg font-semibold">{job.company?.name || 'Unknown Company'}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <FaMapMarkerAlt />
              <span>{locationStr || 'Location not specified'}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={toggleFeatured}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
                job.featured 
                  ? 'bg-yellow-50 text-yellow-600 border-2 border-yellow-400 hover:bg-yellow-100' 
                  : 'bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200'
              }`}
            >
              {job.featured ? <FaStar /> : <FaRegStar />}
              {job.featured ? 'Featured' : 'Mark Featured'}
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-50 text-red-600 border-2 border-red-300 rounded-lg font-medium hover:bg-red-100 transition flex items-center gap-2"
            >
              <FaTrash /> Delete
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-3 rounded-lg">
              <FaDollarSign className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Salary</p>
              <p className="font-semibold text-gray-900">{salaryStr}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-green-100 p-3 rounded-lg">
              <FaBriefcase className="text-green-600 text-xl" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Type</p>
              <p className="font-semibold text-gray-900">{job.employmentType}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-3 rounded-lg">
              <FaClock className="text-purple-600 text-xl" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Work Mode</p>
              <p className="font-semibold text-gray-900">{job.workMode}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <FaUserTie className="text-orange-600 text-xl" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Experience</p>
              <p className="font-semibold text-gray-900">
                {job.experience?.min || 0}-{job.experience?.max || 0} years
              </p>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-gray-600">
            <FaUsers className="text-blue-600" />
            <span className="text-sm">
              <span className="font-semibold">{job.applicationsCount || 0}</span> Applications
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaCalendar className="text-green-600" />
            <span className="text-sm">
              Posted: <span className="font-semibold">{new Date(job.createdAt).toLocaleDateString()}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FaCheckCircle className={job.status === 'active' ? 'text-green-600' : 'text-gray-400'} />
            <span className="text-sm">
              Status: <span className="font-semibold capitalize">{job.status}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Job Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FaBriefcase className="text-blue-600" />
              Job Description
            </h2>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {job.description}
            </div>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaListUl className="text-purple-600" />
                Key Responsibilities
              </h2>
              <ul className="space-y-3">
                {job.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaCheckCircle className="text-green-600" />
                Requirements
              </h2>
              <ul className="space-y-3">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <FaCheckCircle className="text-blue-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FaGift className="text-pink-600" />
                Benefits & Perks
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {job.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3 bg-pink-50 p-3 rounded-lg">
                    <FaCheckCircle className="text-pink-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Skills Required */}
          {job.skills && job.skills.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Skills Required</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Company Info */}
          {job.company && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Company Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Company Name</p>
                  <p className="font-semibold text-gray-900">{job.company.name}</p>
                </div>
                {job.company.website && (
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {job.company.website}
                    </a>
                  </div>
                )}
                {job.company.description && (
                  <div>
                    <p className="text-sm text-gray-500">About</p>
                    <p className="text-gray-700 text-sm">{job.company.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Job Meta */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Job Details</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Category</p>
                <p className="font-semibold text-gray-900">{job.category}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Openings</p>
                <p className="font-semibold text-gray-900">{job.openings || 1} Position(s)</p>
              </div>
              {job.expiresAt && (
                <div>
                  <p className="text-sm text-gray-500">Expires On</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(job.expiresAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Applications */}
          {applications.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Applications</h2>
              <div className="space-y-3">
                {applications.slice(0, 5).map((app) => (
                  <div key={app._id} className="border-b pb-3 last:border-b-0">
                    <p className="font-semibold text-gray-900">{app.user?.name || 'Unknown'}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      app.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
              {applications.length > 5 && (
                <button
                  onClick={() => navigate('/applications')}
                  className="mt-3 w-full text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View All Applications →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
