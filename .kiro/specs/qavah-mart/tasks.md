# Implementation Plan: Qavah-mart Computer E-commerce Platform

## Overview

This implementation plan breaks down the Qavah-mart e-commerce platform into discrete, manageable coding tasks. Each task builds incrementally on previous work, ensuring a functional system at each checkpoint. The implementation uses Next.js 13+ with TypeScript, Tailwind CSS for styling, and follows modern React patterns with Server and Client Components.

## Tasks

- [x] 1. Project Setup and Core Infrastructure
  - Initialize Next.js 13+ project with TypeScript and Tailwind CSS
  - Configure brown/white color theme in Tailwind config with primary and neutral color scales
  - Set up project structure with app router following the design routing structure
  - Configure Next.js Image optimization settings for WebP/AVIF formats
  - Install and configure dependencies (React Hook Form, Zod, Lucide React, fast-check)
  - Create basic layout components and global styles
  - _Requirements: 8.3, 10.2, 10.3_

- [ ] 2. Data Models and Type Definitions
  - [x] 2.1 Create TypeScript interfaces for all data models
    - Define Product interface with all fields (id, title, description, price, condition, category, subcategory, brand, specifications, images, location, sellerId, timestamps, status, views, favorites)
    - Define ProductSpecifications interface for computer-specific specs
    - Define User and Seller interfaces with authentication and profile fields
    - Define Category and Subcategory interfaces with the seven main categories structure
    - Define Review, ProductRating, and SellerRating interfaces
    - Define Location, SearchFilters, SearchResult, and SearchFacets interfaces
    - Create SupportedBrand type with all 16 brands from requirements
    - Create CATEGORY_STRUCTURE constant with all categories and subcategories
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.4, 3.1, 4.1, 6.1, 7.1_

  - [ ]* 2.2 Write property test for product catalog organization
    - **Property 1: Product Catalog Organization**
    - Test that any product is assigned to exactly one of seven main categories with valid subcategory
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.4, 1.5**

  - [x] 2.3 Create mock data generators and sample datasets
    - Generate sample products across all seven categories (Laptops, Desktop Computers, Computer Components, Peripherals, Networking Equipment, Software & Licenses, Computer Accessories)
    - Include all subcategories (Gaming/Business/Ultrabooks/Budget for Laptops, etc.)
    - Create products with all 16 supported brands (Dell, HP, Lenovo, ASUS, Acer, MSI, Apple, Intel, AMD, NVIDIA, Corsair, Kingston, Samsung, Logitech, Razer, SteelSeries)
    - Generate sample users with seller and buyer profiles
    - Create sample reviews with ratings and comments
    - Include realistic computer specifications for each product type
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.4, 3.1, 7.1_

- [ ] 3. Core Layout and Navigation Components
  - [x] 3.1 Implement root layout with header and footer
    - Create app/layout.tsx with consistent header and footer structure
    - Apply brown/white color scheme globally
    - Set up React Context providers for user, location, and app state
    - _Requirements: 8.3, 9.1, 9.5_

  - [x] 3.2 Implement Header component with logo, search bar, and location selector
    - Create Header component with Qavah-mart logo
    - Implement search input with proper styling and submit handling
    - Add LocationSelector dropdown with available locations
    - Make header responsive for mobile, tablet, and desktop
    - _Requirements: 9.1, 9.2, 8.1, 6.1_

  - [ ]* 3.3 Write property test for navigation consistency
    - **Property 17: Navigation Consistency**
    - Test that any page displays complete header with logo, search bar, and location selector
    - **Validates: Requirements 9.1, 9.3, 9.5**

  - [x] 3.4 Implement Category Navigation component
    - Create navigation bar with all seven main computer categories
    - Add hover effects and active states with brown theme colors
    - Implement dropdown menus for subcategories on hover
    - Ensure responsive design with mobile hamburger menu
    - _Requirements: 9.3, 9.4, 8.1, 1.1_

  - [ ]* 3.5 Write property test for navigation functionality
    - **Property 18: Navigation Functionality**
    - Test that any category navigation click navigates to appropriate category page
    - **Validates: Requirements 9.4**

