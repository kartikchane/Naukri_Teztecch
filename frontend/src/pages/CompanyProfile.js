import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';
import { FaBuilding, FaIndustry, FaMapMarkerAlt, FaGlobe, FaUsers, FaCalendar, FaEdit, FaSave, FaTimes, FaCheckCircle, FaClock, FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

const CompanyProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [company, setCompany] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    location: {
      city: '',
      state: '',
      country: 'India'
    },
    website: '',
    companySize: '',
    founded: '',
    logo: null,
    specialties: '',
    benefits: '',
    socialLinks: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: ''
    }
  });
  const [documents, setDocuments] = useState({
    aadharCard: null,
    panCard: null,
    gstCertificate: null,
    udyamAadhar: null
  });
  const [uploadingDoc, setUploadingDoc] = useState(null);

  const industries = [
    'IT & Software',
    'Finance',
    'Healthcare',
    'Manufacturing',
    'Retail',
    'Education',
    'Energy',
    'Telecommunications',
    'Media & Entertainment',
    'Real Estate',
    'Transportation',
    'Hospitality',
    'Other'
  ];

  const companySizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      const response = await API.get('/companies/my-company');
      setCompany(response.data);
      populateForm(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        toast.info('You need to create a company profile first');
        navigate('/create-company');
      } else {
        toast.error('Failed to load company profile');
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (companyData) => {
    setFormData({
      name: companyData.name || '',
      description: companyData.description || '',
      industry: companyData.industry || '',
      location: {
        city: companyData.location?.city || '',
        state: companyData.location?.state || '',
        country: companyData.location?.country || 'India'
      },
      website: companyData.website || '',
      companySize: companyData.companySize || '',
      founded: companyData.founded || '',
      logo: null,
      specialties: companyData.specialties?.join(', ') || '',
      benefits: companyData.benefits?.join(', ') || '',
      socialLinks: {
        linkedin: companyData.socialLinks?.linkedin || '',
        twitter: companyData.socialLinks?.twitter || '',
        facebook: companyData.socialLinks?.facebook || '',
        instagram: companyData.socialLinks?.instagram || ''
      }
    });

    // Populate documents
    if (companyData.documents) {
      setDocuments({
        aadharCard: companyData.documents.aadharCard || null,
        panCard: companyData.documents.panCard || null,
        gstCertificate: companyData.documents.gstCertificate || null,
        udyamAadhar: companyData.documents.udyamAadhar || null
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDocumentChange = async (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingDoc(docType);
    const docFormData = new FormData();
    docFormData.append('document', file);
    docFormData.append('documentType', docType);

    try {
      const response = await API.post(`/companies/${company._id}/documents`, docFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setDocuments(prev => ({
        ...prev,
        [docType]: response.data.filePath
      }));
      toast.success(`${docType} uploaded successfully`);
    } catch (error) {
      console.error('Document upload failed:', error);
      toast.error(error.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Company name is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Company description is required');
      return;
    }
    if (!formData.industry) {
      toast.error('Industry is required');
      return;
    }
    if (!formData.location.city.trim()) {
      toast.error('City is required');
      return;
    }

    setSaving(true);

    try {
      const specialtiesArray = formData.specialties
        ? formData.specialties.split(',').map(s => s.trim()).filter(s => s)
        : [];

      const benefitsArray = formData.benefits
        ? formData.benefits.split(',').map(s => s.trim()).filter(s => s)
        : [];

      const updateData = {
        name: formData.name,
        description: formData.description,
        industry: formData.industry,
        location: formData.location,
        website: formData.website,
        companySize: formData.companySize,
        founded: formData.founded ? parseInt(formData.founded) : undefined,
        specialties: specialtiesArray,
        benefits: benefitsArray,
        socialLinks: formData.socialLinks
      };

      // Upload logo if new file selected
      if (formData.logo && formData.logo instanceof File) {
        const logoFormData = new FormData();
        logoFormData.append('logo', formData.logo);

        try {
          const logoRes = await API.post(`/companies/${company._id}/logo`, logoFormData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          toast.success('Logo uploaded successfully');
        } catch (logoError) {
          console.error('Logo upload failed:', logoError);
          toast.warning('Company updated but logo upload failed');
        }
      }

      // Update company details
      const updatedCompany = await API.put(`/companies/${company._id}`, updateData);
      setCompany(updatedCompany.data);
      populateForm(updatedCompany.data);
      setEditMode(false);
      toast.success('Company profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update company profile');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    populateForm(company);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Company Profile</h1>
        <p className="text-gray-600 mb-6">No company profile found</p>
        <button
          onClick={() => navigate('/create-company')}
          className="btn-primary"
        >
          Create Company Profile
        </button>
      </div>
    );
  }

  const getVerificationStatus = () => {
    const status = company.documentVerification?.status;
    if (status === 'verified') {
      return <span className="flex items-center gap-2 text-green-600"><FaCheckCircle /> Verified</span>;
    } else if (status === 'pending') {
      return <span className="flex items-center gap-2 text-yellow-600"><FaClock /> Pending Verification</span>;
    } else if (status === 'rejected') {
      return <span className="flex items-center gap-2 text-red-600"><FaTimes /> Rejected - {company.documentVerification?.rejectionReason}</span>;
    }
    return <span className="flex items-center gap-2 text-gray-600"><FaClock /> Not Submitted</span>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Company Profile</h1>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              className="flex items-center gap-2 btn-primary"
            >
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>

        {/* Verification Status Badge */}
        <div className="mb-6 p-4 rounded-lg bg-gray-50 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-gray-700 font-semibold">Verification Status:</span>
              {getVerificationStatus()}
            </div>
            {company.documentVerification?.status === 'rejected' && (
              <p className="text-sm text-red-600">Admin Notes: {company.documentVerification?.adminNotes}</p>
            )}
          </div>
        </div>

        {!editMode ? (
          /* View Mode */
          <div className="space-y-6">
            {/* Logo & Basic Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex gap-6 mb-6">
                {company.logo && (
                  <img
                    src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${company.logo}`}
                    alt={company.name}
                    className="w-32 h-32 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=3B82F6&color=fff&size=256&bold=true`;
                    }}
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{company.name}</h2>
                  <p className="text-gray-600 mb-4">{company.description}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="font-semibold">Industry:</span> {company.industry}</div>
                    <div><span className="font-semibold">Size:</span> {company.companySize || 'N/A'} employees</div>
                    {company.founded && <div><span className="font-semibold">Founded:</span> {company.founded}</div>}
                    {company.website && (
                      <div>
                        <span className="font-semibold">Website:</span>{' '}
                        <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-600">
                          {company.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Email:</span>
                  <p className="font-semibold">{company.contactInfo?.registeredEmail || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <p className="font-semibold">{company.contactInfo?.registeredPhone || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaMapMarkerAlt /> Location
              </h3>
              <p className="text-gray-700">
                {company.location?.city}, {company.location?.state}, {company.location?.country}
              </p>
            </div>

            {/* Specialties & Benefits */}
            {(company.specialties?.length > 0 || company.benefits?.length > 0) && (
              <div className="grid md:grid-cols-2 gap-6">
                {company.specialties?.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-bold mb-4">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {company.specialties.map((spec, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {company.benefits?.length > 0 && (
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-bold mb-4">Benefits</h3>
                    <div className="flex flex-wrap gap-2">
                      {company.benefits.map((benefit, idx) => (
                        <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Social Links */}
            {Object.values(company.socialLinks || {}).some(v => v) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">Social Links</h3>
                <div className="flex gap-4">
                  {company.socialLinks?.linkedin && (
                    <a href={company.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                      <FaLinkedin size={24} />
                    </a>
                  )}
                  {company.socialLinks?.twitter && (
                    <a href={company.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                      <FaTwitter size={24} />
                    </a>
                  )}
                  {company.socialLinks?.facebook && (
                    <a href={company.socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                      <FaFacebook size={24} />
                    </a>
                  )}
                  {company.socialLinks?.instagram && (
                    <a href={company.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                      <FaInstagram size={24} />
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Company Documents */}
            {company.documents && Object.values(company.documents).some(v => v) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  📄 Registration Documents
                </h3>
                <div className="space-y-3">
                  {company.documents.aadharCard && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                      <span className="font-medium text-gray-700">Aadhar Card</span>
                      <a
                        href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${company.documents.aadharCard}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                  {company.documents.panCard && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                      <span className="font-medium text-gray-700">PAN Card</span>
                      <a
                        href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${company.documents.panCard}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                  {company.documents.gstCertificate && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                      <span className="font-medium text-gray-700">GST Certificate</span>
                      <a
                        href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${company.documents.gstCertificate}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                  {company.documents.udyamAadhar && (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                      <span className="font-medium text-gray-700">Udyam Aadhar Registration</span>
                      <a
                        href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${company.documents.udyamAadhar}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate('/post-job')}
                className="flex-1 btn-primary"
              >
                Post a Job
              </button>
              <button
                onClick={() => navigate('/plans')}
                className="flex-1 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
              >
                View Plans
              </button>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSave} className="bg-white rounded-lg shadow p-6 space-y-6">
            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-semibold mb-2">Company Logo</label>
              <div className="flex gap-4 items-end">
                {company.logo && (
                  <img
                    src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${company.logo}`}
                    alt="Current logo"
                    className="w-20 h-20 object-cover rounded"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=3B82F6&color=fff&size=160&bold=true`;
                    }}
                  />
                )}
                <input
                  type="file"
                  name="logo"
                  onChange={handleChange}
                  accept="image/*"
                  className="flex-1 border rounded px-3 py-2"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Leave empty to keep current logo</p>
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-sm font-semibold mb-2">Company Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter company name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">Company Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tell us about your company..."
              />
            </div>

            {/* Industry & Size */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Industry *</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select industry</option>
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Company Size</label>
                <select
                  name="companySize"
                  value={formData.companySize}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select size</option>
                  {companySizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">City *</label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="City"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">State</label>
                <input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="State"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Country</label>
                <input
                  type="text"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Country"
                />
              </div>
            </div>

            {/* Website & Founded */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Website</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Founded Year</label>
                <input
                  type="number"
                  name="founded"
                  value={formData.founded}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., 2020"
                />
              </div>
            </div>

            {/* Specialties & Benefits */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Specialties (comma-separated)</label>
                <input
                  type="text"
                  name="specialties"
                  value={formData.specialties}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Web Development, AI, Cloud"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Benefits (comma-separated)</label>
                <input
                  type="text"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleChange}
                  className="w-full border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Health Insurance, Remote Work"
                />
              </div>
            </div>

            {/* Company Registration Documents */}
            <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded">
              <h4 className="font-semibold mb-4 text-blue-900">Company Registration Documents</h4>
              <div className="space-y-4">
                {/* Aadhar Card */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Aadhar Card <span className="text-red-600">*</span>
                  </label>
                  {documents.aadharCard && (
                    <div className="flex items-center gap-2 mb-2 bg-green-50 p-2 rounded border border-green-200">
                      <span className="text-sm text-green-700">
                        ✓ {documents.aadharCard.split('/').pop()}
                      </span>
                      <a
                        href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${documents.aadharCard}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        View
                      </a>
                    </div>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleDocumentChange(e, 'aadharCard')}
                    disabled={uploadingDoc === 'aadharCard'}
                    className="w-full border rounded px-3 py-2"
                  />
                  {uploadingDoc === 'aadharCard' && (
                    <p className="text-sm text-blue-600 mt-1">Uploading...</p>
                  )}
                </div>

                {/* PAN Card */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    PAN Card <span className="text-red-600">*</span>
                  </label>
                  {documents.panCard && (
                    <div className="flex items-center gap-2 mb-2 bg-green-50 p-2 rounded border border-green-200">
                      <span className="text-sm text-green-700">
                        ✓ {documents.panCard.split('/').pop()}
                      </span>
                      <a
                        href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${documents.panCard}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        View
                      </a>
                    </div>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleDocumentChange(e, 'panCard')}
                    disabled={uploadingDoc === 'panCard'}
                    className="w-full border rounded px-3 py-2"
                  />
                  {uploadingDoc === 'panCard' && (
                    <p className="text-sm text-blue-600 mt-1">Uploading...</p>
                  )}
                </div>

                {/* GST Certificate */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    GST Certificate <span className="text-red-600">*</span>
                  </label>
                  {documents.gstCertificate && (
                    <div className="flex items-center gap-2 mb-2 bg-green-50 p-2 rounded border border-green-200">
                      <span className="text-sm text-green-700">
                        ✓ {documents.gstCertificate.split('/').pop()}
                      </span>
                      <a
                        href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${documents.gstCertificate}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        View
                      </a>
                    </div>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleDocumentChange(e, 'gstCertificate')}
                    disabled={uploadingDoc === 'gstCertificate'}
                    className="w-full border rounded px-3 py-2"
                  />
                  {uploadingDoc === 'gstCertificate' && (
                    <p className="text-sm text-blue-600 mt-1">Uploading...</p>
                  )}
                </div>

                {/* Udyam Aadhar */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Udyam Aadhar Registration <span className="text-red-600">*</span>
                  </label>
                  {documents.udyamAadhar && (
                    <div className="flex items-center gap-2 mb-2 bg-green-50 p-2 rounded border border-green-200">
                      <span className="text-sm text-green-700">
                        ✓ {documents.udyamAadhar.split('/').pop()}
                      </span>
                      <a
                        href={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/${documents.udyamAadhar}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                      >
                        View
                      </a>
                    </div>
                  )}
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleDocumentChange(e, 'udyamAadhar')}
                    disabled={uploadingDoc === 'udyamAadhar'}
                    className="w-full border rounded px-3 py-2"
                  />
                  {uploadingDoc === 'udyamAadhar' && (
                    <p className="text-sm text-blue-600 mt-1">Uploading...</p>
                  )}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-semibold mb-3">Social Media Links</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="url"
                  name="socialLinks.linkedin"
                  value={formData.socialLinks.linkedin}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="LinkedIn URL"
                />
                <input
                  type="url"
                  name="socialLinks.twitter"
                  value={formData.socialLinks.twitter}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Twitter URL"
                />
                <input
                  type="url"
                  name="socialLinks.facebook"
                  value={formData.socialLinks.facebook}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Facebook URL"
                />
                <input
                  type="url"
                  name="socialLinks.instagram"
                  value={formData.socialLinks.instagram}
                  onChange={handleChange}
                  className="border rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Instagram URL"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 btn-primary disabled:opacity-50"
              >
                <FaSave /> {saving ? 'Saving...' : 'Save Profile'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors font-semibold disabled:opacity-50"
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CompanyProfile;
