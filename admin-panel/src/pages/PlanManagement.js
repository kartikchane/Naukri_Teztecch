import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../../utils/api';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaSave } from 'react-icons/fa';

const PlanManagement = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    description: '',
    price: 0,
    billingCycle: 'monthly',
    planType: 'job-posting',
    features: {
      jobsPerPosting: 1,
      totalJobPostings: null,
      jobLocations: 1,
      jobValidityDays: 30,
      descriptionCharLimit: 250,
      viewApplicants: true,
      boostOnSearch: false,
      jobBranding: false,
      contactDetailsVisible: true,
      featuredPosting: false,
      discountPercentage: 0,
      resumeDatabase: false
    },
    displayOrder: 0,
    isActive: true
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await API.get('/plans?type=job-posting');
      const plansData = response.data?.plans || response.data || [];
      setPlans(Array.isArray(plansData) ? plansData : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching plans:', error);
      toast.error('Failed to fetch plans');
      setLoading(false);
    }
  };

  const handleOpenModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        ...plan,
        features: { ...plan.features }
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        displayName: '',
        description: '',
        price: 0,
        billingCycle: 'monthly',
        planType: 'job-posting',
        features: {
          jobsPerPosting: 1,
          totalJobPostings: null,
          jobLocations: 1,
          jobValidityDays: 30,
          descriptionCharLimit: 250,
          viewApplicants: true,
          boostOnSearch: false,
          jobBranding: false,
          contactDetailsVisible: true,
          featuredPosting: false,
          discountPercentage: 0,
          resumeDatabase: false
        },
        displayOrder: 0,
        isActive: true
      });
    }
    setShowModal(true);
  };

  const handleSavePlan = async () => {
    try {
      if (!formData.name || !formData.displayName || formData.price < 0) {
        toast.error('Please fill all required fields');
        return;
      }

      if (editingPlan) {
        await API.put(`/plans/${editingPlan._id}`, formData);
        toast.success('Plan updated successfully');
      } else {
        await API.post('/plans', formData);
        toast.success('Plan created successfully');
      }

      setShowModal(false);
      fetchPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
      toast.error(error.response?.data?.message || 'Failed to save plan');
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;

    try {
      await API.delete(`/plans/${planId}`);
      toast.success('Plan deleted successfully');
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      toast.error('Failed to delete plan');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('features.')) {
      const featureKey = name.replace('features.', '');
      setFormData({
        ...formData,
        features: {
          ...formData.features,
          [featureKey]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value)
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) : value)
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Plan Management</h1>
            <p className="text-gray-600 mt-2">Create and manage subscription plans</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            <FaPlus /> Create New Plan
          </button>
        </div>

        {/* Plans Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Job Postings</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Validity</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900">{plan.displayName}</p>
                      <p className="text-sm text-gray-600">{plan.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-900">₹{plan.price}</td>
                  <td className="px-6 py-4 text-gray-900">
                    {plan.features.totalJobPostings || '∞'}
                  </td>
                  <td className="px-6 py-4 text-gray-900">
                    {plan.features.jobValidityDays} days
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        plan.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleOpenModal(plan)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeletePlan(plan._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-screen overflow-y-auto p-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingPlan ? 'Edit Plan' : 'Create New Plan'}
            </h2>

            <div className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Plan Name (ID)
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., standard"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    placeholder="e.g., Standard Plan"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Billing Cycle
                  </label>
                  <select
                    name="billingCycle"
                    value={formData.billingCycle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="one-time">One-time</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Features */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Total Job Postings
                    </label>
                    <input
                      type="number"
                      name="features.totalJobPostings"
                      value={formData.features.totalJobPostings || ''}
                      onChange={handleInputChange}
                      placeholder="Leave empty for unlimited"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Job Locations
                    </label>
                    <input
                      type="number"
                      name="features.jobLocations"
                      value={formData.features.jobLocations}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Job Validity (Days)
                    </label>
                    <input
                      type="number"
                      name="features.jobValidityDays"
                      value={formData.features.jobValidityDays}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Description Char Limit
                    </label>
                    <input
                      type="number"
                      name="features.descriptionCharLimit"
                      value={formData.features.descriptionCharLimit}
                      onChange={handleInputChange}
                      min="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      name="features.discountPercentage"
                      value={formData.features.discountPercentage}
                      onChange={handleInputChange}
                      min="0"
                      max="100"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Feature Toggles */}
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="features.boostOnSearch"
                      checked={formData.features.boostOnSearch}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-gray-900">Boost on Search</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="features.jobBranding"
                      checked={formData.features.jobBranding}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-gray-900">Job Branding</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="features.contactDetailsVisible"
                      checked={formData.features.contactDetailsVisible}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-gray-900">Show Contact Details</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      name="features.resumeDatabase"
                      checked={formData.features.resumeDatabase}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold text-gray-900">Resume Database Access</span>
                  </label>
                </div>
              </div>

              {/* Status */}
              <div className="border-t border-gray-200 pt-6 flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-semibold text-gray-900">Active</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePlan}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                <FaSave /> Save Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanManagement;
