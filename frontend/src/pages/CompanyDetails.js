import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../utils/api';
import { FaArrowLeft, FaBuilding } from 'react-icons/fa';
import CompanyHeader from '../components/CompanyHeader';
import CompanyOverview from '../components/CompanyOverview';
import CompanyJobs from '../components/CompanyJobs';
import CompanyReviews from '../components/CompanyReviews';

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    fetchCompanyDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCompanyDetails = async () => {
    try {
      const { data } = await API.get(`/companies/${id}`);
      setCompany(data);
      // Check if user is following (you can implement this with actual data later)
      setIsFollowing(false);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching company details:', error);
      setError('Failed to load company details');
      setLoading(false);
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

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'jobs', label: 'Jobs' },
    { id: 'reviews', label: 'Reviews' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/companies"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Companies
        </Link>

        {/* Company Header */}
        <CompanyHeader
          company={company}
          isFollowing={isFollowing}
          onFollowChange={setIsFollowing}
        />

        {/* Tab Navigation */}
        <div className="mt-8 bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'overview' && <CompanyOverview company={company} />}
          {activeTab === 'jobs' && <CompanyJobs companyId={company._id} />}
          {activeTab === 'reviews' && <CompanyReviews companyId={company._id} />}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
