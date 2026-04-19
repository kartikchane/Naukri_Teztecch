import React, { useState } from 'react';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import { getFileUrl } from '../utils/fileUtils';
import API from '../utils/api';
import { toast } from 'react-toastify';

const CompanyHeader = ({ company, isFollowing, onFollowChange }) => {
  const [following, setFollowing] = useState(isFollowing);
  const [loading, setLoading] = useState(false);
  const [followers, setFollowers] = useState(company?.followers || 0);

  const handleFollow = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (following) {
        await API.delete(`/companies/${company._id}/follow`);
        setFollowers(Math.max(0, followers - 1));
        toast.info('Unfollowed company');
      } else {
        await API.post(`/companies/${company._id}/follow`);
        setFollowers(followers + 1);
        toast.success('Following company');
      }
      setFollowing(!following);
      onFollowChange?.(!following);
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Cover Image */}
      <div className="h-40 bg-gradient-to-r from-blue-600 to-purple-600 relative">
        {company?.coverImage && (
          <img
            src={company.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Header Content */}
      <div className="px-6 pb-6 relative">
        <div className="flex items-start gap-4 -mt-16 mb-4">
          {/* Logo */}
          <div className="relative">
            {company?.logo && !company.logo.includes('default') ? (
              <img
                src={getFileUrl(`uploads/${company.logo}`)}
                alt={company.name}
                className="w-32 h-32 rounded-lg object-cover border-4 border-white bg-white"
              />
            ) : (
              <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center border-4 border-white text-white text-3xl font-bold">
                {getInitials(company?.name || '')}
              </div>
            )}
          </div>

          {/* Company Info & Actions */}
          <div className="flex-1 pt-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{company?.name}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-lg ${
                          i < Math.round(company?.averageRating || 3.6)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-gray-900">
                    {(company?.averageRating || 3.6).toFixed(1)}
                  </span>
                  <span className="text-gray-600">
                    ({company?.totalReviews || 0} reviews)
                  </span>
                </div>
                {company?.location && (
                  <p className="text-gray-600 text-sm mt-1">
                    📍 {company.location.city}, {company.location.state}
                  </p>
                )}
              </div>

              {/* Follow Button */}
              <button
                onClick={handleFollow}
                disabled={loading}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${
                  following
                    ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {following ? <FaHeart /> : <FaRegHeart />}
                {following ? 'Following' : 'Follow'}
              </button>
            </div>

            {/* Description */}
            {company?.description && (
              <p className="text-gray-600 mt-3 text-sm line-clamp-2">
                {company.description}
              </p>
            )}

            {/* Tags & Followers */}
            <div className="flex items-center gap-4 mt-4 flex-wrap">
              {company?.industry && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {company.industry}
                </span>
              )}
              {company?.companySize && (
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {company.companySize} employees
                </span>
              )}
              <div className="text-gray-600 text-sm font-medium">
                👥 {followers?.toLocaleString() || 0} followers
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyHeader;
