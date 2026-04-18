# Gallery Management System - Admin Panel Guide

## Overview
The Gallery Management system allows admins to upload, edit, and manage company gallery images with thumbnails and descriptions.

## Features Implemented

### Backend Features
1. **Gallery Model** (`backend/models/Gallery.js`)
   - Stores gallery images with metadata
   - Fields: title, description, category, displayOrder, uploadedAt, uploadedBy
   - Categories: office, team, event, project, culture, other

2. **Gallery Routes** (`backend/routes/gallery.js`)
   - `GET /api/gallery/company/:companyId` - Get all gallery images for a company
   - `GET /api/gallery/:id` - Get single image details
   - `POST /api/gallery/upload/:companyId` - Upload new image (multipart/form-data)
   - `PUT /api/gallery/:id` - Update image details (title, description, category, displayOrder)
   - `DELETE /api/gallery/:id` - Delete image
   - `PUT /api/gallery/reorder/:companyId` - Reorder gallery images

3. **File Upload Handling**
   - Supports: JPEG, PNG, GIF, WebP formats
   - Uploads to `uploads/gallery/` directory with unique filename
   - Automatic error handling and file cleanup

### Admin Panel Features
1. **Gallery Management Component** (`admin-panel/src/pages/GalleryManagement.js`)
   - Upload images with title, description, and category
   - Image preview before upload
   - Edit existing images
   - Delete images
   - View gallery in grid layout with thumbnails

2. **Styling** (`admin-panel/src/pages/GalleryManagement.css`)
   - Responsive grid layout
   - Beautiful card design with hover effects
   - Form styling for upload and edit

## How to Use

### 1. Access Gallery Management
Navigate to: `http://localhost:3001/gallery/:companyId`

**Example:** `http://localhost:3001/gallery/507f1f77bcf86cd799439011`

You need a valid company MongoDB ID. Find company IDs from:
- Admin Panel > Companies page
- Click on any company to see its ID
- Or query the database: `db.companies.find().pretty()`

### 2. Upload an Image
1. Click "+ Upload Image" button
2. Select an image file (JPEG, PNG, GIF, or WebP)
3. Add optional title and description
4. Choose a category
5. Click "Upload Image"

### 3. Edit an Image
1. Click "Edit" button on any gallery card
2. Update title, description, or category
3. Click "Save" to apply changes

### 4. Delete an Image
1. Click "Delete" button on any gallery card
2. Confirm deletion in the popup

## API Examples

### Upload Image (cURL)
```bash
curl -X POST http://localhost:5001/api/gallery/upload/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "image=@/path/to/image.jpg" \
  -F "title=Office View" \
  -F "description=Our beautiful office" \
  -F "category=office"
```

### Get Gallery Images
```bash
curl http://localhost:5001/api/gallery/company/507f1f77bcf86cd799439011
```

### Update Image
```bash
curl -X PUT http://localhost:5001/api/gallery/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Title",
    "description": "Updated description",
    "category": "team"
  }'
```

### Delete Image
```bash
curl -X DELETE http://localhost:5001/api/gallery/507f1f77bcf86cd799439012 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Integration with Frontend

The gallery images will be displayed on company profile pages with:
- Image carousel/slider
- Thumbnail preview
- Navigation arrows
- Lightbox view

## File Structure
```
backend/
  ├── models/Gallery.js
  ├── routes/gallery.js
  └── uploads/gallery/  (auto-created, stores image files)

admin-panel/src/
  ├── pages/
  │   ├── GalleryManagement.js
  │   └── GalleryManagement.css
  └── App.js (routing configured)
```

## Troubleshooting

### Upload fails with "Cannot POST" error
- Make sure backend is running on port 5001
- Check that `/api/gallery` route is registered in `server.js`

### Images not showing
- Verify uploads directory exists and is writable
- Check file paths in database
- Ensure `/uploads` static file serving is configured in server.js

### Permission errors
- Make sure you're logged in as admin
- Check JWT token validity
- Verify Authorization header is being sent

## Next Steps
1. Create a Companies Gallery view page to display galleries
2. Add drag-and-drop upload support
3. Add image cropping/editing tools
4. Add gallery templates/themes
5. Add image batch operations
