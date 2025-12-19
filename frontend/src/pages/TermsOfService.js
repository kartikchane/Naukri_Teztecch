import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Terms of Service</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Last updated: December 17, 2025
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 md:p-12">
            <div className="prose max-w-none">
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="mb-6 text-gray-700">
                By accessing and using Teztech ("the Platform"), you accept and agree to be bound by the 
                terms and provision of this agreement. If you do not agree to these Terms of Service, 
                please do not use the Platform.
              </p>

              <h2 className="text-2xl font-bold mb-4">2. User Accounts</h2>
              <p className="mb-4 text-gray-700">
                To access certain features of the Platform, you must register for an account. When you 
                register, you agree to:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">3. User Conduct</h2>
              <p className="mb-4 text-gray-700">You agree not to:</p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Post false, inaccurate, misleading, or fraudulent information</li>
                <li>Impersonate any person or entity</li>
                <li>Harass, abuse, or harm another person or entity</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Upload or transmit viruses or malicious code</li>
                <li>Spam or send unsolicited messages to other users</li>
                <li>Collect or store personal data about other users</li>
                <li>Interfere with or disrupt the Platform or servers</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">4. Job Postings and Applications</h2>
              <h3 className="text-xl font-semibold mb-3">For Employers:</h3>
              <ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
                <li>Job postings must be accurate and represent genuine employment opportunities</li>
                <li>You must have the authority to post jobs on behalf of your organization</li>
                <li>You agree not to discriminate in your hiring practices</li>
                <li>You will handle applicant data in compliance with privacy laws</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3">For Job Seekers:</h3>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>Your profile and resume information must be accurate and truthful</li>
                <li>You grant employers permission to view your profile and contact you</li>
                <li>You are responsible for all communications with employers</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
              <p className="mb-6 text-gray-700">
                All content on the Platform, including text, graphics, logos, images, and software, is 
                the property of Teztech or its content suppliers and is protected by intellectual property 
                laws. You may not reproduce, distribute, or create derivative works without our express 
                written permission.
              </p>

              <h2 className="text-2xl font-bold mb-4">6. Payment and Refunds</h2>
              <p className="mb-4 text-gray-700">
                For paid services:
              </p>
              <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                <li>All fees are non-refundable unless otherwise stated</li>
                <li>Prices are subject to change with notice</li>
                <li>You authorize us to charge your payment method for all fees</li>
                <li>Failed payments may result in service suspension</li>
              </ul>

              <h2 className="text-2xl font-bold mb-4">7. Privacy</h2>
              <p className="mb-6 text-gray-700">
                Your use of the Platform is also governed by our Privacy Policy. Please review our 
                <Link to="/privacy" className="text-blue-600 hover:underline"> Privacy Policy</Link> to 
                understand our practices.
              </p>

              <h2 className="text-2xl font-bold mb-4">8. Disclaimer of Warranties</h2>
              <p className="mb-6 text-gray-700">
                THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. 
                WE DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF 
                VIRUSES OR OTHER HARMFUL COMPONENTS.
              </p>

              <h2 className="text-2xl font-bold mb-4">9. Limitation of Liability</h2>
              <p className="mb-6 text-gray-700">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, TEZTECH SHALL NOT BE LIABLE FOR ANY INDIRECT, 
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR 
                REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
              </p>

              <h2 className="text-2xl font-bold mb-4">10. Termination</h2>
              <p className="mb-6 text-gray-700">
                We reserve the right to suspend or terminate your account at any time, with or without 
                notice, for any reason, including violation of these Terms of Service.
              </p>

              <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
              <p className="mb-6 text-gray-700">
                We reserve the right to modify these Terms of Service at any time. We will notify users 
                of any material changes. Your continued use of the Platform after changes constitutes 
                acceptance of the modified terms.
              </p>

              <h2 className="text-2xl font-bold mb-4">12. Governing Law</h2>
              <p className="mb-6 text-gray-700">
                These Terms shall be governed by and construed in accordance with the laws of India, 
                without regard to its conflict of law provisions.
              </p>

              <h2 className="text-2xl font-bold mb-4">13. Contact Us</h2>
              <p className="mb-4 text-gray-700">
                If you have any questions about these Terms of Service, please contact us:
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
    </div>
  );
};

export default TermsOfService;
