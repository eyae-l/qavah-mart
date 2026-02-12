'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

export interface ProductImageGalleryProps {
  images: string[];
  productTitle: string;
}

/**
 * ProductImageGallery Component
 * 
 * Displays multiple product images with:
 * - Thumbnail navigation
 * - Zoom functionality on click
 * - Brown placeholder for missing images
 * - Next.js Image with priority loading for first image
 * 
 * Requirements: 3.4, 10.3
 */
export default function ProductImageGallery({
  images,
  productTitle,
}: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Handle empty images array
  const hasImages = images && images.length > 0;
  const currentImage = hasImages ? images[selectedIndex] : null;

  const handlePrevious = () => {
    if (hasImages) {
      setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
  };

  const handleNext = () => {
    if (hasImages) {
      setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
  };

  const handleImageClick = () => {
    if (hasImages) {
      setIsZoomed(true);
    }
  };

  const handleCloseZoom = () => {
    setIsZoomed(false);
  };

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative w-full aspect-square bg-primary-50 rounded-lg overflow-hidden border border-neutral-200">
        {currentImage ? (
          <>
            <Image
              src={currentImage}
              alt={`${productTitle} - Image ${selectedIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority={selectedIndex === 0}
            />
            
            {/* Zoom Button Overlay */}
            <button
              onClick={handleImageClick}
              className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors duration-200 group"
              aria-label="Zoom image"
            >
              <ZoomIn className="w-5 h-5 text-neutral-700 group-hover:text-primary-700" />
            </button>

            {/* Navigation Arrows (only show if multiple images) */}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors duration-200"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6 text-neutral-700" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors duration-200"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6 text-neutral-700" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                {selectedIndex + 1} / {images.length}
              </div>
            )}
          </>
        ) : (
          // Brown placeholder when no images
          <div className="w-full h-full flex items-center justify-center bg-primary-100">
            <div className="text-primary-700 text-center p-8">
              <svg
                className="w-24 h-24 mx-auto mb-4 opacity-50"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-lg font-medium">No Images Available</span>
            </div>
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {hasImages && images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                index === selectedIndex
                  ? 'border-primary-600 ring-2 ring-primary-200'
                  : 'border-neutral-200 hover:border-primary-400'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${productTitle} - Thumbnail ${index + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Zoom Modal */}
      {isZoomed && currentImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={handleCloseZoom}
        >
          <button
            onClick={handleCloseZoom}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200"
            aria-label="Close zoom"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <div className="relative w-full h-full max-w-6xl max-h-[90vh]">
            <Image
              src={currentImage}
              alt={`${productTitle} - Zoomed`}
              fill
              sizes="100vw"
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {/* Navigation in Zoom Mode */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-8 h-8 text-white" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-200"
                aria-label="Next image"
              >
                <ChevronRight className="w-8 h-8 text-white" />
              </button>

              {/* Image Counter in Zoom */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 text-white text-lg rounded-full">
                {selectedIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
