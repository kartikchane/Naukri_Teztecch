import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { FaCog, FaSave, FaTimes, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { toast } from 'react-toastify';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    general: {
      platformName: 'Naukri Platform',
      supportEmail: 'support@naukri.com',
      supportPhone: '+91-8888-8888-88',
      country: 'India',
      timezone: 'IST'
    },
    features: {
      jobApproval: true,
      emailNotifications: true,
      smsNotifications: false,
      companyVerification: true,
      userReviews: true,
      videoInterviews: false
    },
    commission: {
      jobPostingFee: 5000,
      premiumJobFee: 15000,
      featuredJobFee: 25000,
      commissionPercentage: 10
    },
    security: {
      maxLoginAttempts: 5,
      passwordResetTimeout: 24,
      sessionTimeout: 30,
      requireEmailVerification: true,
      enableTwoFactor: false
    },
    maintenance: {
      maintenanceMode: false,
      maintenanceMessage: 'Platform is under maintenance',
      maxUploadSize: 5, // MB
      allowedFileTypes: '.pdf,.doc,.docx,.jpg,.png'
    }
  });

  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);

  const saveSettings = async () => {
    setSaving(true);
    try {
      // API call would go here
      // await API.put('/admin/settings', settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleFeature = (feature) => {
    setSettings({
      ...settings,
      features: {
        ...settings.features,
        [feature]: !settings.features[feature]
      }
    });
  };

  const SettingInput = ({ label, value, onChange, type = 'text', description }) => (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-gray-900 mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-500"
          rows="4"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500"
        />
      )}
      {description && <p className="text-xs text-gray-600 mt-1">{description}</p>}
    </div>
  );

  const FeatureToggle = ({ name, enabled, onToggle }) => (
    <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg mb-2">
      <span className="font-semibold text-gray-900">{name}</span>
      <button
        onClick={onToggle}
        className={`text-3xl transition ${enabled ? 'text-green-600' : 'text-gray-400'}`}
      >
        {enabled ? <FaToggleOn /> : <FaToggleOff />}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
              <FaCog className="text-blue-600" />
              System Settings
            </h1>
            <p className="text-gray-600">Configure platform behavior and business rules</p>
          </div>
          <button
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <FaSave /> Save Settings
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-lg shadow p-2 overflow-x-auto">
          {['general', 'features', 'commission', 'security', 'maintenance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded font-semibold transition whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">General Settings</h2>
              <SettingInput
                label="Platform Name"
                value={settings.general.platformName}
                onChange={(val) => setSettings({
                  ...settings,
                  general: { ...settings.general, platformName: val }
                })}
              />
              <SettingInput
                label="Support Email"
                value={settings.general.supportEmail}
                onChange={(val) => setSettings({
                  ...settings,
                  general: { ...settings.general, supportEmail: val }
                })}
                type="email"
              />
              <SettingInput
                label="Support Phone"
                value={settings.general.supportPhone}
                onChange={(val) => setSettings({
                  ...settings,
                  general: { ...settings.general, supportPhone: val }
                })}
              />
              <SettingInput
                label="Country"
                value={settings.general.country}
                onChange={(val) => setSettings({
                  ...settings,
                  general: { ...settings.general, country: val }
                })}
              />
              <SettingInput
                label="Timezone"
                value={settings.general.timezone}
                onChange={(val) => setSettings({
                  ...settings,
                  general: { ...settings.general, timezone: val }
                })}
              />
            </div>
          )}

          {/* Feature Toggles */}
          {activeTab === 'features' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Feature Toggles</h2>
              <p className="text-gray-600 mb-4">Enable or disable platform features</p>
              <FeatureToggle
                name="Job Approval Workflow"
                enabled={settings.features.jobApproval}
                onToggle={() => toggleFeature('jobApproval')}
              />
              <FeatureToggle
                name="Email Notifications"
                enabled={settings.features.emailNotifications}
                onToggle={() => toggleFeature('emailNotifications')}
              />
              <FeatureToggle
                name="SMS Notifications"
                enabled={settings.features.smsNotifications}
                onToggle={() => toggleFeature('smsNotifications')}
              />
              <FeatureToggle
                name="Company Verification"
                enabled={settings.features.companyVerification}
                onToggle={() => toggleFeature('companyVerification')}
              />
              <FeatureToggle
                name="User Reviews"
                enabled={settings.features.userReviews}
                onToggle={() => toggleFeature('userReviews')}
              />
              <FeatureToggle
                name="Video Interviews"
                enabled={settings.features.videoInterviews}
                onToggle={() => toggleFeature('videoInterviews')}
              />
            </div>
          )}

          {/* Commission Settings */}
          {activeTab === 'commission' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Commission & Pricing</h2>
              <SettingInput
                label="Job Posting Fee (₹)"
                value={settings.commission.jobPostingFee}
                onChange={(val) => setSettings({
                  ...settings,
                  commission: { ...settings.commission, jobPostingFee: parseInt(val) }
                })}
                type="number"
                description="Default fee for posting a job"
              />
              <SettingInput
                label="Premium Job Fee (₹)"
                value={settings.commission.premiumJobFee}
                onChange={(val) => setSettings({
                  ...settings,
                  commission: { ...settings.commission, premiumJobFee: parseInt(val) }
                })}
                type="number"
                description="Fee for premium job listings"
              />
              <SettingInput
                label="Featured Job Fee (₹)"
                value={settings.commission.featuredJobFee}
                onChange={(val) => setSettings({
                  ...settings,
                  commission: { ...settings.commission, featuredJobFee: parseInt(val) }
                })}
                type="number"
                description="Fee for featured job placements"
              />
              <SettingInput
                label="Commission Percentage (%)"
                value={settings.commission.commissionPercentage}
                onChange={(val) => setSettings({
                  ...settings,
                  commission: { ...settings.commission, commissionPercentage: parseInt(val) }
                })}
                type="number"
                description="Platform commission on premium services"
              />
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Security Settings</h2>
              <SettingInput
                label="Max Login Attempts"
                value={settings.security.maxLoginAttempts}
                onChange={(val) => setSettings({
                  ...settings,
                  security: { ...settings.security, maxLoginAttempts: parseInt(val) }
                })}
                type="number"
              />
              <SettingInput
                label="Password Reset Timeout (hours)"
                value={settings.security.passwordResetTimeout}
                onChange={(val) => setSettings({
                  ...settings,
                  security: { ...settings.security, passwordResetTimeout: parseInt(val) }
                })}
                type="number"
              />
              <SettingInput
                label="Session Timeout (minutes)"
                value={settings.security.sessionTimeout}
                onChange={(val) => setSettings({
                  ...settings,
                  security: { ...settings.security, sessionTimeout: parseInt(val) }
                })}
                type="number"
              />
              <FeatureToggle
                name="Require Email Verification"
                enabled={settings.security.requireEmailVerification}
                onToggle={() => setSettings({
                  ...settings,
                  security: {
                    ...settings.security,
                    requireEmailVerification: !settings.security.requireEmailVerification
                  }
                })}
              />
              <FeatureToggle
                name="Enable Two-Factor Authentication"
                enabled={settings.security.enableTwoFactor}
                onToggle={() => setSettings({
                  ...settings,
                  security: {
                    ...settings.security,
                    enableTwoFactor: !settings.security.enableTwoFactor
                  }
                })}
              />
            </div>
          )}

          {/* Maintenance Settings */}
          {activeTab === 'maintenance' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Maintenance Mode</h2>
              <FeatureToggle
                name="Enable Maintenance Mode"
                enabled={settings.maintenance.maintenanceMode}
                onToggle={() => setSettings({
                  ...settings,
                  maintenance: {
                    ...settings.maintenance,
                    maintenanceMode: !settings.maintenance.maintenanceMode
                  }
                })}
              />
              <SettingInput
                label="Maintenance Message"
                value={settings.maintenance.maintenanceMessage}
                onChange={(val) => setSettings({
                  ...settings,
                  maintenance: { ...settings.maintenance, maintenanceMessage: val }
                })}
                type="textarea"
                description="Message shown to users during maintenance"
              />
              <SettingInput
                label="Max Upload Size (MB)"
                value={settings.maintenance.maxUploadSize}
                onChange={(val) => setSettings({
                  ...settings,
                  maintenance: { ...settings.maintenance, maxUploadSize: parseInt(val) }
                })}
                type="number"
              />
              <SettingInput
                label="Allowed File Types"
                value={settings.maintenance.allowedFileTypes}
                onChange={(val) => setSettings({
                  ...settings,
                  maintenance: { ...settings.maintenance, allowedFileTypes: val }
                })}
                description="Comma-separated file extensions"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
