import React, { useState, useEffect } from 'react';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaPaperPlane, 
  FaClock,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaHeadset,
  FaUsers,
  FaCheckCircle,
  FaQuestionCircle
} from 'react-icons/fa';
import { toast } from 'react-toastify';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[id^="animate-"]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast.success('Thank you for contacting us! We\'ll get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setSubmitting(false);
    }, 1000);
  };

  const contactMethods = [
    {
      icon: FaMapMarkerAlt,
      title: "Visit Our Office",
      details: "Plot 1/A/K, Beside Gajanan Primary School,\nAyodhya Nagar, Nagpur – 440 024",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
      action: "Get Directions"
    },
    {
      icon: FaPhone,
      title: "Call Us Today",
      details: "+91 89566 10799\n+91 98222 77777",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
      action: "Call Now"
    },
    {
      icon: FaEnvelope,
      title: "Email Support",
      details: "info@teztecch.com\nsupport@teztecch.com",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
      action: "Send Email"
    }
  ];

  const socialLinks = [
    { icon: FaFacebookF, color: "bg-blue-600 hover:bg-blue-700", url: "#" },
    { icon: FaTwitter, color: "bg-sky-500 hover:bg-sky-600", url: "#" },
    { icon: FaLinkedinIn, color: "bg-blue-700 hover:bg-blue-800", url: "#" },
    { icon: FaInstagram, color: "bg-pink-600 hover:bg-pink-700", url: "#" }
  ];

  const quickFacts = [
    { icon: FaHeadset, title: "24/7 Support", desc: "Round the clock assistance" },
    { icon: FaUsers, title: "Expert Team", desc: "Professional consultants" },
    { icon: FaCheckCircle, title: "Quick Response", desc: "Within 24 hours" },
    { icon: FaQuestionCircle, title: "Free Consultation", desc: "No obligation chat" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-600/50 to-transparent"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div 
            id="animate-hero"
            className={`transition-all duration-1000 ${
              isVisible['animate-hero'] 
                ? 'transform translate-y-0 opacity-100' 
                : 'transform translate-y-10 opacity-0'
            }`}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Let's Connect
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed">
              Ready to transform your career journey? We're here to guide you every step of the way. 
              Your dream job is just a conversation away.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  className={`${social.color} text-white p-3 rounded-full transition-all transform hover:scale-110 hover:rotate-6`}
                >
                  <social.icon className="text-lg" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Animated Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg className="w-full h-20" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M1200 120L1200 0L0 0L0 120C240 120 240 60 480 60C720 60 720 120 960 120C1080 120 1200 60 1200 120Z" fill="rgb(249, 250, 251)"></path>
          </svg>
        </div>
      </section>

      {/* Quick Facts */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <div 
            id="animate-facts"
            className={`grid md:grid-cols-4 gap-8 transition-all duration-1000 delay-300 ${
              isVisible['animate-facts']
                ? 'transform translate-y-0 opacity-100'
                : 'transform translate-y-10 opacity-0'
            }`}
          >
            {quickFacts.map((fact, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-all hover:shadow-2xl"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <fact.icon className="text-2xl" />
                </div>
                <h3 className="font-bold text-lg mb-2 text-gray-800">{fact.title}</h3>
                <p className="text-gray-600">{fact.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-16 max-w-7xl mx-auto">
          {/* Contact Information */}
          <div 
            id="animate-contact"
            className={`transition-all duration-1000 delay-500 ${
              isVisible['animate-contact']
                ? 'transform translate-x-0 opacity-100'
                : 'transform -translate-x-10 opacity-0'
            }`}
          >
            <div className="mb-12">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Multiple Ways to Reach Us
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                Choose your preferred method of communication. Our team is always ready to assist you 
                with personalized solutions for your career growth.
              </p>
            </div>

            <div className="space-y-8">
              {contactMethods.map((method, index) => (
                <div 
                  key={index}
                  className="group bg-white rounded-2xl shadow-lg p-6 transform hover:scale-[1.02] transition-all hover:shadow-2xl"
                  style={{ animationDelay: `${600 + index * 200}ms` }}
                >
                  <div className="flex items-start gap-6">
                    <div className={`${method.color} ${method.hoverColor} text-white p-4 rounded-xl transition-all group-hover:scale-110 group-hover:rotate-3`}>
                      <method.icon className="text-2xl" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">
                        {method.title}
                      </h3>
                      <p className="text-gray-600 whitespace-pre-line leading-relaxed mb-4">
                        {method.details}
                      </p>
                      <button className={`${method.color} ${method.hoverColor} text-white px-6 py-2 rounded-full font-semibold transition-all transform group-hover:scale-105`}>
                        {method.action}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Business Hours */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <FaClock className="text-blue-600 text-2xl" />
                  <h3 className="font-bold text-xl text-gray-800">Business Hours</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Monday - Friday</span>
                    <span className="text-blue-600 font-semibold">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Saturday</span>
                    <span className="text-blue-600 font-semibold">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Sunday</span>
                    <span className="text-red-500 font-semibold">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div 
            id="animate-form"
            className={`transition-all duration-1000 delay-700 ${
              isVisible['animate-form']
                ? 'transform translate-x-0 opacity-100'
                : 'transform translate-x-10 opacity-0'
            }`}
          >
            <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                  Send Us a Message
                </h2>
                <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-gray-700 font-semibold mb-2 group-focus-within:text-blue-600 transition-colors">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      placeholder="Your name"
                    />
                  </div>

                  <div className="group">
                    <label className="block text-gray-700 font-semibold mb-2 group-focus-within:text-blue-600 transition-colors">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-gray-700 font-semibold mb-2 group-focus-within:text-blue-600 transition-colors">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div className="group">
                  <label className="block text-gray-700 font-semibold mb-2 group-focus-within:text-blue-600 transition-colors">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <div className="group">
                  <label className="block text-gray-700 font-semibold mb-2 group-focus-within:text-blue-600 transition-colors">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="transform group-hover:translate-x-1 transition-transform" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div 
            id="animate-map"
            className={`transition-all duration-1000 delay-900 ${
              isVisible['animate-map']
                ? 'transform translate-y-0 opacity-100'
                : 'transform translate-y-10 opacity-0'
            }`}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Visit Our Office
              </h2>
              <p className="text-gray-600 text-lg">Drop by for a coffee and let's discuss your career goals in person</p>
            </div>
            
            <div className="max-w-6xl mx-auto bg-white p-6 rounded-3xl shadow-2xl border border-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.2!2d79.0882!3d21.1458!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDA4JzQ0LjkiTiA3OcKwMDUnMTcuNSJF!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Teztech Location"
                className="rounded-2xl"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
