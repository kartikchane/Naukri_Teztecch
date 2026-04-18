import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FaEdit, FaPlus, FaTrash, FaImage, FaSave, FaTimes,
  FaGlobe, FaMapMarkerAlt, FaPhone, FaEnvelope, FaLinkedin,
  FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaCheckCircle
} from 'react-icons/fa';
import API from '../utils/api';
import { toast } from 'react-toastify';

const ManageCompany = () => {
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('basic');
  const [editing, setEditing] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [newBenefit, setNewBenefit] = useState('');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    industry: '',
    companySize: '',
    founded: '',
    specialties: [],
    benefits: [],
    cultureTags: [],
    location: { city: '', state: '', country: '', address: '' },
    socialLinks: { linkedin: '', twitter: '', facebook: '', instagram: '', youtube: '' }
  });

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const { data } = await API.get('/companies/my-company');
      setCompany(data);
      setFormData({
        name: data.name || '',
        description: data.description || '',
        website: data.website || '',
        industry: data.industry || '',
        companySize: data.companySize || '',
        founded: data.founded || '',
        specialties: data.specialties || [],
        benefits: data.benefits || [],
        cultureTags: data.cultureTags || [],
        location: data.location || { city: '', state: '', country: '', address: '' },
        socialLinks: data.socialLinks || { linkedin: '', twitter: '', facebook: '', instagram: '', youtube: '' }
      });
    } catch (error) {
      toast.error('Failed to load company data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: { ...prev.location, [name]: value }
    }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [name]: value }
    }));
  };

  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }));
      setNewBenefit('');
    }
  };

  const handleRemoveBenefit = (index) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }));
  };

  const handleAddSpecialty = (specialty) => {
    if (specialty.trim() && !formData.specialties.includes(specialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty.trim()]
      }));
    }
  };

  const handleRemoveSpecialty = (index) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }));
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingPhotos(true);
    try {
      for (const file of files) {
        const formDataFile = new FormData();
        formDataFile.append('photo', file);

        const { data } = await API.post(`/gallery/company/${company._id}`, formDataFile, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        setCompany(prev => ({
          ...prev,
          companyPhotos: [...(prev.companyPhotos || []), data.photo]
        }));
      }
      toast.success('Photos uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload photos');
      console.error(error);
    } finally {
      setUploadingPhotos(false);
    }
  };

  const handleDeletePhoto = async (photo) => {
    try {
      await API.delete(`/gallery/photo/${encodeURIComponent(photo)}`);
      setCompany(prev => ({
        ...prev,
        companyPhotos: prev.companyPhotos.filter(p => p !== photo)
      }));
      toast.success('Photo deleted');
    } catch (error) {
      toast.error('Failed to delete photo');
    }
  };

  const handleSave = async () => {
    try {
      const { data } = await API.put(`/companies/${company._id}`, formData);
      setCompany(data);
      setEditing(false);
      toast.success('Company updated successfully');
    } catch (error) {
      toast.error('Failed to update company');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">No Company Found</h1>
          <p className="text-gray-600 mb-6">You need to create a company profile first</p>
          <button
            onClick={() => navigate('/create-company')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Create Company
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Manage Company</h1>
            <p className="text-gray-600 mt-2">{company.name}</p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition ${
              editing
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {editing ? (
              <>
                <FaTimes /> Cancel
              </>
            ) : (
              <>
                <FaEdit /> Edit Profile
              </>
            )}
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            {['basic', 'gallery', 'benefits', 'location', 'social'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* Basic Information */}
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
                    <input
                      type="text"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Company Size</label>
                    <select
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="201-500">201-500</option>
                      <option value="501-1000">501-1000</option>
                      <option value="1000+">1000+</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Founded Year</label>
                    <input
                      type="number"
                      name="founded"
                      value={formData.founded}
                      onChange={handleInputChange}
                      disabled={!editing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    disabled={!editing}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                  />
                </div>

                {editing && (
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
                  >
                    <FaSave /> Save Changes
                  </button>
                )}
              </div>
            )}

            {/* Gallery */}
            {activeTab === 'gallery' && (
              <div className="space-y-6">
                {editing && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      disabled={uploadingPhotos}
                      className="hidden"
                      id="photoUpload"
                    />
                    <label
                      htmlFor="photoUpload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <FaImage className="text-4xl text-gray-400" />
                      <span className="text-lg font-medium text-gray-700">Click to upload photos</span>
                      <span className="text-sm text-gray-500">or drag and drop</span>
                    </label>
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-6">
                  {company.companyPhotos && company.companyPhotos.map((photo, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={`http://localhost:5000/${photo}`}
                        alt="Company"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {editing && (
                        <button
                          onClick={() => handleDeletePhoto(photo)}
                          className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Benefits */}
            {activeTab === 'benefits' && (
              <div className="space-y-6">
                {editing && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddBenefit()}
                      placeholder="Enter a benefit and press Enter"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={handleAddBenefit}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                    >
                      <FaPlus /> Add
                    </button>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  {formData.benefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex justify-between items-center"
                    >
                      <span className="font-medium text-gray-900">{benefit}</span>
                      {editing && (
                        <button
                          onClick={() => handleRemoveBenefit(idx)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            {activeTab === 'location' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.location.address}
                      onChange={handleLocationChange}
                      disabled={!editing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.location.city}
                      onChange={handleLocationChange}
                      disabled={!editing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.location.state}
                      onChange={handleLocationChange}
                      disabled={!editing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.location.country}
                      onChange={handleLocationChange}
                      disabled={!editing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {editing && (
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
                  >
                    <FaSave /> Save Changes
                  </button>
                )}
              </div>
            )}

            {/* Social Links */}
            {activeTab === 'social' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaLinkedin className="text-blue-600" /> LinkedIn
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.socialLinks.linkedin}
                      onChange={handleSocialChange}
                      disabled={!editing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaTwitter className="text-blue-400" /> Twitter
                    </label>
                    <input
                      type="url"
                      name="twitter"
                      value={formData.socialLinks.twitter}
                      onChange={handleSocialChange}
                      disabled={!editing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaFacebook className="text-blue-600" /> Facebook
                    </label>
                    <input
                      type="url"
                      name="facebook"
                      value={formData.socialLinks.facebook}
                      onChange={handleSocialChange}
                      disabled={!editing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <FaInstagram className="text-pink-600" /> Instagram
                    </label>
                    <input
                      type="url"
                      name="instagram"
                      value={formData.socialLinks.instagram}
                      onChange={handleSocialChange}
                      disabled={!editing}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <FaYoutube className="text-red-600" /> YouTube
                  </label>
                  <input
                    type="url"
                    name="youtube"
                    value={formData.socialLinks.youtube}
                    onChange={handleSocialChange}
                    disabled={!editing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100"
                  />
                </div>

                {editing && (
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
                  >
                    <FaSave /> Save Changes
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageCompany;
