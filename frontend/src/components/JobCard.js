import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaBriefcase, FaClock, FaRupeeSign, FaBookmark, FaRegBookmark, FaExclamationCircle } from 'react-icons/fa';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const JobCard = ({ job, onSave, isSaved: initialSaved }) => {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const formatSalary = (min, max) => {
    return `₹${(min / 100000).toFixed(1)}–${(max / 100000).toFixed(1)} LPA`;
  };

  const formatExperience = (min, max) => {
    return `${min}–${max} yrs`;
  };

  const isNewJob = () => {
    const jobDate = new Date(job.createdAt || job.postedAt || job.postedDate);
    const now = new Date();
    const diffInDays = (now - jobDate) / (1000 * 60 * 60 * 24);
    return diffInDays <= 7; // Job posted within last 7 days
  };

  const getDaysLeft = () => {
    if (!job.applicationDeadline) return null;
    const deadline = new Date(job.applicationDeadline);
    const now = new Date();
    const diffInDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    return diffInDays;
  };

  const handleSaveJob = async () => {
    if (saving) return;
    
    try {
      setSaving(true);
      const { data } = await API.post(`/users/save-job/${job._id}`);
      setIsSaved(data.saved);
      toast.success(data.message);
      if (onSave) onSave(job._id);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Please login to save jobs');
      } else {
        toast.error('Failed to save job');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleApplyClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast.info('Please login to apply for this job');
      navigate('/login', { state: { from: `/jobs/${job._id}?action=apply` } });
    }
  };

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 p-4 md:p-6 lg:p-8 relative group h-full flex flex-col">
      {/* Bookmark Icon - Top Right */}
      <button
        onClick={handleSaveJob}
        disabled={saving}
        className="absolute top-3 right-3 md:top-6 md:right-6 text-gray-400 hover:text-yellow-500 transition-colors z-10 disabled:opacity-50 disabled:cursor-not-allowed"
        title={isSaved ? "Remove from saved" : "Save job"}
      >
        {isSaved ? <FaBookmark size={18} className="text-yellow-500 md:w-5 md:h-5" /> : <FaRegBookmark size={18} className="md:w-5 md:h-5" />}
      </button>

      {/* Company Logo & Basic Info */}
      <div className="flex items-start space-x-3 md:space-x-5 mb-4 md:mb-5">
        <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl md:rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm border border-gray-200">
          {job.company?.logo ? (
            <img 
              src={job.company.logo} 
              alt={job.company.name} 
              className="w-full h-full object-contain p-2" 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <span className={`text-xl md:text-3xl font-bold text-indigo-600 ${job.company?.logo ? 'hidden' : 'flex'}`}>
            {job.company?.name?.charAt(0)}
          </span>
        </div>

        <div className="flex-1 min-w-0 pr-8 md:pr-10">
          <Link to={`/jobs/${job._id}`} className="block group-hover:text-blue-600 transition-colors">
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-1 md:mb-2 line-clamp-2 leading-tight">{job.title}</h3>
          </Link>
          <p className="text-gray-600 font-medium text-sm md:text-base">{job.company?.name}</p>
        </div>
      </div>

      {/* Job Meta Info */}
      <div className="flex flex-wrap gap-x-3 md:gap-x-5 gap-y-2 text-xs md:text-sm text-gray-600 mb-4 md:mb-5">
        <span className="flex items-center">
          <FaMapMarkerAlt className="mr-1.5 text-gray-400" />
          <span className="font-medium">{job.location.city}, {job.location.state}</span>
        </span>
        <span className="flex items-center">
          <FaBriefcase className="mr-1.5 text-gray-400" />
          <span className="font-medium">{formatExperience(job.experience.min, job.experience.max)}</span>
        </span>
        <span className="flex items-center text-green-600 font-semibold">
          <FaRupeeSign className="mr-1" />
          {formatSalary(job.salary.min, job.salary.max)}
        </span>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 md:gap-2 mb-4 md:mb-5">
        {job.skills.slice(0, 5).map((skill, index) => {
          const colors = [
            'bg-blue-100 text-blue-700',
            'bg-indigo-100 text-indigo-700',
            'bg-purple-100 text-purple-700',
            'bg-pink-100 text-pink-700',
            'bg-blue-50 text-blue-600'
          ];
          return (
            <span key={index} className={`px-2 py-1 md:px-3 md:py-1.5 ${colors[index % colors.length]} rounded-md text-xs md:text-sm font-medium`}>
              {skill}
            </span>
          );
        })}
        {job.skills.length > 5 && (
          <span className="px-2 py-1 md:px-3 md:py-1.5 bg-gray-100 text-gray-600 rounded-md text-xs md:text-sm font-medium">
            +{job.skills.length - 5} more
          </span>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap items-center gap-1.5 md:gap-2 mb-4 md:mb-6">
        <span className={`px-3 py-1.5 text-xs font-semibold rounded-md ${
          job.workMode === 'Remote' 
            ? 'bg-green-50 text-green-700' 
            : job.workMode === 'Hybrid'
            ? 'bg-purple-50 text-purple-700'
            : 'bg-blue-50 text-blue-700'
        }`}>
          {job.workMode}
        </span>
        <span className="px-3 py-1.5 text-xs font-semibold rounded-md bg-orange-50 text-orange-700">
          {job.employmentType}
        </span>
        {job.featured && (
          <span className="px-3 py-1.5 text-xs font-semibold rounded-md bg-yellow-50 text-yellow-700">
            Featured
          </span>
        )}
      </div>

      {/* Footer - Posted Time & Action Buttons */}
      <div className="mt-auto pt-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center text-sm text-gray-500">
            <FaClock className="mr-2" />
            <span>Posted {new Date(job.createdAt).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}</span>
          </div>
        </div>
        <div className="flex gap-3">
          <Link 
            to={`/jobs/${job._id}`} 
            className="flex-1 px-5 py-3 text-sm font-semibold text-blue-600 bg-white hover:bg-gray-50 rounded-lg transition-colors border-2 border-blue-600 text-center"
          >
            View Details
          </Link>
          {/* Only show Apply button for authenticated job seekers */}
          {isAuthenticated && user?.role === 'jobseeker' ? (
            job.hasApplied ? (
              <button 
                disabled 
                className="flex-1 px-5 py-3 text-sm font-semibold bg-green-600 text-white rounded-lg cursor-not-allowed text-center"
              >
                Applied
              </button>
            ) : (
              <Link 
                to={`/jobs/${job._id}?action=apply`}
                onClick={handleApplyClick}
                className="flex-1 px-5 py-3 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors shadow-sm hover:shadow-md text-center"
              >
                Apply Now
              </Link>
            )
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
