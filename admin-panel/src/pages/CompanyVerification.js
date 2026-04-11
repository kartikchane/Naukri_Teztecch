import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { FaBuilding, FaCheck, FaTimes, FaBan, FaShieldAlt, FaStar, FaEye, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CompanyVerification = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('unverified'); // unverified, verified, suspended, all
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, [filter]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/companies');
      let filtered = data.companies || [];

      if (filter === 'unverified') {
        filtered = filtered.filter(c => !c.verified);
      } else if (filter === 'verified') {
        filtered = filtered.filter(c => c.verified);
      } else if (filter === 'suspended') {
        filtered = filtered.filter(c => c.suspended);
      }

      setCompanies(filtered);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast.error('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (companyId) => {
    try {
      await API.put(`/admin/companies/${companyId}`, { verified: true, suspended: false });
      toast.success('Company verified successfully');
      fetchCompanies();
    } catch (error) {
      toast.error('Failed to verify company');
    }
  };

  const handleSuspend = async (companyId) => {
    try {
      await API.put(`/admin/companies/${companyId}`, { suspended: true });
      toast.success('Company suspended successfully');
      fetchCompanies();
    } catch (error) {
      toast.error('Failed to suspend company');
    }
  };

  const handleReactivate = async (companyId) => {
    try {
      await API.put(`/admin/companies/${companyId}`, { suspended: false });
      toast.success('Company reactivated');
      fetchCompanies();
    } catch (error) {
      toast.error('Failed to reactivate company');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
            <FaShieldAlt className="text-blue-600" />
            Company Verification & Control
          </h1>
          <p className="text-gray-600">Manage company verification status and compliance</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg shadow p-1 overflow-x-auto">
          {['unverified', 'verified', 'suspended', 'all'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded font-semibold transition whitespace-nowrap ${
                filter === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'unverified' && <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">5</span>}
            </button>
          ))}
        </div>

        {/* Companies List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : companies.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FaBuilding className="mx-auto text-4xl text-gray-300 mb-4" />
            <p className="text-gray-600 text-lg">No companies in this category</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {companies.map((company) => (
              <div
                key={company._id}
                className={`bg-white rounded-lg shadow-md p-6 border-l-4 hover:shadow-lg transition ${
                  company.suspended
                    ? 'border-red-500'
                    : company.verified
                    ? 'border-green-500'
                    : 'border-yellow-500'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        {company.logo ? (
                          <img src={company.logo} alt={company.name} className="w-full h-full rounded object-cover" />
                        ) : (
                          <FaBuilding className="text-gray-500" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{company.name}</h3>
                        <p className="text-sm text-gray-600">{company.industry}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {company.verified && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <FaCheck /> Verified
                      </span>
                    )}
                    {company.suspended && (
                      <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                        <FaBan /> Suspended
                      </span>
                    )}
                    {!company.verified && !company.suspended && (
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Pending
                      </span>
                    )}
                  </div>
                </div>

                {/* Company Info */}
                <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-600 font-semibold">Owner</p>
                    <p className="text-gray-900">{company.owner?.name}</p>
                    <p className="text-gray-500">{company.owner?.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Size & Founded</p>
                    <p className="text-gray-900">{company.companySize}</p>
                    <p className="text-gray-500">Founded {company.founded}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Statistics</p>
                    <p className="text-gray-900">{company.jobsCount || 0} jobs posted</p>
                    <p className="text-gray-500">Rating: {company.averageRating || 'N/A'}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setSelectedCompany(company)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <FaEye /> View Details
                  </button>

                  {!company.verified && !company.suspended && (
                    <button
                      onClick={() => handleVerify(company._id)}
                      className="flex items-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm"
                    >
                      <FaCheck /> Verify Company
                    </button>
                  )}

                  {company.verified && !company.suspended && (
                    <button
                      onClick={() => handleSuspend(company._id)}
                      className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm"
                    >
                      <FaBan /> Suspend
                    </button>
                  )}

                  {company.suspended && (
                    <button
                      onClick={() => handleReactivate(company._id)}
                      className="flex items-center gap-2 bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-700 text-sm"
                    >
                      <FaCheck /> Reactivate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Company Details Modal */}
        {selectedCompany && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedCompany.name}</h2>
                  <button
                    onClick={() => setSelectedCompany(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-gray-600 font-semibold">Description</p>
                    <p className="text-gray-900">{selectedCompany.description}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Location</p>
                    <p className="text-gray-900">
                      {selectedCompany.location?.city}, {selectedCompany.location?.state}, {selectedCompany.location?.country}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 font-semibold">Website</p>
                    <a href={selectedCompany.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {selectedCompany.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyVerification;
