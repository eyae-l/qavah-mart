'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import ProductGrid from '@/components/ProductGrid';
import FilterSidebar from '@/components/FilterSidebar';
import { mockProducts } from '@/data/mockData';
import { CATEGORY_STRUCTURE, CategorySlug, Product, ProductCondition } from '@/types';
import { useLocation } from '@/contexts/LocationContext';

/**
 * Dynamic Category Page
 * 
 * Displays products filtered by selected category with:
 * - Client-side rendering for filter interactivity
 * - Subcategory navigation within category
 * - Breadcrumb navigation
 * - Filtered product grid with location filtering
 * - Prioritizes local results when location is selected
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.2, 6.4, 9.4
 */

interface CategoryPageProps {
  params: {
    category: string;
  } | Promise<{
    category: string;
  }>;
}

/**
 * Category Page Component
 */
export default function CategoryPage({ params }: CategoryPageProps) {
  const [category, setCategory] = useState<string | null>(null);
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
      } else {
        setCategory(params.category);
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
  if (category === null) {
    return null;
  }
  
  // Validate category exists
  if (!(category in CATEGORY_STRUCTURE)) {
    notFound();
    return null; // TypeScript safety - notFound() throws but TS doesn't know
  }
  
  const categoryData = CATEGORY_STRUCTURE[category as CategorySlug];
  
  // Filter products by category
  let categoryProducts = mockProducts.filter(
    (product) => product.category === category && product.status === 'active'
  );
  
  // Apply filters
  if (priceMin !== undefined) {
    categoryProducts = categoryProducts.filter(p => p.price >= priceMin);
  }
  if (priceMax !== undefined) {
    categoryProducts = categoryProducts.filter(p => p.price <= priceMax);
  }
  if (selectedBrands.length > 0) {
    categoryProducts = categoryProducts.filter(p => selectedBrands.includes(p.brand));
  }
  if (selectedConditions.length > 0) {
    categoryProducts = categoryProducts.filter(p => selectedConditions.includes(p.condition));
  }
  if (selectedLocation) {
    // Filter by location and prioritize local results
    const localProducts = categoryProducts.filter(
      p => p.location.city === selectedLocation || p.location.region === selectedLocation
    );
    const otherProducts = categoryProducts.filter(
      p => p.location.city !== selectedLocation && p.location.region !== selectedLocation
    );
    categoryProducts = [...localProducts, ...otherProducts];
  }
  
  // Get product count by subcategory for display (before filtering)
  const allCategoryProducts = mockProducts.filter(
    (product) => product.category === category && product.status === 'active'
  );
  const subcategoryCounts = categoryData.subcategories.reduce((acc, subcategory) => {
    const count = allCategoryProducts.filter(
      (product) => product.subcategory === subcategory
    ).length;
    acc[subcategory] = count;
    return acc;
  }, {} as Record<string, number>);
  
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
          <span className="text-neutral-900 font-medium">{categoryData.name}</span>
        </nav>
        
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
            {categoryData.name}
          </h1>
          <p className="text-neutral-600">
            {categoryProducts.length} {categoryProducts.length === 1 ? 'product' : 'products'} available
          </p>
        </div>
        
        {/* Subcategory Navigation */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">
            Browse by Subcategory
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {categoryData.subcategories.map((subcategory) => {
              const subcategorySlug = subcategory.toLowerCase().replace(/\s+/g, '-');
              const count = subcategoryCounts[subcategory] || 0;
              
              return (
                <Link
                  key={subcategory}
                  href={`/categories/${category}/${subcategorySlug}`}
                  className="group relative bg-primary-50 hover:bg-primary-100 border border-primary-200 hover:border-primary-300 rounded-lg p-4 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-neutral-900 group-hover:text-primary-700 transition-colors">
                      {subcategory}
                    </span>
                    <span className="text-xs text-neutral-600 mt-1">
                      {count} {count === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-hover:text-primary-600 transition-colors" />
                </Link>
              );
            })}
          </div>
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
        
        {/* All Products in Category with Sidebar */}
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
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              All {categoryData.name}
            </h2>
            
            {categoryProducts.length > 0 ? (
              <ProductGrid products={categoryProducts} />
            ) : (
              <div className="text-center py-12">
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-8 max-w-md mx-auto">
                  <p className="text-neutral-700 mb-4">
                    {hasActiveFilters 
                      ? 'No products match your filters. Try adjusting your search criteria.'
                      : 'No products available in this category yet.'}
                  </p>
                  {hasActiveFilters ? (
                    <button
                      onClick={handleClearAllFilters}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
                    >
                      Clear Filters
                    </button>
                  ) : (
                    <p className="text-sm text-neutral-600">
                      Check back soon for new listings!
                    </p>
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
