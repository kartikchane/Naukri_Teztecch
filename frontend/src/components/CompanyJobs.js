import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaDollarSign } from 'react-icons/fa';
import API from '../utils/api';

const CompanyJobs = ({ companyId }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    department: '',
    location: '',
    experience: '',
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/jobs', {
        params: { company: companyId },
      });
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  const fetchDepartments = useCallback(async () => {
    try {
      const { data } = await API.get(`/companies/${companyId}/departments`);
      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching departments:', error);
      setDepartments([]);
    }
  }, [companyId]);

  useEffect(() => {
    fetchJobs();
    fetchDepartments();
  }, [fetchJobs, fetchDepartments]);

  const filteredJobs = jobs.filter((job) => {
    if (filters.department && job.category !== filters.department) return false;
    if (
      filters.location &&
      `${job.location?.city}`.toLowerCase() !== filters.location.toLowerCase()
    )
      return false;
    return true;
  });

  const locations = [...new Set(jobs.map((j) => j.location?.city))].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Departments Summary */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Departments hiring at this company
        </h3>
        <div className="grid md:grid-cols-5 gap-3">
          {departments && departments.length > 0 ? (
            departments.map((dept, index) => (
              <div
                key={index}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
              >
                <h4 className="font-semibold text-gray-900 text-sm mb-1">{dept.name}</h4>
                <p className="text-blue-600 font-bold text-sm">{dept.openings} openings</p>
              </div>
            ))
          ) : (
            <div className="col-span-5 text-center text-gray-600 py-4">
              No departments with open positions
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Filter</h3>
        <div className="flex flex-wrap gap-4">
          <select
            name="department"
            value={filters.department}
            onChange={(e) =>
              setFilters({ ...filters, department: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Departments</option>
            {departments && departments.length > 0 && departments.map((dept, index) => (
              <option key={index} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>

          <select
            name="location"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Locations</option>
            {locations.map((loc, index) => (
              <option key={index} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <select
            name="experience"
            value={filters.experience}
            onChange={(e) =>
              setFilters({ ...filters, experience: e.target.value })
            }
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Experience Levels</option>
            <option value="0-2">0-2 years</option>
            <option value="2-5">2-5 years</option>
            <option value="5-10">5-10 years</option>
            <option value="10+">10+ years</option>
          </select>
        </div>
      </div>

      {/* Job Listings */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">
            {filteredJobs.length} Job opening{filteredJobs.length !== 1 ? 's' : ''} at {filteredJobs.length > 0 ? 'this company' : 'this company'}
          </h3>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-600">Loading jobs...</div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-6 text-center text-gray-600">
            No jobs found matching your filters
          </div>
        ) : (
          <div className="divide-y">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="p-6 hover:bg-gray-50 transition cursor-pointer border-l-4 border-transparent hover:border-blue-600"
                onClick={() => navigate(`/jobs/${job._id}`)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900">{job.title}</h4>
                    <p className="text-gray-600 text-sm mt-1">
                      {job.company?.name || 'Company Name'}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {job.workMode}
                  </span>
                </div>

                <div className="grid md:grid-cols-4 gap-4 text-sm my-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaMapMarkerAlt className="text-lg" />
                    <span>{job.location?.city || 'Location'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaBriefcase className="text-lg" />
                    <span>{job.employmentType}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaGraduationCap className="text-lg" />
                    <span>
                      {job.experience?.min || 0}-{job.experience?.max || 5} yrs
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaDollarSign className="text-lg" />
                    <span>
                      ₹{(job.salary?.min / 100000)?.toFixed(1)}L - ₹
                      {(job.salary?.max / 100000)?.toFixed(1)}L
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 line-clamp-2 mb-3">{job.description}</p>

                <div className="flex gap-2 flex-wrap">
                  {job.skills?.slice(0, 3).map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {job.skills?.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      +{job.skills.length - 3} more
                    </span>
                  )}
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Posted {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently'}
                  </span>
                  <button className="text-blue-600 font-semibold hover:text-blue-700">
                    Apply Now →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyJobs;
