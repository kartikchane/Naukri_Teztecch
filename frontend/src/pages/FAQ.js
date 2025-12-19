import React, { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      category: 'For Job Seekers',
      questions: [
        {
          question: 'How do I create an account on Teztech?',
          answer: 'Click on the "Register" button in the top right corner, fill in your details, and choose "Job Seeker" as your account type. You\'ll receive a confirmation email to activate your account.'
        },
        {
          question: 'Is Teztech free for job seekers?',
          answer: 'Yes! Creating an account, browsing jobs, and applying to positions is completely free for job seekers.'
        },
        {
          question: 'How do I apply for a job?',
          answer: 'Browse or search for jobs, click on a job listing that interests you, review the details, and click the "Apply Now" button. Make sure your profile is complete before applying.'
        },
        {
          question: 'Can I save jobs to apply later?',
          answer: 'Yes! Click the bookmark icon on any job listing to save it. You can access your saved jobs from your dashboard under "Saved Jobs".'
        },
        {
          question: 'How do I update my profile?',
          answer: 'Go to your profile page, click "Edit Profile", update your information, and click "Save Changes". Keep your profile updated to increase your chances of being noticed by employers.'
        },
        {
          question: 'Can I track my job applications?',
          answer: 'Yes! Visit the "My Applications" section in your dashboard to see all jobs you\'ve applied to and their current status.'
        }
      ]
    },
    {
      category: 'For Employers',
      questions: [
        {
          question: 'How do I post a job?',
          answer: 'Register as an employer, complete your company profile, then navigate to "Post a Job" from your dashboard. Fill in the job details and publish your listing.'
        },
        {
          question: 'What are the pricing plans?',
          answer: 'We offer flexible pricing plans based on your hiring needs. Visit our Pricing page to view detailed information about our packages.'
        },
        {
          question: 'How long will my job posting be active?',
          answer: 'Standard job postings remain active for 30 days. You can extend or renew postings from your employer dashboard.'
        },
        {
          question: 'Can I edit a job posting after publishing?',
          answer: 'Yes, you can edit your job postings at any time from your employer dashboard. Changes will be reflected immediately.'
        },
        {
          question: 'How do I review applications?',
          answer: 'Log in to your employer dashboard and navigate to "My Jobs". Click on any job to see all applications received with candidate profiles.'
        },
        {
          question: 'Can I search for candidates directly?',
          answer: 'Yes! Our premium plans include access to our candidate database where you can search and reach out to potential candidates directly.'
        }
      ]
    },
    {
      category: 'Account & Security',
      questions: [
        {
          question: 'How do I reset my password?',
          answer: 'Click on "Forgot Password" on the login page, enter your registered email address, and follow the instructions sent to your email.'
        },
        {
          question: 'Is my personal information secure?',
          answer: 'Yes! We use industry-standard encryption and security measures to protect your data. Read our Privacy Policy for more details.'
        },
        {
          question: 'Can I delete my account?',
          answer: 'Yes, you can request account deletion by contacting our support team at info@teztecch.com. Please note that this action is irreversible.'
        },
        {
          question: 'How do I change my email address?',
          answer: 'Go to your profile settings, update your email address, and verify the new email through the confirmation link we\'ll send you.'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          question: 'The website is not working properly. What should I do?',
          answer: 'Try clearing your browser cache, updating your browser, or try using a different browser. If the issue persists, contact our support team.'
        },
        {
          question: 'I\'m not receiving email notifications. Why?',
          answer: 'Check your spam/junk folder. Add info@teztecch.com to your contacts. You can also check your notification settings in your profile.'
        },
        {
          question: 'How do I upload my resume?',
          answer: 'Go to your profile, click on "Upload Resume", and select your file. We support PDF, DOC, and DOCX formats up to 5MB.'
        },
        {
          question: 'Can I use Teztech on my mobile device?',
          answer: 'Yes! Our website is fully responsive and works on all devices. We also have mobile apps available for iOS and Android.'
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Find answers to common questions about using Teztech.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b-2 border-blue-600 pb-2">
                  {category.category}
                </h2>
                <div className="space-y-4">
                  {category.questions.map((faq, questionIndex) => {
                    const index = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openIndex === index;

                    return (
                      <div
                        key={questionIndex}
                        className="bg-white rounded-lg shadow-md overflow-hidden"
                      >
                        <button
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-semibold text-gray-900 pr-8">
                            {faq.question}
                          </span>
                          <span className="flex-shrink-0 ml-4">
                            {isOpen ? (
                              <FaMinus className="text-blue-600" />
                            ) : (
                              <FaPlus className="text-blue-600" />
                            )}
                          </span>
                        </button>
                        {isOpen && (
                          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <p className="text-gray-700">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Still Have Questions?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our support team is here to help!
          </p>
          <Link
            to="/contact"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
          >
            Contact Support
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
