import React from 'react';
import { Link } from 'react-router-dom';

const ComingSoon = ({ title, description }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center px-4">
        <div className="text-6xl mb-6">🚀</div>
        <h1 className="text-4xl font-bold mb-4 text-gray-900">{title || 'Coming Soon'}</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          {description || 'We\'re working hard to bring you this feature. Stay tuned!'}
        </p>
        <Link
          to="/"
          className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;
