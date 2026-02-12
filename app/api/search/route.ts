import { NextRequest, NextResponse } from 'next/server';
import { mockProducts } from '@/data/mockData';
import { Product, SearchResult, SearchFacets, ProductCondition, SupportedBrand } from '@/types';

/**
 * Search API Route
 * 
 * Implements search logic for product titles, descriptions, and specifications
 * Returns relevant products with facets for filtering
 * 
 * Requirements: 2.1, 9.2
 */

/**
 * GET /api/search
 * 
 * Query parameters:
 * - q: Search query string
 * - category: Filter by category
 * - subcategory: Filter by subcategory
 * - priceMin: Minimum price
 * - priceMax: Maximum price
 * - condition: Filter by condition (comma-separated)
 * - brands: Filter by brands (comma-separated)
 * - location: Filter by location
 * - sortBy: Sort order (relevance, price-low, price-high, newest, oldest)
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Extract query parameters
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || undefined;
    const subcategory = searchParams.get('subcategory') || undefined;
    const priceMin = searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined;
    const priceMax = searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined;
    const conditionParam = searchParams.get('condition') || searchParams.get('conditions') || '';
    const brandsParam = searchParams.get('brands') || '';
    const location = searchParams.get('location') || undefined;
    const sortBy = (searchParams.get('sortBy') || 'relevance') as 'relevance' | 'price-low' | 'price-high' | 'newest' | 'oldest';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    // Parse comma-separated values
    const conditions = conditionParam ? conditionParam.split(',').filter(Boolean) as ProductCondition[] : [];
    const brands = brandsParam ? brandsParam.split(',').filter(Boolean) as SupportedBrand[] : [];
    
    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }
    
    // Filter products
    let filteredProducts = mockProducts.filter((product) => {
      // Only show active products
      if (product.status !== 'active') return false;
      
      // Search query filter (search in title, description, and specifications)
      if (query) {
        const searchLower = query.toLowerCase();
        const titleMatch = product.title.toLowerCase().includes(searchLower);
        const descriptionMatch = product.description.toLowerCase().includes(searchLower);
        
        // Search in specifications
        const specsMatch = Object.values(product.specifications).some((value) => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(searchLower);
          }
          return false;
        });
        
        if (!titleMatch && !descriptionMatch && !specsMatch) {
          return false;
        }
      }
      
      // Category filter
      if (category && product.category !== category) return false;
      
      // Subcategory filter
      if (subcategory && product.subcategory !== subcategory) return false;
      
      // Price range filter
      if (priceMin !== undefined && product.price < priceMin) return false;
      if (priceMax !== undefined && product.price > priceMax) return false;
      
      // Condition filter
      if (conditions.length > 0 && !conditions.includes(product.condition)) return false;
      
      // Brand filter
      if (brands.length > 0 && !brands.includes(product.brand)) return false;
      
      // Location filter
      if (location && product.location.city !== location) return false;
      
      return true;
    });
    
    // Sort products
    filteredProducts = sortProducts(filteredProducts, sortBy, query);
    
    // Calculate facets before pagination
    const facets = calculateFacets(filteredProducts);
    
    // Pagination
    const totalCount = filteredProducts.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Generate search suggestions (simple implementation)
    const suggestions = query ? generateSuggestions(query, mockProducts) : undefined;
    
    // Build response
    const result: SearchResult = {
      products: paginatedProducts,
      totalCount,
      facets,
      suggestions,
    };
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Sort products based on sort option
 */
function sortProducts(
  products: Product[],
  sortBy: 'relevance' | 'price-low' | 'price-high' | 'newest' | 'oldest',
  query: string
): Product[] {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    
    case 'newest':
      return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    case 'oldest':
      return sorted.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    
    case 'relevance':
    default:
      // Sort by relevance (title match > description match > specs match)
      if (!query) {
        // If no query, sort by newest
        return sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      }
      
      return sorted.sort((a, b) => {
        const queryLower = query.toLowerCase();
        
        // Calculate relevance scores
        const scoreA = calculateRelevanceScore(a, queryLower);
        const scoreB = calculateRelevanceScore(b, queryLower);
        
        return scoreB - scoreA;
      });
  }
}

/**
 * Calculate relevance score for a product
 */
function calculateRelevanceScore(product: Product, queryLower: string): number {
  let score = 0;
  
  // Title match (highest priority)
  if (product.title.toLowerCase().includes(queryLower)) {
    score += 100;
    // Exact match bonus
    if (product.title.toLowerCase() === queryLower) {
      score += 50;
    }
    // Starts with query bonus
    if (product.title.toLowerCase().startsWith(queryLower)) {
      score += 25;
    }
  }
  
  // Description match (medium priority)
  if (product.description.toLowerCase().includes(queryLower)) {
    score += 50;
  }
  
  // Specifications match (lower priority)
  Object.values(product.specifications).forEach((value) => {
    if (typeof value === 'string' && value.toLowerCase().includes(queryLower)) {
      score += 10;
    }
  });
  
  // Brand match bonus
  if (product.brand.toLowerCase().includes(queryLower)) {
    score += 30;
  }
  
  return score;
}

/**
 * Calculate search facets for filtering
 */
function calculateFacets(products: Product[]): SearchFacets {
  // Category facets
  const categoryMap = new Map<string, number>();
  products.forEach((product) => {
    categoryMap.set(product.category, (categoryMap.get(product.category) || 0) + 1);
  });
  const categories = Array.from(categoryMap.entries()).map(([value, count]) => ({
    value,
    count,
  }));
  
  // Brand facets
  const brandMap = new Map<string, number>();
  products.forEach((product) => {
    brandMap.set(product.brand, (brandMap.get(product.brand) || 0) + 1);
  });
  const brands = Array.from(brandMap.entries()).map(([value, count]) => ({
    value,
    count,
  }));
  
  // Condition facets
  const conditionMap = new Map<string, number>();
  products.forEach((product) => {
    conditionMap.set(product.condition, (conditionMap.get(product.condition) || 0) + 1);
  });
  const conditions = Array.from(conditionMap.entries()).map(([value, count]) => ({
    value,
    count,
  }));
  
  // Price range facets
  const prices = products.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRanges = generatePriceRanges(minPrice, maxPrice, products);
  
  return {
    categories,
    brands,
    conditions,
    priceRanges,
  };
}

/**
 * Generate price range facets
 */
function generatePriceRanges(
  minPrice: number,
  maxPrice: number,
  products: Product[]
): Array<{ min: number; max: number; count: number }> {
  if (products.length === 0) {
    return [];
  }
  
  // Define price ranges
  const ranges = [
    { min: 0, max: 10000 },
    { min: 10000, max: 25000 },
    { min: 25000, max: 50000 },
    { min: 50000, max: 100000 },
    { min: 100000, max: Infinity },
  ];
  
  return ranges
    .map((range) => ({
      ...range,
      count: products.filter((p) => p.price >= range.min && p.price < range.max).length,
    }))
    .filter((range) => range.count > 0);
}

/**
 * Generate search suggestions based on query
 */
function generateSuggestions(query: string, products: Product[]): string[] {
  const queryLower = query.toLowerCase();
  const suggestions = new Set<string>();
  
  // Find products that match the query
  products.forEach((product) => {
    // Add matching product titles
    if (product.title.toLowerCase().includes(queryLower)) {
      suggestions.add(product.title);
    }
    
    // Add matching brands
    if (product.brand.toLowerCase().includes(queryLower)) {
      suggestions.add(product.brand);
    }
  });
  
  // Return top 5 suggestions
  return Array.from(suggestions).slice(0, 5);
}
