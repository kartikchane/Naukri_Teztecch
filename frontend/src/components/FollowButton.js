import React, { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import API from '../utils/api';
import { toast } from 'react-toastify';

const FollowButton = ({ companyId, initialFollowing = false, onFollowChange }) => {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (following) {
        await API.delete(`/companies/${companyId}/follow`);
        toast.info('Unfollowed company');
      } else {
        await API.post(`/companies/${companyId}/follow`);
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

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
        following
          ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {following ? <FaHeart /> : <FaRegHeart />}
      {following ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;
