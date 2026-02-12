'use client';

import { Product, Seller } from '@/types';
import { MapPin, CheckCircle, User } from 'lucide-react';

export interface ProductDetailsProps {
  product: Product;
  seller: Seller;
  onContactSeller?: () => void;
}

/**
 * ProductDetails Component
 * 
 * Displays comprehensive product information including:
 * - Product title, price, and condition badge
 * - Comprehensive specifications table
 * - Seller information (name, location, verification status)
 * - "Contact Seller" button
 * - Product status (available, sold)
 * 
 * Requirements: 3.1, 3.2, 3.3
 */
export default function ProductDetails({
  product,
  seller,
  onContactSeller,
}: ProductDetailsProps) {
  // Handle contact seller click
  const handleContactSeller = () => {
    if (onContactSeller) {
      onContactSeller();
    } else {
      // Default behavior - show alert
      alert('Contact seller functionality will be implemented in future tasks');
    }
  };
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

  // Get status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sold':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'inactive':
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  // Capitalize text
  const capitalize = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  // Filter out empty specifications
  const specifications = Object.entries(product.specifications).filter(
    ([_, value]) => value !== undefined && value !== null && value !== ''
  );

  return (
    <div className="space-y-6">
      {/* Product Title and Badges */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`inline-block px-3 py-1 text-sm font-semibold rounded-full border ${getConditionBadgeClass(
              product.condition
            )}`}
          >
            {capitalize(product.condition)}
          </span>
          <span
            className={`inline-block px-3 py-1 text-sm font-semibold rounded-full border ${getStatusBadgeClass(
              product.status
            )}`}
          >
            {product.status === 'active' ? 'Available' : capitalize(product.status)}
          </span>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
          {product.title}
        </h1>
        
        <div className="text-4xl font-bold text-primary-700 mb-2">
          {formattedPrice}
        </div>
      </div>

      {/* Product Description */}
      <div className="border-t border-neutral-200 pt-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-3">
          Description
        </h2>
        <p className="text-neutral-700 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
      </div>

      {/* Specifications */}
      {specifications.length > 0 && (
        <div className="border-t border-neutral-200 pt-6">
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Specifications
          </h2>
          <div className="bg-neutral-50 rounded-lg overflow-hidden">
            <table className="w-full">
              <tbody>
                {specifications.map(([key, value], index) => (
                  <tr
                    key={key}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-neutral-700 w-1/3">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-900">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Seller Information */}
      <div className="border-t border-neutral-200 pt-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-4">
          Seller Information
        </h2>
        
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            {/* Seller Avatar */}
            <div className="flex-shrink-0">
              {seller.avatar ? (
                <img
                  src={seller.avatar}
                  alt={`${seller.firstName} ${seller.lastName}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary-200 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary-700" />
                </div>
              )}
            </div>

            {/* Seller Details */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {seller.firstName} {seller.lastName}
                </h3>
                {seller.isVerified && (
                  <span title="Verified Seller">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </span>
                )}
              </div>

              {seller.businessName && (
                <p className="text-sm text-neutral-700 mb-2">
                  {seller.businessName}
                </p>
              )}

              <div className="flex items-center gap-1 text-sm text-neutral-600 mb-3">
                <MapPin className="w-4 h-4" />
                <span>
                  {seller.location.city}, {seller.location.region}
                </span>
              </div>

              {seller.rating > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${
                          star <= seller.rating ? 'text-yellow-400' : 'text-neutral-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-neutral-600">
                    {seller.rating.toFixed(1)} ({seller.totalSales} sales)
                  </span>
                </div>
              )}

              {/* Contact Seller Button */}
              <button
                onClick={handleContactSeller}
                disabled={product.status === 'sold'}
                className={`w-full md:w-auto px-6 py-3 rounded-lg font-semibold transition-colors ${
                  product.status === 'sold'
                    ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                {product.status === 'sold' ? 'Sold Out' : 'Contact Seller'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Location */}
      <div className="border-t border-neutral-200 pt-6">
        <h2 className="text-xl font-semibold text-neutral-900 mb-3">
          Location
        </h2>
        <div className="flex items-center gap-2 text-neutral-700">
          <MapPin className="w-5 h-5 text-primary-600" />
          <span>
            {product.location.city}, {product.location.region}, {product.location.country}
          </span>
        </div>
      </div>
    </div>
  );
}
