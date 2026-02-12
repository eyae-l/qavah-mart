/**
 * Qavah-mart Data Models and Type Definitions
 * 
 * This file contains all TypeScript interfaces and types for the Qavah-mart
 * computer e-commerce platform. These types are based on the requirements
 * and design specifications.
 */

// ============================================================================
// Brand Configuration
// ============================================================================

/**
 * Supported brands in the Qavah-mart marketplace
 * Requirements: 2.4
 */
export const SUPPORTED_BRANDS = [
  // Computer Manufacturers
  'Dell',
  'HP',
  'Lenovo',
  'ASUS',
  'Acer',
  'MSI',
  'Apple',
  
  // Component Manufacturers
  'Intel',
  'AMD',
  'NVIDIA',
  
  // Peripheral and Accessory Brands
  'Corsair',
  'Kingston',
  'Samsung',
  'Logitech',
  'Razer',
  'SteelSeries',
] as const;

export type SupportedBrand = typeof SUPPORTED_BRANDS[number];

// ============================================================================
// Category and Subcategory Structure
// ============================================================================

/**
 * Category and subcategory structure for the marketplace
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */
export const CATEGORY_STRUCTURE = {
  'laptops': {
    name: 'Laptops',
    subcategories: ['Gaming', 'Business', 'Ultrabooks', 'Budget']
  },
  'desktop-computers': {
    name: 'Desktop Computers',
    subcategories: ['Gaming PCs', 'Workstations', 'All-in-One']
  },
  'computer-components': {
    name: 'Computer Components',
    subcategories: ['CPUs', 'GPUs', 'RAM', 'Storage', 'Motherboards']
  },
  'peripherals': {
    name: 'Peripherals',
    subcategories: ['Monitors', 'Keyboards', 'Mice', 'Speakers', 'Webcams']
  },
  'networking-equipment': {
    name: 'Networking Equipment',
    subcategories: ['Routers', 'Switches', 'Modems', 'Network Cards', 'Cables']
  },
  'software-licenses': {
    name: 'Software & Licenses',
    subcategories: ['Operating Systems', 'Productivity Software', 'Security Software', 'Development Tools']
  },
  'computer-accessories': {
    name: 'Computer Accessories',
    subcategories: ['Bags & Cases', 'Cables & Adapters', 'Cooling', 'Power Supplies', 'Other Accessories']
  }
} as const;

export type CategorySlug = keyof typeof CATEGORY_STRUCTURE;
export type CategoryName = typeof CATEGORY_STRUCTURE[CategorySlug]['name'];

// ============================================================================
// Location Models
// ============================================================================

/**
 * Location information for products and users
 * Requirements: 6.1, 6.3
 */
export interface Location {
  city: string;
  region: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// ============================================================================
// Product Models
// ============================================================================

/**
 * Product condition types
 * Requirements: 3.2
 */
export type ProductCondition = 'new' | 'used' | 'refurbished';

/**
 * Product status types
 * Requirements: 5.5
 */
export type ProductStatus = 'active' | 'sold' | 'inactive';

/**
 * Computer-specific product specifications
 * Requirements: 3.1
 */
export interface ProductSpecifications {
  [key: string]: string | number | boolean | undefined;
  // Computer-specific specs
  processor?: string;
  memory?: string;
  storage?: string;
  graphics?: string;
  screenSize?: string;
  operatingSystem?: string;
  warranty?: string;
}

/**
 * Main product interface
 * Requirements: 1.1, 1.6, 3.1, 3.2, 3.4, 5.1, 6.3
 */
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: ProductCondition;
  category: string;
  subcategory: string;
  brand: SupportedBrand;
  specifications: ProductSpecifications;
  images: string[];
  location: Location;
  sellerId: string;
  createdAt: Date;
  updatedAt: Date;
  status: ProductStatus;
  views: number;
  favorites: number;
}

// ============================================================================
// User and Seller Models
// ============================================================================

/**
 * Base user interface
 * Requirements: 4.1, 4.3
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  location: Location;
  avatar?: string;
  createdAt: Date;
  isVerified: boolean;
  isSeller: boolean;
}

/**
 * Business type for sellers
 * Requirements: 4.5
 */
export type BusinessType = 'individual' | 'business';

/**
 * Verification status for sellers
 * Requirements: 4.5
 */
export type VerificationStatus = 'pending' | 'verified' | 'rejected';

/**
 * Seller interface extending User
 * Requirements: 3.3, 4.5, 7.5
 */
export interface Seller extends User {
  businessName?: string;
  businessType: BusinessType;
  verificationStatus: VerificationStatus;
  rating: number;
  totalSales: number;
  responseTime: number; // in hours
  joinedDate: Date;
}

// ============================================================================
// Category Models
// ============================================================================

/**
 * Specification template for category-specific fields
 * Requirements: 1.1, 3.1
 */
