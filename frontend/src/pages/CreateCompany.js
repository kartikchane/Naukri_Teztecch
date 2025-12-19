import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';
import { FaBuilding, FaIndustry, FaMapMarkerAlt, FaGlobe, FaUsers, FaCalendar } from 'react-icons/fa';

const CreateCompany = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checkingCompany, setCheckingCompany] = useState(true);
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
    logo: '',
    specialties: ''
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
    const { name, value } = e.target;
    
    if (name.includes('.')) {
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
    if (!formData.location.city.trim()) {
      toast.error('City is required');
      return;
    }

    setLoading(true);

    try {
      // Convert specialties to array
      const specialtiesArray = formData.specialties 
        ? formData.specialties.split(',').map(s => s.trim()).filter(s => s)
        : [];

      const companyData = {
        ...formData,
        specialties: specialtiesArray,
        foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : undefined
      };

      const { data } = await API.post('/companies', companyData);
      
      toast.success('Company profile created successfully!');
      navigate('/post-job');
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

            {/* Logo URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Logo URL
              </label>
              <input
                type="url"
                name="logo"
                value={formData.logo}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/logo.png"
              />
              <p className="text-sm text-gray-500 mt-1">Provide a URL to your company logo image</p>
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
