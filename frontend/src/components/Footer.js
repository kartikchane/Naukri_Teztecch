import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaGithub, FaApple, FaGooglePlay, FaChevronDown } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Footer = () => {
  const { user } = useAuth();
  const [openFaqIndex, setOpenFaqIndex] = React.useState(null);

  const jobSeekerFaqs = [
    {
      question: "How do I create an account?",
      answer: "Click on 'Sign Up' and fill in your details like name, email, and password. You can also sign up using your Google or LinkedIn account for quick registration."
    },
    {
      question: "How can I search for jobs?",
      answer: "Use the search bar on the homepage or go to 'Find Jobs'. You can filter by job title, location, industry, experience level, and salary range."
    },
    {
      question: "How do I apply for a job?",
      answer: "Click on a job posting and click the 'Apply Now' button. Upload your resume and fill in any additional information requested by the employer."
    },
    {
      question: "Can I track my application status?",
      answer: "Yes, go to your profile and check the 'My Applications' section to see the status of all jobs you've applied to."
    },
    {
      question: "How do I update my resume?",
      answer: "Visit your profile settings and upload your latest resume. You can also update your skills, experience, and other details anytime."
    },
    {
      question: "Will I get notifications about new jobs?",
      answer: "Yes, you'll receive instant notifications for jobs matching your profile. You can enable/disable notifications from your profile settings."
    }
  ];

  const employerFaqs = [
    {
      question: "What is Teztecch Naukri and how does it help employers?",
      answer: "Teztecch Naukri is a job portal that helps employers connect with skilled candidates through job postings, targeted hiring, and recruitment support."
    },
    {
      question: "Who can post jobs on Teztecch Naukri?",
      answer: "Startups, SMEs, corporates, HR professionals, and individual recruiters can all post jobs on the platform."
    },
    {
      question: "Is there a free job posting option available?",
      answer: "Yes, employers can post jobs for free and start receiving applications without any initial cost."
    },
    {
      question: "What are the limitations of free job postings?",
      answer: "Free job posts have limited visibility and reach a broader, less targeted audience, which may result in slower hiring."
    },
    {
      question: "Can I target specific locations or industries with free job posts?",
      answer: "Free postings offer basic reach but do not support advanced targeting like specific locations, industries, or skill-based filtering."
    },
    {
      question: "What benefits do paid job postings offer?",
      answer: "Paid plans provide: Featured listings, Targeted candidate reach, Higher visibility, and Faster response rates."
    }
  ];

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* FAQ Section - Show different FAQ based on user role */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {user?.role === 'employer' ? 'Employer FAQs' : 'Jobseeker FAQs'}
            </h2>
            <p className="text-lg opacity-90">
              {user?.role === 'employer'
                ? 'Common questions about posting jobs and hiring on Teztecch Naukri'
                : 'Find answers to common questions about searching and applying for jobs'}
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {(user?.role === 'employer' ? employerFaqs : jobSeekerFaqs).map((faq, index) => (
                <div
                  key={index}
                  className="border border-white border-opacity-30 rounded-lg overflow-hidden hover:bg-white hover:bg-opacity-10 transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left"
                  >
                    <h3 className="text-lg font-semibold text-white pr-4">
                      {faq.question}
                    </h3>
                    <FaChevronDown
                      className={`flex-shrink-0 text-white transition-transform duration-300 ${
                        openFaqIndex === index ? 'transform rotate-180' : ''
                      }`}
                    />
                  </button>

                  {openFaqIndex === index && (
                    <div className="px-6 py-4 bg-white bg-opacity-10 border-t border-white border-opacity-30">
                      <p className="text-white opacity-90 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/Teztech-logo-full.png"
                alt="Teztech Logo"
                className="h-10 w-10 object-contain"
              />
              <h3 className="text-xl font-bold text-white">Teztecch</h3>
            </div>
            <p className="mb-4 text-sm">
              One Complete Solution For Your Growth. Your Complete Platform for networking and building Future.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">
                <FaInstagram className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/jobs" className="hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link to="/companies" className="hover:text-white transition-colors">Companies</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link to="/plans" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="text-white font-semibold mb-4">For Employers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/post-job" className="hover:text-white transition-colors">Post a Job</Link></li>
              <li><Link to="/my-jobs" className="hover:text-white transition-colors">Employer Dashboard</Link></li>
              <li><Link to="/hire" className="hover:text-white transition-colors">Browse Candidates</Link></li>
              <li><Link to="/employer-resources" className="hover:text-white transition-colors">Resources</Link></li>
              <li><Link to="/recruitment-solutions" className="hover:text-white transition-colors">Recruitment Solutions</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="text-blue-500 mt-1 flex-shrink-0" />
                <span>123 Business Street, Tech City, TC 12345</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-blue-500 flex-shrink-0" />
                <span>+91 1234567890</span>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-blue-500 flex-shrink-0" />
                <a href="mailto:info@teztecch.com" className="hover:text-white transition-colors">
                  info@teztecch.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 font-semibold flex-shrink-0">Hours:</span>
                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="text-white font-semibold mb-3 text-sm">Additional Links</h5>
              <div className="flex flex-wrap gap-4 text-sm">
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
                <Link to="/founder" className="hover:text-white transition-colors">Founder</Link>
                <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                <Link to="/faq" className="hover:text-white transition-colors">FAQs</Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>© {new Date().getFullYear()} Teztecch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
