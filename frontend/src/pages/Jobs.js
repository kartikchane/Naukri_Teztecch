import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../utils/api';
import JobCard from '../components/JobCard';
import JobFilters from '../components/JobFilters';
import { FaSearch, FaFilter, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    workMode: searchParams.get('workMode') || '',
    employmentType: searchParams.get('employmentType') || '',
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalJobs: 0,
    limit: 10,
  });

  const categories = [
    'Software Development',
    'Data & Analytics',
    'Design',
    'Customer Support',
    'Banking & Finance',
    'Marketing',
    'Operations',
    'HR & Recruitment',
  ];

  const workModes = ['On-site', 'Remote', 'Hybrid'];
  const employmentTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Freelance'];

  // Update filters when URL parameters change (e.g., from Navbar search)
  useEffect(() => {
    const newFilters = {
      search: searchParams.get('search') || '',
      category: searchParams.get('category') || '',
      location: searchParams.get('location') || '',
      workMode: searchParams.get('workMode') || '',
      employmentType: searchParams.get('employmentType') || '',
    };
    setFilters(newFilters);
    setPagination({ currentPage: 1, totalPages: 1, totalJobs: 0, limit: 10 });
  }, [searchParams]);

  useEffect(() => {
    fetchJobs();
  }, [filters, pagination.currentPage, pagination.limit]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      params.append('page', pagination.currentPage);
      params.append('limit', pagination.limit);

      const { data } = await API.get(`/jobs?${params.toString()}`);
      setJobs(data.jobs);
      setPagination(prev => ({
        ...prev,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalJobs: data.totalJobs,
      }));
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, currentPage: 1 });
  };

  const handleLimitChange = (newLimit) => {
    setPagination({ ...pagination, limit: newLimit, currentPage: 1 });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      location: '',
      workMode: '',
      employmentType: '',
    });
    setPagination({ ...pagination, currentPage: 1 });
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination({ ...pagination, currentPage: page });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pages = [];
    const currentPage = pagination.currentPage;
    const totalPages = pagination.totalPages;
    
    // Always show first page
    pages.push(1);
    
    // Show pages around current page
    if (currentPage > 3) {
      pages.push('...');
    }
    
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    
    // Show last page
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return (
      <div className="flex justify-center items-center mt-8 gap-2">
        {/* Previous Button */}
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            currentPage === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-primary hover:text-white shadow-sm'
          }`}
        >
          <FaChevronLeft className="inline mr-1" /> Previous
        </button>

        {/* Page Numbers */}
        {pages.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                page === currentPage
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-110'
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
              }`}
            >
              {page}
            </button>
          )
        ))}

        {/* Next Button */}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            currentPage === totalPages
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 hover:bg-primary hover:text-white shadow-sm'
          }`}
        >
          Next <FaChevronRight className="inline ml-1" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Category Header - Show when filtered by category */}
        {filters.category && (
          <div className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6">
            <h1 className="text-3xl font-bold mb-2">{filters.category} Jobs</h1>
            <p className="text-lg opacity-90">
              Showing {pagination.totalJobs} job{pagination.totalJobs !== 1 ? 's' : ''} in {filters.category}
            </p>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3">
                <FaSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Job title, skills, or company"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="w-full outline-none"
                />
              </div>
            </div>
            <input
              type="text"
              placeholder="Location"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="input-field md:w-64"
            />
            <button type="submit" className="btn-primary">
              Search
            </button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <JobFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />
          </div>

          {/* Jobs List */}
          <div className="flex-1">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {pagination.totalJobs} Jobs Found
              </h2>
              
              {/* Jobs per page selector */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Show:</label>
                <select
                  value={pagination.limit}
                  onChange={(e) => handleLimitChange(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={5}>5 jobs</option>
                  <option value={10}>10 jobs</option>
                  <option value={20}>20 jobs</option>
                  <option value={50}>50 jobs</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : jobs.length > 0 ? (
              <>
                <div className="space-y-6">
                  {jobs.map((job) => (
                    <JobCard key={job._id} job={job} />
                  ))}
                </div>

                {/* Enhanced Pagination */}
                {renderPagination()}
                
                {/* Pagination Info */}
                {pagination.totalPages > 1 && (
                  <div className="text-center mt-4 text-sm text-gray-600">
                    Showing page {pagination.currentPage} of {pagination.totalPages}
                    <span className="mx-2">•</span>
                    {pagination.totalJobs} total jobs
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-gray-600 text-lg">No jobs found matching your criteria</p>
                <button onClick={clearFilters} className="mt-4 text-primary hover:underline">
                  Clear filters and try again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
