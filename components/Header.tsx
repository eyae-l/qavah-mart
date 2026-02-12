'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect, FormEvent } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Search, MapPin, ChevronDown, X, Menu } from 'lucide-react';

// Available locations from mock data
const AVAILABLE_LOCATIONS = [
  { city: 'Addis Ababa', region: 'Addis Ababa', country: 'Ethiopia' },
  { city: 'Dire Dawa', region: 'Dire Dawa', country: 'Ethiopia' },
  { city: 'Mekelle', region: 'Tigray', country: 'Ethiopia' },
  { city: 'Gondar', region: 'Amhara', country: 'Ethiopia' },
  { city: 'Bahir Dar', region: 'Amhara', country: 'Ethiopia' },
  { city: 'Hawassa', region: 'Sidama', country: 'Ethiopia' },
  { city: 'Adama', region: 'Oromia', country: 'Ethiopia' },
  { city: 'Jimma', region: 'Oromia', country: 'Ethiopia' },
  { city: 'Dessie', region: 'Amhara', country: 'Ethiopia' },
  { city: 'Harar', region: 'Harari', country: 'Ethiopia' },
];

export default function Header() {
  const router = useRouter();
  const { location, setLocation } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const locationDropdownRef = useRef<HTMLDivElement>(null);

  // Close location dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search submission
  const handleSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('q', searchQuery.trim());
      if (location) {
        params.set('location', location);
      }
      router.push(`/search?${params.toString()}`);
    }
  };

  // Handle location selection
  const handleLocationSelect = (locationString: string) => {
    setLocation(locationString);
    setIsLocationDropdownOpen(false);
  };

  // Clear location
  const handleClearLocation = () => {
    setLocation(null);
    setIsLocationDropdownOpen(false);
  };

  // Get current location display text
  const currentLocationDisplay = location || 'All Ethiopia';

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50 shadow-sm" role="banner">
      <div className="container mx-auto px-4">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl font-bold text-primary-700 hover:text-primary-800 transition-colors whitespace-nowrap"
            aria-label="Qavah-mart home"
          >
            Qavah-mart
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-2xl" role="search">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for computers, components, accessories..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
                aria-label="Search for products"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" aria-hidden="true" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 transition-colors"
                aria-label="Submit search"
              >
                Search
              </button>
            </div>
          </form>

          {/* Location Selector */}
          <nav aria-label="Location selector">
            <div className="relative" ref={locationDropdownRef}>
              <button
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 text-neutral-700 hover:text-primary-700 hover:bg-neutral-50 rounded-lg transition-colors whitespace-nowrap"
                aria-label={`Current location: ${currentLocationDisplay}`}
                aria-expanded={isLocationDropdownOpen}
                aria-haspopup="true"
              >
                <MapPin className="w-5 h-5" aria-hidden="true" />
                <span className="text-sm font-medium">{currentLocationDisplay}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>

              {/* Location Dropdown */}
              {isLocationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-neutral-200 rounded-lg shadow-lg py-2 max-h-96 overflow-y-auto" role="menu">
                  {/* Clear Location Option */}
                  <button
                    onClick={handleClearLocation}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 transition-colors flex items-center justify-between"
                    role="menuitem"
                  >
                    <span className="font-medium text-neutral-900">All Ethiopia</span>
                    {!location && <span className="text-primary-600 text-xs" aria-label="Selected">✓</span>}
                  </button>
                  
                  <div className="border-t border-neutral-200 my-2" role="separator"></div>

                  {/* Location Options */}
                  {AVAILABLE_LOCATIONS.map((loc) => {
                    const locationString = `${loc.city}, ${loc.region}`;
                    const isSelected = location === locationString;
                    
                    return (
                      <button
                        key={locationString}
                        onClick={() => handleLocationSelect(locationString)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 transition-colors flex items-center justify-between"
                        role="menuitem"
                        aria-current={isSelected ? 'true' : undefined}
                      >
                        <div>
                          <div className="font-medium text-neutral-900">{loc.city}</div>
                          <div className="text-xs text-neutral-500">{loc.region}</div>
                        </div>
                        {isSelected && <span className="text-primary-600 text-xs" aria-label="Selected">✓</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="flex items-center justify-between h-14">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-neutral-700 hover:text-primary-700"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>

            {/* Logo */}
            <Link 
              href="/" 
              className="text-xl font-bold text-primary-700"
              aria-label="Qavah-mart home"
            >
              Qavah-mart
            </Link>

            {/* Location Icon */}
            <button
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              className="p-2 text-neutral-700 hover:text-primary-700"
              aria-label={`Select location. Current: ${currentLocationDisplay}`}
              aria-expanded={isLocationDropdownOpen}
            >
              <MapPin className="w-6 h-6" aria-hidden="true" />
            </button>
          </div>

          {/* Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="pb-3" role="search">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                aria-label="Search for products"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" aria-hidden="true" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-primary-600 text-white text-xs rounded hover:bg-primary-700"
                aria-label="Submit search"
              >
                Search
              </button>
            </div>
          </form>

          {/* Mobile Location Dropdown */}
          {isLocationDropdownOpen && (
            <div className="absolute left-0 right-0 mt-1 mx-4 bg-white border border-neutral-200 rounded-lg shadow-lg py-2 max-h-80 overflow-y-auto z-50" role="menu">
              <button
                onClick={handleClearLocation}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center justify-between"
                role="menuitem"
              >
                <span className="font-medium text-neutral-900">All Ethiopia</span>
                {!location && <span className="text-primary-600 text-xs" aria-label="Selected">✓</span>}
              </button>
              
              <div className="border-t border-neutral-200 my-2" role="separator"></div>

              {AVAILABLE_LOCATIONS.map((loc) => {
                const locationString = `${loc.city}, ${loc.region}`;
                const isSelected = location === locationString;
                
                return (
                  <button
                    key={locationString}
                    onClick={() => handleLocationSelect(locationString)}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 flex items-center justify-between"
                    role="menuitem"
                    aria-current={isSelected ? 'true' : undefined}
                  >
                    <div>
                      <div className="font-medium text-neutral-900">{loc.city}</div>
                      <div className="text-xs text-neutral-500">{loc.region}</div>
                    </div>
                    {isSelected && <span className="text-primary-600 text-xs" aria-label="Selected">✓</span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
