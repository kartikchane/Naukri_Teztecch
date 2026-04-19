import React, { useEffect, useState, useCallback } from 'react';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import API from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CompanyReviews = ({ companyId }) => {
  const { isAuthenticated } = useAuth();
  const [ratings, setRatings] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    jobTitle: '',
    overallRating: 4,
    salary: 4,
    culture: 4,
    growth: 4,
    security: 4,
    satisfaction: 4,
    worklife: 4,
    benefits: 4,
    reviewText: '',
    pros: '',
    cons: ''
  });

  const fetchRatingsAndReviews = useCallback(async () => {
    setLoading(true);
    try {
      const ratingsRes = await API.get(`/companies/${companyId}/rating-summary`);
      const reviewsRes = await API.get(`/companies/${companyId}/reviews?page=1&limit=5`);

      setRatings(ratingsRes.data);
      setReviews(reviewsRes.data.reviews || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchRatingsAndReviews();
  }, [fetchRatingsAndReviews]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      return;
    }

    if (formData.reviewText.length < 10) {
      toast.error('Review must be at least 10 characters');
      return;
    }

    setSubmitting(true);
    try {
      await API.post(`/companies/${companyId}/reviews`, {
        jobTitle: formData.jobTitle,
        overallRating: parseInt(formData.overallRating),
        categoryRatings: {
          salary: parseInt(formData.salary),
          culture: parseInt(formData.culture),
          growth: parseInt(formData.growth),
          security: parseInt(formData.security),
          satisfaction: parseInt(formData.satisfaction),
          worklife: parseInt(formData.worklife),
          benefits: parseInt(formData.benefits)
        },
        reviewText: formData.reviewText,
        pros: formData.pros ? formData.pros.split(',').map(p => p.trim()) : [],
        cons: formData.cons ? formData.cons.split(',').map(c => c.trim()) : []
      });

      toast.success('Review submitted! It will be published after admin approval.');
      setShowForm(false);
      setFormData({
        jobTitle: '',
        overallRating: 4,
        salary: 4,
        culture: 4,
        growth: 4,
        security: 4,
        satisfaction: 4,
        worklife: 4,
        benefits: 4,
        reviewText: '',
        pros: '',
        cons: ''
      });
      await fetchRatingsAndReviews();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit review';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

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
        <span className="font-bold text-gray-900">{numRating.toFixed(1)}</span>
      </div>
    );
  };

  const RatingInput = ({ name, label, value, onChange }) => {
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => onChange({ target: { name, value: num } })}
              className={`p-2 rounded transition ${
                parseInt(value) === num
                  ? 'bg-yellow-400 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <FaStar />
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-8">Loading ratings...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchRatingsAndReviews}
          className="mt-4 px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Rating Section */}
      {ratings && (
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-6 border border-teal-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Overall Ratings</h3>
          <div className="flex items-center gap-8">
            <div>
              <div className="text-6xl font-bold text-teal-600">
                {ratings?.overallRating || 'N/A'}
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
              <p>Based on actual employee reviews from our community.</p>
            </div>
          </div>
        </div>
      )}

      {/* Rating Categories */}
      {ratings && ratings.categoryRatings && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">Employee Experience</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries({
              salary: { label: 'Salary & Benefits', icon: '💰' },
              culture: { label: 'Company Culture', icon: '🏢' },
              growth: { label: 'Skill Development', icon: '📈' },
              security: { label: 'Job Security', icon: '🔒' },
              satisfaction: { label: 'Work Satisfaction', icon: '😊' },
              worklife: { label: 'Work Life Balance', icon: '⚖️' },
            }).map(([key, { label, icon }]) => (
              <div key={key} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">{icon}</span>
                  <span className="font-semibold text-gray-900">{label}</span>
                </div>
                <StarRating rating={ratings.categoryRatings[key]} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Reviews</h3>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="border-b pb-6 last:border-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{review.reviewedBy?.name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">{review.jobTitle}</p>
                  </div>
                  <StarRating rating={review.overallRating} />
                </div>
                <p className="text-gray-700 mb-3">{review.reviewText}</p>
                {(review.pros?.length > 0 || review.cons?.length > 0) && (
                  <div className="grid md:grid-cols-2 gap-4 mb-3 text-sm">
                    {review.pros?.length > 0 && (
                      <div className="bg-green-50 p-3 rounded border border-green-200">
                        <p className="font-semibold text-green-900 mb-1">👍 Pros:</p>
                        <ul className="text-green-700">
                          {review.pros.map((pro, i) => (
                            <li key={i}>• {pro}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {review.cons?.length > 0 && (
                      <div className="bg-red-50 p-3 rounded border border-red-200">
                        <p className="font-semibold text-red-900 mb-1">👎 Cons:</p>
                        <ul className="text-red-700">
                          {review.cons.map((con, i) => (
                            <li key={i}>• {con}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-xs text-gray-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Write Review Section */}
      <div className="bg-teal-50 border-l-4 border-teal-600 rounded-lg p-6">
        {showForm ? (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <h4 className="text-lg font-bold text-gray-900">Share Your Experience</h4>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                required
                placeholder="e.g., Software Engineer, Product Manager"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <RatingInput
              name="overallRating"
              label="Overall Rating *"
              value={formData.overallRating}
              onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <RatingInput
                name="salary"
                label="Salary & Benefits"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              />
              <RatingInput
                name="culture"
                label="Company Culture"
                value={formData.culture}
                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              />
              <RatingInput
                name="growth"
                label="Skill Development"
                value={formData.growth}
                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              />
              <RatingInput
                name="security"
                label="Job Security"
                value={formData.security}
                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              />
              <RatingInput
                name="satisfaction"
                label="Work Satisfaction"
                value={formData.satisfaction}
                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              />
              <RatingInput
                name="worklife"
                label="Work Life Balance"
                value={formData.worklife}
                onChange={(e) => setFormData({ ...formData, [e.target.name]: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Review *</label>
              <textarea
                name="reviewText"
                value={formData.reviewText}
                onChange={(e) => setFormData({ ...formData, reviewText: e.target.value })}
                required
                placeholder="Share your experience... (min 10 characters)"
                minLength="10"
                maxLength="1000"
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.reviewText.length}/1000</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pros (comma separated)</label>
              <input
                type="text"
                name="pros"
                value={formData.pros}
                onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
                placeholder="e.g., Good work culture, Flexible hours, Great team"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cons (comma separated)</label>
              <input
                type="text"
                name="cons"
                value={formData.cons}
                onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
                placeholder="e.g., Long hours, Limited benefits, Slow growth"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 disabled:bg-gray-400"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
            <p className="text-xs text-gray-600">Your review will be published after admin approval</p>
          </form>
        ) : (
          <div className="text-center">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Help Other Job Seekers</h4>
            <p className="text-gray-700 mb-4">
              Share your experience working here to help candidates make better decisions
            </p>
            {isAuthenticated ? (
              <button
                onClick={() => setShowForm(true)}
                className="bg-teal-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-teal-700 transition"
              >
                Write a Review
              </button>
            ) : (
              <p className="text-gray-600">Please login to write a review</p>
            )}
          </div>
        )}
      </div>

      {/* No reviews message */}
      {reviews.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No reviews yet. Be the first to review this company!</p>
        </div>
      )}
    </div>
  );
};

export default CompanyReviews;