- [ ] 4. Product Display Components
  - [x] 4.1 Create ProductCard component
    - Display product image using Next.js Image component with optimization
    - Show brown placeholder box when image is missing
    - Display title, price with ETB currency, condition badge (New/Used/Refurbished)
    - Show location information with icon
    - Add hover effects and click handling
    - Make responsive for different grid layouts
    - _Requirements: 1.6, 3.2, 3.4, 6.3, 10.3_

  - [ ]* 4.2 Write property test for product display completeness
    - **Property 2: Product Display Completeness**
    - Test that any product displayed contains all required fields (title, price, condition, location, image or placeholder)
    - **Validates: Requirements 1.6, 3.2, 3.4, 6.3**

  - [x] 4.3 Implement ProductGrid component
    - Create responsive grid layout (2 columns mobile, 3 tablet, 4 desktop)
    - Implement lazy loading for images using Next.js Image with loading="lazy"
    - Add loading skeleton states
    - Handle empty states with helpful messages
    - _Requirements: 1.6, 8.1, 10.3, 10.4_

  - [ ]* 4.4 Write property test for image optimization
    - **Property 20: Image Optimization Implementation**
    - Test that any image uses Next.js Image component with lazy loading in grids
    - **Validates: Requirements 10.3, 10.4**

- [ ] 5. Homepage and Category Pages
  - [x] 5.1 Create homepage with featured products
    - Implement app/page.tsx with Server Component for SSG
    - Display featured products from all categories
    - Add category quick links with icons
    - Include hero section with search functionality
    - _Requirements: 1.1, 1.6, 9.1, 9.3_

  - [x] 5.2 Implement dynamic category pages
    - Create app/categories/[category]/page.tsx with SSG
    - Display products filtered by selected category
    - Show subcategory navigation within category
    - Add breadcrumb navigation
    - Generate static params for all seven categories
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 9.4_

  - [x] 5.3 Implement dynamic subcategory pages
    - Create app/categories/[category]/[subcategory]/page.tsx with SSG
    - Display products filtered by category and subcategory
    - Show relevant filters for subcategory
    - Add breadcrumb navigation
    - _Requirements: 1.2, 1.3, 1.4, 1.5_

- [x] 6. Checkpoint - Basic Product Display
  - Ensure all tests pass, verify responsive design works across devices, ask the user if questions arise.

- [ ] 7. Search Functionality
  - [x] 7.1 Implement search API route
    - Create app/api/search/route.ts
    - Implement search logic for product titles, descriptions, and specifications
    - Return relevant products with facets for filtering
    - Add query validation and error handling
    - _Requirements: 2.1, 9.2_

  - [x] 7.2 Create search results page
    - Implement app/search/page.tsx with SSR
    - Display search results in grid layout
    - Show search query and result count
    - Handle empty results with suggestions
    - Add sorting options (relevance, price-low, price-high, newest)
    - _Requirements: 2.1, 9.2_

  - [ ]* 7.3 Write property test for search result relevance
    - **Property 3: Search Result Relevance**
    - Test that any search query returns products containing search terms in title, description, or specifications
    - **Validates: Requirements 2.1, 9.2**

  - [x] 7.4 Implement search bar functionality in header
    - Connect header search input to search page
    - Add search suggestions/autocomplete
    - Handle search submission and navigation
    - _Requirements: 9.2_

- [ ] 8. Filter System
  - [x] 8.1 Create FilterSidebar component
    - Implement price range filter with min/max inputs
    - Add brand filter with checkboxes for all 16 supported brands
    - Add condition filter (New, Used, Refurbished)
    - Add location filter with available locations
    - Implement "Clear All Filters" functionality
    - Make responsive with collapsible sections on mobile
    - _Requirements: 2.2, 2.3, 2.4, 2.5, 6.2_

  - [ ]* 8.2 Write property test for filter functionality
    - **Property 4: Filter Functionality**
    - Test that any applied filter returns only products matching filter criteria
    - **Validates: Requirements 2.3, 2.4, 2.5, 6.2, 6.4**

  - [x] 8.3 Integrate filters with search results
    - Connect FilterSidebar to search results page
    - Synchronize filter state with URL query parameters
    - Update results dynamically when filters change
    - Display active filters with remove buttons
    - _Requirements: 2.2, 2.3, 2.4, 2.5_

  - [x] 8.4 Implement location-based filtering
    - Add location filter to all product listing pages
    - Prioritize local results when location is selected
    - Display distance or location information on products
    - _Requirements: 6.2, 6.4_

