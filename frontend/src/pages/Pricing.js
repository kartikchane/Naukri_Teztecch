import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaRocket, FaCrown, FaStar } from 'react-icons/fa';

const Pricing = () => {
  const plans = [
    {
      name: 'Basic',
      icon: <FaRocket className="text-4xl text-blue-600" />,
      price: '₹9,999',
      period: '/month',
      description: 'Perfect for small businesses and startups',
      features: [
        '5 Job Postings per month',
        '30 days job listing duration',
        'Basic candidate search',
        'Email support',
        'Company profile page',
        'Application tracking',
        'Basic analytics'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Professional',
      icon: <FaCrown className="text-4xl text-purple-600" />,
      price: '₹24,999',
      period: '/month',
      description: 'Best for growing companies',
      features: [
        '20 Job Postings per month',
        '60 days job listing duration',
        'Advanced candidate search',
        'Priority support',
        'Featured company profile',
        'Advanced analytics',
        'Resume database access',
        'Dedicated account manager',
        'Priority job listing',
        'Branded job postings'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      icon: <FaStar className="text-4xl text-orange-600" />,
      price: 'Custom',
      period: '',
      description: 'For large organizations with high volume hiring',
      features: [
        'Unlimited Job Postings',
        '90 days job listing duration',
        'Full candidate database access',
        '24/7 Premium support',
        'Premium company branding',
        'Custom integrations',
        'Advanced API access',
        'Recruitment solutions',
        'Custom analytics & reporting',
        'Multiple user accounts',
        'Training & onboarding',
        'Custom contract terms'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const addOns = [
    {
      name: 'Featured Job Posting',
      price: '₹1,999',
      description: '7 days of premium visibility for a single job posting'
    },
    {
      name: 'Resume Database Access',
      price: '₹4,999',
      description: 'One month access to search and download resumes'
    },
    {
      name: 'Sponsored Company Profile',
      price: '₹9,999',
      description: 'Featured placement in company listings for one month'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Choose the perfect plan for your hiring needs. All plans include our core features.
          </p>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-lg shadow-lg overflow-hidden ${
                  plan.popular ? 'ring-4 ring-purple-600 transform md:scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-2 font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <div className="flex justify-center mb-4">
                    {plan.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-center mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-center mb-6">{plan.description}</p>
                  
                  <div className="text-center mb-6">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-600">{plan.period}</span>}
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/register"
                    className={`block w-full text-center py-3 rounded-lg font-semibold transition-all ${
                      plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Add-Ons</h2>
            <p className="text-center text-gray-600 mb-12">
              Enhance your hiring with these additional services
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {addOns.map((addon, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
                  <h3 className="text-xl font-semibold mb-2">{addon.name}</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-3">{addon.price}</div>
                  <p className="text-gray-600 text-sm">{addon.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">Can I cancel my subscription anytime?</h3>
                <p className="text-gray-600">
                  Yes, you can cancel your subscription at any time. Your access will continue until 
                  the end of your billing period.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">
                  We accept all major credit cards, debit cards, net banking, and UPI payments.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">Do you offer refunds?</h3>
                <p className="text-gray-600">
                  We offer a 7-day money-back guarantee if you're not satisfied with our service.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">Can I upgrade or downgrade my plan?</h3>
                <p className="text-gray-600">
                  Yes, you can change your plan at any time. Changes take effect immediately, and 
                  we'll prorate the charges accordingly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Hiring?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of companies finding their perfect candidates on Teztech.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              to="/contact"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
