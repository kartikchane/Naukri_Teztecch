import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import { toast } from 'react-toastify';
import './GalleryManagement.css';

const GalleryManagement = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other'
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const categories = ['office', 'team', 'event', 'project', 'culture', 'other'];

  // Fetch gallery images
  useEffect(() => {
    fetchGallery();
  }, [companyId]);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/gallery/company/${companyId}`);
      // Convert relative image URLs to full URLs for display
      const galleryWithFullUrls = (response.data.data || []).map(item => ({
        ...item,
        imageUrl: item.imageUrl.startsWith('http')
          ? item.imageUrl
          : `http://localhost:5001${item.imageUrl}`
      }));
      setGallery(galleryWithFullUrls);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast.error('Failed to load gallery');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        toast.error('Only image files are allowed');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast.error('Please select an image');
      return;
    }

    try {
      setUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('image', imageFile);
      uploadFormData.append('title', formData.title || 'Untitled');
      uploadFormData.append('description', formData.description);
      uploadFormData.append('category', formData.category);

      const response = await API.post(`/gallery/upload/${companyId}`, uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success('Image uploaded successfully');
        setGallery([...gallery, response.data.data]);
        resetForm();
        setShowUploadForm(false);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await API.put(`/gallery/${id}`, {
        title: formData.title,
        description: formData.description,
        category: formData.category
      });

      if (response.data.success) {
        toast.success('Gallery image updated successfully');
        setGallery(gallery.map(img => img._id === id ? response.data.data : img));
        setEditingId(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error updating image:', error);
      toast.error('Failed to update image');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this image?')) {
      return;
    }

    try {
      const response = await API.delete(`/gallery/${id}`);
      if (response.data.success) {
        toast.success('Image deleted successfully');
        setGallery(gallery.filter(img => img._id !== id));
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', category: 'other' });
    setImageFile(null);
    setPreviewUrl(null);
  };

  const startEdit = (image) => {
    setEditingId(image._id);
    setFormData({
      title: image.title,
      description: image.description,
      category: image.category
    });
  };

  if (loading) {
    return <div className="gallery-loading">Loading gallery...</div>;
  }

  return (
    <div className="gallery-management">
      <div className="gallery-header">
        <div>
          <h2>Gallery Management</h2>
          <p>Manage company gallery images and photos</p>
        </div>
        <button
          className="btn-upload"
          onClick={() => {
            setShowUploadForm(!showUploadForm);
            resetForm();
          }}
        >
          {showUploadForm ? '✕ Cancel' : '+ Upload Image'}
        </button>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <div className="gallery-upload-form">
          <h3>Upload New Image</h3>
          <form onSubmit={handleUpload}>
            <div className="form-group">
              <label>Image File *</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                disabled={uploading}
              />
              {previewUrl && (
                <img src={previewUrl} alt="Preview" className="image-preview" />
              )}
            </div>

            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Image title"
                disabled={uploading}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Image description"
                rows="3"
                disabled={uploading}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                disabled={uploading}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="btn-submit"
              disabled={uploading || !imageFile}
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </form>
        </div>
      )}

      {/* Gallery Grid */}
      {gallery.length === 0 ? (
        <div className="gallery-empty">
          <p>No images uploaded yet. Start by uploading your first image!</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {gallery.map(image => (
            <div key={image._id} className="gallery-card">
              <img src={image.imageUrl} alt={image.title} />

              {editingId === image._id ? (
                <div className="gallery-edit">
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Title"
                  />
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Description"
                    rows="2"
                  />
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                  <div className="edit-buttons">
                    <button
                      className="btn-save"
                      onClick={() => handleUpdate(image._id)}
                    >
                      Save
                    </button>
                    <button
                      className="btn-cancel"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="gallery-info">
                  <h4>{image.title}</h4>
                  <p className="category">{image.category}</p>
                  {image.description && <p className="description">{image.description}</p>}
                  <div className="gallery-actions">
                    <button
                      className="btn-edit"
                      onClick={() => startEdit(image)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(image._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;
