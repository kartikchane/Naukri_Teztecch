import React from 'react';
import { FaLinkedin, FaTwitter, FaGlobe } from 'react-icons/fa';

const Founder = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Meet Our Founder</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            The visionary behind Teztech's mission to revolutionize career growth and professional networking.
          </p>
        </div>
      </section>
                
      {/* Founder Profile */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              {/* Founder Image */}
              <div className="md:w-2/5 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center p-12">
                <div className="w-64 h-64 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-6xl font-bold">
                  <img 
                    src={process.env.PUBLIC_URL + '/founder.jpeg'} 
                    alt="Founder" 
                    className="w-56 h-56 object-cover rounded-full border-4 border-white shadow-lg" 
                  />
                </div>
              </div>

              {/* Founder Info */}
              <div className="md:w-3/5 p-12">
                <h2 className="text-4xl font-bold mb-2">Tejaswini Bandarkar</h2>
                <p className="text-xl text-gray-600 mb-6">Founder & CEO, Teztech</p>

                <div className="prose max-w-none text-gray-700 space-y-4">
                  <p>
                    With over 15 years of experience in the technology and recruitment industry, 
                    our founder has dedicated their career to bridging the gap between talented 
                    professionals and exceptional opportunities.
                  </p>

                  <p>
                    The vision for Teztech was born from a simple yet powerful idea: to create 
                    a platform that not only connects job seekers with employers but also fosters 
                    meaningful professional relationships and career growth.
                  </p>

                  <p>
                    Under their leadership, Teztech has grown from a startup to one of India's 
                    leading job portals, serving thousands of companies and helping hundreds of 
                    thousands of professionals find their dream careers.
                  </p>
                </div>

                {/* Social Links */}
                <div className="mt-8 flex gap-4">
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
                  >
                    <FaLinkedin className="text-xl" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition-colors"
                  >
                    <FaTwitter className="text-xl" />
                  </a>
                  <a
                    href="https://teztecch.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition-colors"
                  >
                    <FaGlobe className="text-xl" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-blue-900">Our Vision</h3>
                <p className="text-gray-700">
                  To become the most trusted and comprehensive career development platform, 
                  empowering millions of professionals worldwide to achieve their career 
                  aspirations and helping businesses build exceptional teams.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-purple-900">Our Mission</h3>
                <p className="text-gray-700">
                  To revolutionize the way people find jobs and companies hire talent by 
                  leveraging technology, data-driven insights, and a deep understanding of 
                  both job seeker and employer needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Achievements & Recognition</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-4">🏆</div>
                <h3 className="font-semibold mb-2">Best Job Portal 2024</h3>
                <p className="text-gray-600 text-sm">Industry Excellence Awards</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-4">🌟</div>
                <h3 className="font-semibold mb-2">500K+ Users</h3>
                <p className="text-gray-600 text-sm">Active job seekers on platform</p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="font-semibold mb-2">10K+ Companies</h3>
                <p className="text-gray-600 text-sm">Trust Teztech for hiring</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Founder;
