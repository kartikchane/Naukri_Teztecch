import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../utils/api';
import { FaSave, FaUpload, FaGlobe, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaGithub, FaEnvelope, FaPhone, FaMapMarkerAlt, FaPalette, FaCog } from 'react-icons/fa';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    siteName: '',
    siteTagline: '',
    siteLogo: '',
    header: {
      showTopBar: true,
      topBarText: '',
      navigationItems: []
    },
    footer: {
      aboutText: '',
      copyrightText: '',
      showSocialLinks: true,
      columns: []
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      youtube: '',
      github: ''
    },
    contact: {
      email: '',
      phone: '',
      address: '',
      workingHours: ''
    },
    hero: {
      title: '',
      subtitle: '',
      backgroundImage: '',
      showSearchBar: true
    },
    theme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6',
      accentColor: '#10B981'
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await API.get('/settings');
      setSettings(data);
    } catch (error) {
      toast.error('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await API.put('/settings', settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const { data } = await API.post('/settings/upload-logo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSettings({ ...settings, siteLogo: data.logoUrl });
      toast.success('Logo uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload logo');
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: <FaGlobe /> },
    { id: 'header', label: 'Header', icon: <FaCog /> },
    { id: 'footer', label: 'Footer', icon: <FaCog /> },
    { id: 'social', label: 'Social Media', icon: <FaFacebook /> },
    { id: 'contact', label: 'Contact', icon: <FaEnvelope /> },
    { id: 'hero', label: 'Homepage Hero', icon: <FaGlobe /> },
    { id: 'theme', label: 'Theme Colors', icon: <FaPalette /> }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
        <p className="ml-4 text-gray-600 font-medium">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header with Gradient */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg transform hover:scale-105 transition">
            <FaCog className="text-white text-2xl" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Website Settings
            </h1>
            <p className="text-gray-600 mt-1">Manage your website configuration and appearance</p>
          </div>
        </div>
      </div>

      {/* Modern Tabs with Pills */}
      <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl shadow-lg border border-gray-200 mb-6 p-4">
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-semibold whitespace-nowrap rounded-xl transition-all transform hover:scale-105 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">General Settings</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Naukri Platform"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Tagline</label>
              <input
                type="text"
                value={settings.siteTagline}
                onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Find Your Dream Job"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Logo</label>
              <div className="flex items-center gap-4">
                {settings.siteLogo && (
                  <img src={settings.siteLogo} alt="Logo" className="h-16 w-16 object-contain border rounded" />
                )}
                <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <FaUpload />
                  Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Header Settings */}
        {activeTab === 'header' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Header Settings</h2>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.header?.showTopBar}
                onChange={(e) => setSettings({
                  ...settings,
                  header: { ...settings.header, showTopBar: e.target.checked }
                })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label className="text-sm font-medium text-gray-700">Show Top Bar</label>
            </div>

            {settings.header?.showTopBar && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Top Bar Text</label>
                <input
                  type="text"
                  value={settings.header?.topBarText || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    header: { ...settings.header, topBarText: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Welcome message"
                />
              </div>
            )}
          </div>
        )}

        {/* Footer Settings */}
        {activeTab === 'footer' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Footer Settings</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">About Text</label>
              <textarea
                value={settings.footer?.aboutText || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  footer: { ...settings.footer, aboutText: e.target.value }
                })}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="About your platform..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
              <input
                type="text"
                value={settings.footer?.copyrightText || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  footer: { ...settings.footer, copyrightText: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="© 2026 Naukri Platform"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.footer?.showSocialLinks}
                onChange={(e) => setSettings({
                  ...settings,
                  footer: { ...settings.footer, showSocialLinks: e.target.checked }
                })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label className="text-sm font-medium text-gray-700">Show Social Links in Footer</label>
            </div>
          </div>
        )}

        {/* Social Media */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Social Media Links</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FaFacebook className="text-blue-600" /> Facebook
                </label>
                <input
                  type="url"
                  value={settings.socialMedia?.facebook || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, facebook: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FaTwitter className="text-blue-400" /> Twitter
                </label>
                <input
                  type="url"
                  value={settings.socialMedia?.twitter || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, twitter: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://twitter.com/yourhandle"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FaLinkedin className="text-blue-700" /> LinkedIn
                </label>
                <input
                  type="url"
                  value={settings.socialMedia?.linkedin || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, linkedin: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://linkedin.com/company/yourcompany"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FaInstagram className="text-pink-600" /> Instagram
                </label>
                <input
                  type="url"
                  value={settings.socialMedia?.instagram || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, instagram: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://instagram.com/yourhandle"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FaYoutube className="text-red-600" /> YouTube
                </label>
                <input
                  type="url"
                  value={settings.socialMedia?.youtube || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, youtube: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://youtube.com/@yourchannel"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FaGithub /> GitHub
                </label>
                <input
                  type="url"
                  value={settings.socialMedia?.github || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    socialMedia: { ...settings.socialMedia, github: e.target.value }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://github.com/yourorg"
                />
              </div>
            </div>
          </div>
        )}

        {/* Contact Settings */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaEnvelope /> Email
              </label>
              <input
                type="email"
                value={settings.contact?.email || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  contact: { ...settings.contact, email: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="contact@example.com"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaPhone /> Phone
              </label>
              <input
                type="tel"
                value={settings.contact?.phone || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  contact: { ...settings.contact, phone: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt /> Address
              </label>
              <textarea
                value={settings.contact?.address || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  contact: { ...settings.contact, address: e.target.value }
                })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Your office address"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours</label>
              <input
                type="text"
                value={settings.contact?.workingHours || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  contact: { ...settings.contact, workingHours: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Mon-Fri: 9AM-6PM"
              />
            </div>
          </div>
        )}

        {/* Hero Section */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Homepage Hero Section</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
              <input
                type="text"
                value={settings.hero?.title || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  hero: { ...settings.hero, title: e.target.value }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Find Your Dream Job Today"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
              <textarea
                value={settings.hero?.subtitle || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  hero: { ...settings.hero, subtitle: e.target.value }
                })}
                rows="2"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Discover thousands of job opportunities..."
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.hero?.showSearchBar}
                onChange={(e) => setSettings({
                  ...settings,
                  hero: { ...settings.hero, showSearchBar: e.target.checked }
                })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label className="text-sm font-medium text-gray-700">Show Search Bar</label>
            </div>
          </div>
        )}

        {/* Theme Colors */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Theme Colors</h2>
            <p className="text-gray-600 mb-4">Customize the color scheme of your website</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.theme?.primaryColor || '#3B82F6'}
                    onChange={(e) => setSettings({
                      ...settings,
                      theme: { ...settings.theme, primaryColor: e.target.value }
                    })}
                    className="h-12 w-20 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.theme?.primaryColor || '#3B82F6'}
                    onChange={(e) => setSettings({
                      ...settings,
                      theme: { ...settings.theme, primaryColor: e.target.value }
                    })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.theme?.secondaryColor || '#8B5CF6'}
                    onChange={(e) => setSettings({
                      ...settings,
                      theme: { ...settings.theme, secondaryColor: e.target.value }
                    })}
                    className="h-12 w-20 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.theme?.secondaryColor || '#8B5CF6'}
                    onChange={(e) => setSettings({
                      ...settings,
                      theme: { ...settings.theme, secondaryColor: e.target.value }
                    })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.theme?.accentColor || '#10B981'}
                    onChange={(e) => setSettings({
                      ...settings,
                      theme: { ...settings.theme, accentColor: e.target.value }
                    })}
                    className="h-12 w-20 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.theme?.accentColor || '#10B981'}
                    onChange={(e) => setSettings({
                      ...settings,
                      theme: { ...settings.theme, accentColor: e.target.value }
                    })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end mt-8 pt-6 border-t-2 border-gray-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:shadow-2xl font-semibold flex items-center gap-3 disabled:opacity-50 transform hover:scale-105 transition-all"
          >
            <FaSave className="text-xl" />
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