export interface SpecificationTemplate {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select';
  required: boolean;
  options?: string[];
}

/**
 * Subcategory interface
 * Requirements: 1.2, 1.3, 1.4, 1.5
 */
export interface Subcategory {
  id: string;
  name: string;
  slug: string;
  parentCategory: string;
  specifications: SpecificationTemplate[];
}

/**
 * Category interface
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  subcategories: Subcategory[];
  featuredBrands: SupportedBrand[];
  specifications: SpecificationTemplate[];
}

// ============================================================================
// Review and Rating Models
// ============================================================================

/**
 * Individual review interface
 * Requirements: 7.1, 7.3, 7.4
 */
export interface Review {
  id: string;
  productId: string;
  userId: string;
  sellerId: string;
  rating: number; // 1-5
  title: string;
  comment: string;
  createdAt: Date;
  helpful: number;
  verified: boolean; // verified purchase
}

/**
 * Rating distribution for 5-star system
 * Requirements: 7.2
 */
export interface RatingDistribution {
  5: number;
  4: number;
  3: number;
  2: number;
  1: number;
}

/**
 * Product rating aggregate
 * Requirements: 7.2
 */
export interface ProductRating {
  productId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution;
}

/**
 * Seller rating aggregate
 * Requirements: 7.5
 */
export interface SellerRating {
  sellerId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution;
}

// ============================================================================
// Search and Filter Models
// ============================================================================

/**
 * Sort options for search results
 * Requirements: 2.1
 */
export type SortOption = 'relevance' | 'price-low' | 'price-high' | 'newest' | 'oldest';

/**
 * Search filters interface
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 6.2
 */
export interface SearchFilters {
  query?: string;
  category?: string;
  subcategory?: string;
  priceMin?: number;
  priceMax?: number;
  condition?: ProductCondition[];
  brands?: SupportedBrand[];
  location?: string;
  sortBy?: SortOption;
}

/**
 * Facet count for search facets
 * Requirements: 2.2
 */
export interface FacetCount {
  value: string;
  count: number;
}

/**
 * Price range facet
 * Requirements: 2.3
 */
export interface PriceRangeFacet {
  min: number;
  max: number;
  count: number;
}

/**
 * Search facets for filtering
 * Requirements: 2.2, 2.3, 2.4, 2.5
 */
export interface SearchFacets {
  categories: FacetCount[];
  brands: FacetCount[];
  conditions: FacetCount[];
  priceRanges: PriceRangeFacet[];
}

/**
 * Search result interface
 * Requirements: 2.1, 2.2
 */
export interface SearchResult {
  products: Product[];
  totalCount: number;
  facets: SearchFacets;
  suggestions?: string[];
}

// ============================================================================
// Form Data Models
// ============================================================================

/**
 * Login credentials
 * Requirements: 4.2
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 * Requirements: 4.1
 */
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  location: Location;
}

/**
 * Product form data for creating/editing listings
 * Requirements: 5.1, 5.2
 */
export interface ProductFormData {
  title: string;
  description: string;
  price: number;
  condition: ProductCondition;
  category: string;
  subcategory: string;
  brand: SupportedBrand;
  specifications: ProductSpecifications;
  images: File[] | string[];
  location: Location;
}

/**
 * Review form data
 * Requirements: 7.1
 */
export interface ReviewFormData {
  rating: number;
  title: string;
  comment: string;
}

// ============================================================================
// State Management Models
// ============================================================================

/**
 * Cart item interface
 * Requirements: Future feature
 */
export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}

/**
 * Global app context state
 * Requirements: 4.2, 6.1, 6.5
 */
export interface AppContextState {
  user: User | null;
  location: string | null;
  cart: CartItem[];
  favorites: string[]; // product IDs
  theme: 'light' | 'dark';
}

/**
 * User context state
 * Requirements: 4.1, 4.2, 4.4
 */
export interface UserContextState {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

/**
 * Location context state
 * Requirements: 6.1, 6.5
 */
export interface LocationContextState {
  currentLocation: string | null;
  availableLocations: Location[];
  setLocation: (location: string) => void;
  clearLocation: () => void;
}

// ============================================================================
// Component Props Models
// ============================================================================

/**
 * Header component props
 * Requirements: 9.1, 6.1
 */
export interface HeaderProps {
  currentLocation?: string;
  onLocationChange: (location: string) => void;
}

/**
 * Search bar component props
 * Requirements: 9.2
 */
export interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
}

/**
 * Category navigation props
 * Requirements: 9.3, 9.4
 */
export interface CategoryNavProps {
  categories: Category[];
  activeCategory?: string;
  onCategorySelect: (categoryId: string) => void;
}

/**
 * Product grid props
 * Requirements: 1.6
 */
export interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  onProductClick: (productId: string) => void;
  gridColumns?: 2 | 3 | 4;
}

