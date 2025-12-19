import React from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaChartLine, FaHandshake, FaLightbulb, FaAward, FaClock } from 'react-icons/fa';

const RecruitmentSolutions = () => {
  const solutions = [
    {
      icon: <FaUsers className="text-4xl text-blue-600" />,
      title: 'Volume Hiring',
      description: 'Scale your recruitment process to hire hundreds of candidates efficiently with our streamlined bulk hiring solutions.',
      features: ['Mass recruitment drives', 'Automated screening', 'Batch onboarding', 'Campus recruitment']
    },
    {
      icon: <FaLightbulb className="text-4xl text-purple-600" />,
      title: 'Executive Search',
      description: 'Find top-tier leadership talent with our executive search services tailored for C-suite and senior management positions.',
      features: ['Headhunting services', 'Leadership assessment', 'Confidential searches', 'Market mapping']
    },
    {
      icon: <FaChartLine className="text-4xl text-green-600" />,
      title: 'RPO Services',
      description: 'Recruitment Process Outsourcing to manage your entire hiring function with dedicated recruiters and technology.',
      features: ['End-to-end recruitment', 'Dedicated team', 'Scalable solutions', 'Performance metrics']
    },
    {
      icon: <FaHandshake className="text-4xl text-orange-600" />,
      title: 'Contract Staffing',
      description: 'Flexible workforce solutions for project-based and temporary hiring needs with quick turnaround times.',
      features: ['Project-based hiring', 'Temporary staffing', 'Contract-to-hire', 'Compliance management']
    },
    {
      icon: <FaAward className="text-4xl text-red-600" />,
      title: 'Talent Assessment',
      description: 'Comprehensive assessment services to evaluate candidates\' skills, cultural fit, and potential for success.',
      features: ['Skills testing', 'Psychometric assessments', 'Technical evaluations', 'Culture fit analysis']
    },
    {
      icon: <FaClock className="text-4xl text-teal-600" />,
      title: 'Payroll Management',
      description: 'Complete payroll and compliance management for your workforce, ensuring accuracy and timely payments.',
      features: ['Payroll processing', 'Tax compliance', 'Benefits administration', 'Statutory compliance']
    }
  ];

  const benefits = [
    { number: '50%', label: 'Faster Hiring', description: 'Reduce time-to-hire with our optimized processes' },
    { number: '90%', label: 'Client Retention', description: 'Long-term partnerships built on trust and results' },
    { number: '10K+', label: 'Placements', description: 'Successful placements across various industries' },
    { number: '24/7', label: 'Support', description: 'Dedicated account managers available round the clock' }
  ];

  const industries = [
    'Information Technology', 'Healthcare', 'Manufacturing', 'Retail & E-commerce',
    'Banking & Finance', 'Telecommunications', 'Education', 'Hospitality',
    'Real Estate', 'Logistics', 'Media & Entertainment', 'Automotive'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">Recruitment Solutions</h1>
          <p className="text-xl max-w-3xl mb-8">
            End-to-end recruitment services tailored to your business needs. From volume hiring to executive search,
            we provide comprehensive solutions to build your dream team.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
          >
            Get Started
          </Link>
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Our Solutions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all">
              <div className="mb-4">{solution.icon}</div>
              <h3 className="text-2xl font-bold mb-3">{solution.title}</h3>
              <p className="text-gray-600 mb-4">{solution.description}</p>
              <ul className="space-y-2">
                {solution.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-700">
                    <span className="text-green-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">{benefit.number}</div>
                <div className="text-xl font-semibold mb-2">{benefit.label}</div>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Industries Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">Industries We Serve</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-lg shadow text-center font-semibold text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all"
            >
              {industry}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Hiring?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Let's discuss your recruitment needs and create a customized solution for your organization.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              Contact Us
            </Link>
            <Link
              to="/pricing"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruitmentSolutions;
