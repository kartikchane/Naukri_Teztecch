import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../utils/api';
import {
  FaCheckCircle, FaCreditCard, FaArrowRight, FaTrophy,
  FaChevronRight, FaHeadset, FaLock, FaRocket,
  FaThumbsUp, FaChartBar, FaSync
} from 'react-icons/fa';

const Plans = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [activeSubscription, setActiveSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPlansAndSubscription();
  }, []);

  const fetchPlansAndSubscription = async () => {
    try {
      setLoading(true);
      const plansRes = await API.get('/plans?type=job-posting');
      setPlans(plansRes.data.plans || []);

      try {
        const subRes = await API.get('/subscriptions/my-subscription');
        setActiveSubscription(subRes.data);
      } catch (error) {
        // No active subscription
      }
    } catch (error) {
      toast.error('Failed to load plans');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = (plan) => {
    if (activeSubscription && activeSubscription.plan._id === plan._id) {
      toast.info('You already have this subscription');
      return;
    }

    setSelectedPlan(plan);
    setShowPaymentModal(true);
  };

  const handlePayment = async () => {
    if (!selectedPlan) return;

    if (selectedPlan.price === 0) {
      await createSubscription(selectedPlan._id, 'manual');
      return;
    }

    setProcessing(true);
    try {
      const orderRes = await API.post('/subscriptions/create', {
        planId: selectedPlan._id,
        paymentMethod: 'razorpay'
      });

      const { razorpayOrder } = orderRes.data;
      const razorpayOrderId = razorpayOrder.orderId;
      const amount = razorpayOrder.amount;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount, // Already in paise from backend
        currency: 'INR',
        order_id: razorpayOrderId,
        name: 'Teztecch Naukri',
        description: `Subscription to ${selectedPlan.displayName} Plan`,
        prefill: {
          email: localStorage.getItem('userEmail'),
          contact: localStorage.getItem('userPhone')
        },
        handler: (response) => {
          verifyPayment(response);
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
            toast.error('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setProcessing(false);
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
      console.error(error);
    }
  };

  const verifyPayment = async (paymentResponse) => {
    try {
      setProcessing(true);

      await API.post('/subscriptions/verify-payment', {
        razorpayOrderId: paymentResponse.razorpay_order_id,
        razorpayPaymentId: paymentResponse.razorpay_payment_id,
        razorpaySignature: paymentResponse.razorpay_signature
      });

      toast.success('✅ Subscription activated! Redirecting to Post Job...');
      setShowPaymentModal(false);

      await fetchPlansAndSubscription();

      setTimeout(() => {
        navigate('/post-job');
      }, 2000);
    } catch (error) {
      setProcessing(false);
      toast.error('Payment verification failed. Please contact support.');
      console.error(error);
    }
  };

  const createSubscription = async (planId, paymentMethod) => {
    try {
      setProcessing(true);

      await API.post('/subscriptions/create', {
        planId: planId,
        paymentMethod: paymentMethod
      });

      toast.success('✅ Free subscription activated!');
      setShowPaymentModal(false);

      await fetchPlansAndSubscription();

      setTimeout(() => {
        navigate('/post-job');
      }, 2000);
    } catch (error) {
      setProcessing(false);
      toast.error(error.response?.data?.message || 'Failed to activate subscription');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white to-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent"></div>
      </div>
    );
  }

  const sortedPlans = [...plans].sort((a, b) => a.price - b.price);

  return (
    <>
      <div className="bg-gradient-to-b from-white via-gray-50 to-white min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-6xl">

          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-teal-100 rounded-full">
              <span className="text-teal-700 text-sm font-semibold">💼 PRICING PLANS</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Perfect <span className="text-teal-600">Plan</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
              Select the ideal package to post jobs and connect with talented candidates. Upgrade or downgrade anytime—no hidden fees.
            </p>
            <div className="flex flex-wrap gap-6 justify-center text-sm bg-gray-50 rounded-full mx-auto w-fit px-8 py-4 border border-gray-200">
              <div className="flex items-center gap-2 text-teal-700">
                <FaLock className="text-lg" /> Secure Payments
              </div>
              <div className="w-px bg-gray-300"></div>
              <div className="flex items-center gap-2 text-teal-700">
                <FaSync className="text-lg" /> Flexible Billing
              </div>
              <div className="w-px bg-gray-300"></div>
              <div className="flex items-center gap-2 text-teal-700">
                <FaArrowRight className="text-lg" /> Cancel Anytime
              </div>
            </div>
          </div>

          {/* Key Benefits Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="bg-teal-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FaRocket className="text-xl text-teal-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Fast Setup</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Get started posting jobs in just minutes with our intuitive interface</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FaChartBar className="text-xl text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Advanced Analytics</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Track performance and reach of every single posting in real-time</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="bg-emerald-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FaThumbsUp className="text-xl text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">Quality Candidates</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Access pre-screened talent pool for better candidate matches</p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FaHeadset className="text-xl text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-lg">24/7 Support</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Dedicated support team ready to help you succeed anytime</p>
            </div>
          </div>

          {/* Active Subscription Banner */}
          {activeSubscription && (
            <div className="mb-16">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-8 shadow-lg border border-emerald-200">
                <div className="flex items-center justify-between flex-wrap gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <FaCheckCircle className="text-white text-4xl" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-xl">✓ Active Subscription</p>
                      <p className="text-emerald-50 text-sm mt-1">
                        {activeSubscription.plan.displayName} plan • Valid until {new Date(activeSubscription.endDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate('/post-job')}
                    className="flex items-center gap-2 bg-white text-emerald-600 px-8 py-3 rounded-lg hover:bg-emerald-50 transition-all font-semibold hover:shadow-lg transform hover:scale-105"
                  >
                    Post Job Now <FaArrowRight />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Plans Grid */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Our Plans</h2>
              <p className="text-gray-600 text-lg">Choose the perfect plan for your hiring needs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sortedPlans.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400 text-xl">No plans available at the moment</p>
                </div>
              ) : (
                sortedPlans.map((plan, index) => {
                  const isPopular = index === 1;
                  const isCurrentPlan = activeSubscription?.plan._id === plan._id;

                  return (
                    <div
                      key={plan._id}
                      className={`group relative rounded-2xl transition-all duration-500 overflow-hidden h-full flex flex-col border-2 ${
                        isPopular
                          ? 'border-teal-500 shadow-xl md:scale-105 bg-gradient-to-br from-teal-50 to-cyan-50'
                          : 'border-gray-200 shadow-md hover:shadow-lg hover:border-teal-300 bg-white'
                      }`}
                    >
                      {isCurrentPlan && (
                        <div className="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                          ✓ Current Plan
                        </div>
                      )}

                      {isPopular && (
                        <div className="absolute left-1/2 transform -translate-x-1/2 z-10 -top-1">
                          <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg">
                            <FaTrophy size={14} /> MOST POPULAR
                          </div>
                        </div>
                      )}

                      {/* Content */}
                      <div className={`px-6 pb-6 flex flex-col h-full ${isPopular ? 'pt-12' : 'pt-6'}`}>
                        {/* Plan Header */}
                        <div className="mb-6">
                          <h3 className={`text-2xl font-bold mb-2 ${isPopular ? 'text-teal-700' : 'text-gray-900'}`}>
                            {plan.displayName}
                          </h3>
                          {plan.description && (
                            <p className={`text-sm ${isPopular ? 'text-teal-600' : 'text-gray-500'}`}>
                              {plan.description}
                            </p>
                          )}
                        </div>

                        {/* Price Section */}
                        <div className="mb-6 pb-6 border-b border-gray-200">
                          <div className="flex items-baseline gap-2 mb-2">
                            <span className={`text-4xl font-black ${isPopular ? 'text-teal-700' : 'text-gray-900'}`}>
                              {plan.price === 0 ? 'Free' : (
                                <>
                                  <span className="text-2xl">₹</span>{plan.price}
                                </>
                              )}
                            </span>
                            {plan.price > 0 && (
                              <span className={`text-sm font-medium ${isPopular ? 'text-teal-600' : 'text-gray-500'}`}>
                                {plan.billingCycle === 'monthly' ? '/month' : plan.billingCycle === 'yearly' ? '/year' : ''}
                              </span>
                            )}
                          </div>
                          {isPopular && <p className="text-sm text-teal-600 mt-2 font-medium">Best for growing businesses</p>}
                        </div>

                        {/* Features List */}
                        <div className="mb-6 flex-1">
                          <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                <FaCheckCircle className={`text-base ${isPopular ? 'text-teal-600' : 'text-gray-400'}`} />
                              </div>
                              <span className={`text-sm leading-snug ${isPopular ? 'text-teal-700 font-medium' : 'text-gray-600'}`}>
                                {plan.features.totalJobPostings
                                  ? `${plan.features.totalJobPostings}/month`
                                  : '∞ Unlimited'
                                } job postings
                              </span>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                <FaCheckCircle className={`text-base ${isPopular ? 'text-teal-600' : 'text-gray-400'}`} />
                              </div>
                              <span className={`text-sm leading-snug ${isPopular ? 'text-teal-700 font-medium' : 'text-gray-600'}`}>
                                {plan.features.jobValidityDays} days job visibility
                              </span>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                <FaCheckCircle className={`text-base ${isPopular ? 'text-teal-600' : 'text-gray-400'}`} />
                              </div>
                              <span className={`text-sm leading-snug ${isPopular ? 'text-teal-700 font-medium' : 'text-gray-600'}`}>
                                {plan.features.jobLocations} job locations
                              </span>
                            </li>
                            <li className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                <FaCheckCircle className={`text-base ${isPopular ? 'text-teal-600' : 'text-gray-400'}`} />
                              </div>
                              <span className={`text-sm leading-snug ${isPopular ? 'text-teal-700 font-medium' : 'text-gray-600'}`}>
                                {plan.features.descriptionCharLimit} character limit
                              </span>
                            </li>
                            {plan.features.viewApplicants && (
                              <li className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  <FaCheckCircle className="text-base text-emerald-500" />
                                </div>
                                <span className={`text-sm leading-snug ${isPopular ? 'text-teal-700' : 'text-gray-600'} font-medium`}>
                                  View all applicants
                                </span>
                              </li>
                            )}
                            {plan.features.boostOnSearch && (
                              <li className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  <FaCheckCircle className="text-base text-emerald-500" />
                                </div>
                                <span className={`text-sm leading-snug ${isPopular ? 'text-teal-700' : 'text-gray-600'} font-medium`}>
                                  Boost on search results
                                </span>
                              </li>
                            )}
                            {plan.features.resumeDatabase && (
                              <li className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                  <FaCheckCircle className="text-base text-emerald-500" />
                                </div>
                                <span className={`text-sm leading-snug ${isPopular ? 'text-teal-700' : 'text-gray-600'} font-medium`}>
                                  Resume database access
                                </span>
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* CTA Button */}
                        <button
                          onClick={() => handleSubscribe(plan)}
                          disabled={isCurrentPlan || processing}
                          className={`w-full py-3 px-4 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 text-base mt-auto transform hover:-translate-y-0.5 ${
                            isCurrentPlan
                              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                              : isPopular
                              ? 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white hover:shadow-lg hover:shadow-teal-300/50'
                              : 'bg-gray-100 text-gray-900 hover:bg-teal-50 hover:text-teal-700 border border-gray-300'
                          }`}
                        >
                          {isCurrentPlan
                            ? '✓ Current'
                            : plan.price === 0
                            ? 'Start Free'
                            : 'Choose Plan'
                          }
                          {!isCurrentPlan && <FaChevronRight className="text-sm group-hover:translate-x-1 transition-transform" />}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Features Comparison Table */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Compare All Features</h2>
              <p className="text-gray-600 text-lg">See exactly what you get with each plan</p>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-teal-500 to-cyan-600">
                      <th className="px-6 py-4 text-left font-bold text-white text-lg">Feature</th>
                      {sortedPlans.map(plan => (
                        <th key={plan._id} className="px-6 py-4 text-center font-bold text-white text-lg">
                          <div>{plan.displayName}</div>
                          <div className="text-sm font-normal text-teal-100 mt-1">
                            {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      { label: '🔼 Monthly Cost', key: 'cost' },
                      { label: '📌 Job Postings', key: 'postings' },
                      { label: '📅 Job Validity', key: 'validity' },
                      { label: '📍 Locations', key: 'locations' },
                      { label: '📝 Description Limit', key: 'chars' },
                      { label: '👥 View Applicants', key: 'applicants' },
                      { label: '🚀 Boost on Search', key: 'boost' },
                      { label: '⭐ Featured Badge', key: 'featured' },
                      { label: '📊 Resume Database', key: 'database' }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-900 text-base">{row.label}</td>
                        {sortedPlans.map(plan => {
                          let content;
                          if (row.key === 'cost') {
                            content = plan.price === 0 ? 'FREE' : `₹${plan.price}`;
                          } else if (row.key === 'postings') {
                            content = plan.features.totalJobPostings ? `${plan.features.totalJobPostings}/month` : '∞';
                          } else if (row.key === 'validity') {
                            content = `${plan.features.jobValidityDays} days`;
                          } else if (row.key === 'locations') {
                            content = plan.features.jobLocations;
                          } else if (row.key === 'chars') {
                            content = `${plan.features.descriptionCharLimit}`;
                          } else if (row.key === 'applicants') {
                            content = plan.features.viewApplicants ? 'Yes' : 'No';
                          } else if (row.key === 'boost') {
                            content = plan.features.boostOnSearch ? 'Yes' : 'No';
                          } else if (row.key === 'featured') {
                            content = plan.features.featuredPosting ? 'Yes' : 'No';
                          } else if (row.key === 'database') {
                            content = plan.features.resumeDatabase ? 'Yes' : 'No';
                          }

                          return (
                            <td key={plan._id} className="px-6 py-4 text-center">
                              {typeof content === 'string' && (content === 'Yes' || content === '∞' || content === 'FREE') ? (
                                <span className="text-emerald-600 font-bold text-base">{content === '∞' ? '∞ Unlimited' : (content === 'FREE' ? '✓ FREE' : '✓ ' + content)}</span>
                              ) : typeof content === 'string' && content === 'No' ? (
                                <span className="text-red-500 font-semibold">✗ No</span>
                              ) : (
                                <span className="text-gray-600 font-semibold">{content}</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 rounded-3xl p-12 text-center shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your Perfect Candidates?</h2>
            <p className="text-teal-50 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of companies hiring smarter with Teztecch Naukri. Start your free trial today—no credit card required!
            </p>
            <button
              onClick={() => handleSubscribe(sortedPlans.find(p => p.price === 0) || sortedPlans[0])}
              className="inline-flex items-center gap-3 bg-white text-teal-600 px-10 py-4 rounded-lg font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg text-lg"
            >
              🚀 Start Your Free Trial
              <FaArrowRight />
            </button>
            <p className="text-teal-50 text-sm mt-6">✓ Free forever plan available • ✓ Full-featured trial • ✓ Cancel anytime</p>
          </div>

        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in">
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-teal-100 rounded-full mb-4">
                <FaCreditCard className="text-3xl text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Your Plan</h2>
              <p className="text-gray-600 text-sm">Review and confirm before proceeding to payment</p>
            </div>

            {/* Plan Summary */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 mb-6 border border-teal-200">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedPlan.displayName}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedPlan.description}</p>
                </div>
              </div>

              <div className="border-t border-teal-200 pt-4 mt-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-700 font-medium">Billing Cycle:</span>
                  <span className="text-gray-900 font-bold">
                    {selectedPlan.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-lg font-bold text-teal-600">
                  <span>Total Amount:</span>
                  <span>
                    {selectedPlan.price === 0 ? '₹0 (FREE)' : `₹${selectedPlan.price}`}
                  </span>
                </div>
              </div>

              {selectedPlan.subscriptionFeatures?.durationMonths && (
                <div className="mt-3 text-sm text-gray-600">
                  <p>✓ Valid for {selectedPlan.subscriptionFeatures.durationMonths} month(s)</p>
                </div>
              )}
            </div>

            {/* Features Highlight */}
            <div className="mb-6 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <FaCheckCircle className="text-emerald-500" />
                <span>{selectedPlan.features.totalJobPostings ? `${selectedPlan.features.totalJobPostings}/month` : 'Unlimited'} job postings</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <FaCheckCircle className="text-emerald-500" />
                <span>{selectedPlan.features.jobValidityDays} days visibility</span>
              </div>
              {selectedPlan.features.viewApplicants && (
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <FaCheckCircle className="text-emerald-500" />
                  <span>View all applicants</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={processing}
                className="flex-1 py-3 px-4 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCreditCard />
                    Proceed to Payment
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              💳 Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      )}

      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
    </>
  );
};

export default Plans;
