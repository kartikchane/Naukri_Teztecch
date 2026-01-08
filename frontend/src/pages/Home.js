import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';
import { useSettings } from '../context/SettingsContext';
import { useCountUp } from '../hooks/useCountUp';
import { 
  FaMapMarkerAlt, 
  FaBriefcase, 
  FaRocket, 
  FaSearch, 
  FaUsers,
  FaCode,
  FaChartLine,
  FaPaintBrush,
  FaBullhorn,
  FaMoneyBillWave,
  FaHospital,
  FaGraduationCap,
  FaHeadset
} from 'react-icons/fa';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const { settings } = useSettings();
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ jobs: 0, companies: 0, users: 0 });
  const [startCounting, setStartCounting] = useState(false);
  const [categoryCounts, setCategoryCounts] = useState({});
  
  // Animated counters
  const jobsCount = useCountUp(stats.jobs, 2000, startCounting);
  const companiesCount = useCountUp(stats.companies, 2000, startCounting);
  const usersCount = useCountUp(stats.users, 2500, startCounting);

  const categories = [
    { name: 'Software Development', icon: '💻', color: 'from-blue-50 to-blue-100' },
    { name: 'Data & Analytics', icon: '📊', color: 'from-green-50 to-green-100' },
    { name: 'Design', icon: '🎨', color: 'from-pink-50 to-pink-100' },
    { name: 'Customer Support', icon: '🎧', color: 'from-gray-50 to-gray-100' },
    { name: 'Banking & Finance', icon: '💰', color: 'from-yellow-50 to-yellow-100' },
    { name: 'Marketing', icon: '📱', color: 'from-purple-50 to-purple-100' },
    { name: 'Operations', icon: '⚙️', color: 'from-indigo-50 to-indigo-100' },
    { name: 'HR & Recruitment', icon: '👥', color: 'from-violet-50 to-violet-100' }
  ];

  useEffect(() => {
    fetchFeaturedJobs();
    fetchStats();
    fetchCategoryCounts();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      setLoading(true);
      // Fetch only featured jobs for homepage
      const response = await API.get('/jobs?featured=true&limit=8&sort=createdAt');
      // Sort jobs by createdAt descending (most recent first)
      const jobs = (response.data.jobs || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setFeaturedJobs(jobs);
    } catch (error) {
      console.error('Error fetching featured jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await API.get('/stats');
      setStats(response.data);
      // Start counting animation after stats are loaded
      setTimeout(() => setStartCounting(true), 300);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchCategoryCounts = async () => {
    try {
      const response = await API.get('/stats/categories');
      setCategoryCounts(response.data);
    } catch (error) {
      console.error('Error fetching category counts:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/jobs?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 md:py-16 lg:py-20"
        style={settings.hero?.backgroundImage ? {
          backgroundImage: `linear-gradient(rgba(37, 99, 235, 0.85), rgba(147, 51, 234, 0.85)), url(${settings.hero.backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {}}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
              {settings.hero?.title || 'Find Your Dream Job'}
            </h1>
            <p className="text-base md:text-lg lg:text-xl mb-6 md:mb-8 opacity-90 px-4">
              {settings.hero?.subtitle || 'Discover thousands of job opportunities with all the information you need. Its your future.'}
            </p>
            
            {/* Search Bar - Only show if enabled in settings */}
            {(settings.hero?.showSearchBar !== false) && (
              <div className="max-w-2xl mx-auto mb-6 md:mb-8">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row bg-white rounded-lg shadow-lg overflow-hidden">
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 md:px-6 py-3 md:py-4 text-gray-900 focus:outline-none text-sm md:text-base"
                  />
                  <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 px-6 md:px-8 py-3 md:py-4 font-semibold transition-colors flex items-center justify-center text-sm md:text-base"
                  >
                    <FaSearch className="mr-2" />
                    Search
                  </button>
                </form>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-md mx-auto">
              <div>
                <div className="text-2xl md:text-3xl font-bold">{jobsCount}+</div>
                <div className="text-blue-200 text-xs md:text-base">Jobs</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">{companiesCount}+</div>
                <div className="text-blue-200 text-xs md:text-base">Companies</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold">{usersCount.toLocaleString()}+</div>
                <div className="text-blue-200 text-xs md:text-base">Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Platform?</h2>
            <p className="text-lg text-gray-600">We provide the best experience for job seekers and employers</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaBriefcase className="text-blue-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Jobs</h3>
              <p className="text-gray-600">Find high-quality job opportunities from trusted companies</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaUsers className="text-green-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Application</h3>
              <p className="text-gray-600">Simple and fast application process with instant notifications</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaRocket className="text-orange-600 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Career Growth</h3>
              <p className="text-gray-600">Advance your career with opportunities from leading companies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore by Category Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Explore by category</h2>
            <Link to="/jobs" className="text-blue-600 hover:text-blue-700 font-semibold text-lg">
              View all →
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const jobCount = categoryCounts[category.name] || 0;
              return (
                <Link
                  key={index}
                  to={`/jobs?category=${encodeURIComponent(category.name)}`}
                  className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm font-medium">
                        {jobCount.toLocaleString()} {jobCount === 1 ? 'job' : 'jobs'}
                      </p>
                    </div>
                    <div className="text-4xl ml-4 group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Featured jobs</h2>
            <Link to="/jobs" className="text-blue-600 hover:text-blue-700 font-semibold text-lg">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredJobs.map((job) => (
                <JobCard key={job._id} job={job} isFeatured={true} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of professionals and find your dream job today</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/jobs" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Jobs
            </Link>
            <Link 
              to={isAuthenticated && user?.role === 'employer' ? '/post-job' : '/register'} 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              {user?.role === 'employer' ? 'Post a Job' : 'Sign Up'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
