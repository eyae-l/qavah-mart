'use client';

import { useState, useEffect } from 'react';
import ProductGrid from './ProductGrid';
import { Product } from '@/types';

/**
 * ProductGrid Component Examples
 * 
 * This file demonstrates various usage scenarios for the ProductGrid component.
 */

// Sample product data for examples
const sampleProducts: Product[] = [
  {
    id: '1',
    title: 'Dell XPS 15 Gaming Laptop',
    description: 'High-performance laptop with Intel i7 processor and NVIDIA RTX 3060',
    price: 85000,
    condition: 'new',
    category: 'laptops',
    subcategory: 'gaming',
    brand: 'Dell',
    specifications: {
      processor: 'Intel Core i7-12700H',
      memory: '16GB DDR5',
      storage: '512GB NVMe SSD',
      graphics: 'NVIDIA RTX 3060 6GB',
      screenSize: '15.6" FHD 144Hz',
    },
    images: ['/images/dell-xps-15.jpg'],
    location: { city: 'Addis Ababa', region: 'Addis Ababa', country: 'Ethiopia' },
    sellerId: 'seller1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    status: 'active',
    views: 245,
    favorites: 18,
  },
  {
    id: '2',
    title: 'HP Pavilion Business Laptop',
    description: 'Reliable business laptop with long battery life',
    price: 42000,
    condition: 'used',
    category: 'laptops',
    subcategory: 'business',
    brand: 'HP',
    specifications: {
      processor: 'Intel Core i5-1135G7',
      memory: '8GB DDR4',
      storage: '256GB SSD',
      screenSize: '14" FHD',
    },
    images: ['/images/hp-pavilion.jpg'],
    location: { city: 'Bahir Dar', region: 'Amhara', country: 'Ethiopia' },
    sellerId: 'seller2',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    status: 'active',
    views: 156,
    favorites: 12,
  },
  {
    id: '3',
    title: 'Lenovo ThinkPad X1 Carbon',
    description: 'Premium ultrabook for professionals',
    price: 95000,
    condition: 'refurbished',
    category: 'laptops',
    subcategory: 'ultrabooks',
    brand: 'Lenovo',
    specifications: {
      processor: 'Intel Core i7-1165G7',
      memory: '16GB LPDDR4X',
      storage: '512GB NVMe SSD',
      screenSize: '14" 2K IPS',
    },
    images: ['/images/lenovo-thinkpad.jpg'],
    location: { city: 'Dire Dawa', region: 'Dire Dawa', country: 'Ethiopia' },
    sellerId: 'seller3',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    status: 'active',
    views: 189,
    favorites: 24,
  },
  {
    id: '4',
    title: 'ASUS ROG Strix Gaming Desktop',
    description: 'Powerful gaming PC with RGB lighting',
    price: 125000,
    condition: 'new',
    category: 'desktop-computers',
    subcategory: 'gaming-pcs',
    brand: 'ASUS',
    specifications: {
      processor: 'AMD Ryzen 7 5800X',
      memory: '32GB DDR4',
      storage: '1TB NVMe SSD + 2TB HDD',
      graphics: 'NVIDIA RTX 3080 10GB',
    },
    images: ['/images/asus-rog.jpg'],
    location: { city: 'Addis Ababa', region: 'Addis Ababa', country: 'Ethiopia' },
    sellerId: 'seller4',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    status: 'active',
    views: 312,
    favorites: 45,
  },
];

// Example 1: Basic Product Grid
export function BasicProductGridExample() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">
        Basic Product Grid
      </h2>
      <ProductGrid products={sampleProducts} />
    </div>
  );
}

// Example 2: Product Grid with Loading State
export function LoadingStateExample() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setProducts(sampleProducts);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">
        Loading State Example
      </h2>
      <p className="text-neutral-600 mb-4">
        {loading ? 'Loading products...' : 'Products loaded!'}
      </p>
      <ProductGrid products={products} loading={loading} />
    </div>
  );
}

// Example 3: Empty State
export function EmptyStateExample() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">
        Empty State Example
      </h2>
      <p className="text-neutral-600 mb-4">
        No products match your search criteria
      </p>
      <ProductGrid products={[]} />
    </div>
  );
}

