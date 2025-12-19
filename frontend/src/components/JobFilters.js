import React, { useState } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';

const JobFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [salaryRange, setSalaryRange] = useState({
    min: filters.salaryMin || '',
    max: filters.salaryMax || ''
  });
  const [experienceRange, setExperienceRange] = useState({
    min: filters.experienceMin || '',
    max: filters.experienceMax || ''
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
  const postedWithin = ['24 hours', '3 days', '7 days', '14 days', '30 days'];

  const handleSalaryChange = (type, value) => {
    const newSalary = { ...salaryRange, [type]: value };
    setSalaryRange(newSalary);
    if (type === 'min') onFilterChange('salaryMin', value);
    if (type === 'max') onFilterChange('salaryMax', value);
  };

  const handleExperienceChange = (type, value) => {
    const newExp = { ...experienceRange, [type]: value };
    setExperienceRange(newExp);
    if (type === 'min') onFilterChange('experienceMin', value);
    if (type === 'max') onFilterChange('experienceMax', value);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Clear Filters */}
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={() => {
            onClearFilters();
            setSalaryRange({ min: '', max: '' });
            setExperienceRange({ min: '', max: '' });
            setShowMobileFilters(false);
          }}
          className="text-primary hover:text-blue-700 text-sm font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Categories */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Category</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="radio"
                name="category"
                checked={filters.category === category}
                onChange={() => onFilterChange('category', category)}
                className="mr-2 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Work Mode */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Work Mode</h4>
        <div className="space-y-2">
          {workModes.map((mode) => (
            <label key={mode} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="radio"
                name="workMode"
                checked={filters.workMode === mode}
                onChange={() => onFilterChange('workMode', mode)}
                className="mr-2 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{mode}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Employment Type */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Employment Type</h4>
        <div className="space-y-2">
          {employmentTypes.map((type) => (
            <label key={type} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="radio"
                name="employmentType"
                checked={filters.employmentType === type}
                onChange={() => onFilterChange('employmentType', type)}
                className="mr-2 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Salary Range */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Salary Range (LPA)</h4>
        <div className="space-y-2">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Minimum</label>
            <input
              type="number"
              value={salaryRange.min}
              onChange={(e) => handleSalaryChange('min', e.target.value)}
              placeholder="e.g., 5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Maximum</label>
            <input
              type="number"
              value={salaryRange.max}
              onChange={(e) => handleSalaryChange('max', e.target.value)}
              placeholder="e.g., 20"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Experience Range */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Experience (Years)</h4>
        <div className="space-y-2">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Minimum</label>
            <input
              type="number"
              value={experienceRange.min}
              onChange={(e) => handleExperienceChange('min', e.target.value)}
              placeholder="e.g., 0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Maximum</label>
            <input
              type="number"
              value={experienceRange.max}
              onChange={(e) => handleExperienceChange('max', e.target.value)}
              placeholder="e.g., 5"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Posted Within */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Posted Within</h4>
        <div className="space-y-2">
          {postedWithin.map((time) => (
            <label key={time} className="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
              <input
                type="radio"
                name="postedWithin"
                checked={filters.postedWithin === time}
                onChange={() => onFilterChange('postedWithin', time)}
                className="mr-2 text-primary focus:ring-primary"
              />
              <span className="text-sm text-gray-700">{time}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setShowMobileFilters(true)}
        className="lg:hidden fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-blue-700 z-40"
      >
        <FaFilter size={20} />
      </button>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-lg shadow p-6 sticky top-24">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Drawer */}
      {showMobileFilters && (
        <div className="lg:hidden fixed inset-0 z-50">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowMobileFilters(false)}
          />
          
          {/* Drawer */}
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              <FilterContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default JobFilters;
