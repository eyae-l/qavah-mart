'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import ProductGrid from '@/components/ProductGrid';
import FilterSidebar from '@/components/FilterSidebar';
import { mockProducts } from '@/data/mockData';
import { CATEGORY_STRUCTURE, CategorySlug, ProductCondition } from '@/types';
import { useLocation } from '@/contexts/LocationContext';

/**
 * Dynamic Subcategory Page
 * 
 * Displays products filtered by category and subcategory with:
 * - Client-side rendering for filter interactivity
 * - Breadcrumb navigation
 * - Filtered product grid with location filtering
 * - Prioritizes local results when location is selected
 * - Relevant filters for subcategory
 * 
 * Requirements: 1.2, 1.3, 1.4, 1.5, 6.2, 6.4
 */

interface SubcategoryPageProps {
  params: {
    category: string;
    subcategory: string;
  } | Promise<{
    category: string;
    subcategory: string;
  }>;
}

/**
 * Subcategory Page Component
 */
export default function SubcategoryPage({ params }: SubcategoryPageProps) {
  const [category, setCategory] = useState<string | null>(null);
  const [subcategory, setSubcategory] = useState<string | null>(null);
  const { currentLocation } = useLocation();
  
  // Filter state
  const [priceMin, setPriceMin] = useState<number | undefined>(undefined);
  const [priceMax, setPriceMax] = useState<number | undefined>(undefined);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<ProductCondition[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined);
  
  // Resolve params (handle both Promise and plain object)
  useEffect(() => {
    const resolveParams = async () => {
      if (params instanceof Promise) {
        const resolvedParams = await params;
        setCategory(resolvedParams.category);
        setSubcategory(resolvedParams.subcategory);
      } else {
        setCategory(params.category);
        setSubcategory(params.subcategory);
      }
    };
    resolveParams();
  }, [params]);
  
  // Use current location from context if available
  useEffect(() => {
    if (currentLocation && !selectedLocation) {
      setSelectedLocation(currentLocation);
    }
  }, [currentLocation, selectedLocation]);
  
  // Show loading state while resolving params
  if (category === null || subcategory === null) {
    return null;
  }
  
  // Validate category exists
  if (!(category in CATEGORY_STRUCTURE)) {
    notFound();
    return null; // TypeScript safety
  }
  
  const categoryData = CATEGORY_STRUCTURE[category as CategorySlug];
  
  // Find matching subcategory (case-insensitive, slug-based match)
  const matchingSubcategory = categoryData.subcategories.find(
    (sub) => sub.toLowerCase().replace(/\s+/g, '-') === subcategory
  );
  
  // If subcategory doesn't exist in this category, show 404
  if (!matchingSubcategory) {
    notFound();
    return null; // TypeScript safety
  }
  
  // Filter products by category and subcategory
  let subcategoryProducts = mockProducts.filter(
    (product) =>
      product.category === category &&
      product.subcategory === matchingSubcategory &&
      product.status === 'active'
  );
  
  // Apply filters
  if (priceMin !== undefined) {
    subcategoryProducts = subcategoryProducts.filter(p => p.price >= priceMin);
  }
  if (priceMax !== undefined) {
    subcategoryProducts = subcategoryProducts.filter(p => p.price <= priceMax);
  }
  if (selectedBrands.length > 0) {
    subcategoryProducts = subcategoryProducts.filter(p => selectedBrands.includes(p.brand));
  }
  if (selectedConditions.length > 0) {
    subcategoryProducts = subcategoryProducts.filter(p => selectedConditions.includes(p.condition));
  }
  if (selectedLocation) {
    // Filter by location and prioritize local results
    const localProducts = subcategoryProducts.filter(
      p => p.location.city === selectedLocation || p.location.region === selectedLocation
    );
    const otherProducts = subcategoryProducts.filter(
      p => p.location.city !== selectedLocation && p.location.region !== selectedLocation
    );
    subcategoryProducts = [...localProducts, ...otherProducts];
  }
  
  // Handle filter changes
  const handlePriceChange = (min: number | undefined, max: number | undefined) => {
    setPriceMin(min);
    setPriceMax(max);
  };
  
  const handleBrandsChange = (brands: string[]) => {
    setSelectedBrands(brands);
  };
  
  const handleConditionsChange = (conditions: ProductCondition[]) => {
    setSelectedConditions(conditions);
  };
  
  const handleLocationChange = (location: string | undefined) => {
    setSelectedLocation(location);
  };
  
  const handleClearAllFilters = () => {
    setPriceMin(undefined);
    setPriceMax(undefined);
    setSelectedBrands([]);
    setSelectedConditions([]);
    setSelectedLocation(undefined);
  };
  
  const removeFilter = (type: 'price' | 'brand' | 'condition' | 'location', value?: string) => {
    switch (type) {
      case 'price':
        handlePriceChange(undefined, undefined);
        break;
      case 'brand':
        if (value) {
          handleBrandsChange(selectedBrands.filter(b => b !== value));
        }
        break;
      case 'condition':
        if (value) {
          handleConditionsChange(selectedConditions.filter(c => c !== value));
        }
        break;
      case 'location':
        handleLocationChange(undefined);
        break;
    }
  };
  
  const hasActiveFilters = 
    priceMin !== undefined || 
    priceMax !== undefined || 
    selectedBrands.length > 0 || 
    selectedConditions.length > 0 || 
    selectedLocation !== undefined;
  
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
          <Link
            href="/"
            className="text-neutral-600 hover:text-primary-700 transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
          <Link
            href={`/categories/${category}`}
            className="text-neutral-600 hover:text-primary-700 transition-colors"
          >
            {categoryData.name}
          </Link>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
          <span className="text-neutral-900 font-medium">{matchingSubcategory}</span>
        </nav>
        
        {/* Subcategory Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
            {matchingSubcategory}
          </h1>
          <p className="text-neutral-600">
            {subcategoryProducts.length} {subcategoryProducts.length === 1 ? 'product' : 'products'} available
          </p>
        </div>
        
        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-neutral-700">Active Filters:</span>
            
            {priceMin !== undefined || priceMax !== undefined ? (
              <button
                onClick={() => removeFilter('price')}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm hover:bg-primary-200 transition-colors"
              >
                Price: {priceMin || 0} - {priceMax || '∞'} ETB
                <X className="w-3 h-3" />
              </button>
            ) : null}
            
            {selectedBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => removeFilter('brand', brand)}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm hover:bg-primary-200 transition-colors"
              >
                {brand}
                <X className="w-3 h-3" />
              </button>
            ))}
            
            {selectedConditions.map((condition) => (
              <button
                key={condition}
                onClick={() => removeFilter('condition', condition)}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm hover:bg-primary-200 transition-colors"
              >
                {condition.charAt(0).toUpperCase() + condition.slice(1)}
                <X className="w-3 h-3" />
              </button>
            ))}
            
            {selectedLocation && (
              <button
                onClick={() => removeFilter('location')}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm hover:bg-primary-200 transition-colors"
              >
                {selectedLocation}
                <X className="w-3 h-3" />
              </button>
            )}
            
            <button
              onClick={handleClearAllFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium underline"
            >
              Clear All
            </button>
          </div>
        )}
        
        {/* Products Grid with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="lg:sticky lg:top-6">
              <FilterSidebar
                priceMin={priceMin}
                priceMax={priceMax}
                selectedBrands={selectedBrands}
                selectedConditions={selectedConditions}
                selectedLocation={selectedLocation}
                onPriceChange={handlePriceChange}
                onBrandsChange={handleBrandsChange}
                onConditionsChange={handleConditionsChange}
                onLocationChange={handleLocationChange}
                onClearAll={handleClearAllFilters}
              />
            </div>
          </aside>
          
          {/* Products Grid */}
          <div className="flex-1">
            {subcategoryProducts.length > 0 ? (
              <ProductGrid products={subcategoryProducts} />
            ) : (
              <div className="text-center py-12">
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-8 max-w-md mx-auto">
                  <p className="text-neutral-700 mb-4">
                    {hasActiveFilters 
                      ? 'No products match your filters. Try adjusting your search criteria.'
                      : 'No products available in this subcategory yet.'}
                  </p>
                  {hasActiveFilters ? (
                    <button
                      onClick={handleClearAllFilters}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Clear Filters
                    </button>
                  ) : (
                    <>
                      <p className="text-sm text-neutral-600 mb-4">
                        Check back soon for new listings!
                      </p>
                      <Link
                        href={`/categories/${category}`}
                        className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        Browse All {categoryData.name}
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
