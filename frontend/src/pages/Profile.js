import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCheckCircle,
  FaExclamationCircle,
  FaEdit
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user: authUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    skills: [],
    location: {
      city: '',
      state: '',
      country: ''
    }
  });
  const [completionData, setCompletionData] = useState({
    percentage: 0,
    completed: [],
    pending: []
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to view profile');
      navigate('/login');
      return;
    }
    fetchProfile();
  }, [isAuthenticated, navigate]);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/users/profile');
      setUser(data);
      calculateCompletion(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletion = (userData) => {
    const checks = [
      { name: 'Basic Info', field: userData.name && userData.email, weight: 10 },
      { name: 'Phone Number', field: userData.phone, weight: 10 },
      { name: 'Profile Photo', field: userData.avatar && userData.avatar !== 'default-avatar.png', weight: 10 },
      { name: 'Location', field: userData.location?.city, weight: 10 },
      { name: 'Bio', field: userData.bio, weight: 15 },
      { name: 'Skills', field: userData.skills?.length > 0, weight: 15 },
      { name: 'Resume', field: userData.resume, weight: 15 },
      { name: 'Experience', field: userData.experience?.length > 0, weight: 10 },
      { name: 'Education', field: userData.education?.length > 0, weight: 15 },
    ];

    const completed = checks.filter(check => check.field);
    const pending = checks.filter(check => !check.field);
    const calculatedPercentage = completed.reduce((sum, item) => sum + item.weight, 0);
    // Cap percentage at 100
    const percentage = Math.min(calculatedPercentage, 100);

    setCompletionData({
      percentage,
      completed: completed.map(c => c.name),
      pending: pending.map(p => ({ name: p.name, weight: p.weight }))
    });
  };

  const handleEditProfile = () => {
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      bio: user.bio || '',
      skills: user.skills || [],
      location: {
        city: user.location?.city || '',
        state: user.location?.state || '',
        country: user.location?.country || ''
      }
    });
    setIsEditModalOpen(true);
  };

  const handleInputChange = (e) => {
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
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setFormData(prev => ({
      ...prev,
      skills: skillsArray
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only PDF and DOC/DOCX files are allowed');
        return;
      }
      setResumeFile(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      // First update profile data
      const { data } = await API.put('/users/profile', formData);
      
      // Then upload resume if a new file was selected
      if (resumeFile) {
        const formDataFile = new FormData();
        formDataFile.append('resume', resumeFile);
        await API.post('/users/resume', formDataFile, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      }
      
      // Fetch updated profile
      const { data: updatedUser } = await API.get('/users/profile');
      setUser(updatedUser);
      calculateCompletion(updatedUser);
      setIsEditModalOpen(false);
      setResumeFile(null);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const getCompletionColor = () => {
    if (completionData.percentage >= 80) return 'bg-green-500';
    if (completionData.percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getCompletionTextColor = () => {
    if (completionData.percentage >= 80) return 'text-green-600';
    if (completionData.percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Profile Completion Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 mb-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">Profile Completion</h2>
                <p className="text-blue-100">
                  {completionData.percentage >= 80 
                    ? 'Excellent! Your profile is looking great 🎉' 
                    : completionData.percentage >= 50 
                    ? 'Good progress! Keep going 💪'
                    : 'Let\'s complete your profile to get better matches 🚀'
                  }
                </p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-bold">{completionData.percentage}%</div>
                <div className="text-sm text-blue-100">Complete</div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-3 mb-4">
              <div 
                className="bg-white h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionData.percentage}%` }}
              ></div>
            </div>

            {/* Pending Items */}
            {completionData.pending.length > 0 && (
              <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FaExclamationCircle />
                  Complete these to boost your profile:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {completionData.pending.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      <span>{item.name}</span>
                      <span className="text-xs opacity-75">(+{item.weight}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Information */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
              <button 
                onClick={handleEditProfile}
                className="btn-outline flex items-center gap-2"
              >
                <FaEdit /> Edit Profile
              </button>
            </div>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <FaUser className="text-gray-400" /> Full Name
                  </label>
                  <p className="text-lg font-medium text-gray-900">{user.name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <FaEnvelope className="text-gray-400" /> Email
                  </label>
                  <p className="text-lg font-medium text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <FaPhone className="text-gray-400" /> Phone
                  </label>
                  <p className="text-lg font-medium text-gray-900">{user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-gray-400" /> Location
                  </label>
                  <p className="text-lg font-medium text-gray-900">
                    {user.location?.city ? `${user.location.city}, ${user.location.state || user.location.country || ''}` : 'Not provided'}
                  </p>
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">About Me</label>
                  <p className="text-gray-700">{user.bio}</p>
                </div>
              )}

              {/* Skills */}
              {user.skills && user.skills.length > 0 && (
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span key={index} className="badge badge-blue">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6">
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="+91XXXXXXXXXX"
                  />
                </div>

                {/* Location */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="location.city"
                      value={formData.location.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g. NAGPUR"
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
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g. Maharashtra"
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
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g. India"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    About Me (Bio)
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.skills.join(', ')}
                    onChange={handleSkillsChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="e.g. React, mongoDb, JavaScript, Node.js"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Current: {formData.skills.length} skill{formData.skills.length !== 1 ? 's' : ''}
                  </p>
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume/CV
                  </label>
                  <div className="space-y-2">
                    {user.resume && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="flex-1">Current: {user.resume.split('/').pop()}</span>
                        <a 
                          href={`http://localhost:5000${user.resume}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View
                        </a>
                      </div>
                    )}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                    />
                    {resumeFile && (
                      <p className="text-sm text-green-600">
                        ✓ New file selected: {resumeFile.name}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Allowed formats: PDF, DOC, DOCX (Max size: 5MB)
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
