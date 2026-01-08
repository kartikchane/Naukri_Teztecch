import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../utils/api';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    siteName: 'Naukri Platform',
    siteTagline: 'Find Your Dream Job',
    siteLogo: '/logo.png',
    header: {
      showTopBar: true,
      topBarText: 'Welcome to Naukri Platform - Find Your Dream Job Today!',
      navigationItems: []
    },
    footer: {
      aboutText: 'Naukri Platform is your trusted job search portal connecting talented professionals with leading companies.',
      copyrightText: '© 2026 Naukri Platform. All rights reserved.',
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
      title: 'Find Your Dream Job Today',
      subtitle: 'Discover thousands of job opportunities from top companies',
      backgroundImage: '',
      showSearchBar: true
    },
    theme: {
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6',
      accentColor: '#10B981'
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await API.get('/settings');
      setSettings(data);
      
      // Apply theme colors to CSS variables
      if (data.theme) {
        document.documentElement.style.setProperty('--primary-color', data.theme.primaryColor);
        document.documentElement.style.setProperty('--secondary-color', data.theme.secondaryColor);
        document.documentElement.style.setProperty('--accent-color', data.theme.accentColor);
      }
      
      // Update page title
      if (data.siteName) {
        document.title = `${data.siteName} - ${data.siteTagline || 'Find Your Dream Job'}`;
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshSettings = () => {
    fetchSettings();
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
