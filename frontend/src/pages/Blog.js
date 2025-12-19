import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaClock, FaUser, FaTag, FaSearch } from 'react-icons/fa';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const blogPosts = [
    {
      id: 1,
      title: '10 Essential Tips for Job Seekers in 2024',
      excerpt: 'Navigate the modern job market with these proven strategies for landing your dream job in the current competitive landscape.',
      author: 'Priya Sharma',
      date: 'January 15, 2024',
      category: 'Job Seekers',
      readTime: '5 min read',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800'
    },
    {
      id: 2,
      title: 'How to Write a Compelling Job Description',
      excerpt: 'Learn the art of crafting job descriptions that attract top talent and clearly communicate your expectations and company culture.',
      author: 'Rajesh Kumar',
      date: 'January 12, 2024',
      category: 'Employers',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800'
    },
    {
      id: 3,
      title: 'The Rise of Remote Work: What It Means for Recruiters',
      excerpt: 'Explore how the shift to remote work is transforming recruitment strategies and what employers need to adapt to this new reality.',
      author: 'Anjali Mehta',
      date: 'January 10, 2024',
      category: 'Trends',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=800'
    },
    {
      id: 4,
      title: 'Interview Preparation: A Complete Guide',
      excerpt: 'Master the interview process with comprehensive preparation techniques, common questions, and tips for making a lasting impression.',
      author: 'Vikram Singh',
      date: 'January 8, 2024',
      category: 'Job Seekers',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800'
    },
    {
      id: 5,
      title: 'Building a Strong Employer Brand',
      excerpt: 'Discover strategies to create and maintain an employer brand that attracts and retains top talent in your industry.',
      author: 'Neha Gupta',
      date: 'January 5, 2024',
      category: 'Employers',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800'
    },
    {
      id: 6,
      title: 'AI in Recruitment: Opportunities and Challenges',
      excerpt: 'Understanding how artificial intelligence is reshaping the recruitment landscape and what it means for both employers and candidates.',
      author: 'Arjun Patel',
      date: 'January 3, 2024',
      category: 'Technology',
      readTime: '9 min read',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800'
    },
    {
      id: 7,
      title: 'Negotiating Your Salary: Do\'s and Don\'ts',
      excerpt: 'Expert advice on navigating salary negotiations confidently and securing the compensation package you deserve.',
      author: 'Meera Reddy',
      date: 'December 28, 2023',
      category: 'Career Advice',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800'
    },
    {
      id: 8,
      title: 'The Future of Work: Skills That Matter',
      excerpt: 'Identify the key skills that will be in high demand in the coming years and how to develop them for career success.',
      author: 'Sanjay Joshi',
      date: 'December 25, 2023',
      category: 'Trends',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
    }
  ];

  const categories = ['All', 'Job Seekers', 'Employers', 'Trends', 'Technology', 'Career Advice'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">Teztech Blog</h1>
          <p className="text-xl max-w-3xl mb-8">
            Insights, tips, and trends in recruitment, career development, and the future of work.
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Blog+Post';
                  }}
                />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                      <FaTag className="inline mr-1" />
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-sm flex items-center">
                      <FaClock className="mr-1" />
                      {post.readTime}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 text-gray-900 hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center text-gray-600 text-sm">
                      <FaUser className="mr-2" />
                      <span>{post.author}</span>
                    </div>
                    <span className="text-gray-500 text-sm">{post.date}</span>
                  </div>
                  <button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all">
                    Read More
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No articles found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Subscribe to Our Newsletter</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Get the latest career insights, hiring tips, and industry trends delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none"
            />
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
