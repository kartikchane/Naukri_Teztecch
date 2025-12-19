import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { Link, useSearchParams } from 'react-router-dom';
import { FaBuilding, FaMapMarkerAlt, FaUsers, FaCalendar, FaCheckCircle, FaGlobe, FaLinkedin, FaTwitter, FaFacebook, FaSearch } from 'react-icons/fa';

const Companies = () => {
  const [searchParams] = useSearchParams();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterSize, setFilterSize] = useState('');

  // Update search term when URL parameters change (e.g., from Navbar search)
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchTerm(urlSearch);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchCompanies();
  }, [searchTerm, filterIndustry, filterSize]);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (searchTerm) params.append('search', searchTerm);
      if (filterIndustry) params.append('industry', filterIndustry);
      if (filterSize) params.append('companySize', filterSize);
      
      const { data } = await API.get(`/companies?${params.toString()}`);
      console.log('Companies data:', data);
      setCompanies(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching companies:', error);
      setLoading(false);
    }
  };

  // Get unique industries for filter
  const industries = [...new Set(companies.map(c => c.industry))].filter(Boolean);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Companies
          </h1>
          <p className="text-xl text-gray-600">
            Discover amazing companies and learn about their culture
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search companies..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Industry Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterIndustry}
              onChange={(e) => setFilterIndustry(e.target.value)}
            >
              <option value="">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>

            {/* Size Filter */}
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterSize}
              onChange={(e) => setFilterSize(e.target.value)}
            >
              <option value="">All Sizes</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501-1000">501-1000 employees</option>
              <option value="1000+">1000+ employees</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {companies.length} {companies.length === 1 ? 'company' : 'companies'}
          </div>
        </div>

        {/* Companies Grid */}
        {companies.length === 0 ? (
          <div className="text-center py-12">
            <FaBuilding className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No companies found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <Link
                key={company._id}
                to={`/companies/${company._id}`}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                {/* Company Logo */}
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative p-4">
                  {company.logo && company.logo !== 'default-company-logo.png' ? (
                    <img 
                      src={company.logo} 
                      alt={company.name}
                      className="max-h-32 max-w-[80%] object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`text-6xl font-bold text-blue-600 ${company.logo && company.logo !== 'default-company-logo.png' ? 'hidden' : 'flex'}`}>
                    {company.name?.charAt(0)}
                  </div>
                  {company.verified && (
                    <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full flex items-center text-xs">
                      <FaCheckCircle className="mr-1" />
                      Verified
                    </div>
                  )}
                </div>

                {/* Company Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{company.name}</h3>
                  
                  {company.industry && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full mb-3">
                      {company.industry}
                    </span>
                  )}

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {company.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-500">
                    {company.location?.city && (
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-2 text-gray-400" />
                        <span>
                          {company.location.city}
                          {company.location.state && `, ${company.location.state}`}
                          {company.location.country && `, ${company.location.country}`}
                        </span>
                      </div>
                    )}

                    {company.companySize && (
                      <div className="flex items-center">
                        <FaUsers className="mr-2 text-gray-400" />
                        <span>{company.companySize} employees</span>
                      </div>
                    )}

                    {company.founded && (
                      <div className="flex items-center">
                        <FaCalendar className="mr-2 text-gray-400" />
                        <span>Founded in {company.founded}</span>
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  {(company.socialLinks?.linkedin || company.socialLinks?.twitter || company.socialLinks?.facebook || company.website) && (
                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-3">
                      {company.website && (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <FaGlobe className="text-lg" />
                        </a>
                      )}
                      {company.socialLinks?.linkedin && (
                        <a
                          href={company.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-400 hover:text-blue-600 transition-colors"
                        >
                          <FaLinkedin className="text-lg" />
                        </a>
                      )}
                      {company.socialLinks?.twitter && (
                        <a
                          href={company.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                        >
                          <FaTwitter className="text-lg" />
                        </a>
                      )}
                      {company.socialLinks?.facebook && (
                        <a
                          href={company.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-400 hover:text-blue-700 transition-colors"
                        >
                          <FaFacebook className="text-lg" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;
