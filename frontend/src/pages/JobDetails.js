import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import { toast } from 'react-toastify';
import ApplyModal from '../components/ApplyModal';
import {
  FaMapMarkerAlt,
  FaBriefcase,
  FaRupeeSign,
  FaClock,
  FaBuilding,
  FaBookmark,
  FaRegBookmark,
  FaShareAlt,
  FaTimes,
  FaCheckCircle,
  FaWhatsapp,
  FaLinkedin,
  FaTwitter,
  FaEye,
} from 'react-icons/fa';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJob();
    trackView();
    // Check if apply action is in URL
    if (searchParams.get('action') === 'apply') {
      if (!isAuthenticated) {
        toast.info('Please login to apply for this job');
        navigate('/login', { state: { from: `/jobs/${id}?action=apply` } });
      } else {
        setShowApplyModal(true);
      }
    }
  }, [id, searchParams, isAuthenticated]);

  const trackView = async () => {
    try {
      // Check if this job was viewed in the last 24 hours
      const viewedJobsKey = 'viewedJobs';
      const viewedJobs = JSON.parse(localStorage.getItem(viewedJobsKey) || '{}');
      const now = Date.now();
      const oneDayInMs = 24 * 60 * 60 * 1000; // 24 hours

      // Check if job was recently viewed
      if (viewedJobs[id] && (now - viewedJobs[id]) < oneDayInMs) {
        // Already viewed within 24 hours, don't track again
        return;
      }

      // Track the view
      await API.post(`/jobs/${id}/view`);
      
      // Update localStorage with current timestamp
      viewedJobs[id] = now;
      
      // Clean up old entries (older than 30 days)
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
      Object.keys(viewedJobs).forEach(jobId => {
        if (now - viewedJobs[jobId] > thirtyDaysInMs) {
          delete viewedJobs[jobId];
        }
      });
      
      localStorage.setItem(viewedJobsKey, JSON.stringify(viewedJobs));
    } catch (error) {
      // Silent fail - view tracking shouldn't affect UX
      console.error('Failed to track view:', error);
    }
  };

  const fetchJob = async () => {
    try {
      const { data } = await API.get(`/jobs/${id}`);
      setJob(data);
      // fetch related jobs by same category (domain-specific)
      if (data?.category) {
        fetchRelated(data.category, data._id);
      }
      // Check if job is saved and if user has applied
      if (isAuthenticated && user?.role === 'jobseeker') {
        try {
          const { data: userData } = await API.get('/users/profile');
          setIsSaved(userData.savedJobs?.some(savedJob => 
            (typeof savedJob === 'string' ? savedJob : savedJob._id) === id
          ));
          
          // Check if user has already applied
          const { data: applicationsData } = await API.get('/applications/my');
          console.log('My Applications:', applicationsData);
          const alreadyApplied = applicationsData.applications?.some(app => {
            const jobId = typeof app.job === 'string' ? app.job : app.job?._id;
            console.log('Comparing:', jobId, 'with', id);
            return jobId === id;
          });
          console.log('Has Applied:', alreadyApplied);
          setHasApplied(alreadyApplied);
        } catch (error) {
          console.error('Failed to check saved status:', error);
        }
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Job not found');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelated = async (category, currentJobId) => {
    try {
      const { data } = await API.get('/jobs', { params: { category, limit: 12 } });
      // Ensure returned jobs match the requested category (backend should filter, but double-check on frontend)
      const jobs = (data.jobs || [])
        .filter(j => j.category === category)
        .filter(j => j._id !== currentJobId)
        .slice(0, 5);
      setRelatedJobs(jobs);
    } catch (err) {
      console.error('Failed to fetch related jobs:', err);
    }
  };

  const handleSaveJob = async () => {
    if (saving) return;
    
    try {
      setSaving(true);
      const { data } = await API.post(`/users/save-job/${id}`);
      setIsSaved(data.saved);
      toast.success(data.message);
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

  const handleShare = (platform) => {
    const jobUrl = window.location.href;
    const jobTitle = encodeURIComponent(job.title);
    const companyName = encodeURIComponent(job.company?.name || 'Unknown Company');
    const text = encodeURIComponent(`Check out this job: ${job.title} at ${job.company?.name || 'Unknown Company'}`);
    
    let shareUrl = '';
    
    switch(platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${text}%20${encodeURIComponent(jobUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(jobUrl)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank', 'width=600,height=400');
    setShowShareModal(false);
    toast.success('Opening share dialog...');
  };

  const copyJobLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Job link copied to clipboard!');
    setShowShareModal(false);
  };

  const handleApplySuccess = () => {
    // Update hasApplied state after successful application
    setHasApplied(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!job) return null;

  const formatSalary = () => {
    return `₹${job.salary.min / 100000}–${job.salary.max / 100000} LPA`;
  };

  const formatExperience = () => {
    return `${job.experience.min}–${job.experience.max} years`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Job Header */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center overflow-hidden p-1">
                  {job.company?.logo ? (
                    <>
                      <img 
                        src={job.company.logo} 
                        alt={job.company.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <span className="hidden text-2xl font-bold text-blue-600">
                        {job.company?.name?.charAt(0)}
                      </span>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-blue-600">
                      {job.company?.name?.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <p className="text-xl text-gray-700">{job.company?.name}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={handleSaveJob}
                  disabled={saving}
                  className="p-2 text-gray-600 hover:text-primary disabled:opacity-50"
                  title={isSaved ? 'Remove from saved jobs' : 'Save this job'}
                >
                  {isSaved ? (
                    <FaBookmark size={20} className="text-primary" />
                  ) : (
                    <FaRegBookmark size={20} />
                  )}
                </button>
                <button 
                  onClick={() => setShowShareModal(true)}
                  className="p-2 text-gray-600 hover:text-primary"
                  title="Share this job"
                >
                  <FaShareAlt size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Location</p>
                <p className="font-semibold flex items-center">
                  <FaMapMarkerAlt className="mr-1" />
                  {job.location.city}, {job.location.state}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Experience</p>
                <p className="font-semibold flex items-center">
                  <FaBriefcase className="mr-1" />
                  {formatExperience()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Salary</p>
                <p className="font-semibold flex items-center">
                  <FaRupeeSign className="mr-1" />
                  {formatSalary()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                  <FaEye className="text-gray-400" />
                  Views
                </p>
                <p className="font-semibold">
                  {job.views || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Posted</p>
                <p className="font-semibold flex items-center">
                  <FaClock className="mr-1" />
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className={`badge ${job.workMode === 'Remote' ? 'badge-green' : 'badge-purple'}`}>
                {job.workMode}
              </span>
              <span className="badge badge-orange">{job.employmentType}</span>
              <span className="badge badge-blue">{job.category}</span>
            </div>

            {user?.role !== 'employer' && (
              hasApplied ? (
                <button
                  disabled
                  className="w-full md:w-auto px-8 py-3 bg-green-100 text-green-700 font-semibold rounded-lg flex items-center justify-center gap-2 cursor-not-allowed"
                >
                  <FaCheckCircle />
                  Already Applied
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.info('Please login to apply for this job');
                      navigate('/login', { state: { from: `/jobs/${id}?action=apply` } });
                    } else {
                      setShowApplyModal(true);
                    }
                  }}
                  className="btn-primary w-full md:w-auto px-8"
                >
                  Apply Now
                </button>
              )
            )}
          </div>

          {/* Job Description */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>

          {/* Skills Required */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <h2 className="text-2xl font-bold mb-4">Skills Required</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <span key={index} className="badge badge-blue text-base">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-8 mb-6">
              <h2 className="text-2xl font-bold mb-4">Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {job.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-8 mb-6">
              <h2 className="text-2xl font-bold mb-4">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {job.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Company Info */}
          {job.company && (
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold mb-4">About {job.company.name}</h2>
              <p className="text-gray-700 mb-4">{job.company.description}</p>
              {job.company.website && (
                <a
                  href={job.company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Visit company website →
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Share this job</h2>

            <div className="space-y-3">
              <button
                onClick={() => handleShare('whatsapp')}
                className="w-full flex items-center gap-4 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <FaWhatsapp className="text-2xl text-green-600" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">WhatsApp</div>
                  <div className="text-sm text-gray-600">Share via WhatsApp</div>
                </div>
              </button>

              <button
                onClick={() => handleShare('linkedin')}
                className="w-full flex items-center gap-4 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
              >
                <FaLinkedin className="text-2xl text-blue-600" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">LinkedIn</div>
                  <div className="text-sm text-gray-600">Share on LinkedIn</div>
                </div>
              </button>

              <button
                onClick={() => handleShare('twitter')}
                className="w-full flex items-center gap-4 p-4 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
              >
                <FaTwitter className="text-2xl text-sky-500" />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Twitter</div>
                  <div className="text-sm text-gray-600">Share on Twitter</div>
                </div>
              </button>

              <button
                onClick={copyJobLink}
                className="w-full p-4 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition-colors"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}

            {/* Related jobs (same domain/category) */}
          {relatedJobs && relatedJobs.length > 0 && (
            <div className="max-w-4xl mx-auto mt-6">
              <h2 className="text-2xl font-bold mb-4">More {job.category} jobs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedJobs.map(rj => (
                  <div key={rj._id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <a href={`/jobs/${rj._id}`} className="text-lg font-semibold text-gray-900 hover:text-primary">{rj.title}</a>
                        <div className="text-sm text-gray-600">{rj.company?.name}</div>
                        <div className="text-sm text-gray-500 mt-2">{rj.location?.city || 'Location not specified'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">{rj.employmentType}</div>
                        <div className="text-sm font-semibold text-gray-900">{rj.views || 0} views</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

      {/* Apply Modal */}
      <ApplyModal 
        job={job} 
        isOpen={showApplyModal} 
        onClose={() => setShowApplyModal(false)}
        onApplySuccess={handleApplySuccess}
      />
    </div>
  );
};

export default JobDetails;
