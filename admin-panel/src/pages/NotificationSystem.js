import React, { useState, useEffect } from 'react';
import API from '../utils/api';
import { FaEnvelope, FaBell, FaToggleOn, FaToggleOff, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const NotificationSystem = () => {
  const [emailTemplates, setEmailTemplates] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState(null);

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    setLoading(true);
    try {
      // Mock data - in real app would fetch from API
      const mockTemplates = [
        {
          _id: '1',
          name: 'Job Applied',
          trigger: 'job_application',
          subject: 'Thank you for applying to {jobTitle}',
          enabled: true,
          preview: 'We received your application for {jobTitle} at {companyName}.',
          variables: ['{jobTitle}', '{companyName}', '{applicantName}']
        },
        {
          _id: '2',
          name: 'Application Status Update',
          trigger: 'application_status_change',
          subject: 'Update on your application - {status}',
          enabled: true,
          preview: 'Your application status has been updated to {status}.',
          variables: ['{jobTitle}', '{status}', '{companyName}']
        },
        {
          _id: '3',
          name: 'Job Posted (Employer)',
          trigger: 'job_posted',
          subject: 'Your job {jobTitle} is now live',
          enabled: true,
          preview: 'Congratulations! Your job posting is now visible to job seekers.',
          variables: ['{jobTitle}', '{applicationsReceived}']
        },
        {
          _id: '4',
          name: 'Daily Job Digest',
          trigger: 'daily_digest',
          subject: 'Your daily job matches - {date}',
          enabled: false,
          preview: 'Here are {count} new jobs matching your profile.',
          variables: ['{count}', '{date}']
        },
        {
          _id: '5',
          name: 'New Application Received (Employer)',
          trigger: 'new_application',
          subject: 'New application for {jobTitle}',
          enabled: true,
          preview: '{applicantName} applied for {jobTitle}.',
          variables: ['{applicantName}', '{jobTitle}', '{applicantEmail}']
        }
      ];
      setEmailTemplates(mockTemplates);
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      toast.error('Failed to load notification settings');
    } finally {
      setLoading(false);
    }
  };

  const toggleTemplate = async (templateId) => {
    try {
      const updated = emailTemplates.map(t =>
        t._id === templateId ? { ...t, enabled: !t.enabled } : t
      );
      setEmailTemplates(updated);
      toast.success('Notification status updated');
      // API call would go here
    } catch (error) {
      toast.error('Failed to update notification');
    }
  };

  const saveTemplate = async (template) => {
    try {
      // API call would go here
      toast.success('Email template saved successfully');
      setEditingTemplate(null);
      fetchNotificationSettings();
    } catch (error) {
      toast.error('Failed to save email template');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3 mb-2">
            <FaBell className="text-blue-600" />
            Email Notification System
          </h1>
          <p className="text-gray-600">Manage email templates and notification settings</p>
        </div>

        {/* Notification Templates */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {emailTemplates.map((template) => (
              <div key={template._id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FaEnvelope className="text-blue-600 text-lg" />
                      <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {template.trigger}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">Subject: {template.subject}</p>
                    <p className="text-gray-600 text-sm mt-2">{template.preview}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleTemplate(template._id)}
                      className={`text-3xl transition ${
                        template.enabled ? 'text-green-600' : 'text-gray-400'
                      }`}
                    >
                      {template.enabled ? <FaToggleOn /> : <FaToggleOff />}
                    </button>
                  </div>
                </div>

                {/* Variables Info */}
                <div className="bg-gray-50 rounded p-3 mb-4 text-sm">
                  <p className="text-gray-700 font-semibold mb-2">Available Variables:</p>
                  <div className="flex flex-wrap gap-2">
                    {template.variables.map((variable, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono">
                        {variable}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingTemplate(template)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <FaEdit /> Edit Template
                  </button>
                  <button className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm">
                    <FaEnvelope /> Send Test Email
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Template Modal */}
        {editingTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Edit Email Template</h2>
                <button
                  onClick={() => setEditingTemplate(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={editingTemplate.subject}
                    onChange={(e) =>
                      setEditingTemplate({ ...editingTemplate, subject: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Content
                  </label>
                  <textarea
                    value={editingTemplate.preview}
                    onChange={(e) =>
                      setEditingTemplate({ ...editingTemplate, preview: e.target.value })
                    }
                    placeholder="Use variables like {jobTitle}, {companyName}, etc."
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    rows="8"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setEditingTemplate(null)}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => saveTemplate(editingTemplate)}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
                  >
                    <FaSave /> Save Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationSystem;
