import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      // Simulated password reset - in production, this would send an email
      // await API.post('/auth/forgot-password', { email });
      
      // For now, show success message
      setTimeout(() => {
        setEmailSent(true);
        toast.success('Password reset instructions sent to your email!');
        setLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Failed to send reset email');
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaEnvelope className="text-3xl text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent password reset instructions to <strong>{email}</strong>
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setEmailSent(false);
                  setEmail('');
                }}
                className="w-full py-2 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Try Another Email
              </button>
              <Link
                to="/login"
                className="w-full block py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password?</h2>
          <p className="mt-2 text-gray-600">
            No worries! Enter your email and we'll send you reset instructions.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
          </form>

          <div className="mt-6">
            <Link
              to="/login"
              className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Login
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Having trouble? Contact our support team at{' '}
              <a href="mailto:support@naukri.com" className="text-blue-600 hover:underline">
                support@naukri.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
