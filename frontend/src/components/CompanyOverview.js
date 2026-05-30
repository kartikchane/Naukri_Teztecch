import React, { useEffect, useState, useCallback } from 'react';
import {
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaUtensils,
  FaHeartPulse,
  FaChalkboardUser,
  FaShieldHalved,
  FaGift,
} from 'react-icons/fa6';
import { getFileUrl } from '../utils/fileUtils';
import API from '../utils/api';
import CompanyPhotoGallery from './CompanyPhotoGallery';

const CompanyOverview = ({ company }) => {
  const [departments, setDepartments] = useState([]);
  const [benefits, setBenefits] = useState([]);
  const [salaries, setSalaries] = useState([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllBenefits, setShowAllBenefits] = useState(false);
  const [showAllSalaries, setShowAllSalaries] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      console.log('🔄 Starting fetchData for company:', company._id);
      
      // Fetch gallery separately to prevent failures from blocking other data
      let galleryData = [];
      try {
        const galleryRes = await API.get(`/gallery/company/${company._id}`);
        console.log('✅ Gallery fetched:', { count: galleryRes.data?.count, dataLength: galleryRes.data?.data?.length });
        galleryData = galleryRes.data?.data || [];
      } catch (galleryError) {
        console.warn('⚠️ Gallery fetch failed:', galleryError.message);
      }

      // Fetch other data
      let deptData = [];
      let benefitsData = [];
      let salariesData = [];
      
      try {
        const [deptRes, benefitsRes, salariesRes] = await Promise.all([
          API.get(`/companies/${company._id}/departments`).catch(err => {
            console.warn('Departments fetch failed:', err.message);
            return { data: [] };
          }),
          API.get(`/companies/${company._id}/benefits`).catch(err => {
            console.warn('Benefits fetch failed:', err.message);
            return { data: [] };
          }),
          API.get(`/companies/${company._id}/salaries`).catch(err => {
            console.warn('Salaries fetch failed:', err.message);
            return { data: [] };
          }),
        ]);

        deptData = Array.isArray(deptRes.data) ? deptRes.data : deptRes.data.data || [];
        benefitsData = Array.isArray(benefitsRes.data) ? benefitsRes.data : benefitsRes.data.data || [];
        salariesData = Array.isArray(salariesRes.data) ? salariesRes.data : salariesRes.data.data || [];
      } catch (error) {
        console.warn('Error fetching departments/benefits/salaries:', error);
      }

      setDepartments(deptData);
      setBenefits(benefitsData);
      setSalaries(salariesData);

      // Process gallery images
      if (galleryData.length > 0) {
        // Sort by displayOrder
        const sortedData = [...galleryData].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
        const photoUrls = sortedData
          .map(img => {
            let imagePath = img.imageUrl || img.path || img;
            if (typeof imagePath === 'object') {
              imagePath = imagePath.imageUrl || imagePath.path || '';
            }
            if (!imagePath) return null;
            
            // Handle relative paths
            if (!imagePath.startsWith('http')) {
              if (!imagePath.startsWith('uploads/')) {
                imagePath = `uploads/${imagePath}`;
              }
              return getFileUrl(imagePath);
            }
            return imagePath;
          })
          .filter(url => url && url.trim()); // Remove nulls and empty strings
        
        console.log('✅ Gallery photos processed:', {
          totalInDb: galleryData.length,
          validUrls: photoUrls.length,
          firstUrl: photoUrls[0]?.substring(0, 80) || 'N/A'
        });
        
        setGalleryPhotos(photoUrls);
      } else {
        console.log('ℹ️ No gallery images found, using company photos fallback');
        // Use company photos as fallback
        if (company?.companyPhotos && Array.isArray(company.companyPhotos)) {
          const fallbackUrls = company.companyPhotos
            .map(photo => {
              const path = photo.startsWith('uploads/') ? photo : `uploads/${photo}`;
              return getFileUrl(path);
            })
            .filter(url => url);
          setGalleryPhotos(fallbackUrls);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching company data:', error);
      setDepartments([]);
      setBenefits([]);
      setSalaries([]);
      setGalleryPhotos([]);
    } finally {
      setLoading(false);
    }
  }, [company?._id, company?.companyPhotos]);

  useEffect(() => {
    if (company?._id) {
      fetchData();
    }
  }, [fetchData, company?._id]);

  const benefitIcons = {
    'Free meal': FaUtensils,
    'Health insurance': FaHeartPulse,
    'Cafeteria': FaUtensils,
    'Job/Soft skill training': FaChalkboardUser,
    'Child care facility': FaShieldHalved,
  };

  const getSocialIcon = (platform) => {
    const icons = {
      linkedin: FaLinkedin,
      twitter: FaTwitter,
      facebook: FaFacebook,
      instagram: FaInstagram,
      youtube: FaYoutube,
    };
    return icons[platform] || null;
  };

  return (
    <>
      <div className="space-y-6">
      {/* About Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">About {company?.name}</h2>
        <p className="text-gray-700 leading-relaxed">{company?.description}</p>
        <button className="text-blue-600 font-semibold mt-3 hover:text-blue-700">
          read more
        </button>
      </div>

      {/* Life at Company - Photo Gallery */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Life at {company?.name}</h2>
          <button className="text-blue-600 font-semibold hover:text-blue-700">
            View gallery →
          </button>
        </div>
        {loading && galleryPhotos.length === 0 && (
          <div className="bg-gray-100 h-96 flex items-center justify-center rounded-lg">
            <p className="text-gray-500">Loading gallery...</p>
          </div>
        )}
        {!loading && galleryPhotos.length > 0 && (
          <CompanyPhotoGallery key={`gallery-${galleryPhotos.length}`} photos={galleryPhotos} />
        )}
        {!loading && galleryPhotos.length === 0 && company?.companyPhotos && company.companyPhotos.length > 0 && (
          <CompanyPhotoGallery key="fallback" photos={company.companyPhotos} />
        )}
        {!loading && galleryPhotos.length === 0 && (!company?.companyPhotos || company.companyPhotos.length === 0) && (
          <CompanyPhotoGallery key="default" photos={[]} />
        )}
      </div>

      {/* Departments Hiring */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Departments hiring at {company?.name}
        </h2>
        <div className="grid md:grid-cols-5 gap-3">
          {loading ? (
            <div className="col-span-5 text-center py-4">Loading departments...</div>
          ) : departments && departments.length > 0 ? (
            departments.map((dept, index) => (
              <div
                key={index}
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
              >
                <h3 className="font-semibold text-gray-900 text-sm mb-2">{dept.name}</h3>
                <p className="text-blue-600 font-bold">{dept.openings} openings ></p>
              </div>
            ))
          ) : (
            <div className="col-span-5 text-center text-gray-600 py-4">
              No open positions at the moment
            </div>
          )}
        </div>
      </div>

      {/* Benefits Reported by Employees */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Benefits reported by employees</h2>
          <button
            onClick={() => setShowAllBenefits(true)}
            className="text-blue-600 font-semibold hover:text-blue-700">
            View all benefits →
          </button>
        </div>
        <div className="grid md:grid-cols-5 gap-4">
          {benefits && benefits.length > 0 && benefits.slice(0, 5).map((benefit, index) => {
            const IconComponent = benefitIcons[benefit.name] || FaGift;
            return (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <IconComponent className="text-3xl text-primary" />
                </div>
                <p className="text-sm text-gray-700">{benefit.name}</p>
                <p className="text-xs text-gray-500 mt-1">({benefit.count})</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Employee Salaries */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Employee Salaries</h2>
          <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
            <option>All Departments</option>
            {departments && departments.length > 0 && departments.map((dept, index) => (
              <option key={index}>{dept.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="text-center py-4">Loading salary data...</div>
        ) : salaries && salaries.length > 0 ? (
          <div className="space-y-3">
            {salaries.slice(0, 3).map((salary, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{salary.jobTitle}</h4>
                    <p className="text-sm text-gray-600">
                      with {salary.experienceLevel} experience ({salary.count} salaries)
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-grow bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(100, (salary.maxSalary / 150000) * 100)}%`,
                      }}
                    ></div>
                  </div>
                  <span className="font-bold text-gray-900 whitespace-nowrap">
                    ₹ {(salary.minSalary / 100000).toFixed(1)}L - ₹ {(salary.maxSalary / 100000).toFixed(1)}L
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 py-4">
            No salary data available
          </div>
        )}
        <button
          onClick={() => setShowAllSalaries(true)}
          className="mt-4 text-blue-600 font-semibold hover:text-blue-700">
          View all salaries →
        </button>
      </div>

      {/* More Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">More Information</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="text-gray-600 text-sm font-semibold block mb-1">
                Type
              </label>
              <p className="text-gray-900 font-semibold">{company?.industry}</p>
            </div>
            <div>
              <label className="text-gray-600 text-sm font-semibold block mb-1">
                Founded
              </label>
              <p className="text-gray-900 font-semibold">{company?.founded || 'N/A'}</p>
            </div>
            <div>
              <label className="text-gray-600 text-sm font-semibold block mb-1">
                Company Size
              </label>
              <p className="text-gray-900 font-semibold">{company?.companySize}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-gray-600 text-sm font-semibold block mb-1">
                Headquarters
              </label>
              <p className="text-gray-900 font-semibold">
                {company?.location?.city}, {company?.location?.state}
              </p>
            </div>
            <div>
              <label className="text-gray-600 text-sm font-semibold block mb-1">
                Website
              </label>
              {company?.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  {company.website}
                </a>
              ) : (
                <p className="text-gray-500">Not provided</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      {
        Object.values(company?.socialLinks || {}).some(link => link) && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Connect with {company?.name}
            </h2>
            <div className="flex gap-4">
              {Object.entries(company?.socialLinks || {}).map(([platform, url]) => {
                if (!url) return null;
                const IconComponent = getSocialIcon(platform);
                return IconComponent ? (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-red-600 hover:text-red-700 transition"
                  >
                    <IconComponent className="text-3xl" />
                  </a>
                ) : null;
              })}
            </div>
          </div>
        )
      }
      </div>

      {/* All Benefits Modal */}
      {showAllBenefits && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">All Benefits</h2>
            <button
              onClick={() => setShowAllBenefits(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {benefits && benefits.length > 0 ? (
              benefits.map((benefit, index) => {
                const IconComponent = benefitIcons[benefit.name] || FaGift;
                return (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                    <div className="flex justify-center mb-2">
                      <IconComponent className="text-3xl text-blue-600" />
                    </div>
                    <p className="font-semibold text-gray-900">{benefit.name}</p>
                    <p className="text-sm text-gray-600 mt-1">{benefit.count} employees</p>
                  </div>
                );
              })
            ) : (
              <div className="col-span-3 text-center text-gray-600 py-4">
                No benefits data available
              </div>
            )}
          </div>
        </div>
      </div>
    )}

    {/* All Salaries Modal */}
    {showAllSalaries && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-96 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">All Employee Salaries</h2>
            <button
              onClick={() => setShowAllSalaries(false)}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>
          </div>
          {salaries && salaries.length > 0 ? (
            <div className="space-y-4">
              {salaries.map((salary, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{salary.jobTitle}</h4>
                      <p className="text-sm text-gray-600">
                        {salary.experienceLevel} ({salary.count} salaries reported)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-grow bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                        style={{
                          width: `${Math.min(100, (salary.maxSalary / 150000) * 100)}%`,
                        }}
                      ></div>
                    </div>
                    <span className="font-bold text-gray-900 whitespace-nowrap">
                      ₹ {(salary.minSalary / 100000).toFixed(1)}L - ₹ {(salary.maxSalary / 100000).toFixed(1)}L
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 py-8">
              No salary data available
            </div>
          )}
        </div>
      </div>
      )}
    </>
  );
};

export default CompanyOverview;
