'use client';

import { useState, useEffect } from 'react';
import { X, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { SUPPORTED_BRANDS } from '@/types';
import { mockLocations } from '@/data/mockData';

export interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  priceMin?: number;
  priceMax?: number;
  selectedBrands?: string[];
  selectedConditions?: ('new' | 'used' | 'refurbished')[];
  selectedLocation?: string;
  onApplyFilters: (filters: {
    priceMin?: number;
    priceMax?: number;
    brands: string[];
    conditions: ('new' | 'used' | 'refurbished')[];
    location?: string;
  }) => void;
  onClearAll: () => void;
}

/**
 * MobileFilterDrawer Component
 * 
 * Mobile-optimized filter drawer with:
 * - Bottom sheet/drawer UI
 * - Touch-friendly controls
 * - Apply and Clear buttons
 * - Active filter count badge
 * - Smooth animations
 * 
 * Requirements: 8.2, 2.2
 */
export default function MobileFilterDrawer({
  isOpen,
  onClose,
  priceMin,
  priceMax,
  selectedBrands = [],
  selectedConditions = [],
  selectedLocation,
  onApplyFilters,
  onClearAll,
}: MobileFilterDrawerProps) {
  // Local state for filters (applied on "Apply" button)
  const [localPriceMin, setLocalPriceMin] = useState(priceMin?.toString() || '');
  const [localPriceMax, setLocalPriceMax] = useState(priceMax?.toString() || '');
  const [localBrands, setLocalBrands] = useState<string[]>(selectedBrands);
  const [localConditions, setLocalConditions] = useState<('new' | 'used' | 'refurbished')[]>(selectedConditions);
  const [localLocation, setLocalLocation] = useState<string | undefined>(selectedLocation);

  // Section expansion state
  const [priceSection, setPriceSection] = useState(true);
  const [brandSection, setBrandSection] = useState(false);
  const [conditionSection, setConditionSection] = useState(false);
  const [locationSection, setLocationSection] = useState(false);

  // Sync local state with props when drawer opens
  useEffect(() => {
    if (isOpen) {
      setLocalPriceMin(priceMin?.toString() || '');
      setLocalPriceMax(priceMax?.toString() || '');
      setLocalBrands(selectedBrands);
      setLocalConditions(selectedConditions);
      setLocalLocation(selectedLocation);
    }
  }, [isOpen, priceMin, priceMax, selectedBrands, selectedConditions, selectedLocation]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleBrandToggle = (brand: string) => {
    if (localBrands.includes(brand)) {
      setLocalBrands(localBrands.filter(b => b !== brand));
    } else {
      setLocalBrands([...localBrands, brand]);
    }
  };

  const handleConditionToggle = (condition: 'new' | 'used' | 'refurbished') => {
    if (localConditions.includes(condition)) {
      setLocalConditions(localConditions.filter(c => c !== condition));
    } else {
      setLocalConditions([...localConditions, condition]);
    }
  };

  const handleLocationSelect = (location: string) => {
    setLocalLocation(localLocation === location ? undefined : location);
  };

  const handleApply = () => {
    const min = localPriceMin ? parseFloat(localPriceMin) : undefined;
    const max = localPriceMax ? parseFloat(localPriceMax) : undefined;

    onApplyFilters({
      priceMin: min,
      priceMax: max,
      brands: localBrands,
      conditions: localConditions,
      location: localLocation,
    });
    onClose();
  };

  const handleClear = () => {
    setLocalPriceMin('');
    setLocalPriceMax('');
    setLocalBrands([]);
    setLocalConditions([]);
    setLocalLocation(undefined);
    onClearAll();
    onClose();
  };

  // Calculate active filter count
  const activeFilterCount = 
    (localPriceMin || localPriceMax ? 1 : 0) +
    localBrands.length +
    localConditions.length +
    (localLocation ? 1 : 0);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-200 px-4 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-neutral-700" />
            <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
            {activeFilterCount > 0 && (
              <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-600 text-white text-xs font-bold rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-700 hover:text-primary-700 active:bg-neutral-100 rounded-lg transition-colors touch-manipulation"
            aria-label="Close filters"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {/* Price Range Filter */}
          <div className="border-b border-neutral-200 pb-4 mb-4">
            <button
              onClick={() => setPriceSection(!priceSection)}
              className="flex items-center justify-between w-full text-left py-2 touch-manipulation"
            >
              <span className="font-medium text-neutral-900 text-base">Price Range (ETB)</span>
              {priceSection ? (
                <ChevronUp className="w-5 h-5 text-neutral-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-neutral-500" />
              )}
            </button>
            
            {priceSection && (
              <div className="mt-3 space-y-3">
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={localPriceMin}
                    onChange={(e) => setLocalPriceMin(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 text-base touch-manipulation"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={localPriceMax}
                    onChange={(e) => setLocalPriceMax(e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500 text-base touch-manipulation"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Brand Filter */}
          <div className="border-b border-neutral-200 pb-4 mb-4">
            <button
              onClick={() => setBrandSection(!brandSection)}
              className="flex items-center justify-between w-full text-left py-2 touch-manipulation"
            >
              <span className="font-medium text-neutral-900 text-base">
                Brand {localBrands.length > 0 && `(${localBrands.length})`}
              </span>
              {brandSection ? (
                <ChevronUp className="w-5 h-5 text-neutral-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-neutral-500" />
              )}
            </button>
            
            {brandSection && (
              <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                {SUPPORTED_BRANDS.map((brand) => (
                  <label
                    key={brand}
                    className="flex items-center gap-3 cursor-pointer active:bg-neutral-50 p-2 rounded-lg touch-manipulation"
                  >
                    <input
                      type="checkbox"
                      checked={localBrands.includes(brand)}
                      onChange={() => handleBrandToggle(brand)}
                      className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 touch-manipulation"
                    />
                    <span className="text-base text-neutral-700">{brand}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Condition Filter */}
          <div className="border-b border-neutral-200 pb-4 mb-4">
            <button
              onClick={() => setConditionSection(!conditionSection)}
              className="flex items-center justify-between w-full text-left py-2 touch-manipulation"
            >
              <span className="font-medium text-neutral-900 text-base">
                Condition {localConditions.length > 0 && `(${localConditions.length})`}
              </span>
              {conditionSection ? (
                <ChevronUp className="w-5 h-5 text-neutral-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-neutral-500" />
              )}
            </button>
            
            {conditionSection && (
              <div className="mt-3 space-y-2">
                {(['new', 'used', 'refurbished'] as const).map((condition) => (
                  <label
                    key={condition}
                    className="flex items-center gap-3 cursor-pointer active:bg-neutral-50 p-2 rounded-lg touch-manipulation"
                  >
                    <input
                      type="checkbox"
                      checked={localConditions.includes(condition)}
                      onChange={() => handleConditionToggle(condition)}
                      className="w-5 h-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 touch-manipulation"
                    />
                    <span className="text-base text-neutral-700 capitalize">
                      {condition}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Location Filter */}
          <div className="pb-4">
            <button
              onClick={() => setLocationSection(!locationSection)}
              className="flex items-center justify-between w-full text-left py-2 touch-manipulation"
            >
              <span className="font-medium text-neutral-900 text-base">
                Location {localLocation && '(1)'}
              </span>
              {locationSection ? (
                <ChevronUp className="w-5 h-5 text-neutral-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-neutral-500" />
              )}
            </button>
            
            {locationSection && (
              <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                {mockLocations.map((location) => (
                  <label
                    key={location.city}
                    className="flex items-center gap-3 cursor-pointer active:bg-neutral-50 p-2 rounded-lg touch-manipulation"
                  >
                    <input
                      type="radio"
                      name="location"
                      checked={localLocation === location.city}
                      onChange={() => handleLocationSelect(location.city)}
                      className="w-5 h-5 text-primary-600 border-neutral-300 focus:ring-primary-500 touch-manipulation"
                    />
                    <span className="text-base text-neutral-700">{location.city}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer with Action Buttons */}
        <div className="sticky bottom-0 bg-white border-t border-neutral-200 px-4 py-4 flex gap-3">
          <button
            onClick={handleClear}
            className="flex-1 px-6 py-3 border-2 border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50 active:bg-neutral-100 transition-colors touch-manipulation"
          >
            Clear All
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 active:bg-primary-800 transition-colors touch-manipulation"
          >
            Apply Filters
            {activeFilterCount > 0 && ` (${activeFilterCount})`}
          </button>
        </div>
      </div>
    </>
  );
}
