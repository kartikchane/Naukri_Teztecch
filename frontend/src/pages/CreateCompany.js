import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';
import { FaBuilding, FaIndustry, FaMapMarkerAlt, FaGlobe, FaUsers, FaCalendar, FaFileAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const CreateCompany = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingCompany, setCheckingCompany] = useState(true);
  const [customIndustry, setCustomIndustry] = useState('');
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
    size: '',
    foundedYear: '',
    logo: null,
    specialties: '',
    // Company Documents
    aadharCard: null,
    panCard: null,
    gstCertificate: null,
    udyamAadhar: null,
    registeredEmail: '',
    registeredPhone: ''
  });

  useEffect(() => {
    checkExistingCompany();
  }, []);

  const checkExistingCompany = async () => {
    try {
      const { data } = await API.get('/companies/my-company');
      if (data) {
        toast.info('You already have a company profile');
        navigate('/profile');
      }
    } catch (error) {
      // No company found, can create new one
    } finally {
      setCheckingCompany(false);
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

  const handleSubmit = async (e) => {
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
    if (formData.industry === 'Other' && !customIndustry.trim()) {
      toast.error('Please specify your industry');
      return;
    }
    if (!formData.location.city.trim()) {
      toast.error('City is required');
      return;
    }

    // Validate required documents
    if (!formData.aadharCard) {
      toast.error('Aadhar card of owner is required');
      return;
    }
    if (!formData.panCard) {
      toast.error('PAN card of company is required');
      return;
    }
    if (!formData.gstCertificate) {
      toast.error('GST certificate is required');
      return;
    }
    if (!formData.udyamAadhar) {
      toast.error('Registration certificate (Udyam Aadhar) is required');
      return;
    }
    if (!formData.registeredEmail.trim()) {
      toast.error('Registered email of company is required');
      return;
    }
    if (!formData.registeredPhone.trim()) {
      toast.error('Registered contact number of company is required');
      return;
    }

    setLoading(true);

    try {
      // Convert specialties to array
      const specialtiesArray = formData.specialties
        ? formData.specialties.split(',').map(s => s.trim()).filter(s => s)
        : [];

      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('industry', formData.industry === 'Other' ? customIndustry : formData.industry);
      formDataToSend.append('location[city]', formData.location.city);
      formDataToSend.append('location[state]', formData.location.state);
      formDataToSend.append('location[country]', formData.location.country);
      formDataToSend.append('website', formData.website);
      formDataToSend.append('size', formData.size);
      formDataToSend.append('foundedYear', formData.foundedYear ? parseInt(formData.foundedYear) : '');

      // Append logo file if selected
      if (formData.logo && formData.logo instanceof File) {
        formDataToSend.append('logo', formData.logo);
      }

      formDataToSend.append('specialties', JSON.stringify(specialtiesArray));

      // Append company documents
      if (formData.aadharCard instanceof File) {
        formDataToSend.append('aadharCard', formData.aadharCard);
      }
      if (formData.panCard instanceof File) {
        formDataToSend.append('panCard', formData.panCard);
      }
      if (formData.gstCertificate instanceof File) {
        formDataToSend.append('gstCertificate', formData.gstCertificate);
      }
      if (formData.udyamAadhar instanceof File) {
        formDataToSend.append('udyamAadhar', formData.udyamAadhar);
      }
      formDataToSend.append('registeredEmail', formData.registeredEmail);
      formDataToSend.append('registeredPhone', formData.registeredPhone);

      const { data } = await API.post('/companies', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Company profile created! Now let\'s set up your subscription to post jobs.');
      // Store company data in sessionStorage for immediate use
      if (data.company) {
        sessionStorage.setItem('newCompanyData', JSON.stringify(data.company));
      }
      setTimeout(() => {
        navigate('/plans', { state: { companyCreated: true, companyData: data.company } });
      }, 2000);
    } catch (error) {
      console.error('Error creating company:', error);
      toast.error(error.response?.data?.message || 'Failed to create company profile');
    } finally {
      setLoading(false);
    }
  };

  if (checkingCompany) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Company Profile</h1>
            <p className="text-gray-600">Set up your company profile to start posting jobs</p>
          </div>

          {/* Info Box - Document Requirements */}
          <div className="mb-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <h3 className="font-semibold text-blue-900 mb-2">📋 Required Documents</h3>
            <p className="text-sm text-blue-800">
              Your company documents will be verified by our admin team before you can start posting jobs.
              Please ensure all documents are valid and clearly readable.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaBuilding className="inline mr-2" />
                Company Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Tech Innovations Pvt Ltd"
                required
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaIndustry className="inline mr-2" />
                Industry *
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
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

            {/* Custom Industry Input */}
            {formData.industry === 'Other' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaIndustry className="inline mr-2" />
                  Specify Your Industry *
                </label>
                <input
                  type="text"
                  value={customIndustry}
                  onChange={(e) => setCustomIndustry(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Agriculture, Automotive, etc."
                  required
                />
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your company, its mission, values, and what makes it unique..."
                required
              />
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2" />
                  City *
                </label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Mumbai"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Maharashtra"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="India"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaGlobe className="inline mr-2" />
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.yourcompany.com"
              />
            </div>

            {/* Company Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaUsers className="inline mr-2" />
                Company Size
              </label>
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Size</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1001-5000">1001-5000 employees</option>
                <option value="5000+">5000+ employees</option>
              </select>
            </div>

            {/* Founded Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaCalendar className="inline mr-2" />
                Founded Year
              </label>
              <input
                type="number"
                name="foundedYear"
                value={formData.foundedYear}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 2015"
                min="1800"
                max={new Date().getFullYear()}
              />
            </div>

            {/* Logo Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Logo
              </label>
              <input
                type="file"
                name="logo"
                onChange={handleChange}
                accept="image/*"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Upload your company logo (image file)</p>
              {formData.logo && formData.logo instanceof File && (
                <p className="text-sm text-green-600 mt-1">✓ {formData.logo.name}</p>
              )}
            </div>

            {/* Specialties */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specialties
              </label>
              <input
                type="text"
                name="specialties"
                value={formData.specialties}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Web Development, Mobile Apps, Cloud Solutions"
              />
              <p className="text-sm text-gray-500 mt-1">Separate multiple specialties with commas</p>
            </div>

            {/* Required Documents Section */}
            <div className="border-t pt-6 mt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FaFileAlt className="inline mr-2 text-blue-600" />
                Required Company Documents
              </h2>

              {/* Aadhar Card Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aadhar Card of Owner *
                </label>
                <input
                  type="file"
                  name="aadharCard"
                  onChange={handleChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Upload Aadhar card document (PDF, JPG, PNG)</p>
                {formData.aadharCard && formData.aadharCard instanceof File && (
                  <p className="text-sm text-green-600 mt-1">✓ {formData.aadharCard.name}</p>
                )}
              </div>

              {/* PAN Card Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PAN Card of Company *
                </label>
                <input
                  type="file"
                  name="panCard"
                  onChange={handleChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Upload PAN card document (PDF, JPG, PNG)</p>
                {formData.panCard && formData.panCard instanceof File && (
                  <p className="text-sm text-green-600 mt-1">✓ {formData.panCard.name}</p>
                )}
              </div>

              {/* GST Certificate Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GST Certificate *
                </label>
                <input
                  type="file"
                  name="gstCertificate"
                  onChange={handleChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Upload GST certificate (PDF, JPG, PNG)</p>
                {formData.gstCertificate && formData.gstCertificate instanceof File && (
                  <p className="text-sm text-green-600 mt-1">✓ {formData.gstCertificate.name}</p>
                )}
              </div>

              {/* Udyam Aadhar Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Certificate (Udyam Aadhar) *
                </label>
                <input
                  type="file"
                  name="udyamAadhar"
                  onChange={handleChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Upload Udyam Aadhar registration certificate (PDF, JPG, PNG)</p>
                {formData.udyamAadhar && formData.udyamAadhar instanceof File && (
                  <p className="text-sm text-green-600 mt-1">✓ {formData.udyamAadhar.name}</p>
                )}
              </div>
            </div>

            {/* Company Contact Information */}
            <div className="border-t pt-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Company Contact Information</h2>

              {/* Registered Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaEnvelope className="inline mr-2" />
                    Registered Email Address *
                  </label>
                  <input
                    type="email"
                    name="registeredEmail"
                    value={formData.registeredEmail}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., info@company.com"
                    required
                  />
                </div>

                {/* Registered Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FaPhone className="inline mr-2" />
                    Registered Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="registeredPhone"
                    value={formData.registeredPhone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., +91 1234567890"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold"
              >
                {loading ? 'Creating...' : 'Create Company Profile'}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCompany;
