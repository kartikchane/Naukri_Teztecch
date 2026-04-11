import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

const CompanyPhotoGallery = ({ photos = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  // Default company photos if none provided
  const defaultPhotos = [
    'https://via.placeholder.com/500x300?text=Company+Office+1',
    'https://via.placeholder.com/500x300?text=Company+Office+2',
    'https://via.placeholder.com/500x300?text=Company+Team',
  ];

  const photoList = photos.length > 0 ? photos : defaultPhotos;

  const goToPrevious = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === 0 ? photoList.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setSelectedIndex((prevIndex) =>
      prevIndex === photoList.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div>
      {/* Gallery Container */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative bg-gray-900 h-96 flex items-center justify-center group">
          {/* Main Image */}
          <img
            src={photoList[selectedIndex]}
            alt={`Company photo ${selectedIndex + 1}`}
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setShowLightbox(true)}
          />

          {/* Navigation Buttons */}
          {photoList.length > 1 && (
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
            {selectedIndex + 1} / {photoList.length}
          </div>
        </div>

        {/* Thumbnail Strip */}
        {photoList.length > 1 && (
          <div className="bg-gray-100 p-3 flex gap-2 overflow-x-auto">
            {photoList.map((photo, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all ${
                  selectedIndex === index
                    ? 'ring-2 ring-blue-600'
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={photo}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
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
            src={photoList[selectedIndex]}
            alt={`Company photo ${selectedIndex + 1}`}
            className="max-w-4xl max-h-[80vh] object-contain"
          />

          <button
            onClick={goToNext}
            className="absolute right-4 text-white p-3 hover:bg-white/20 rounded-full transition"
          >
            <FaChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CompanyPhotoGallery;
