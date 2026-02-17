'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect, FormEvent } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useUser } from '@/contexts/UserContext';
import { Search, MapPin, ChevronDown, X, Menu, User as UserIcon, LogOut, LayoutDashboard, UserCircle } from 'lucide-react';

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
  const { user, isAuthenticated, logout } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const locationDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(event.target as Node)) {
        setIsLocationDropdownOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
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

  // Handle logout
  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push('/');
  };

  // Get user display name
  const userDisplayName = user ? `${user.firstName} ${user.lastName}` : '';

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

          {/* User Authentication */}
          <nav aria-label="User menu" className="flex items-center gap-2">
            {!isAuthenticated ? (
              <>
                {/* Login Button */}
                <Link
                  href="/user/login"
                  className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-primary-700 hover:bg-neutral-50 rounded-lg transition-colors whitespace-nowrap"
                >
                  Login
                </Link>
                
                {/* Register Button */}
                <Link
                  href="/user/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  Register
                </Link>
              </>
            ) : (
              /* User Menu Dropdown */
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 text-neutral-700 hover:text-primary-700 hover:bg-neutral-50 rounded-lg transition-colors"
                  aria-label="User menu"
                  aria-expanded={isUserMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-primary-700" aria-hidden="true" />
                  </div>
                  <span className="text-sm font-medium max-w-32 truncate">{userDisplayName}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 rounded-lg shadow-lg py-2" role="menu">
                    <div className="px-4 py-2 border-b border-neutral-200">
                      <p className="text-sm font-medium text-neutral-900">{userDisplayName}</p>
                      <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                    </div>

                    <Link
                      href="/user/profile"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      role="menuitem"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <UserCircle className="w-4 h-4" aria-hidden="true" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/user/dashboard"
                      className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                      role="menuitem"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" aria-hidden="true" />
                      <span>Dashboard</span>
                    </Link>

                    <div className="border-t border-neutral-200 my-2" role="separator"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      role="menuitem"
                    >
                      <LogOut className="w-4 h-4" aria-hidden="true" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

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
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button - Touch optimized (44x44px) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 -ml-3 text-neutral-700 hover:text-primary-700 active:bg-primary-50 rounded-lg transition-colors touch-manipulation"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>

            {/* Logo */}
            <Link 
              href="/" 
              className="text-xl font-bold text-primary-700 active:text-primary-800 transition-colors"
              aria-label="Qavah-mart home"
            >
              Qavah-mart
            </Link>

            {/* Right Side Icons */}
            <div className="flex items-center gap-1">
              {/* User Icon - Touch optimized (44x44px) */}
              {isAuthenticated ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-3 text-neutral-700 hover:text-primary-700 active:bg-primary-50 rounded-lg transition-colors touch-manipulation"
                  aria-label="User menu"
                  aria-expanded={isUserMenuOpen}
                >
                  <UserIcon className="w-6 h-6" aria-hidden="true" />
                </button>
              ) : (
                <Link
                  href="/user/login"
                  className="p-3 text-neutral-700 hover:text-primary-700 active:bg-primary-50 rounded-lg transition-colors touch-manipulation"
                  aria-label="Login"
                >
                  <UserIcon className="w-6 h-6" aria-hidden="true" />
                </Link>
              )}

              {/* Location Icon - Touch optimized (44x44px) */}
              <button
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              className="p-3 -mr-3 text-neutral-700 hover:text-primary-700 active:bg-primary-50 rounded-lg transition-colors touch-manipulation"
              aria-label={`Select location. Current: ${currentLocationDisplay}`}
              aria-expanded={isLocationDropdownOpen}
            >
              <MapPin className="w-6 h-6" aria-hidden="true" />
            </button>
            </div>
          </div>

          {/* Mobile Search Bar - Improved touch targets */}
          <form onSubmit={handleSearchSubmit} className="pb-4" role="search">
            <div className="relative">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-11 pr-20 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-base touch-manipulation"
                aria-label="Search for products"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" aria-hidden="true" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 active:bg-primary-800 transition-colors touch-manipulation"
                aria-label="Submit search"
              >
                Search
              </button>
            </div>
          </form>

          {/* Mobile User Menu Dropdown */}
          {isUserMenuOpen && isAuthenticated && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black bg-opacity-30 z-40"
                onClick={() => setIsUserMenuOpen(false)}
                aria-hidden="true"
              />
              
              {/* Dropdown Panel */}
              <div className="fixed left-4 right-4 top-32 bg-white border border-neutral-200 rounded-lg shadow-xl py-2 z-50" role="menu">
                <div className="px-4 py-3 border-b border-neutral-200">
                  <p className="text-base font-medium text-neutral-900">{userDisplayName}</p>
                  <p className="text-sm text-neutral-500 truncate">{user?.email}</p>
                </div>

                <Link
                  href="/user/profile"
                  className="flex items-center gap-3 px-4 py-3 text-base text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100 transition-colors touch-manipulation"
                  role="menuitem"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <UserCircle className="w-5 h-5" aria-hidden="true" />
                  <span>My Profile</span>
                </Link>

                <Link
                  href="/user/dashboard"
                  className="flex items-center gap-3 px-4 py-3 text-base text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100 transition-colors touch-manipulation"
                  role="menuitem"
                  onClick={() => setIsUserMenuOpen(false)}
                >
                  <LayoutDashboard className="w-5 h-5" aria-hidden="true" />
                  <span>Dashboard</span>
                </Link>

                <div className="border-t border-neutral-200 my-2" role="separator"></div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-base text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors touch-manipulation"
                  role="menuitem"
                >
                  <LogOut className="w-5 h-5" aria-hidden="true" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}

          {/* Mobile Location Dropdown - Improved touch targets */}
          {isLocationDropdownOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black bg-opacity-30 z-40"
                onClick={() => setIsLocationDropdownOpen(false)}
                aria-hidden="true"
              />
              
              {/* Dropdown Panel */}
              <div className="fixed left-4 right-4 top-32 bg-white border border-neutral-200 rounded-lg shadow-xl py-2 max-h-96 overflow-y-auto z-50 animate-slide-in" role="menu">
                <button
                  onClick={handleClearLocation}
                  className="w-full px-4 py-3 text-left text-base hover:bg-neutral-50 active:bg-neutral-100 flex items-center justify-between transition-colors touch-manipulation"
                  role="menuitem"
                >
                  <span className="font-medium text-neutral-900">All Ethiopia</span>
                  {!location && <span className="text-primary-600 text-sm" aria-label="Selected">✓</span>}
                </button>
                
                <div className="border-t border-neutral-200 my-2" role="separator"></div>

                {AVAILABLE_LOCATIONS.map((loc) => {
                  const locationString = `${loc.city}, ${loc.region}`;
                  const isSelected = location === locationString;
                  
                  return (
                    <button
                      key={locationString}
                      onClick={() => handleLocationSelect(locationString)}
                      className="w-full px-4 py-3 text-left text-base hover:bg-neutral-50 active:bg-neutral-100 flex items-center justify-between transition-colors touch-manipulation"
                      role="menuitem"
                      aria-current={isSelected ? 'true' : undefined}
                    >
                      <div>
                        <div className="font-medium text-neutral-900">{loc.city}</div>
                        <div className="text-sm text-neutral-500">{loc.region}</div>
                      </div>
                      {isSelected && <span className="text-primary-600 text-sm" aria-label="Selected">✓</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