/**
 * Product card props
 * Requirements: 1.6, 3.2, 3.4, 6.3
 */
export interface ProductCardProps {
  product: Product;
  showLocation?: boolean;
  showCondition?: boolean;
  onFavorite?: (productId: string) => void;
}

/**
 * Product detail props
 * Requirements: 3.1, 3.3, 3.5, 7.3
 */
export interface ProductDetailProps {
  product: Product;
  seller: Seller;
  reviews: Review[];
  relatedProducts: Product[];
}

/**
 * Product image gallery props
 * Requirements: 3.4
 */
export interface ProductImageGalleryProps {
  images: string[];
  placeholderColor?: string;
  onImageClick: (imageIndex: number) => void;
}

/**
 * Filter sidebar props
 * Requirements: 2.2, 2.3, 2.4, 2.5
 */
export interface FilterSidebarProps {
  filters: FilterConfig;
  activeFilters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
  onClearFilters: () => void;
}

/**
 * Filter configuration
 * Requirements: 2.2, 2.3, 2.4, 2.5
 */
export interface FilterConfig {
  priceRange: PriceRangeFilter;
  brands: BrandFilter[];
  conditions: ConditionFilter[];
  locations: LocationFilter[];
  categories: CategoryFilter[];
}

/**
 * Price range filter
 * Requirements: 2.3
 */
export interface PriceRangeFilter {
  min: number;
  max: number;
  step: number;
}

/**
 * Brand filter
 * Requirements: 2.4
 */
export interface BrandFilter {
  brand: SupportedBrand;
  count: number;
}

/**
 * Condition filter
 * Requirements: 2.2
 */
export interface ConditionFilter {
  condition: ProductCondition;
  count: number;
}

/**
 * Location filter
 * Requirements: 2.5, 6.2
 */
export interface LocationFilter {
  location: string;
  count: number;
}

/**
 * Category filter
 * Requirements: 2.2
 */
export interface CategoryFilter {
  category: string;
  count: number;
}

/**
 * Active filters state
 * Requirements: 2.2, 2.3, 2.4, 2.5
 */
export interface ActiveFilters {
  priceMin?: number;
  priceMax?: number;
  brands: SupportedBrand[];
  conditions: ProductCondition[];
  locations: string[];
  categories: string[];
}

/**
 * Search results props
 * Requirements: 2.1, 9.2
 */
export interface SearchResultsProps {
  query: string;
  results: Product[];
  totalCount: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

/**
 * Authentication modal props
 * Requirements: 4.1, 4.2
 */
export interface AuthModalProps {
  isOpen: boolean;
  mode: 'login' | 'register' | 'forgot-password';
  onClose: () => void;
  onSuccess: (user: User) => void;
}

/**
 * User profile props
 * Requirements: 4.3
 */
export interface UserProfileProps {
  user: User;
  listings: Product[];
  reviews: Review[];
  onEditProfile: () => void;
}

/**
 * Listing form props
 * Requirements: 5.1, 5.2
 */
export interface ListingFormProps {
  product?: Product;
  categories: Category[];
  onSubmit: (productData: ProductFormData) => void;
  onCancel: () => void;
}

/**
 * Seller dashboard props
 * Requirements: 5.4, 5.5, 7.5
 */
export interface SellerDashboardProps {
  seller: Seller;
  activeListings: Product[];
  soldListings: Product[];
  analytics: SellerAnalytics;
}

/**
 * Seller analytics
 * Requirements: 5.4
 */
export interface SellerAnalytics {
  totalViews: number;
  totalFavorites: number;
  totalSales: number;
  averageRating: number;
  responseRate: number;
}

/**
 * Review list props
 * Requirements: 7.3
 */
export interface ReviewListProps {
  productId: string;
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  onHelpfulClick: (reviewId: string) => void;
}

/**
 * Review form props
 * Requirements: 7.1
 */
export interface ReviewFormProps {
  productId: string;
  sellerId: string;
  userId: string;
  onSubmit: (review: ReviewFormData) => void;
  onCancel: () => void;
}

/**
 * Rating display props
 * Requirements: 7.2
 */
export interface RatingDisplayProps {
  rating: number;
  totalReviews: number;
  size?: 'small' | 'medium' | 'large';
  showCount?: boolean;
}

/**
 * Rating distribution props
 * Requirements: 7.2
 */
export interface RatingDistributionProps {
  distribution: RatingDistribution;
  totalReviews: number;
}

/**
 * Location selector props
 * Requirements: 6.1
 */
export interface LocationSelectorProps {
  currentLocation?: string;
  availableLocations: Location[];
  onLocationChange: (location: string) => void;
}

/**
 * Location display props
 * Requirements: 6.3
 */
export interface LocationDisplayProps {
  location: Location;
  showIcon?: boolean;
  compact?: boolean;
}
