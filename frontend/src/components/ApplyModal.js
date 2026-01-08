import React, { useState } from 'react';
import { FaTimes, FaPaperclip, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { toast } from 'react-toastify';

const ApplyModal = ({ job, isOpen, onClose, onApplySuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [applying, setApplying] = useState(false);
  const [formData, setFormData] = useState({
    coverLetter: '',
    resume: null,
    phone: user?.phone || '',
    email: user?.email || '',
    experience: '',
    currentCTC: '',
    expectedCTC: '',
    noticePeriod: '',
  });
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
      setFormData({ ...formData, resume: file });
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to apply');
      navigate('/login');
      return;
    }

    if (!formData.coverLetter.trim()) {
      toast.error('Please write a cover letter');
      return;
    }

    setApplying(true);

    try {
      const submitData = new FormData();
      submitData.append('jobId', job._id);
      submitData.append('coverLetter', formData.coverLetter);
      submitData.append('phone', formData.phone);
      submitData.append('email', formData.email);
      submitData.append('experience', formData.experience);
      submitData.append('currentCTC', formData.currentCTC);
      submitData.append('expectedCTC', formData.expectedCTC);
      submitData.append('noticePeriod', formData.noticePeriod);
      
      if (formData.resume) {
        submitData.append('resume', formData.resume);
      }

      await API.post('/applications', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Application submitted successfully!');
      
      // Call the success callback to update parent component
      if (onApplySuccess) {
        onApplySuccess();
      }
      
      onClose();
      setFormData({
        coverLetter: '',
        resume: null,
        phone: user?.phone || '',
        email: user?.email || '',
        experience: '',
        currentCTC: '',
        expectedCTC: '',
        noticePeriod: '',
      });
      setFileName('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Apply for Position</h2>
            <p className="text-sm opacity-90 mt-1">{job.title} at {job.company?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Personal Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input-field"
                placeholder="+91 1234567890"
              />
            </div>
          </div>

          {/* Professional Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Experience (Years)
              </label>
              <input
                type="number"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="input-field"
                placeholder="e.g., 3"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notice Period (Days)
              </label>
              <input
                type="number"
                value={formData.noticePeriod}
                onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                className="input-field"
                placeholder="e.g., 30"
                min="0"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current CTC (LPA)
              </label>
              <input
                type="number"
                value={formData.currentCTC}
                onChange={(e) => setFormData({ ...formData, currentCTC: e.target.value })}
                className="input-field"
                placeholder="e.g., 6"
                min="0"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected CTC (LPA)
              </label>
              <input
                type="number"
                value={formData.expectedCTC}
                onChange={(e) => setFormData({ ...formData, expectedCTC: e.target.value })}
                className="input-field"
                placeholder="e.g., 8"
                min="0"
                step="0.1"
              />
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.coverLetter}
              onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
              rows="6"
              className="input-field resize-none"
              placeholder="Tell us why you're a great fit for this position..."
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              {formData.coverLetter.length}/500 characters
            </p>
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Resume (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
              <input
                type="file"
                id="resume"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="resume" className="cursor-pointer">
                <FaPaperclip className="mx-auto text-gray-400 text-3xl mb-2" />
                {fileName ? (
                  <p className="text-sm text-green-600 font-medium flex items-center justify-center">
                    <FaCheckCircle className="mr-2" /> {fileName}
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX (Max 5MB)
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={applying}
              className="btn-primary px-8 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {applying ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyModal;
