'use client';

import { Product } from '@/types';
import ProductCard from './ProductCard';

export interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onProductClick?: (productId: string) => void;
  gridColumns?: 2 | 3 | 4;
}

/**
 * ProductGrid Component
 * 
 * Displays products in a responsive grid layout with lazy loading and skeleton states.
 * Implements requirements: 1.6, 8.1, 10.3, 10.4
 * 
 * Features:
 * - Responsive grid layout (2 columns mobile, 3 tablet, 4 desktop)
 * - Lazy loading for images using Next.js Image with loading="lazy"
 * - Loading skeleton states
 * - Empty states with helpful messages
 */
export default function ProductGrid({
  products,
  loading = false,
  onProductClick,
  gridColumns = 4,
}: ProductGridProps) {
  // Get grid column classes based on gridColumns prop
  const getGridClasses = () => {
    const baseClasses = 'grid gap-4 sm:gap-6';
    
    switch (gridColumns) {
      case 2:
        return `${baseClasses} grid-cols-1 sm:grid-cols-2`;
      case 3:
        return `${baseClasses} grid-cols-2 sm:grid-cols-2 lg:grid-cols-3`;
      case 4:
      default:
        return `${baseClasses} grid-cols-2 sm:grid-cols-3 lg:grid-cols-4`;
    }
  };

  // Show loading skeletons
  if (loading) {
    return (
      <div className={getGridClasses()}>
        {Array.from({ length: gridColumns * 2 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Show empty state if no products
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="text-center max-w-md">
          {/* Empty state icon */}
          <div className="mb-6">
            <svg
              className="w-24 h-24 mx-auto text-neutral-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          
          {/* Empty state message */}
          <h3 className="text-xl font-semibold text-neutral-900 mb-2">
            No Products Found
          </h3>
          <p className="text-neutral-600 mb-6">
            We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
          </p>
          
          {/* Helpful suggestions */}
          <div className="text-left bg-neutral-50 rounded-lg p-4 border border-neutral-200">
            <p className="text-sm font-medium text-neutral-900 mb-2">
              Suggestions:
            </p>
            <ul className="text-sm text-neutral-600 space-y-1">
              <li>• Check your spelling</li>
              <li>• Try more general keywords</li>
              <li>• Remove some filters</li>
              <li>• Browse our categories instead</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Render product grid
  return (
    <div className={getGridClasses()}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onClick={onProductClick}
          showLocation={true}
          showCondition={true}
        />
      ))}
    </div>
  );
}

/**
 * ProductCardSkeleton Component
 * 
 * Loading skeleton for ProductCard while data is being fetched.
 */
function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="relative w-full aspect-square bg-neutral-200" />
      
      {/* Content skeleton */}
      <div className="p-4">
        {/* Title skeleton */}
        <div className="h-4 bg-neutral-200 rounded mb-2" />
        <div className="h-4 bg-neutral-200 rounded w-3/4 mb-3" />
        
        {/* Price skeleton */}
        <div className="h-8 bg-neutral-200 rounded w-1/2 mb-3" />
        
        {/* Location skeleton */}
        <div className="flex items-center">
          <div className="w-4 h-4 bg-neutral-200 rounded mr-2" />
          <div className="h-3 bg-neutral-200 rounded w-2/3" />
        </div>
      </div>
    </div>
  );
}
