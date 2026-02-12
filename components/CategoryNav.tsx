'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { CATEGORY_STRUCTURE } from '@/types';

// Convert CATEGORY_STRUCTURE to array format with subcategories
const categories = Object.entries(CATEGORY_STRUCTURE).map(([slug, data]) => ({
  name: data.name,
  slug,
  subcategories: data.subcategories,
}));

/**
 * CategoryNav Component
 * 
 * Navigation bar with all seven main computer categories
 * Features:
 * - Hover effects and active states with brown theme colors
 * - Dropdown menus for subcategories on hover
 * - Responsive design with mobile hamburger menu
 * 
 * Requirements: 9.3, 9.4, 8.1, 1.1
 */
export default function CategoryNav() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenCategory, setMobileOpenCategory] = useState<string | null>(null);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setMobileOpenCategory(null);
  }, [pathname]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setMobileOpenCategory(null);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when mobile menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Handle mouse enter for dropdown
  const handleMouseEnter = (slug: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(slug);
  };

  // Handle mouse leave for dropdown
  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  // Check if a category is active
  const isCategoryActive = (slug: string) => {
    return pathname?.startsWith(`/categories/${slug}`);
  };

  // Check if a subcategory is active
  const isSubcategoryActive = (categorySlug: string, subcategory: string) => {
    const subcategorySlug = subcategory.toLowerCase().replace(/\s+/g, '-');
    return pathname === `/categories/${categorySlug}/${subcategorySlug}`;
  };

  // Toggle mobile category dropdown
  const toggleMobileCategory = (slug: string) => {
    setMobileOpenCategory(mobileOpenCategory === slug ? null : slug);
  };

  return (
    <nav className="bg-primary-50 border-b border-primary-200 relative z-40">
      <div className="container mx-auto px-4">
        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <ul className="flex items-center gap-1">
            {categories.map((category) => {
              const isActive = isCategoryActive(category.slug);
              const hasSubcategories = category.subcategories.length > 0;
              const isOpen = openDropdown === category.slug;

              return (
                <li
                  key={category.slug}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(category.slug)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={`/categories/${category.slug}`}
                    className={`
                      flex items-center gap-1 px-4 py-3 text-sm font-medium whitespace-nowrap
                      transition-colors duration-200 rounded-t-lg
                      ${
                        isActive
                          ? 'bg-primary-600 text-white'
                          : 'text-neutral-700 hover:bg-primary-100 hover:text-primary-800'
                      }
                    `}
                  >
                    {category.name}
                    {hasSubcategories && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu for Subcategories */}
                  {hasSubcategories && isOpen && (
                    <div className="absolute left-0 top-full mt-0 w-56 bg-white border border-neutral-200 rounded-b-lg shadow-lg py-2 z-50">
                      {category.subcategories.map((subcategory) => {
                        const subcategorySlug = subcategory.toLowerCase().replace(/\s+/g, '-');
                        const isSubActive = isSubcategoryActive(category.slug, subcategory);

                        return (
                          <Link
                            key={subcategory}
                            href={`/categories/${category.slug}/${subcategorySlug}`}
                            className={`
                              block px-4 py-2 text-sm transition-colors duration-150
                              ${
                                isSubActive
                                  ? 'bg-primary-50 text-primary-700 font-medium'
                                  : 'text-neutral-700 hover:bg-primary-50 hover:text-primary-700'
                              }
                            `}
                          >
                            {subcategory}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <div className="flex items-center justify-between py-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 hover:text-primary-700 hover:bg-primary-100 rounded-lg transition-colors"
              aria-label="Toggle categories menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
              <span>Categories</span>
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-hidden="true"
              />

              {/* Mobile Menu Panel */}
              <div className="fixed left-0 right-0 top-[112px] bottom-0 bg-white z-50 overflow-y-auto">
                <div className="py-2">
                  {categories.map((category) => {
                    const isActive = isCategoryActive(category.slug);
                    const hasSubcategories = category.subcategories.length > 0;
                    const isOpen = mobileOpenCategory === category.slug;

                    return (
                      <div key={category.slug} className="border-b border-neutral-200">
                        <div className="flex items-center">
                          <Link
                            href={`/categories/${category.slug}`}
                            className={`
                              flex-1 px-4 py-3 text-sm font-medium transition-colors
                              ${
                                isActive
                                  ? 'bg-primary-50 text-primary-700'
                                  : 'text-neutral-700 hover:bg-neutral-50'
                              }
                            `}
                          >
                            {category.name}
                          </Link>

                          {hasSubcategories && (
                            <button
                              onClick={() => toggleMobileCategory(category.slug)}
                              className="px-4 py-3 text-neutral-700 hover:bg-neutral-50"
                              aria-label={`Toggle ${category.name} subcategories`}
                              aria-expanded={isOpen}
                            >
                              <ChevronDown
                                className={`w-5 h-5 transition-transform duration-200 ${
                                  isOpen ? 'rotate-180' : ''
                                }`}
                              />
                            </button>
                          )}
                        </div>

                        {/* Mobile Subcategories */}
                        {hasSubcategories && isOpen && (
                          <div className="bg-neutral-50 py-1">
                            {category.subcategories.map((subcategory) => {
                              const subcategorySlug = subcategory.toLowerCase().replace(/\s+/g, '-');
                              const isSubActive = isSubcategoryActive(category.slug, subcategory);

                              return (
                                <Link
                                  key={subcategory}
                                  href={`/categories/${category.slug}/${subcategorySlug}`}
                                  className={`
                                    block px-8 py-2 text-sm transition-colors
                                    ${
                                      isSubActive
                                        ? 'bg-primary-100 text-primary-700 font-medium'
                                        : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                                    }
                                  `}
                                >
                                  {subcategory}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
