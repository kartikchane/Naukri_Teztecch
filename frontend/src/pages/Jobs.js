import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../utils/api';
import JobCard from '../components/JobCard';
import JobFilters from '../components/JobFilters';
import { FaSearch, FaFilter } from 'react-icons/fa';

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
    setPagination({ currentPage: 1, totalPages: 1, totalJobs: 0 });
  }, [searchParams]);

  useEffect(() => {
    fetchJobs();
  }, [filters, pagination.currentPage]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      params.append('page', pagination.currentPage);
      params.append('limit', 10);

      const { data } = await API.get(`/jobs?${params.toString()}`);
      setJobs(data.jobs);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalJobs: data.totalJobs,
      });
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
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {pagination.totalJobs} Jobs Found
              </h2>
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

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-8 space-x-2">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setPagination({ ...pagination, currentPage: page })}
                        className={`px-4 py-2 rounded-lg ${
                          page === pagination.currentPage
                            ? 'bg-primary text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
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