- [ ] 9. Product Detail Pages
  - [x] 9.1 Create product detail page layout
    - Implement app/products/[productId]/page.tsx with SSR
    - Create two-column layout (images left, details right)
    - Make responsive for mobile (stacked layout)
    - _Requirements: 3.1, 8.1_

  - [x] 9.2 Implement ProductImageGallery component
    - Display multiple product images with thumbnail navigation
    - Add zoom functionality on click
    - Show brown placeholder for missing images
    - Use Next.js Image with priority loading for first image
    - _Requirements: 3.4, 10.3_

  - [x] 9.3 Implement ProductDetails component
    - Display product title, price, and condition badge
    - Show comprehensive specifications table
    - Display seller information (name, location, verification status)
    - Add "Contact Seller" button
    - Show product status (available, sold)
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ]* 9.4 Write property test for product detail completeness
    - **Property 5: Product Detail Page Completeness**
    - Test that any product detail page displays specifications, seller info, reviews section, and images
    - **Validates: Requirements 3.1, 3.3, 3.5, 7.3**

  - [x] 9.5 Add related products section
    - Show similar products from same category/subcategory
    - Implement recommendation logic based on brand and specifications
    - Display in horizontal scrollable grid
    - _Requirements: 1.1, 1.6_

- [ ] 10. Review and Rating Display
  - [x] 10.1 Create RatingDisplay component
    - Implement 5-star rating visualization
    - Support different sizes (small, medium, large)
    - Show average rating and review count
    - _Requirements: 7.2_

  - [x] 10.2 Create RatingDistribution component
    - Display rating breakdown (5-star to 1-star counts)
    - Show percentage bars for each rating level
    - Make interactive to filter reviews by rating
    - _Requirements: 7.2_

  - [x] 10.3 Implement ReviewList component
    - Display individual reviews with user info, rating, and comment
    - Show review date and verified purchase badge
    - Add "Helpful" button with count
    - Implement review sorting (most recent, highest rated, most helpful)
    - Add pagination for large review lists
    - _Requirements: 7.3_

  - [ ]* 10.4 Write property test for rating calculation accuracy
    - **Property 15: Rating Calculation Accuracy**
    - Test that any product/seller with reviews displays accurate average rating
    - **Validates: Requirements 7.2, 7.5**

  - [x] 10.5 Integrate reviews into product detail page
    - Add reviews section below product details
    - Display average rating and distribution
    - Show review list with sorting options
    - _Requirements: 3.5, 7.2, 7.3_

- [x] 11. Checkpoint - Product Pages Complete
  - Ensure all tests pass, verify product detail pages work correctly, ask the user if questions arise.

- [ ] 12. User Authentication System
  - [x] 12.1 Create authentication context and hooks
    - Implement UserContext with React Context API
    - Create useAuth hook for authentication state
    - Add login, logout, register, and updateProfile functions
    - Store user session in localStorage
    - _Requirements: 4.1, 4.2_

  - [x] 12.2 Create AuthModal component
    - Implement modal with tabs for login and register
    - Add form validation using React Hook Form and Zod
    - Show appropriate error messages for validation failures
    - Handle authentication success and failure
    - _Requirements: 4.1, 4.2_

  - [ ]* 12.3 Write property test for user registration validation
    - **Property 6: User Registration Validation**
    - Test that any registration with valid data creates account, invalid data is rejected with errors
    - **Validates: Requirements 4.1**

  - [ ]* 12.4 Write property test for authentication security
    - **Property 7: Authentication Security**
    - Test that any login with valid credentials creates session, invalid credentials are rejected
    - **Validates: Requirements 4.2**

  - [x] 12.5 Create login and register pages
    - Implement app/user/login/page.tsx
    - Implement app/user/register/page.tsx
    - Add form validation and error handling
    - Redirect to previous page after successful login
    - _Requirements: 4.1, 4.2_

