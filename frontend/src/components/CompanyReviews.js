import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import API from '../utils/api';

const CompanyReviews = ({ companyId }) => {
  const [ratings, setRatings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRatings();
  }, [companyId]);

  const fetchRatings = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/companies/${companyId}/rating-summary`);
      setRatings(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching ratings:', err);
      setError('Failed to load ratings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading ratings...</div>;
  }

  if (error || !ratings) {
    return <div className="text-center py-8 text-red-600">{error || 'Failed to load ratings'}</div>;
  }

  const ratingCategories = [
    { key: 'salary', label: 'Salary & Benefits', icon: '💰' },
    { key: 'culture', label: 'Company Culture', icon: '🏢' },
    { key: 'growth', label: 'Skill Development', icon: '📈' },
    { key: 'security', label: 'Job Security', icon: '🔒' },
    { key: 'satisfaction', label: 'Work Satisfaction', icon: '😊' },
    { key: 'worklife', label: 'Work Life Balance', icon: '⚖️' },
    { key: 'benefits', label: 'Senior Employee Perks', icon: '🎁' },
  ];

  const StarRating = ({ rating }) => {
    const numRating = parseFloat(rating) || 0;
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`text-lg ${
                i < Math.round(numRating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="font-bold text-gray-900 w-8">{numRating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Overall Rating Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Overall Ratings</h3>
        <div className="flex items-center gap-8">
          <div>
            <div className="text-6xl font-bold text-blue-600">
              {ratings?.overallRating || 0}
            </div>
            <div className="flex gap-1 mt-2">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-2xl ${
                    i < Math.round(ratings?.overallRating || 0)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600 mt-2">{ratings?.totalReviews || 0} reviews</p>
          </div>
          <div className="text-gray-600 text-sm flex-1">
            <p>Based on aggregated data from job postings, salary ranges, and company information.</p>
          </div>
        </div>
      </div>

      {/* Rating Categories */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Employee Speaks</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {ratingCategories.map((category) => {
            const rating = ratings?.categoryRatings?.[category.key] || 0;
            return (
              <div key={category.key} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-semibold text-gray-900">{category.label}</span>
                </div>
                <StarRating rating={rating} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Reviews by Job Profile Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Reviews by Job Profile</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-3 border-b">
            <span className="text-gray-700">Project Lead</span>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < 4 ? 'text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="font-bold">4.6</span>
              <span className="text-gray-600 text-sm">(4)</span>
            </div>
          </div>
          <div className="flex items-center justify-between pb-3 border-b">
            <span className="text-gray-700">Financial Analyst</span>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < 4 ? 'text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="font-bold">4.5</span>
              <span className="text-gray-600 text-sm">(6)</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Team Manager</span>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < 4 ? 'text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="font-bold">4.4</span>
              <span className="text-gray-600 text-sm">(5)</span>
            </div>
          </div>
        </div>
        <button className="mt-4 text-blue-600 font-semibold hover:text-blue-700">
          View all reviews →
        </button>
      </div>

      {/* Review Call-to-Action */}
      <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6 text-center">
        <h4 className="text-lg font-bold text-gray-900 mb-2">Help Candidates</h4>
        <p className="text-gray-600 mb-4">
          Share your experience working here to help job seekers make better decisions
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
          Write a review
        </button>
      </div>
    </div>
  );
};

export default CompanyReviews;
