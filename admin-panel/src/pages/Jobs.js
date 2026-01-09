import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBriefcase, FaEdit, FaTrash, FaSearch, FaStar, FaRegStar, FaEye, FaPlus, FaDollarSign, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import API from '../utils/api';

const Jobs = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    description: '',
    category: '',
    employmentType: 'Full-time',
    workMode: 'On-site',
    location: {
      city: '',
      state: '',
      country: 'India'
    },
    salary: {
      min: '',
      max: '',
      currency: 'INR',
      period: 'Yearly'
    },
    experience: {
      min: '',
      max: ''
    },
    skills: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    openings: 1
  });

  useEffect(() => {
    fetchJobs();
    fetchCompanies();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/jobs');
      setJobs(data.jobs || []);
    } catch (error) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const { data } = await API.get('/admin/companies');
      setCompanies(data.companies || []);
    } catch (error) {
      console.error('Failed to fetch companies');
    }
  };

  const handleDelete = async (jobId, jobTitle) => {
    if (!window.confirm(`Delete job "${jobTitle}"?`)) return;
    try {
      await API.delete(`/admin/jobs/${jobId}`);
      toast.success('Job deleted');
      fetchJobs();
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const toggleFeatured = async (jobId, currentStatus) => {
    try {
      console.log('Toggling featured status for job:', jobId, 'Current status:', currentStatus);
      const response = await API.put(`/admin/jobs/${jobId}/feature`);
      console.log('Toggle response:', response.data);
      toast.success(currentStatus ? 'Job unfeatured successfully' : 'Job featured successfully');
      fetchJobs();
    } catch (error) {
      console.error('Toggle featured error:', error);
      toast.error('Failed to update job: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAddJob = async () => {
    try {
      if (!newJob.title || !newJob.company || !newJob.description || !newJob.category) {
        toast.error('Please fill all required fields');
        return;
      }

      const skillsArray = newJob.skills.split(',').map(s => s.trim()).filter(s => s);
      const requirementsArray = newJob.requirements ? newJob.requirements.split('\n').map(r => r.trim()).filter(r => r) : [];
      const responsibilitiesArray = newJob.responsibilities ? newJob.responsibilities.split('\n').map(r => r.trim()).filter(r => r) : [];
      const benefitsArray = newJob.benefits ? newJob.benefits.split(',').map(b => b.trim()).filter(b => b) : [];

      const jobData = {
        ...newJob,
        skills: skillsArray,
        requirements: requirementsArray,
        responsibilities: responsibilitiesArray,
        benefits: benefitsArray,
        salary: {
          min: Number(newJob.salary.min),
          max: Number(newJob.salary.max),
          currency: newJob.salary.currency,
          period: newJob.salary.period
        },
        experience: {
          min: Number(newJob.experience.min),
          max: Number(newJob.experience.max)
        },
        openings: Number(newJob.openings)
      };

      await API.post('/jobs', jobData);
      toast.success('Job posted successfully');
      setShowAddModal(false);
      setNewJob({
        title: '',
        company: '',
        description: '',
        category: '',
        employmentType: 'Full-time',
        workMode: 'On-site',
        location: {
          city: '',
          state: '',
          country: 'India'
        },
        salary: {
          min: '',
          max: '',
          currency: 'INR',
          period: 'Yearly'
        },
        experience: {
          min: '',
          max: ''
        },
        skills: '',
        requirements: '',
        responsibilities: '',
        benefits: '',
        openings: 1
      });
      fetchJobs();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'featured' && job.featured) ||
                         (filterStatus === 'active' && job.status === 'active');
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Jobs Management</h1>
          <p className="text-gray-600">Manage all job postings and featured jobs</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"
        >
          <FaPlus /> Post Job
        </button>
      </div>

      {/* Featured Jobs Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-3 rounded-lg">
              <FaBriefcase className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Jobs</p>
              <p className="text-2xl font-bold text-blue-900">{jobs.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 p-3 rounded-lg">
              <FaStar className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-yellow-600 font-medium">Featured Jobs</p>
              <p className="text-2xl font-bold text-yellow-900">
                {jobs.filter(job => job.featured).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-3 rounded-lg">
              <FaRegStar className="text-white text-xl" />
            </div>
            <div>
              <p className="text-sm text-green-600 font-medium">Regular Jobs</p>
              <p className="text-2xl font-bold text-green-900">
                {jobs.filter(job => !job.featured).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs..."
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
            <option value="all">All Jobs</option>
            <option value="active">Active Only</option>
            <option value="featured">Featured Only</option>
          </select>
        </div>
        <div className="mt-4">
          <p className="text-sm text-gray-600">Showing {filteredJobs.length} of {jobs.length} jobs</p>
        </div>
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading jobs...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <FaBriefcase className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-600">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <div key={job._id} className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition ${job.featured ? 'border-2 border-yellow-300' : ''}`}>
              {job.featured && (
                <div className="mb-3">
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                    <FaStar /> FEATURED - Shows on Homepage
                  </span>
                </div>
              )}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{job.company?.name || 'Unknown Company'}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {typeof job.location === 'string' 
                      ? job.location 
                      : job.location?.city 
                        ? `${job.location.city}${job.location.state ? ', ' + job.location.state : ''}${job.location.country ? ', ' + job.location.country : ''}`
                        : 'Location not specified'}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => toggleFeatured(job._id, job.featured)}
                    className={`p-2 rounded-lg transition ${job.featured ? 'text-yellow-500 bg-yellow-50 hover:bg-yellow-100' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'}`}
                    title={job.featured ? 'Remove from Featured' : 'Mark as Featured'}
                  >
                    {job.featured ? <FaStar className="text-xl" /> : <FaRegStar className="text-xl" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                  <span className="text-gray-500">Salary:</span>
                  <p className="font-semibold">
                    {job.salary?.min && job.salary?.max 
                      ? `₹${job.salary.min.toLocaleString('en-IN')} - ₹${job.salary.max.toLocaleString('en-IN')}${job.salary.period ? ' / ' + job.salary.period : ''}`
                      : 'Not disclosed'}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Type:</span>
                  <p className="font-semibold">{job.employmentType}</p>
                </div>
                <div>
                  <span className="text-gray-500">Applications:</span>
                  <p className="font-semibold">{job.applicationsCount || 0}</p>
                </div>
                <div>
                  <span className="text-gray-500">Posted:</span>
                  <p className="font-semibold">{new Date(job.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/jobs/${job._id}`)}
                  className="flex-1 px-4 py-2 text-sm text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition flex items-center justify-center gap-2"
                >
                  <FaEye /> View Details
                </button>
                <button
                  onClick={() => handleDelete(job._id, job.title)}
                  className="px-4 py-2 text-sm text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Job Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Post New Job</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                    <input
                      type="text"
                      value={newJob.title}
                      onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Senior React Developer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company *</label>
                    <select
                      value={newJob.company}
                      onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Company</option>
                      {companies.map(company => (
                        <option key={company._id} value={company._id}>{company.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={newJob.description}
                    onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe the role..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      value={newJob.category}
                      onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Category</option>
                      <option value="Software Development">Software Development</option>
                      <option value="Data & Analytics">Data & Analytics</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="Customer Support">Customer Support</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance & Accounting">Finance & Accounting</option>
                      <option value="Operations">Operations</option>
                      <option value="Product Management">Product Management</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type *</label>
                    <select
                      value={newJob.employmentType}
                      onChange={(e) => setNewJob({ ...newJob, employmentType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Freelance">Freelance</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Work Mode *</label>
                    <select
                      value={newJob.workMode}
                      onChange={(e) => setNewJob({ ...newJob, workMode: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="On-site">On-site</option>
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaMapMarkerAlt className="inline mr-2" />City *
                    </label>
                    <input
                      type="text"
                      value={newJob.location.city}
                      onChange={(e) => setNewJob({ 
                        ...newJob, 
                        location: { ...newJob.location, city: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      value={newJob.location.state}
                      onChange={(e) => setNewJob({ 
                        ...newJob, 
                        location: { ...newJob.location, state: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      value={newJob.location.country}
                      onChange={(e) => setNewJob({ 
                        ...newJob, 
                        location: { ...newJob.location, country: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="India"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaDollarSign className="inline mr-2" />Min Salary (₹) *
                    </label>
                    <input
                      type="number"
                      value={newJob.salary.min}
                      onChange={(e) => setNewJob({ 
                        ...newJob, 
                        salary: { ...newJob.salary, min: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="300000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Salary (₹) *</label>
                    <input
                      type="number"
                      value={newJob.salary.max}
                      onChange={(e) => setNewJob({ 
                        ...newJob, 
                        salary: { ...newJob.salary, max: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="600000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Salary Period</label>
                    <select
                      value={newJob.salary.period}
                      onChange={(e) => setNewJob({ 
                        ...newJob, 
                        salary: { ...newJob.salary, period: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Yearly">Yearly</option>
                      <option value="Monthly">Monthly</option>
                      <option value="Hourly">Hourly</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaClock className="inline mr-2" />Min Experience (years) *
                    </label>
                    <input
                      type="number"
                      value={newJob.experience.min}
                      onChange={(e) => setNewJob({ 
                        ...newJob, 
                        experience: { ...newJob.experience, min: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Experience (years) *</label>
                    <input
                      type="number"
                      value={newJob.experience.max}
                      onChange={(e) => setNewJob({ 
                        ...newJob, 
                        experience: { ...newJob.experience, max: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Openings *</label>
                    <input
                      type="number"
                      value={newJob.openings}
                      onChange={(e) => setNewJob({ ...newJob, openings: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="1"
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated) *</label>
                  <input
                    type="text"
                    value={newJob.skills}
                    onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="React, Node.js, MongoDB, TypeScript"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requirements (one per line)</label>
                  <textarea
                    value={newJob.requirements}
                    onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Bachelor's degree in Computer Science&#10;3+ years of React experience&#10;Strong problem-solving skills"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities (one per line)</label>
                  <textarea
                    value={newJob.responsibilities}
                    onChange={(e) => setNewJob({ ...newJob, responsibilities: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Develop web applications&#10;Collaborate with team&#10;Write clean code"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Benefits (comma-separated)</label>
                  <input
                    type="text"
                    value={newJob.benefits}
                    onChange={(e) => setNewJob({ ...newJob, benefits: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Health insurance, Work from home, Flexible hours"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddJob}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Post Job
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jobs;
