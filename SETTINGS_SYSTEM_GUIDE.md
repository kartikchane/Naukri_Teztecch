# Website Settings Management System

## Overview
Your Naukri Platform now has a comprehensive settings management system that allows you to control the entire website from the admin panel - including logo, colors, content, social media links, and more.

## Features

### 1. **General Settings**
- Site Name
- Site Tagline
- Logo Upload (with preview)
- Favicon Upload
- SEO Settings (Meta Title, Description, Keywords)
- Maintenance Mode Toggle

### 2. **Header Settings**
- Top Bar (Enable/Disable)
- Top Bar Text (custom message)
- Navigation Items Management

### 3. **Footer Settings**
- About Text
- Copyright Text
- Show/Hide Social Links
- Footer Columns Configuration

### 4. **Social Media**
- Facebook URL
- Twitter URL
- LinkedIn URL
- Instagram URL
- YouTube URL
- GitHub URL

### 5. **Contact Information**
- Email Address
- Phone Number
- Physical Address
- Working Hours

### 6. **Homepage Hero Section**
- Hero Title
- Hero Subtitle
- Background Image Upload
- Show/Hide Search Bar

### 7. **Theme Colors**
- Primary Color (Brand color)
- Secondary Color
- Accent Color
- Real-time CSS variable updates

## How to Use

### Accessing Settings
1. Login to admin panel: `http://localhost:3001/login`
2. Click "Website Settings" in the sidebar (gear icon)
3. Use tabs to navigate between different settings sections

### Uploading Images
1. Click "Choose File" button
2. Select image (PNG, JPG, JPEG, GIF - Max 5MB)
3. Preview will show immediately
4. Click "Save Settings" to apply

### Changing Colors
1. Go to "Theme Colors" tab
2. Click on color picker
3. Select your desired color
4. Colors apply to CSS variables automatically
5. Click "Save Settings" to persist changes

### Updating Text Content
1. Type directly in input fields
2. Use checkboxes to enable/disable features
3. Click "Save Settings" to apply changes
4. Changes reflect on main website immediately

## Settings Storage
- All settings stored in MongoDB
- Single settings document (singleton pattern)
- Persistent across server restarts
- Images stored in `/backend/uploads/` directory

## API Endpoints

### Public Access
- `GET /api/settings` - Fetch current settings

### Admin Only (Requires Authentication)
- `PUT /api/settings` - Update all settings
- `POST /api/settings/upload-logo` - Upload site logo
- `POST /api/settings/upload-favicon` - Upload favicon
- `POST /api/settings/upload-hero-bg` - Upload hero background
- `PUT /api/settings/header` - Update header settings
- `PUT /api/settings/footer` - Update footer settings
- `PUT /api/settings/social` - Update social media links

## Frontend Integration

### Components Using Settings
1. **Navbar** (`frontend/src/components/Navbar.js`)
   - Dynamic logo
   - Dynamic site name
   - Top bar with custom message

2. **Footer** (`frontend/src/components/Footer.js`)
   - Dynamic logo and site name
   - Dynamic about text
   - Conditional social media links
   - Dynamic contact information
   - Dynamic copyright text

3. **Home** (`frontend/src/pages/Home.js`)
   - Dynamic hero title
   - Dynamic hero subtitle
   - Dynamic hero background image
   - Conditional search bar

### Settings Context
- Located at: `frontend/src/context/SettingsContext.js`
- Provides `settings` object to all components
- Fetches settings on app load
- Applies theme colors to CSS variables
- Updates document title

### Using Settings in Components
```javascript
import { useSettings } from '../context/SettingsContext';

function MyComponent() {
  const { settings, refreshSettings } = useSettings();
  
  return (
    <div>
      <h1>{settings.siteName}</h1>
      <img src={settings.siteLogo} alt="Logo" />
    </div>
  );
}
```

## Testing the System

### Step 1: Start Servers
```bash
# Backend (Terminal 1)
cd backend
npm start

# Frontend (Terminal 2)
cd frontend
npm start

# Admin Panel (Terminal 3)
cd admin-panel
npm start
```

### Step 2: Configure Settings
1. Open admin panel: `http://localhost:3001`
2. Login with admin credentials
3. Go to Website Settings
4. Upload a logo
5. Change site name to "My Job Platform"
6. Add social media links
7. Change primary color to red (#ff0000)
8. Click "Save Settings"

### Step 3: Verify Changes
1. Open main website: `http://localhost:3000`
2. Check if logo appears in navbar and footer
3. Check if site name changed
4. Check if social media icons appear
5. Check if primary color changed (buttons, links)
6. Refresh page to verify persistence

## Default Values
If settings are not configured, these defaults are used:
- Site Name: "Naukri Platform"
- Logo: `/teztech-logo.svg`
- Hero Title: "Find Your Dream Job"
- Hero Subtitle: "Discover thousands of job opportunities..."
- Copyright: "© [Current Year] Naukri Platform. All rights reserved."

## File Structure
```
backend/
├── models/
│   └── Settings.js              # Settings database model
├── routes/
│   └── settings.js              # Settings API routes
└── uploads/                     # Image uploads directory

admin-panel/
└── src/
    └── pages/
        └── Settings.js          # Settings management UI

frontend/
└── src/
    ├── context/
    │   └── SettingsContext.js   # Settings state management
    └── components/
        ├── Navbar.js            # Uses dynamic settings
        ├── Footer.js            # Uses dynamic settings
        └── ...
```

## Customization Tips

### Adding New Settings
1. Update `backend/models/Settings.js` with new field
2. Add input field in `admin-panel/src/pages/Settings.js`
3. Use setting in frontend components via `useSettings()` hook

### Adding New Theme Colors
1. Add color field in Settings model
2. Add color picker in admin Settings page
3. Update `SettingsContext.js` to apply CSS variable
4. Use CSS variable in components: `var(--your-color-name)`

### Adding New Image Uploads
1. Create upload route in `backend/routes/settings.js`
2. Add file input in admin Settings page
3. Use image URL in frontend components

## Troubleshooting

### Settings Not Updating
1. Check browser console for errors
2. Verify backend server is running
3. Check if you're logged in as admin
4. Clear browser cache and refresh

### Images Not Showing
1. Verify file upload successful (check backend console)
2. Check image path in database
3. Ensure `/uploads` directory has correct permissions
4. Verify image URL is accessible: `http://localhost:5000/uploads/filename`

### Theme Colors Not Applying
1. Check if colors saved in database
2. Inspect CSS variables in browser DevTools
3. Verify SettingsContext is wrapping App component
4. Check if components use CSS variables

### Settings Reset on Restart
1. Verify MongoDB connection is working
2. Check if settings document exists in database
3. Ensure Settings model has `getSettings()` method
4. Check for database connection errors in console

## Security Notes
- Only admin users can modify settings
- File uploads validated (type and size)
- Settings API protected with JWT authentication
- Image uploads stored in secure directory
- Input sanitization recommended for text fields

## Future Enhancements
- [ ] Multiple logo variations (light/dark mode)
- [ ] Custom CSS injection
- [ ] Font selection
- [ ] Advanced theme presets
- [ ] Settings import/export
- [ ] Version history
- [ ] Multi-language support
- [ ] Advanced SEO settings
- [ ] Email template customization

## Support
For issues or questions about the settings system, check:
1. Backend console logs
2. Frontend console logs
3. Network tab in browser DevTools
4. MongoDB database directly

---

**Last Updated:** 2025
**Version:** 1.0.0
