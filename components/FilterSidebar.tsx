'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { SUPPORTED_BRANDS } from '@/types';
import { mockLocations } from '@/data/mockData';

export interface FilterSidebarProps {
  priceMin?: number;
  priceMax?: number;
  selectedBrands?: string[];
  selectedConditions?: ('new' | 'used' | 'refurbished')[];
  selectedLocation?: string;
  onPriceChange: (min: number | undefined, max: number | undefined) => void;
  onBrandsChange: (brands: string[]) => void;
  onConditionsChange: (conditions: ('new' | 'used' | 'refurbished')[]) => void;
  onLocationChange: (location: string | undefined) => void;
  onClearAll: () => void;
}

export default function FilterSidebar({
  priceMin,
  priceMax,
  selectedBrands = [],
  selectedConditions = [],
  selectedLocation,
  onPriceChange,
  onBrandsChange,
  onConditionsChange,
  onLocationChange,
  onClearAll,
}: FilterSidebarProps) {
  const [priceSection, setPriceSection] = useState(true);
  const [brandSection, setBrandSection] = useState(true);
  const [conditionSection, setConditionSection] = useState(true);
  const [locationSection, setLocationSection] = useState(true);

  const [localPriceMin, setLocalPriceMin] = useState(priceMin?.toString() || '');
  const [localPriceMax, setLocalPriceMax] = useState(priceMax?.toString() || '');

  const handlePriceApply = () => {
    const min = localPriceMin ? parseFloat(localPriceMin) : undefined;
    const max = localPriceMax ? parseFloat(localPriceMax) : undefined;
    onPriceChange(min, max);
  };

  const handleBrandToggle = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandsChange(selectedBrands.filter(b => b !== brand));
    } else {
      onBrandsChange([...selectedBrands, brand]);
    }
  };

  const handleConditionToggle = (condition: 'new' | 'used' | 'refurbished') => {
    if (selectedConditions.includes(condition)) {
      onConditionsChange(selectedConditions.filter(c => c !== condition));
    } else {
      onConditionsChange([...selectedConditions, condition]);
    }
  };

  const handleLocationSelect = (location: string) => {
    onLocationChange(selectedLocation === location ? undefined : location);
  };

  const hasActiveFilters = 
    priceMin !== undefined || 
    priceMax !== undefined || 
    selectedBrands.length > 0 || 
    selectedConditions.length > 0 || 
    selectedLocation !== undefined;

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={onClearAll}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="border-b border-neutral-200 pb-4 mb-4">
        <button
          onClick={() => setPriceSection(!priceSection)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-neutral-900">Price Range (ETB)</span>
          {priceSection ? (
            <ChevronUp className="w-5 h-5 text-neutral-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-neutral-500" />
          )}
        </button>
        
        {priceSection && (
          <div className="mt-3 space-y-3">
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={localPriceMin}
                onChange={(e) => setLocalPriceMin(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={localPriceMax}
                onChange={(e) => setLocalPriceMax(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <button
              onClick={handlePriceApply}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-md transition-colors"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      {/* Brand Filter */}
      <div className="border-b border-neutral-200 pb-4 mb-4">
        <button
          onClick={() => setBrandSection(!brandSection)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-neutral-900">
            Brand {selectedBrands.length > 0 && `(${selectedBrands.length})`}
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
                className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandToggle(brand)}
                  className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">{brand}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Condition Filter */}
      <div className="border-b border-neutral-200 pb-4 mb-4">
        <button
          onClick={() => setConditionSection(!conditionSection)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-neutral-900">
            Condition {selectedConditions.length > 0 && `(${selectedConditions.length})`}
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
                className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 p-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedConditions.includes(condition)}
                  onChange={() => handleConditionToggle(condition)}
                  className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700 capitalize">
                  {condition}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Location Filter */}
      <div>
        <button
          onClick={() => setLocationSection(!locationSection)}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-neutral-900">
            Location {selectedLocation && '(1)'}
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
                className="flex items-center gap-2 cursor-pointer hover:bg-neutral-50 p-1 rounded"
              >
                <input
                  type="radio"
                  name="location"
                  checked={selectedLocation === location.city}
                  onChange={() => handleLocationSelect(location.city)}
                  className="w-4 h-4 text-primary-600 border-neutral-300 focus:ring-primary-500"
                />
                <span className="text-sm text-neutral-700">{location.city}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
