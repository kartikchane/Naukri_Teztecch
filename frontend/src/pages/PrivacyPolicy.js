import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Last updated: December 17, 2025
          </p>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 md:p-12">
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 mb-8">
                At Teztech, we take your privacy seriously. This Privacy Policy explains how we collect, 
                use, disclose, and safeguard your information when you use our platform.
              </p>

              <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold mb-3">Personal Information</h3>
              <p className="mb-4 text-gray-700">We collect information that you provide directly to us, including:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Name, email address, phone number</li>
                <li>Resume, work history, education, and skills</li>
                <li>Company information for employers</li>
                <li>Profile photo and other profile information</li>
                <li>Payment information for premium services</li>
                <li>Communication preferences and job alerts settings</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">Automatically Collected Information</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Device information (IP address, browser type, operating system)</li>
                <li>Usage data (pages visited, time spent, search queries)</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Location data (with your permission)</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
              <p className="mb-4 text-gray-700">We use the collected information for:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Providing and maintaining our services</li>
                <li>Creating and managing your account</li>
                <li>Matching job seekers with relevant opportunities</li>
                <li>Connecting employers with qualified candidates</li>
                <li>Sending job alerts and notifications</li>
                <li>Processing payments and transactions</li>
                <li>Improving our platform and user experience</li>
                <li>Sending marketing communications (with your consent)</li>
                <li>Preventing fraud and ensuring platform security</li>
                <li>Complying with legal obligations</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">3. Information Sharing and Disclosure</h2>
              
              <h3 className="text-xl font-semibold mb-3">With Employers</h3>
              <p className="mb-4 text-gray-700">
                When you apply for a job or make your profile searchable, employers can view your 
                profile information, resume, and application materials.
              </p>

              <h3 className="text-xl font-semibold mb-3">With Service Providers</h3>
              <p className="mb-4 text-gray-700">
                We share information with third-party service providers who help us operate our platform, 
                including payment processors, cloud hosting, and analytics services.
              </p>

              <h3 className="text-xl font-semibold mb-3">For Legal Reasons</h3>
              <p className="mb-6 text-gray-700">
                We may disclose information if required by law, to protect our rights, or to prevent 
                harm to our users or the public.
              </p>

              <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
              <p className="mb-6 text-gray-700">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. However, 
                no internet transmission is completely secure, and we cannot guarantee absolute security.
              </p>

              <h2 className="text-2xl font-bold mb-4">5. Your Rights and Choices</h2>
              <p className="mb-4 text-gray-700">You have the right to:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct your information</li>
                <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Data Portability:</strong> Request your data in a portable format</li>
                <li><strong>Object:</strong> Object to certain processing of your data</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">6. Cookies and Tracking Technologies</h2>
              <p className="mb-4 text-gray-700">
                We use cookies and similar technologies to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Remember your preferences and settings</li>
                <li>Analyze how you use our platform</li>
                <li>Provide personalized content and ads</li>
                <li>Measure the effectiveness of our services</li>
              </ul>
              <p className="mb-6 text-gray-700">
                You can control cookies through your browser settings, but disabling cookies may limit 
                some functionality of our platform.
              </p>

              <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
              <p className="mb-6 text-gray-700">
                We retain your personal information for as long as necessary to provide our services 
                and comply with legal obligations. When you delete your account, we will delete or 
                anonymize your information, except where we are required to retain it by law.
              </p>

              <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
              <p className="mb-6 text-gray-700">
                Our platform is not intended for users under 18 years of age. We do not knowingly 
                collect personal information from children. If you believe we have collected 
                information from a child, please contact us immediately.
              </p>

              <h2 className="text-2xl font-bold mb-4">9. International Data Transfers</h2>
              <p className="mb-6 text-gray-700">
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place to protect your information in accordance 
                with this Privacy Policy.
              </p>

              <h2 className="text-2xl font-bold mb-4">10. Changes to This Privacy Policy</h2>
              <p className="mb-6 text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any material 
                changes by posting the new Privacy Policy on this page and updating the "Last updated" 
                date. Your continued use of the platform after changes constitutes acceptance of the 
                updated policy.
              </p>

              <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
              <p className="mb-4 text-gray-700">
                If you have questions or concerns about this Privacy Policy or our data practices, 
                please contact us:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 mb-2">
                  <strong>Email:</strong> info@teztecch.com
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Phone:</strong> +91 89566 10799
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong> Plot 1/A/K, Beside Gajanan Primary School, 
                  Ayodhya Nagar, Nagpur – 440 024
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-700 mb-4">
            For more information, please also review our:
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/terms"
              className="text-blue-600 hover:underline font-semibold"
            >
              Terms of Service
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              to="/faq"
              className="text-blue-600 hover:underline font-semibold"
            >
              FAQ
            </Link>
            <span className="text-gray-400">|</span>
            <Link
              to="/contact"
              className="text-blue-600 hover:underline font-semibold"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