- [ ] 13. User Profile and Dashboard
  - [x] 13.1 Create user profile page
    - Implement app/user/profile/page.tsx with SSR
    - Display user information (name, email, phone, location)
    - Show verification status badge
    - Display user's listing history
    - Add "Edit Profile" button
    - _Requirements: 4.3_

  - [ ]* 13.2 Write property test for profile information completeness
    - **Property 8: Profile Information Completeness**
    - Test that any user profile page displays complete user info, verification status, and listing history
    - **Validates: Requirements 4.3**

  - [x] 13.3 Implement profile editing functionality
    - Create profile edit form with validation
    - Allow updating name, phone, location, and avatar
    - Save changes to storage
    - Show success/error messages
    - _Requirements: 4.4_

  - [ ]* 13.4 Write property test for profile update persistence
    - **Property 9: Profile Update Persistence**
    - Test that any profile update with valid data is saved and immediately reflected in UI
    - **Validates: Requirements 4.4**

  - [x] 13.5 Implement seller verification features
    - Add verification badge display
    - Create verification request form
    - Show verification status on seller profiles
    - _Requirements: 4.5, 3.3_

- [ ] 14. Seller Dashboard and Listing Management
  - [x] 14.1 Create seller dashboard page
    - Implement app/user/dashboard/page.tsx with SSR
    - Display active listings, sold items, and inactive listings
    - Show seller analytics (total sales, views, favorites)
    - Display seller rating and recent reviews
    - Add "Create New Listing" button
    - _Requirements: 5.4, 5.5, 7.5_

  - [x] 14.2 Create ListingForm component
    - Implement comprehensive product listing form
    - Add fields for title, description, price, condition, category, subcategory, brand
    - Include specifications input based on category
    - Add image upload with preview (multiple images)
    - Implement location selection
    - Add form validation with React Hook Form and Zod
    - _Requirements: 5.1, 5.2_

  - [ ]* 14.3 Write property test for listing validation
    - **Property 10: Listing Validation and Publication**
    - Test that any listing with all required fields is published, missing fields are rejected with errors
    - **Validates: Requirements 5.1, 5.3**

  - [x] 14.4 Create new listing page
    - Implement app/sell/new/page.tsx
    - Integrate ListingForm component
    - Handle form submission and validation
    - Upload images and create product record
    - Redirect to product detail page on success
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 14.5 Implement listing editing functionality
    - Create app/sell/edit/[listingId]/page.tsx
    - Pre-populate form with existing product data
    - Allow updating all product fields
    - Support image replacement and addition
    - Verify user is the listing owner
    - _Requirements: 5.4_

  - [ ]* 14.6 Write property test for listing management authority
    - **Property 12: Listing Management Authority**
    - Test that only original seller can modify or change status of their listings
    - **Validates: Requirements 5.4, 5.5**

  - [x] 14.7 Add listing status management
    - Implement "Mark as Sold" functionality
    - Add "Remove Listing" functionality
    - Add "Reactivate Listing" functionality
    - Update listing status in storage
    - _Requirements: 5.5_

- [ ] 15. Location Services
  - [x] 15.1 Create LocationContext and hooks
    - Implement LocationContext with React Context API
    - Create useLocation hook for location state
    - Add setLocation and clearLocation functions
    - Store location preference in localStorage
    - _Requirements: 6.1, 6.5_

  - [x] 15.2 Implement LocationSelector component
    - Create dropdown with available locations
    - Show current selected location
    - Handle location change events
    - Display location icon
    - _Requirements: 6.1_

  - [ ]* 15.3 Write property test for location preference persistence
    - **Property 13: Location Preference Persistence**
    - Test that any selected location is maintained across page navigations and sessions
    - **Validates: Requirements 6.5**

  - [x] 15.4 Integrate location filtering across the site
    - Apply location filter to all product listing pages
    - Filter search results by location
    - Prioritize local results in search
    - Display seller location on all product displays
    - _Requirements: 6.2, 6.3, 6.4_

- [ ] 16. Checkpoint - User and Seller Features Complete
  - Ensure all tests pass, verify authentication and listing workflows work correctly, ask the user if questions arise.

