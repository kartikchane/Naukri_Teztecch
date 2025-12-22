import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../utils/api';
import { FaBuilding, FaMapMarkerAlt, FaUsers, FaCalendar, FaCheckCircle, FaGlobe, FaLinkedin, FaTwitter, FaFacebook, FaArrowLeft, FaBriefcase } from 'react-icons/fa';

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompanyDetails();
    fetchCompanyJobs();
  }, [id]);

  const fetchCompanyDetails = async () => {
    try {
      const { data } = await API.get(`/companies/${id}`);
      setCompany(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching company details:', error);
      setError('Failed to load company details');
      setLoading(false);
    }
  };

  const fetchCompanyJobs = async () => {
    try {
      const { data } = await API.get(`/jobs?company=${id}`);
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Error fetching company jobs:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaBuilding className="mx-auto text-6xl text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Company not found</h3>
          <Link to="/companies" className="text-blue-500 hover:text-blue-600">
            ← Back to Companies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link 
          to="/companies" 
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Companies
        </Link>

        {/* Company Header */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          {/* Cover Image/Banner */}
          <div className="h-48 bg-gradient-to-br from-blue-500 to-indigo-600"></div>
          
          {/* Company Info */}
          <div className="px-8 py-6">
            <div className="flex items-start -mt-24 mb-6">
              {/* Logo */}
              <div className="bg-white rounded-lg shadow-lg p-4 w-32 h-32 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                {company.logo && company.logo !== 'default-company-logo.png' ? (
                  <img 
                    src={company.logo} 
                    alt={company.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className={`text-5xl font-bold text-blue-600 ${company.logo && company.logo !== 'default-company-logo.png' ? 'hidden' : 'flex'}`}>
                  {company.name?.charAt(0)}
                </div>
              </div>

              {/* Company Name and Verified Badge */}
              <div className="ml-6 flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                  {company.verified && (
                    <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center text-sm">
                      <FaCheckCircle className="mr-1" />
                      Verified
                    </div>
                  )}
                </div>
                {company.industry && (
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-4 py-1 rounded-full">
                    {company.industry}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {company.location?.city && (
                <div className="flex items-center text-gray-600">
                  <FaMapMarkerAlt className="mr-2 text-gray-400" />
                  <span>
                    {company.location.city}
                    {company.location.state && `, ${company.location.state}`}
                    {company.location.country && `, ${company.location.country}`}
                  </span>
                </div>
              )}

              {company.companySize && (
                <div className="flex items-center text-gray-600">
                  <FaUsers className="mr-2 text-gray-400" />
                  <span>{company.companySize} employees</span>
                </div>
              )}

              {company.founded && (
                <div className="flex items-center text-gray-600">
                  <FaCalendar className="mr-2 text-gray-400" />
                  <span>Founded in {company.founded}</span>
                </div>
              )}
            </div>

            {/* Social Links */}
            {(company.socialLinks?.linkedin || company.socialLinks?.twitter || company.socialLinks?.facebook || company.website) && (
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <FaGlobe className="text-xl" />
                    <span className="text-sm">Website</span>
                  </a>
                )}
                {company.socialLinks?.linkedin && (
                  <a
                    href={company.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <FaLinkedin className="text-xl" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                )}
                {company.socialLinks?.twitter && (
                  <a
                    href={company.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-400 transition-colors"
                  >
                    <FaTwitter className="text-xl" />
                    <span className="text-sm">Twitter</span>
                  </a>
                )}
                {company.socialLinks?.facebook && (
                  <a
                    href={company.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors"
                  >
                    <FaFacebook className="text-xl" />
                    <span className="text-sm">Facebook</span>
                  </a>
                )}
              </div>
            )}

            {/* About Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About {company.name}</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {company.description}
              </p>
            </div>

            {/* Full Address */}
            {company.location?.address && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Location</h3>
                <div className="flex items-start text-gray-600">
                  <FaMapMarkerAlt className="mr-2 mt-1 text-gray-400" />
                  <div>
                    <p>{company.location.address}</p>
                    <p>
                      {company.location.city}
                      {company.location.state && `, ${company.location.state}`}
                      {company.location.zipCode && ` ${company.location.zipCode}`}
                    </p>
                    {company.location.country && <p>{company.location.country}</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Open Positions */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <FaBriefcase className="mr-2" />
              Open Positions
            </h2>
            <span className="text-gray-500">{jobs.length} {jobs.length === 1 ? 'job' : 'jobs'}</span>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No open positions at this time. Check back later!
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Link
                  key={job._id}
                  to={`/jobs/${job._id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                        {job.location && (
                          <span className="flex items-center">
                            <FaMapMarkerAlt className="mr-1" />
                            {typeof job.location === 'object' 
                              ? `${job.location.city || ''}${job.location.state ? ', ' + job.location.state : ''}${job.location.country ? ', ' + job.location.country : ''}`
                              : job.location
                            }
                          </span>
                        )}
                        {job.employmentType && (
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {job.employmentType}
                          </span>
                        )}
                        {job.experienceLevel && (
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
                            {job.experienceLevel}
                          </span>
                        )}
                      </div>
                    </div>
                    {job.salary && (
                      <div className="text-right">
                        <p className="text-lg font-semibold text-green-600">
                          ₹{(job.salary.min / 100000).toFixed(1)}–{(job.salary.max / 100000).toFixed(1)} LPA
                        </p>
                        <p className="text-xs text-gray-500">Lakhs per annum</p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
