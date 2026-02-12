'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Product } from '@/types';

export interface ProductCardProps {
  product: Product;
  showLocation?: boolean;
  showCondition?: boolean;
  onFavorite?: (productId: string) => void;
  onClick?: (productId: string) => void;
}

/**
 * ProductCard Component
 * 
 * Displays a product card with image, title, price, condition badge, and location.
 * Implements requirements: 1.6, 3.2, 3.4, 6.3, 10.3
 * 
 * Features:
 * - Next.js Image component with optimization
 * - Brown placeholder box when image is missing
 * - Title, price with ETB currency, condition badge
 * - Location information with icon
 * - Hover effects and click handling
 * - Responsive for different grid layouts
 */
export default function ProductCard({
  product,
  showLocation = true,
  showCondition = true,
  onFavorite,
  onClick,
}: ProductCardProps) {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick(product.id);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onFavorite) {
      onFavorite(product.id);
    }
  };

  // Get the first image or use placeholder
  const imageUrl = product.images && product.images.length > 0 ? product.images[0] : null;

  // Format price with ETB currency
  const formattedPrice = new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

  // Get condition badge styling
  const getConditionBadgeClass = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'used':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'refurbished':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  // Capitalize condition text
  const formatCondition = (condition: string) => {
    return condition.charAt(0).toUpperCase() + condition.slice(1);
  };

  const cardContent = (
    <div
      onClick={handleClick}
      className="group cursor-pointer bg-white rounded-lg border border-neutral-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary-500 hover:-translate-y-1"
    >
      {/* Product Image */}
      <div className="relative w-full aspect-square bg-primary-100 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          // Brown placeholder box when image is missing
          <div className="w-full h-full flex items-center justify-center bg-primary-100">
            <div className="text-primary-700 text-center p-4">
              <svg
                className="w-16 h-16 mx-auto mb-2 opacity-50"
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
              <span className="text-sm font-medium">No Image</span>
            </div>
          </div>
        )}

        {/* Condition Badge */}
        {showCondition && (
          <div className="absolute top-2 right-2">
            <span
              className={`inline-block px-2 py-1 text-xs font-semibold rounded border ${getConditionBadgeClass(
                product.condition
              )}`}
            >
              {formatCondition(product.condition)}
            </span>
          </div>
        )}

        {/* Favorite Button */}
        {onFavorite && (
          <button
            onClick={handleFavoriteClick}
            className="absolute top-2 left-2 p-2 bg-white rounded-full shadow-md hover:bg-primary-50 transition-colors duration-200"
            aria-label="Add to favorites"
          >
            <svg
              className="w-5 h-5 text-primary-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-base font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors duration-200">
          {product.title}
        </h3>

        {/* Price */}
        <div className="mb-3">
          <span className="text-2xl font-bold text-primary-700">
            {formattedPrice}
          </span>
        </div>

        {/* Location */}
        {showLocation && product.location && (
          <div className="flex items-center text-sm text-neutral-600">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">
              {product.location.city}, {product.location.region}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  // If onClick is provided, use a div with onClick handler
  // Otherwise, use Next.js Link for navigation
  if (onClick) {
    return cardContent;
  }

  return (
    <Link href={`/products/${product.id}`} className="block">
      {cardContent}
    </Link>
  );
}
