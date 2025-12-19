import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaRocket, FaUsers, FaGraduationCap, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Careers = () => {
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    resume: '',
    coverLetter: ''
  });
  const [loading, setLoading] = useState(false);

  const handleApplyClick = (position) => {
    setSelectedPosition(position);
    setShowApplyModal(true);
  };

  const handleCloseModal = () => {
    setShowApplyModal(false);
    setSelectedPosition(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      resume: '',
      coverLetter: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);

    // Simulate application submission
    setTimeout(() => {
      toast.success(`Application submitted for ${selectedPosition.title}!`);
      console.log('Application submitted:', {
        position: selectedPosition.title,
        ...formData
      });
      setLoading(false);
      handleCloseModal();
    }, 1500);
  };
  const openPositions = [
    {
      title: 'Senior Full Stack Developer',
      department: 'Engineering',
      location: 'Nagpur, India',
      type: 'Full-time',
      description: 'Build and maintain our platform using React, Node.js, and modern web technologies.',
      icon: '💻'
    },
    {
      title: 'Product Manager',
      department: 'Product',
      location: 'Nagpur, India',
      type: 'Full-time',
      description: 'Drive product strategy and roadmap for our job platform features.',
      icon: '📱'
    },
    {
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'Nagpur, India',
      type: 'Full-time',
      description: 'Create beautiful and intuitive user experiences for job seekers and employers.',
      icon: '🎨'
    },
    {
      title: 'Business Development Manager',
      department: 'Sales',
      location: 'Nagpur, India',
      type: 'Full-time',
      description: 'Build relationships with companies and grow our employer base.',
      icon: '💼'
    },
    {
      title: 'Content Marketing Specialist',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      description: 'Create engaging content to attract job seekers and employers to our platform.',
      icon: '✍️'
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Nagpur, India',
      type: 'Full-time',
      description: 'Ensure our users have an excellent experience and achieve their goals.',
      icon: '🤝'
    }
  ];

  const benefits = [
    {
      icon: <FaBriefcase className="text-4xl text-blue-600" />,
      title: 'Competitive Salary',
      description: 'Industry-leading compensation packages with performance bonuses'
    },
    {
      icon: <FaRocket className="text-4xl text-purple-600" />,
      title: 'Career Growth',
      description: 'Clear career progression paths and opportunities to lead'
    },
    {
      icon: <FaUsers className="text-4xl text-green-600" />,
      title: 'Great Team',
      description: 'Work with talented, passionate people who love what they do'
    },
    {
      icon: <FaGraduationCap className="text-4xl text-orange-600" />,
      title: 'Learning & Development',
      description: 'Training programs, conferences, and continuous learning opportunities'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Join Our Team</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90 mb-8">
            Help us revolutionize the way people find jobs and companies hire talent.
            Be part of something meaningful.
          </p>
          <a
            href="#positions"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            View Open Positions
          </a>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Join Teztech?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're building the future of recruitment. Join us on this exciting journey!
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Culture */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Culture</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold mb-3">Innovation First</h3>
                <p className="text-gray-600">
                  We encourage new ideas and innovative solutions to complex problems.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold mb-3">Collaboration</h3>
                <p className="text-gray-600">
                  We work together as one team to achieve our common goals.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">⚖️</div>
                <h3 className="text-xl font-semibold mb-3">Work-Life Balance</h3>
                <p className="text-gray-600">
                  We believe in sustainable work practices and personal well-being.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
            <p className="text-xl text-gray-600">Find your perfect role at Teztech</p>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl">{position.icon}</span>
                      <h3 className="text-2xl font-bold text-gray-900">{position.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                        {position.department}
                      </span>
                      <span className="flex items-center gap-1">
                        📍 {position.location}
                      </span>
                      <span className="flex items-center gap-1">
                        ⏰ {position.type}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4">{position.description}</p>
                    <button
                      onClick={() => handleApplyClick(position)}
                      className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Don't See a Position */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Don't see the right position?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We're always looking for talented people. Send us your resume and let us know what you're interested in!
          </p>
          <Link
            to="/contact"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      {/* Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 flex justify-between items-start rounded-t-xl">
              <div>
                <h2 className="text-2xl font-bold mb-2">Apply for Position</h2>
                <p className="text-blue-100">{selectedPosition?.title}</p>
                <div className="flex gap-3 mt-2 text-sm">
                  <span>📍 {selectedPosition?.location}</span>
                  <span>⏰ {selectedPosition?.type}</span>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <FaTimes className="text-2xl" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Your full name"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 9876543210"
                    required
                  />
                </div>

                {/* Resume Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resume Link
                  </label>
                  <input
                    type="url"
                    name="resume"
                    value={formData.resume}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="https://drive.google.com/... or LinkedIn profile"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Provide a link to your resume (Google Drive, Dropbox, LinkedIn, etc.)
                  </p>
                </div>

                {/* Cover Letter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter / Why do you want to join us?
                  </label>
                  <textarea
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell us why you're a great fit for this position..."
                  />
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Careers;
