import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

const CompanyPhotoGallery = ({ photos = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [validPhotos, setValidPhotos] = useState([]);
  const [failedImages, setFailedImages] = useState(new Set());

  // Default company photos if none provided
  const defaultPhotos = [
    'https://via.placeholder.com/500x300?text=Company+Office+1',
    'https://via.placeholder.com/500x300?text=Company+Office+2',
    'https://via.placeholder.com/500x300?text=Company+Team',
  ];

  useEffect(() => {
    // Initialize with provided photos or defaults
    const initialPhotos = photos.length > 0 ? photos : defaultPhotos;
    setValidPhotos(initialPhotos);
    setSelectedIndex(0);
    setFailedImages(new Set());
  }, [photos, defaultPhotos]);

  // Debug logging
  console.log('CompanyPhotoGallery received photos:', {
    photosLength: photos.length,
    validPhotosLength: validPhotos.length,
    isDefault: photos.length === 0,
    firstPhoto: validPhotos[0]?.substring(0, 100) || 'N/A'
  });

  const handleImageError = (index) => {
    console.warn('Image failed to load at index:', index, 'URL:', validPhotos[index]);
    const newFailed = new Set(failedImages);
    newFailed.add(index);
    setFailedImages(newFailed);
    
    // Skip to next valid image
    if (index === selectedIndex) {
      goToNext();
    }
  };

  const goToPrevious = () => {
    let prevIndex = selectedIndex === 0 ? validPhotos.length - 1 : selectedIndex - 1;
    // Skip failed images
    let attempts = 0;
    while (failedImages.has(prevIndex) && attempts < validPhotos.length) {
      prevIndex = prevIndex === 0 ? validPhotos.length - 1 : prevIndex - 1;
      attempts++;
    }
    if (!failedImages.has(prevIndex)) {
      setSelectedIndex(prevIndex);
    }
  };

  const goToNext = () => {
    let nextIndex = selectedIndex === validPhotos.length - 1 ? 0 : selectedIndex + 1;
    // Skip failed images
    let attempts = 0;
    while (failedImages.has(nextIndex) && attempts < validPhotos.length) {
      nextIndex = nextIndex === validPhotos.length - 1 ? 0 : nextIndex + 1;
      attempts++;
    }
    if (!failedImages.has(nextIndex)) {
      setSelectedIndex(nextIndex);
    }
  };

  return (
    <div>
      {validPhotos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
          <p>No photos available</p>
        </div>
      ) : (
        <>
          {/* Gallery Container */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="relative bg-gray-900 h-96 flex items-center justify-center group">
              {/* Main Image */}
              <img
                key={`main-${selectedIndex}`}
                src={validPhotos[selectedIndex]}
                alt={`Company photo`}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setShowLightbox(true)}
                onError={() => {
                  handleImageError(selectedIndex);
                }}
                onLoad={() => {
                  console.log('✅ Image loaded:', validPhotos[selectedIndex]);
                }}
              />

              {/* Navigation Buttons */}
              {validPhotos.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition opacity-0 group-hover:opacity-100"
                  >
                    <FaChevronLeft size={20} />
                  </button>
                  <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition opacity-0 group-hover:opacity-100"
                  >
                    <FaChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Photo Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                {selectedIndex + 1} / {validPhotos.length}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {validPhotos.length > 1 && (
              <div className="bg-gray-100 p-3 flex gap-2 overflow-x-auto">
                {validPhotos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    disabled={failedImages.has(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                      failedImages.has(index) ? 'opacity-30 cursor-not-allowed' : selectedIndex === index
                        ? 'ring-2 ring-blue-600'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(index)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Lightbox Modal */}
          {showLightbox && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
              <button
                onClick={() => setShowLightbox(false)}
                className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition"
              >
                <FaTimes size={24} />
              </button>

              <button
                onClick={goToPrevious}
                className="absolute left-4 text-white p-3 hover:bg-white/20 rounded-full transition"
              >
                <FaChevronLeft size={24} />
              </button>

              <img
                key={`lightbox-${selectedIndex}`}
                src={validPhotos[selectedIndex]}
                alt={`Company photo ${selectedIndex + 1}`}
                className="max-w-4xl max-h-[80vh] object-contain"
                onError={() => handleImageError(selectedIndex)}
              />

              <button
                onClick={goToNext}
                className="absolute right-4 text-white p-3 hover:bg-white/20 rounded-full transition"
              >
                <FaChevronRight size={24} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CompanyPhotoGallery;
