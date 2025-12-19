import React from 'react';
import { Link } from 'react-router-dom';
import { FaBookOpen, FaVideo, FaFileAlt, FaQuestionCircle, FaLightbulb, FaChartLine } from 'react-icons/fa';

const EmployerResources = () => {
  const resources = [
    {
      icon: <FaBookOpen className="text-4xl text-blue-600" />,
      title: 'Hiring Guides',
      description: 'Comprehensive guides on modern hiring practices and talent acquisition strategies',
      link: '#'
    },
    {
      icon: <FaVideo className="text-4xl text-purple-600" />,
      title: 'Video Tutorials',
      description: 'Step-by-step videos on using our platform effectively for maximum results',
      link: '#'
    },
    {
      icon: <FaFileAlt className="text-4xl text-green-600" />,
      title: 'Templates & Tools',
      description: 'Job description templates, interview questions, and evaluation forms',
      link: '#'
    },
    {
      icon: <FaQuestionCircle className="text-4xl text-orange-600" />,
      title: 'Best Practices',
      description: 'Industry best practices for writing job posts and screening candidates',
      link: '#'
    },
    {
      icon: <FaLightbulb className="text-4xl text-yellow-600" />,
      title: 'Case Studies',
      description: 'Real success stories from companies that found great talent on Teztech',
      link: '#'
    },
    {
      icon: <FaChartLine className="text-4xl text-red-600" />,
      title: 'Market Insights',
      description: 'Latest hiring trends, salary data, and industry analytics',
      link: '#'
    }
  ];

  const guides = [
    {
      title: 'How to Write an Effective Job Description',
      category: 'Job Posting',
      readTime: '5 min read',
      description: 'Learn the key elements of a compelling job description that attracts top talent.'
    },
    {
      title: 'Screening Candidates Effectively',
      category: 'Hiring Process',
      readTime: '7 min read',
      description: 'Best practices for reviewing applications and shortlisting the right candidates.'
    },
    {
      title: 'Conducting Remote Interviews',
      category: 'Interviews',
      readTime: '6 min read',
      description: 'Tips for conducting effective video interviews and assessing remote candidates.'
    },
    {
      title: 'Building Your Employer Brand',
      category: 'Branding',
      readTime: '8 min read',
      description: 'Strategies to showcase your company culture and attract quality applicants.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Employer Resources</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Everything you need to hire smarter and build a great team
          </p>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {resource.icon}
                </div>
                <h3 className="text-xl font-semibold text-center mb-3">{resource.title}</h3>
                <p className="text-gray-600 text-center mb-4">{resource.description}</p>
                <a
                  href={resource.link}
                  className="block text-center text-blue-600 font-semibold hover:underline"
                >
                  Learn More →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Guides */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Hiring Guides</h2>
            <p className="text-xl text-gray-600">Expert advice to improve your hiring process</p>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            {guides.map((guide, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                        {guide.category}
                      </span>
                      <span className="text-gray-500 text-sm">{guide.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{guide.title}</h3>
                    <p className="text-gray-600 mb-4">{guide.description}</p>
                    <a
                      href="#"
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Read Guide →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Downloadable Tools</h2>
            <p className="text-xl text-gray-600">Free templates and resources for your hiring needs</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Job Description Template</h3>
              <p className="text-gray-600 mb-4">
                A comprehensive template to help you write clear and attractive job descriptions.
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Download Template
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Interview Questions Bank</h3>
              <p className="text-gray-600 mb-4">
                200+ curated interview questions for different roles and skill levels.
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Download Guide
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Candidate Scorecard</h3>
              <p className="text-gray-600 mb-4">
                Standardized evaluation form to assess and compare candidates objectively.
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Download Scorecard
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-3">Hiring Checklist</h3>
              <p className="text-gray-600 mb-4">
                Step-by-step checklist to ensure you don't miss any important hiring steps.
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Download Checklist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Need More Help?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Our support team is here to help you make the most of Teztech.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              to="/faq"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EmployerResources;