// Example 4: Product Grid with Click Handler
export function ClickHandlerExample() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  const handleProductClick = (productId: string) => {
    setSelectedProduct(productId);
    console.log('Product clicked:', productId);
    // In a real app, you would navigate to the product detail page
    // router.push(`/products/${productId}`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">
        Click Handler Example
      </h2>
      {selectedProduct && (
        <div className="mb-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <p className="text-primary-900">
            Selected Product ID: <strong>{selectedProduct}</strong>
          </p>
        </div>
      )}
      <ProductGrid 
        products={sampleProducts} 
        onProductClick={handleProductClick}
      />
    </div>
  );
}

// Example 5: 2-Column Grid
export function TwoColumnGridExample() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">
        2-Column Grid Example
      </h2>
      <p className="text-neutral-600 mb-4">
        Useful for sidebar layouts or narrow containers
      </p>
      <ProductGrid products={sampleProducts} gridColumns={2} />
    </div>
  );
}

// Example 6: 3-Column Grid
export function ThreeColumnGridExample() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">
        3-Column Grid Example
      </h2>
      <p className="text-neutral-600 mb-4">
        Balanced layout for featured sections
      </p>
      <ProductGrid products={sampleProducts} gridColumns={3} />
    </div>
  );
}

// Example 7: Search Results with Dynamic Data
export function SearchResultsExample() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts);
  const [loading, setLoading] = useState(false);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setLoading(true);

    // Simulate search delay
    setTimeout(() => {
      const filtered = sampleProducts.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">
        Search Results Example
      </h2>
      
      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Results Count */}
      {!loading && (
        <p className="text-neutral-600 mb-4">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      )}

      {/* Product Grid */}
      <ProductGrid 
        products={filteredProducts} 
        loading={loading}
      />
    </div>
  );
}

// Example 8: Category Page with Pagination
export function CategoryPageExample() {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  
  // In a real app, you would fetch products based on currentPage
  const displayedProducts = sampleProducts.slice(0, productsPerPage);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-neutral-900 mb-2">
        Gaming Laptops
      </h2>
      <p className="text-neutral-600 mb-6">
        Browse our selection of high-performance gaming laptops
      </p>

      <ProductGrid products={displayedProducts} />

      {/* Pagination */}
      <div className="mt-8 flex justify-center gap-2">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-neutral-700">
          Page {currentPage}
        </span>
        <button
          onClick={() => setCurrentPage(p => p + 1)}
          className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// Example 9: Responsive Layout Demo
export function ResponsiveLayoutExample() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">
        Responsive Layout Demo
      </h2>
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-900 text-sm">
          <strong>Resize your browser to see the responsive behavior:</strong>
          <br />
          • Mobile (&lt;640px): 2 columns
          <br />
          • Tablet (640-1023px): 3 columns
          <br />
          • Desktop (≥1024px): 4 columns
        </p>
      </div>
      <ProductGrid products={sampleProducts} />
    </div>
  );
}

// Example 10: All Examples Combined
export default function ProductGridExamples() {
  const [activeExample, setActiveExample] = useState('basic');

  const examples = [
    { id: 'basic', label: 'Basic Grid', component: <BasicProductGridExample /> },
    { id: 'loading', label: 'Loading State', component: <LoadingStateExample /> },
    { id: 'empty', label: 'Empty State', component: <EmptyStateExample /> },
    { id: 'click', label: 'Click Handler', component: <ClickHandlerExample /> },
    { id: '2col', label: '2 Columns', component: <TwoColumnGridExample /> },
    { id: '3col', label: '3 Columns', component: <ThreeColumnGridExample /> },
    { id: 'search', label: 'Search Results', component: <SearchResultsExample /> },
    { id: 'category', label: 'Category Page', component: <CategoryPageExample /> },
    { id: 'responsive', label: 'Responsive', component: <ResponsiveLayoutExample /> },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-neutral-900 mb-8">
          ProductGrid Component Examples
        </h1>

        {/* Example Selector */}
        <div className="mb-8 flex flex-wrap gap-2">
          {examples.map(example => (
            <button
              key={example.id}
              onClick={() => setActiveExample(example.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeExample === example.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              {example.label}
            </button>
          ))}
        </div>

        {/* Active Example */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
          {examples.find(ex => ex.id === activeExample)?.component}
        </div>
      </div>
    </div>
  );
}
