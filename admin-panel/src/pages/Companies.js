import React, { useState, useEffect } from 'react';
import { FaBuilding, FaTrash, FaEdit, FaSearch, FaBriefcase, FaGlobe, FaPlus, FaIndustry, FaUsers, FaCalendar, FaMapMarkerAlt, FaEye, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import API from '../utils/api';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCompany, setEditingCompany] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showJobsModal, setShowJobsModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [showEditJobModal, setShowEditJobModal] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    description: '',
    industry: '',
    website: '',
    companySize: '',
    location: {
      city: '',
      state: '',
      country: 'India'
    },
    founded: '',
    logo: ''
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      console.log('📡 Fetching companies...');
      const { data } = await API.get('/admin/companies');
      console.log('✅ Companies data:', data);
      setCompanies(data.companies || []);
      console.log('📊 Companies set:', data.companies?.length);
    } catch (error) {
      console.error('❌ Company fetch error:', error);
      console.error('Error details:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (companyId, companyName) => {
    if (!window.confirm(`Delete ${companyName}? This will also delete all associated jobs!`)) return;
    try {
      await API.delete(`/admin/companies/${companyId}`);
      toast.success('Company deleted');
      fetchCompanies();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = (company) => {
    setEditingCompany({ ...company });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      await API.put(`/admin/companies/${editingCompany._id}`, {
        name: editingCompany.name,
        description: editingCompany.description,
        website: editingCompany.website,
        industry: editingCompany.industry,
        companySize: editingCompany.companySize,
        founded: editingCompany.founded,
        logo: editingCompany.logo,
        location: editingCompany.location
      });
      toast.success('Company updated');
      setShowEditModal(false);
      fetchCompanies();
    } catch (error) {
      toast.error('Failed to update');
    }
  };

  const handleAdd = async () => {
    try {
      if (!newCompany.name || !newCompany.description || !newCompany.industry) {
        toast.error('Please fill all required fields');
        return;
      }
      
      // Get the current logged-in admin user
      const userResponse = await API.get('/auth/me');
      
      await API.post('/companies', {
        ...newCompany,
        owner: userResponse.data._id
      });
      toast.success('Company added successfully');
      setShowAddModal(false);
      setNewCompany({
        name: '',
        description: '',
        industry: '',
        website: '',
        companySize: '',
        location: {
          city: '',
          state: '',
          country: 'India'
        },
        founded: '',
        logo: ''
      });
      fetchCompanies();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add company');
    }
  };

  const handleViewJobs = async (company) => {
    setSelectedCompany(company);
    setShowJobsModal(true);
    setLoadingJobs(true);
    try {
      const { data } = await API.get(`/jobs?company=${company._id}`);
      console.log('📊 Jobs API response:', data);
      // Handle different response formats
      const jobs = Array.isArray(data) ? data : (data.jobs || []);
      console.log('📊 Processed jobs:', jobs);
      setCompanyJobs(jobs);
    } catch (error) {
      console.error('❌ Error fetching jobs:', error);
      toast.error('Failed to fetch jobs');
      setCompanyJobs([]);
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleEditJob = (job) => {
    setEditingJob({ ...job });
    setShowEditJobModal(true);
  };

  const handleUpdateJob = async () => {
    try {
      await API.put(`/admin/jobs/${editingJob._id}`, editingJob);
      toast.success('Job updated successfully');
      setShowEditJobModal(false);
      handleViewJobs(selectedCompany); // Refresh jobs list
    } catch (error) {
      toast.error('Failed to update job');
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await API.delete(`/admin/jobs/${jobId}`);
      toast.success('Job deleted successfully');
      handleViewJobs(selectedCompany); // Refresh jobs list
      fetchCompanies(); // Refresh companies to update job count
    } catch (error) {
      toast.error('Failed to delete job');
    }
  };

  const filteredCompanies = companies.filter(company => 
    company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
            <FaBuilding className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Companies Management
            </h1>
            <p className="text-gray-600 mt-1">Manage all registered companies</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-xl font-semibold flex items-center gap-2 transform hover:scale-105 transition-all"
        >
          <FaPlus /> Add Company
        </button>
      </div>

      {/* Search with Better Design */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl shadow-lg border border-gray-200 p-6 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-4 text-gray-400 text-lg" />
          <input
            type="text"
            placeholder="Search companies by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
          />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-blue-600">{filteredCompanies.length}</span> of <span className="font-semibold">{companies.length}</span> companies
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear Search
            </button>
          )}
        </div>
      </div>

      {/* Companies Grid */}
      {loading ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading companies...</p>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center">
          <FaBuilding className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No companies found</h3>
          <p className="text-gray-600">Try adjusting your search</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div key={company._id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 border border-gray-100 transform hover:scale-105">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {company.logo && company.logo !== 'default-company-logo.png' ? (
                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gray-200 shadow-md bg-white">
                      <img 
                        src={company.logo} 
                        alt={company.name} 
                        className="w-full h-full object-contain p-1"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=3B82F6&color=fff&size=128&bold=true`;
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-2xl">
                        {company.name?.charAt(0)?.toUpperCase() || 'C'}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{company.name}</h3>
                    <p className="text-xs text-gray-500">{company.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {company.industry && (
                  <p className="text-sm text-gray-600 bg-purple-50 px-3 py-1 rounded-full inline-block">
                    <FaIndustry className="inline mr-1" />
                    {company.industry}
                  </p>
                )}
                {company.location && (company.location.city || company.location.state || company.location.country) && (
                  <p className="text-sm text-gray-600">
                    <FaMapMarkerAlt className="inline mr-1 text-red-500" />
                    {[company.location.city, company.location.state, company.location.country].filter(Boolean).join(', ')}
                  </p>
                )}
                {company.website && (
                  <p className="text-sm text-blue-600 truncate hover:text-blue-700">
                    <FaGlobe className="inline mr-1" />
                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                      {company.website}
                    </a>
                  </p>
                )}
                <p className="text-sm text-gray-600 bg-green-50 px-3 py-1 rounded-full inline-block">
                  <FaBriefcase className="inline mr-1" />
                  {company.jobsCount || 0} Jobs Posted
                </p>
              </div>

              {company.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2 bg-gray-50 p-3 rounded-lg">{company.description}</p>
              )}

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleViewJobs(company)}
                  className="w-full py-3 bg-gradient-to-r from-green-50 to-green-100 text-green-600 rounded-xl hover:from-green-100 hover:to-green-200 font-semibold transition-all transform hover:scale-105 shadow-sm"
                >
                  <FaEye className="inline mr-2" /> View Jobs ({company.jobsCount || 0})
                </button>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(company)}
                    className="flex-1 py-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 rounded-xl hover:from-blue-100 hover:to-blue-200 font-semibold transition-all transform hover:scale-105 shadow-sm"
                  >
                    <FaEdit className="inline mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(company._id, company.name)}
                    className="flex-1 py-3 bg-gradient-to-r from-red-50 to-red-100 text-red-600 rounded-xl hover:from-red-100 hover:to-red-200 font-semibold transition-all transform hover:scale-105 shadow-sm"
                  >
                    <FaTrash className="inline mr-2" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Edit Company</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                  <input
                    type="text"
                    value={editingCompany.name}
                    onChange={(e) => setEditingCompany({ ...editingCompany, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editingCompany.email}
                    onChange={(e) => setEditingCompany({ ...editingCompany, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo URL</label>
                  <input
                    type="text"
                    value={editingCompany.logo || ''}
                    onChange={(e) => setEditingCompany({ ...editingCompany, logo: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  {editingCompany.logo && (
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-sm text-gray-600">Preview:</span>
                      <img 
                        src={editingCompany.logo} 
                        alt="Logo preview" 
                        className="w-16 h-16 object-contain border rounded-lg p-1"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(editingCompany.name)}&background=3B82F6&color=fff&size=128&bold=true`;
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Paste a direct image URL (jpg, png, svg)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <input
                    type="text"
                    value={editingCompany.industry || ''}
                    onChange={(e) => setEditingCompany({ ...editingCompany, industry: e.target.value })}
                    placeholder="e.g., Technology, Finance, Healthcare"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="text"
                    value={editingCompany.website || ''}
                    onChange={(e) => setEditingCompany({ ...editingCompany, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="City"
                      value={editingCompany.location?.city || ''}
                      onChange={(e) => setEditingCompany({ 
                        ...editingCompany, 
                        location: { ...editingCompany.location, city: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={editingCompany.location?.state || ''}
                      onChange={(e) => setEditingCompany({ 
                        ...editingCompany, 
                        location: { ...editingCompany.location, state: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Country"
                      value={editingCompany.location?.country || ''}
                      onChange={(e) => setEditingCompany({ 
                        ...editingCompany, 
                        location: { ...editingCompany.location, country: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={editingCompany.description || ''}
                    onChange={(e) => setEditingCompany({ ...editingCompany, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleUpdate}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Update
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Add New Company</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaBuilding className="inline mr-2" />Company Name *
                  </label>
                  <input
                    type="text"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Tech Innovations Pvt Ltd"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Logo URL
                  </label>
                  <input
                    type="text"
                    value={newCompany.logo}
                    onChange={(e) => setNewCompany({ ...newCompany, logo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/logo.png"
                  />
                  {newCompany.logo && (
                    <div className="mt-3 flex items-center gap-3">
                      <span className="text-sm text-gray-600">Preview:</span>
                      <img 
                        src={newCompany.logo} 
                        alt="Logo preview" 
                        className="w-16 h-16 object-contain border rounded-lg p-1"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(newCompany.name || 'Company')}&background=3B82F6&color=fff&size=128&bold=true`;
                        }}
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Paste a direct image URL or use services like{' '}
                    <a href="https://imgur.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Imgur
                    </a>
                    {' '}or{' '}
                    <a href="https://postimages.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      PostImages
                    </a>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaIndustry className="inline mr-2" />Industry *
                  </label>
                  <select
                    value={newCompany.industry}
                    onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Industry</option>
                    <option value="IT & Software">IT & Software</option>
                    <option value="Finance & Banking">Finance & Banking</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Retail">Retail</option>
                    <option value="Telecommunications">Telecommunications</option>
                    <option value="Media & Entertainment">Media & Entertainment</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={newCompany.description}
                    onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your company..."
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaMapMarkerAlt className="inline mr-2" />City *
                    </label>
                    <input
                      type="text"
                      value={newCompany.location.city}
                      onChange={(e) => setNewCompany({ 
                        ...newCompany, 
                        location: { ...newCompany.location, city: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      value={newCompany.location.state}
                      onChange={(e) => setNewCompany({ 
                        ...newCompany, 
                        location: { ...newCompany.location, state: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      value={newCompany.location.country}
                      onChange={(e) => setNewCompany({ 
                        ...newCompany, 
                        location: { ...newCompany.location, country: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="India"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaGlobe className="inline mr-2" />Website
                  </label>
                  <input
                    type="url"
                    value={newCompany.website}
                    onChange={(e) => setNewCompany({ ...newCompany, website: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://www.company.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaUsers className="inline mr-2" />Company Size
                    </label>
                    <select
                      value={newCompany.companySize}
                      onChange={(e) => setNewCompany({ ...newCompany, companySize: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501-1000">501-1000 employees</option>
                      <option value="1000+">1000+ employees</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FaCalendar className="inline mr-2" />Founded Year
                    </label>
                    <input
                      type="number"
                      value={newCompany.founded}
                      onChange={(e) => setNewCompany({ ...newCompany, founded: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="2015"
                      min="1800"
                      max={new Date().getFullYear()}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo URL</label>
                  <input
                    type="url"
                    value={newCompany.logo}
                    onChange={(e) => setNewCompany({ ...newCompany, logo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAdd}
                  className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Add Company
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

      {/* Jobs Modal */}
      {showJobsModal && selectedCompany && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Jobs at {selectedCompany.name}</h2>
                  <p className="text-sm opacity-90">{companyJobs.length} job(s) posted</p>
                </div>
                <button
                  onClick={() => {
                    setShowJobsModal(false);
                    setSelectedCompany(null);
                    setCompanyJobs([]);
                  }}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>
            </div>

            <div className="p-6">
              {loadingJobs ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading jobs...</p>
                </div>
              ) : companyJobs.length === 0 ? (
                <div className="text-center py-12">
                  <FaBriefcase className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No Jobs Posted</h3>
                  <p className="text-gray-600">This company hasn't posted any jobs yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {companyJobs.map((job) => (
                    <div key={job._id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all bg-gradient-to-br from-white to-gray-50">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                          <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full">
                              <FaMapMarkerAlt className="text-blue-600" />
                              {job.location?.city}, {job.location?.state}
                            </span>
                            <span className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                              <FaBriefcase className="text-green-600" />
                              {job.employmentType}
                            </span>
                            {job.salary?.min && job.salary?.max && (
                              <span className="flex items-center gap-1 bg-purple-50 px-3 py-1 rounded-full">
                                💰 ₹{job.salary.min.toLocaleString('en-IN')} - ₹{job.salary.max.toLocaleString('en-IN')}
                              </span>
                            )}
                            {job.isFeatured && (
                              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full font-semibold">
                                ⭐ Featured
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {job.description && (
                        <p className="text-gray-700 mb-4 line-clamp-2 bg-gray-50 p-3 rounded-lg">{job.description}</p>
                      )}

                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.skills?.slice(0, 5).map((skill, idx) => (
                          <span key={idx} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                        {job.skills?.length > 5 && (
                          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                            +{job.skills.length - 5} more
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">{job.applicants?.length || 0}</span> applicants
                          <span className="mx-2">•</span>
                          Posted {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditJob(job)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                          >
                            <FaEdit className="inline mr-1" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                          >
                            <FaTrash className="inline mr-1" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditJobModal && editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">Edit Job</h2>
                  <p className="text-sm opacity-90 mt-1">{editingJob.title}</p>
                </div>
                <button
                  onClick={() => setShowEditJobModal(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                <input
                  type="text"
                  value={editingJob.title}
                  onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={editingJob.description}
                  onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    value={editingJob.location?.city || ''}
                    onChange={(e) => setEditingJob({ 
                      ...editingJob, 
                      location: { ...editingJob.location, city: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                  <input
                    type="text"
                    value={editingJob.location?.state || ''}
                    onChange={(e) => setEditingJob({ 
                      ...editingJob, 
                      location: { ...editingJob.location, state: e.target.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type *</label>
                <select
                  value={editingJob.employmentType}
                  onChange={(e) => setEditingJob({ ...editingJob, employmentType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Salary (₹)</label>
                  <input
                    type="number"
                    value={editingJob.salary?.min || ''}
                    onChange={(e) => setEditingJob({ 
                      ...editingJob, 
                      salary: { ...editingJob.salary, min: parseInt(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Salary (₹)</label>
                  <input
                    type="number"
                    value={editingJob.salary?.max || ''}
                    onChange={(e) => setEditingJob({ 
                      ...editingJob, 
                      salary: { ...editingJob.salary, max: parseInt(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Experience (years)</label>
                  <input
                    type="number"
                    value={editingJob.experience?.min || ''}
                    onChange={(e) => setEditingJob({ 
                      ...editingJob, 
                      experience: { ...editingJob.experience, min: parseInt(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Experience (years)</label>
                  <input
                    type="number"
                    value={editingJob.experience?.max || ''}
                    onChange={(e) => setEditingJob({ 
                      ...editingJob, 
                      experience: { ...editingJob.experience, max: parseInt(e.target.value) }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={editingJob.skills?.join(', ') || ''}
                  onChange={(e) => setEditingJob({ 
                    ...editingJob, 
                    skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="JavaScript, React, Node.js"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingJob.isFeatured || false}
                  onChange={(e) => setEditingJob({ ...editingJob, isFeatured: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label className="text-sm font-medium text-gray-700">
                  ⭐ Featured Job (Show at top)
                </label>
              </div>

              <div className="flex gap-3 mt-6 pt-6 border-t">
                <button
                  onClick={handleUpdateJob}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:shadow-lg font-semibold transition-all"
                >
                  Update Job
                </button>
                <button
                  onClick={() => setShowEditJobModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 font-semibold transition-all"
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

export default Companies;
