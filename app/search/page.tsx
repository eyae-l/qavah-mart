'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ChevronRight, X, SlidersHorizontal } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import FilterSidebar from '@/components/FilterSidebar';
import { Product, SearchResult, SortOption, ProductCondition } from '@/types';

// Dynamic import for MobileFilterDrawer (only loaded on mobile)
const MobileFilterDrawer = dynamic(() => import('@/components/MobileFilterDrawer'), {
  loading: () => null, // No loading state needed for drawer
});

/**
 * Search Results Page
 * 
 * Displays search results with:
 * - SSR for initial load
 * - Product grid layout with FilterSidebar
 * - Search query and result count
 * - Empty results handling
 * - Sorting options
 * - Filter synchronization with URL
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 9.2
 */

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Filter state
  const [priceMin, setPriceMin] = useState<number | undefined>(undefined);
  const [priceMax, setPriceMax] = useState<number | undefined>(undefined);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<ProductCondition[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | undefined>(undefined);
  
  // Initialize filters from URL on mount
  useEffect(() => {
    const minPrice = searchParams.get('priceMin');
    const maxPrice = searchParams.get('priceMax');
    const brands = searchParams.get('brands');
    const conditions = searchParams.get('conditions');
    const location = searchParams.get('location');
    const sort = searchParams.get('sortBy');
    
    if (minPrice) setPriceMin(parseFloat(minPrice));
    if (maxPrice) setPriceMax(parseFloat(maxPrice));
    if (brands) setSelectedBrands(brands.split(','));
    if (conditions) setSelectedConditions(conditions.split(',') as ProductCondition[]);
    if (location) setSelectedLocation(location);
    if (sort) setSortBy(sort as SortOption);
  }, []);
  
  // Update URL when filters change
  const updateURL = (filters: {
    priceMin?: number;
    priceMax?: number;
    brands?: string[];
    conditions?: ProductCondition[];
    location?: string;
    sortBy?: SortOption;
  }) => {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (filters.priceMin !== undefined) params.set('priceMin', filters.priceMin.toString());
    if (filters.priceMax !== undefined) params.set('priceMax', filters.priceMax.toString());
    if (filters.brands && filters.brands.length > 0) params.set('brands', filters.brands.join(','));
    if (filters.conditions && filters.conditions.length > 0) params.set('conditions', filters.conditions.join(','));
    if (filters.location) params.set('location', filters.location);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    
    router.push(`/search?${params.toString()}`);
  };
  
  useEffect(() => {
    async function fetchSearchResults() {
      try {
        setLoading(true);
        setError(null);
        
        // Build query string
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        params.set('sortBy', sortBy);
        if (priceMin !== undefined) params.set('priceMin', priceMin.toString());
        if (priceMax !== undefined) params.set('priceMax', priceMax.toString());
        if (selectedBrands.length > 0) params.set('brands', selectedBrands.join(','));
        if (selectedConditions.length > 0) params.set('conditions', selectedConditions.join(','));
        if (selectedLocation) params.set('location', selectedLocation);
        
        // Fetch search results
        const response = await fetch(`/api/search?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        
        const data: SearchResult = await response.json();
        setSearchResult(data);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to load search results. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchSearchResults();
  }, [query, sortBy, priceMin, priceMax, selectedBrands, selectedConditions, selectedLocation]);
  
  // Handle sort change
  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    updateURL({
      priceMin,
      priceMax,
      brands: selectedBrands,
      conditions: selectedConditions,
      location: selectedLocation,
      sortBy: newSort,
    });
  };
  
  // Handle filter changes
  const handlePriceChange = (min: number | undefined, max: number | undefined) => {
    setPriceMin(min);
    setPriceMax(max);
    updateURL({
      priceMin: min,
      priceMax: max,
      brands: selectedBrands,
      conditions: selectedConditions,
      location: selectedLocation,
      sortBy,
    });
  };
  
  const handleBrandsChange = (brands: string[]) => {
    setSelectedBrands(brands);
    updateURL({
      priceMin,
      priceMax,
      brands,
      conditions: selectedConditions,
      location: selectedLocation,
      sortBy,
    });
  };
  
  const handleConditionsChange = (conditions: ProductCondition[]) => {
    setSelectedConditions(conditions);
    updateURL({
      priceMin,
      priceMax,
      brands: selectedBrands,
      conditions,
      location: selectedLocation,
      sortBy,
    });
  };
  
  const handleLocationChange = (location: string | undefined) => {
    setSelectedLocation(location);
    updateURL({
      priceMin,
      priceMax,
      brands: selectedBrands,
      conditions: selectedConditions,
      location,
      sortBy,
    });
  };
  
  const handleClearAllFilters = () => {
    setPriceMin(undefined);
    setPriceMax(undefined);
    setSelectedBrands([]);
    setSelectedConditions([]);
    setSelectedLocation(undefined);
    updateURL({ sortBy });
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
          <ChevronRight className="w-4 h-4 text-neutral-400" aria-hidden="true" />
          <span className="text-neutral-900 font-medium" aria-current="page">Search Results</span>
        </nav>
        
        {/* Search Header */}
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
            {query ? `Search Results for "${query}"` : 'All Products'}
          </h1>
          
          {!loading && searchResult && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-neutral-600">
                {searchResult.totalCount} {searchResult.totalCount === 1 ? 'product' : 'products'} found
              </p>
              
              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border-2 border-primary-600 text-primary-700 font-medium rounded-lg hover:bg-primary-50 active:bg-primary-100 transition-colors touch-manipulation"
                >
                  <SlidersHorizontal className="w-5 h-5" />
                  <span>Filters</span>
                  {hasActiveFilters && (
                    <span className="inline-flex items-center justify-center w-5 h-5 bg-primary-600 text-white text-xs font-bold rounded-full">
                      {(priceMin !== undefined || priceMax !== undefined ? 1 : 0) +
                        selectedBrands.length +
                        selectedConditions.length +
                        (selectedLocation ? 1 : 0)}
                    </span>
                  )}
                </button>

                {/* Sort Options */}
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm text-neutral-700 font-medium hidden sm:inline">
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value as SortOption)}
                    className="px-3 py-2 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent touch-manipulation"
                    aria-label="Sort products by"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </header>
        
        {/* Active Filters Display */}
        {hasActiveFilters && !loading && (
          <section className="mb-6 flex flex-wrap items-center gap-2" aria-label="Active filters">
            <span className="text-sm font-medium text-neutral-700">Active Filters:</span>
            
            {priceMin !== undefined || priceMax !== undefined ? (
              <button
                onClick={() => removeFilter('price')}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm hover:bg-primary-200 transition-colors"
                aria-label={`Remove price filter: ${priceMin || 0} to ${priceMax || 'unlimited'} ETB`}
              >
                Price: {priceMin || 0} - {priceMax || '∞'} ETB
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            ) : null}
            
            {selectedBrands.map((brand) => (
              <button
                key={brand}
                onClick={() => removeFilter('brand', brand)}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm hover:bg-primary-200 transition-colors"
                aria-label={`Remove brand filter: ${brand}`}
              >
                {brand}
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            ))}
            
            {selectedConditions.map((condition) => (
              <button
                key={condition}
                onClick={() => removeFilter('condition', condition)}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm hover:bg-primary-200 transition-colors"
                aria-label={`Remove condition filter: ${condition}`}
              >
                {condition.charAt(0).toUpperCase() + condition.slice(1)}
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            ))}
            
            {selectedLocation && (
              <button
                onClick={() => removeFilter('location')}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm hover:bg-primary-200 transition-colors"
                aria-label={`Remove location filter: ${selectedLocation}`}
              >
                {selectedLocation}
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            )}
            
            <button
              onClick={handleClearAllFilters}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium underline"
              aria-label="Clear all filters"
            >
              Clear All
            </button>
          </section>
        )}
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12" role="status" aria-live="polite">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <span className="sr-only">Loading search results...</span>
          </div>
        )}
        
        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12" role="alert">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8 max-w-md mx-auto">
              <p className="text-red-700 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        
        {/* Search Results with Sidebar */}
        {!loading && !error && searchResult && (
          <>
            {/* Mobile Filter Drawer */}
            <MobileFilterDrawer
              isOpen={isMobileFilterOpen}
              onClose={() => setIsMobileFilterOpen(false)}
              priceMin={priceMin}
              priceMax={priceMax}
              selectedBrands={selectedBrands}
              selectedConditions={selectedConditions}
              selectedLocation={selectedLocation}
              onApplyFilters={(filters) => {
                setPriceMin(filters.priceMin);
                setPriceMax(filters.priceMax);
                setSelectedBrands(filters.brands);
                setSelectedConditions(filters.conditions);
                setSelectedLocation(filters.location);
                updateURL({
                  priceMin: filters.priceMin,
                  priceMax: filters.priceMax,
                  brands: filters.brands,
                  conditions: filters.conditions,
                  location: filters.location,
                  sortBy,
                });
              }}
              onClearAll={handleClearAllFilters}
            />

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Filter Sidebar - Hidden on mobile */}
              <aside className="hidden lg:block lg:w-64 flex-shrink-0" aria-label="Product filters">
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
              
              {/* Results Grid */}
              <section className="flex-1" aria-label="Search results">
                {searchResult.products.length > 0 ? (
                  <ProductGrid
                    products={searchResult.products}
                    onProductClick={() => {
                      // Navigation is handled by ProductCard component
                    }}
                  />
                ) : (
                  /* Empty Results State */
                  <div className="text-center py-12">
                    <div className="bg-primary-50 border border-primary-200 rounded-lg p-8 max-w-md mx-auto">
                      <h2 className="text-xl font-semibold text-neutral-900 mb-4">
                        No products found
                      </h2>
                      <p className="text-neutral-700 mb-6">
                        {query
                          ? `We couldn't find any products matching "${query}". Try different keywords or browse our categories.`
                          : 'No products available at the moment.'}
                      </p>
                      
                      {/* Suggestions */}
                      {searchResult.suggestions && searchResult.suggestions.length > 0 && (
                        <div className="mb-6">
                          <p className="text-sm text-neutral-600 mb-2">Did you mean:</p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {searchResult.suggestions.map((suggestion, index) => (
                              <Link
                                key={index}
                                href={`/search?q=${encodeURIComponent(suggestion)}`}
                                className="px-3 py-1 bg-white border border-primary-300 rounded-full text-sm text-primary-700 hover:bg-primary-100 transition-colors"
                              >
                                {suggestion}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <Link
                        href="/"
                        className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors"
                      >
                        Browse All Products
                      </Link>
                    </div>
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-neutral-600">Loading search results...</p>
          </div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
