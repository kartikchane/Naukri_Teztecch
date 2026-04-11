import React, { useState } from 'react';
import { FaStar, FaTrash, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

const ReviewModeration = () => {
  const [reviews, setReviews] = useState([
    { _id: 1, type: 'company', entity: 'TechCorp', author: 'John', rating: 5, text: 'Great company!', status: 'published', date: new Date() },
    { _id: 2, type: 'company', entity: 'OldCorp', author: 'Jane', rating: 1, text: 'Worst experience ever', status: 'flagged', date: new Date() },
    { _id: 3, type: 'job', entity: 'Senior Dev', author: 'Mike', rating: 4, text: 'Good opportunity', status: 'pending', date: new Date() }
  ]);

  const approveReview = (id) => {
    setReviews(reviews.map(r => r._id === id ? { ...r, status: 'published' } : r));
    toast.success('Review approved');
  };

  const deleteReview = (id) => {
    setReviews(reviews.filter(r => r._id !== id));
    toast.success('Review deleted');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">📝 Review Moderation</h1>

        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review._id} className={`bg-white rounded-lg shadow p-6 border-l-4 ${
              review.status === 'flagged' ? 'border-red-500' :
              review.status === 'pending' ? 'border-yellow-500' :
              'border-green-500'
            }`}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{review.entity}</h3>
                  <p className="text-sm text-gray-600">{review.type === 'company' ? 'Company' : 'Job'} • By {review.author}</p>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                  ))}
                </div>
              </div>

              <p className="text-gray-700 mb-4">{review.text}</p>

              <div className="flex gap-2">
                {review.status !== 'published' && (
                  <button
                    onClick={() => approveReview(review._id)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                  >
                    <FaCheck /> Approve
                  </button>
                )}
                <button
                  onClick={() => deleteReview(review._id)}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewModeration;
