import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';

const EmployerFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
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
    },
    {
      question: "How does paid posting improve hiring speed?",
      answer: "Paid jobs are promoted to relevant candidates, ensuring quality applications and reducing the overall hiring time."
    },
    {
      question: "Can I filter candidates based on skills and experience?",
      answer: "Yes, with paid plans, you can filter candidates based on location, skills, experience, and industry, ensuring better hiring matches."
    },
    {
      question: "Do paid job posts include promotional support?",
      answer: "Yes, paid listings may include social media promotions, priority placement, and branding support to attract top talent."
    },
    {
      question: "How do I choose between free and paid job posting?",
      answer: "Use Free Posting for basic hiring needs. Choose Paid Posting for faster, targeted, and high-quality recruitment."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Teztecch Naukri – FAQs for Employers & Recruiters
          </h2>
          <p className="text-xl text-gray-600 font-semibold">
            Start hiring for free. Scale your hiring with smart, targeted solutions
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <FaChevronDown
                    className={`flex-shrink-0 text-blue-600 transition-transform duration-300 ${
                      openIndex === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Answer Section */}
                {openIndex === index && (
                  <div className="px-6 py-4 bg-white border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA After FAQs */}
        <div className="mt-16 text-center">
          <p className="text-lg text-gray-600 mb-8">
            Ready to start posting jobs and finding great talent?
          </p>
          <div className="space-y-4">
            <div className="text-2xl font-bold text-blue-600">
              ✓ Simple pricing
            </div>
            <div className="text-2xl font-bold text-blue-600">
              ✓ Zero setup fees
            </div>
            <div className="text-2xl font-bold text-blue-600">
              ✓ Start hiring today
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployerFAQ;