- [ ] 17. Review Submission System
  - [x] 17.1 Create ReviewForm component
    - Implement review submission form with rating selector (1-5 stars)
    - Add title and comment text inputs
    - Implement form validation
    - Show character count for comment
    - _Requirements: 7.1_

  - [x] 17.2 Implement review submission functionality
    - Create API route for review submission
    - Validate user is authenticated
    - Check for duplicate reviews (prevent same user reviewing same product twice)
    - Save review to storage
    - Update product and seller ratings
    - _Requirements: 7.1, 7.4_

  - [ ]* 17.3 Write property test for review system integrity
    - **Property 14: Review System Integrity**
    - Test that any user can only submit one review per product
    - **Validates: Requirements 7.4**

  - [x] 17.4 Add review submission to product detail page
    - Show "Write a Review" button for authenticated users
    - Display ReviewForm in modal or expandable section
    - Handle review submission success/error
    - Refresh reviews list after submission
    - _Requirements: 7.1_

  - [x] 17.5 Implement seller rating display
    - Show seller rating on product detail pages
    - Display seller rating on seller profile pages
    - Calculate seller rating from all their product reviews
    - _Requirements: 7.5_

- [ ] 18. Responsive Design Implementation
  - [x] 18.1 Implement responsive breakpoints for all components
    - Test all components at mobile (<768px), tablet (768-1023px), and desktop (≥1024px)
    - Adjust grid layouts for different screen sizes
    - Ensure proper spacing and typography scaling
    - Fix any layout issues or overlapping elements
    - _Requirements: 8.1, 8.5_

  - [x] 18.2 Optimize mobile navigation
    - Create mobile hamburger menu for category navigation
    - Implement mobile-friendly search interface
    - Add touch-optimized buttons and interactions
    - Ensure proper tap target sizes (minimum 44x44px)
    - _Requirements: 8.2, 9.1, 9.2_

  - [x] 18.3 Implement mobile filter interface
    - Create mobile filter drawer/modal
    - Add "Apply Filters" and "Clear Filters" buttons
    - Show active filter count badge
    - Make filter options touch-friendly
    - _Requirements: 8.2, 2.2_

  - [ ]* 18.4 Write property test for responsive design consistency
    - **Property 16: Responsive Design Adaptation**
    - Test that any page adapts layout appropriately at different screen sizes while maintaining functionality and branding
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.5**

- [ ] 19. SEO Optimization
  - [x] 19.1 Implement metadata generation for all pages
    - Add generateMetadata function to all page components
    - Include proper title, description, and keywords
    - Add Open Graph tags for social sharing
    - Add Twitter Card tags
    - _Requirements: 10.2_

  - [x] 19.2 Add structured data (JSON-LD)
    - Implement Product schema for product detail pages
    - Add Organization schema for homepage
    - Include AggregateRating schema for products with reviews
    - Add BreadcrumbList schema for navigation
    - _Requirements: 10.2_

  - [x] 19.3 Implement SEO-friendly URLs
    - Create product URLs with slugs: /products/[slug]-[id]
    - Ensure category URLs are clean: /categories/[category]
    - Add canonical URLs to prevent duplicate content
    - Implement proper redirects for old URLs
    - _Requirements: 10.5_

  - [ ]* 19.4 Write property test for SEO implementation completeness
    - **Property 19: SEO Implementation Completeness**
    - Test that any page includes proper meta tags, structured data, semantic HTML, and SEO-friendly URLs
    - **Validates: Requirements 10.2, 10.5**

  - [x] 19.5 Optimize semantic HTML
    - Use proper heading hierarchy (h1, h2, h3)
    - Add ARIA labels for accessibility
    - Use semantic HTML5 elements (nav, main, article, section)
    - Ensure proper alt text for all images
    - _Requirements: 10.2_

- [ ] 20. Performance Optimization
  - [ ] 20.1 Configure Next.js Image optimization
    - Set up image formats (WebP, AVIF) in next.config.js
    - Configure device sizes and image sizes
    - Set appropriate cache TTL
    - Add content security policy for images
    - _Requirements: 10.3_

  - [x] 20.2 Implement code splitting and dynamic imports
    - Use dynamic imports for heavy components (ImageGallery, RichTextEditor)
    - Add loading components for dynamic imports
    - Disable SSR for client-only components
    - _Requirements: 10.1_

  - [x] 20.3 Optimize bundle size
    - Analyze bundle with Next.js bundle analyzer
    - Remove unused dependencies
    - Implement tree shaking for icon libraries
    - Optimize font loading with next/font
    - _Requirements: 10.1_

  - [x] 20.4 Implement caching strategies
    - Configure static generation for category pages
    - Set up ISR with 60-second revalidation for product listings
    - Implement client-side caching for search results
    - Use localStorage for user preferences
    - _Requirements: 10.1_

