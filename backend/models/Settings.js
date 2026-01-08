const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // Site Information
  siteName: {
    type: String,
    default: 'Naukri Platform'
  },
  siteTagline: {
    type: String,
    default: 'Find Your Dream Job'
  },
  siteLogo: {
    type: String,
    default: '/logo.png'
  },
  favicon: {
    type: String,
    default: '/favicon.ico'
  },
  
  // Header Settings
  header: {
    showTopBar: {
      type: Boolean,
      default: true
    },
    topBarText: {
      type: String,
      default: 'Welcome to Naukri Platform - Find Your Dream Job Today!'
    },
    navigationItems: [{
      label: String,
      link: String,
      isExternal: {
        type: Boolean,
        default: false
      },
      order: Number
    }]
  },
  
  // Footer Settings
  footer: {
    aboutText: {
      type: String,
      default: 'Naukri Platform is your trusted job search portal connecting talented professionals with leading companies.'
    },
    copyrightText: {
      type: String,
      default: '© 2026 Naukri Platform. All rights reserved.'
    },
    showSocialLinks: {
      type: Boolean,
      default: true
    },
    columns: [{
      title: String,
      links: [{
        label: String,
        url: String
      }],
      order: Number
    }]
  },
  
  // Social Media Links
  socialMedia: {
    facebook: String,
    twitter: String,
    linkedin: String,
    instagram: String,
    youtube: String,
    github: String
  },
  
  // Contact Information
  contact: {
    email: String,
    phone: String,
    address: String,
    workingHours: String
  },
  
  // Homepage Hero Section
  hero: {
    title: {
      type: String,
      default: 'Find Your Dream Job Today'
    },
    subtitle: {
      type: String,
      default: 'Discover thousands of job opportunities from top companies'
    },
    backgroundImage: String,
    showSearchBar: {
      type: Boolean,
      default: true
    }
  },
  
  // Homepage Stats Section
  stats: {
    enabled: {
      type: Boolean,
      default: true
    },
    customStats: [{
      label: String,
      value: String,
      icon: String
    }]
  },
  
  // SEO Settings
  seo: {
    metaTitle: String,
    metaDescription: String,
    metaKeywords: String,
    googleAnalyticsId: String,
    facebookPixelId: String
  },
  
  // Theme/Design Settings
  theme: {
    primaryColor: {
      type: String,
      default: '#3B82F6'
    },
    secondaryColor: {
      type: String,
      default: '#8B5CF6'
    },
    accentColor: {
      type: String,
      default: '#10B981'
    }
  },
  
  // Maintenance Mode
  maintenance: {
    enabled: {
      type: Boolean,
      default: false
    },
    message: String
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
