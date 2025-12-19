import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaApple, FaGooglePlay } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Mobile App Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Find and apply on the go</h2>
              <p className="text-lg mb-6 opacity-90">
                Get instant notifications, chat with recruiters, and apply in one tap.
              </p>
              <div className="flex gap-4">
                <a 
                  href="https://apps.apple.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center gap-3 transition-colors"
                >
                  <FaApple className="text-2xl" />
                  <div className="text-left">
                    <div className="text-xs">Download on the</div>
                    <div className="font-semibold">App Store</div>
                  </div>
                </a>
                <a 
                  href="https://play.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center gap-3 transition-colors"
                >
                  <FaGooglePlay className="text-2xl" />
                  <div className="text-left">
                    <div className="text-xs">Get it on</div>
                    <div className="font-semibold">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?q=80&w=600&auto=format&fit=crop" 
                alt="Mobile App Preview" 
                className="rounded-lg shadow-2xl"
              />
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
              <img src="/teztech-logo.svg" alt="Teztech Logo" className="h-10 w-10 rounded-full" />
              <h3 className="text-xl font-bold text-white">Teztech</h3>
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
              <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h4 className="text-white font-semibold mb-4">For Employers</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/post-job" className="hover:text-white transition-colors">Post a Job</Link></li>
              <li><Link to="/employer/dashboard" className="hover:text-white transition-colors">Employer Dashboard</Link></li>
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
                <span>Plot 1/A/K, Beside Gajanan Primary School, Ayodhya Nagar, Nagpur – 440 024</span>
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-blue-500 flex-shrink-0" />
                <div>
                  <div>+91 89566 10799</div>
                  <div>+91 98222 77777</div>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-blue-500 flex-shrink-0" />
                <a href="mailto:info@teztecch.com" className="hover:text-white transition-colors">
                  info@teztecch.com
                </a>
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
          <p>© 2025 Teztecch. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