- [ ] 21. Error Handling and Edge Cases
  - [x] 21.1 Create error boundary components
    - Implement global error boundary for app
    - Create error.tsx for route-level error handling
    - Add not-found.tsx for 404 errors
    - Create loading.tsx for loading states
    - _Requirements: All requirements (error handling)_

  - [x] 21.2 Implement comprehensive error handling
    - Add try-catch blocks for all async operations
    - Handle network errors with retry logic
    - Show user-friendly error messages
    - Log errors for debugging (console in dev, monitoring in prod)
    - _Requirements: All requirements (error handling)_

  - [x] 21.3 Create loading and empty states
    - Implement skeleton loaders for product grids
    - Add loading spinners for async operations
    - Create empty state messages for no search results
    - Add empty state for no listings in seller dashboard
    - Show "No reviews yet" message when product has no reviews
    - _Requirements: 2.1, 1.6, 7.3_

  - [ ]* 21.4 Write unit tests for error conditions
    - Test network failure scenarios
    - Test invalid input handling
    - Test authentication failures
    - Test empty state displays
    - Test image loading failures
    - _Requirements: All requirements (error handling)_

- [ ] 22. API Routes and Data Management
  - [x] 22.1 Create product API routes
    - Implement app/api/products/route.ts for listing products
    - Add GET endpoint with filtering and pagination
    - Add POST endpoint for creating listings
    - Add PUT endpoint for updating listings
    - Add DELETE endpoint for removing listings
    - _Requirements: 1.1, 5.1, 5.4, 5.5_

  - [x] 22.2 Create user API routes
    - Implement app/api/users/route.ts
    - Add POST endpoint for registration
    - Add POST endpoint for login
    - Add PUT endpoint for profile updates
    - Add GET endpoint for user profiles
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 22.3 Create review API routes
    - Implement app/api/reviews/route.ts
    - Add GET endpoint for fetching reviews
    - Add POST endpoint for submitting reviews
    - Add validation for duplicate reviews
    - Update product and seller ratings on new reviews
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 22.4 Implement data persistence layer
    - Create utility functions for localStorage operations
    - Implement data validation and sanitization
    - Add error handling for storage operations
    - Create data migration utilities for schema changes
    - _Requirements: All requirements (data management)_

- [ ] 23. Final Integration and Testing
  - [x] 23.1 End-to-end workflow testing
    - Test complete buyer journey (browse → search → view product → contact seller)
    - Test complete seller journey (register → create listing → manage listings)
    - Test review submission workflow
    - Test authentication and profile management
    - Verify all property-based tests pass with 100+ iterations
    - _Requirements: All requirements_

  - [x] 23.2 Cross-browser testing
    - Test on Chrome, Firefox, Safari, and Edge
    - Verify responsive design on different devices
    - Test touch interactions on mobile devices
    - Fix any browser-specific issues
    - _Requirements: 8.1, 8.2_

  - [x] 23.3 Performance testing and optimization
    - Run Lighthouse audits on all page types
    - Verify Core Web Vitals meet targets (LCP <2.5s, FID <100ms, CLS <0.1)
    - Test page load times on slow connections
    - Optimize any performance bottlenecks
    - _Requirements: 10.1, 10.3, 10.4_

  - [x] 23.4 Accessibility testing
    - Test keyboard navigation throughout the site
    - Verify screen reader compatibility
    - Check color contrast ratios meet WCAG standards
    - Test with accessibility tools (axe, WAVE)
    - _Requirements: 8.1, 8.2, 10.2_

- [ ] 24. Final Checkpoint - Complete System
  - Ensure all tests pass, verify complete functionality across all devices and browsers, confirm performance targets are met, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP development
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- Property tests validate universal correctness properties from the design document (minimum 100 iterations each)
- Unit tests validate specific examples, edge cases, and error conditions
- The implementation uses Next.js 13+ App Router with TypeScript for type safety
- All components follow responsive design principles with mobile-first approach
- Brown and white color scheme is consistently applied throughout the application
- Mock data is used for initial development, preparing for future backend integration
