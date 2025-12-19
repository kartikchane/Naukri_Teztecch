import React from 'react';
import { Link } from 'react-router-dom';
import { FaRocket, FaUsers, FaAward, FaChartLine } from 'react-icons/fa';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About Teztech</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            One Complete Solution For Your Growth. Your Complete Platform for networking and building Future.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Our Mission</h2>
            <p className="text-lg text-gray-700 text-center mb-6">
              At Teztech, we're dedicated to connecting talented professionals with exceptional opportunities. 
              Our platform bridges the gap between job seekers and employers, creating meaningful career paths 
              and helping businesses find the perfect talent.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">250K+</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-gray-600">Companies</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-green-600 mb-2">500K+</div>
              <div className="text-gray-600">Job Seekers</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <FaRocket className="text-5xl text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-600">
                Constantly evolving to provide cutting-edge solutions for career growth.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <FaUsers className="text-5xl text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Community</h3>
              <p className="text-gray-600">
                Building strong connections between professionals and employers.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <FaAward className="text-5xl text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Excellence</h3>
              <p className="text-gray-600">
                Committed to delivering the highest quality service and results.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <FaChartLine className="text-5xl text-orange-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Growth</h3>
              <p className="text-gray-600">
                Empowering careers and businesses to reach their full potential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who have found their dream careers with Teztech.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/jobs"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Jobs
            </Link>
            <Link
              to="/register"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
