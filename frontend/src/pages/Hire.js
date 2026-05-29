import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import API from '../utils/api';

const Hire = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    experience: '',
    skills: ''
  });

  useEffect(() => {
    fetchCandidates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/candidates', {
        params: {
          ...filters,
          search: searchQuery
        }
      });
      setCandidates(data.candidates || []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCandidates();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setSearchQuery('');
    setFilters({ location: '', experience: '', skills: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Candidates</h1>
          <p className="text-lg text-gray-600">Find qualified candidates for your job openings</p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Search by name, skills, or job title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <FaSearch /> Search
              </button>
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-3 gap-4">
              <select
                name="location"
                value={filters.location}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All Locations</option>
                <option value="New York">New York</option>
                <option value="San Francisco">San Francisco</option>
                <option value="Chicago">Chicago</option>
                <option value="Remote">Remote</option>
              </select>

              <select
                name="experience"
                value={filters.experience}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All Experience Levels</option>
                <option value="0-2">0-2 Years</option>
                <option value="2-5">2-5 Years</option>
                <option value="5-10">5-10 Years</option>
                <option value="10+">10+ Years</option>
              </select>

              <input
                type="text"
                name="skills"
                placeholder="Filter by skills..."
                value={filters.skills}
                onChange={handleFilterChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Reset Filters
            </button>
          </form>
        </div>

        {/* Candidates List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : candidates.length > 0 ? (
          <div className="grid gap-6">
            {candidates.map((candidate) => (
              <div
                key={candidate._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Candidate Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                        {candidate.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{candidate.name}</h3>
                        <p className="text-gray-600">{candidate.currentTitle || 'Job Seeker'}</p>
                      </div>
                    </div>

                    {/* Candidate Details */}
                    <div className="grid md:grid-cols-3 gap-6 mb-4">
                      {candidate.location && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaMapMarkerAlt className="text-blue-600" />
                          <span>{candidate.location}</span>
                        </div>
                      )}
                      {candidate.experience && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaBriefcase className="text-blue-600" />
                          <span>{candidate.experience} years experience</span>
                        </div>
                      )}
                      {candidate.education && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <FaGraduationCap className="text-blue-600" />
                          <span>{candidate.education}</span>
                        </div>
                      )}
                    </div>

                    {/* Skills */}
                    {candidate.skills && candidate.skills.length > 0 && (
                      <div className="mb-4">
                        <p className="font-semibold text-gray-900 mb-2">Top Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {candidate.skills.slice(0, 5).map((skill, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Summary */}
                    {candidate.summary && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{candidate.summary}</p>
                    )}
                  </div>

                  {/* Action Button */}
                  <button className="ml-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors whitespace-nowrap">
                    View Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-lg text-gray-600 mb-4">No candidates found matching your criteria</p>
            <button
              onClick={handleReset}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Hire;
