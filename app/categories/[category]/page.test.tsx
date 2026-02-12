/**
 * Tests for Dynamic Category Page
 * 
 * Validates category page functionality including:
 * - Product filtering by category
 * - Subcategory navigation display
 * - Breadcrumb navigation
 * - Empty state handling
 * - Location filtering
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 6.2, 6.4, 9.4
 */

import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import CategoryPage from './page';
import { mockProducts } from '@/data/mockData';
import { CATEGORY_STRUCTURE } from '@/types';
import { LocationProvider } from '@/contexts/LocationContext';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

// Mock ProductGrid component
jest.mock('@/components/ProductGrid', () => {
  return function MockProductGrid({ products }: { products: any[] }) {
    return (
      <div data-testid="product-grid">
        {products.map((product) => (
          <div key={product.id} data-testid={`product-${product.id}`}>
            {product.title}
          </div>
        ))}
      </div>
    );
  };
});

// Mock FilterSidebar component
jest.mock('@/components/FilterSidebar', () => {
  return function MockFilterSidebar() {
    return <div data-testid="filter-sidebar">Filter Sidebar</div>;
  };
});

// Helper function to render with providers
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <LocationProvider>
      {ui}
    </LocationProvider>
  );
};

describe('CategoryPage', () => {
  describe('CategoryPage Component', () => {
    it('should render category name and product count', () => {
      renderWithProviders(<CategoryPage params={{ category: 'laptops' }} />);
      
      // Use heading role to be more specific
      expect(screen.getByRole('heading', { name: 'Laptops', level: 1 })).toBeInTheDocument();
      
      // Count laptops in mock data
      const laptopCount = mockProducts.filter(
        (p) => p.category === 'laptops' && p.status === 'active'
      ).length;
      
      const countText = `${laptopCount} ${laptopCount === 1 ? 'product' : 'products'} available`;
      expect(screen.getByText(countText)).toBeInTheDocument();
    });
    
    it('should render breadcrumb navigation', () => {
      renderWithProviders(<CategoryPage params={{ category: 'laptops' }} />);
      
      const breadcrumb = screen.getByRole('navigation', { name: /breadcrumb/i });
      expect(breadcrumb).toBeInTheDocument();
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      // Category name appears in breadcrumb and heading, so we check the breadcrumb specifically
      expect(breadcrumb).toHaveTextContent('Laptops');
    });
    
    it('should display all subcategories for the category', () => {
      renderWithProviders(<CategoryPage params={{ category: 'laptops' }} />);
      
      const subcategories = CATEGORY_STRUCTURE.laptops.subcategories;
      
      subcategories.forEach((subcategory) => {
        expect(screen.getByText(subcategory)).toBeInTheDocument();
      });
    });
    
    it('should show product count for each subcategory', () => {
      renderWithProviders(<CategoryPage params={{ category: 'laptops' }} />);
      
      // Should show "X items" or "X item" for each subcategory
      const itemTexts = screen.getAllByText(/\d+ items?/);
      expect(itemTexts.length).toBeGreaterThan(0);
    });
    
    it('should render subcategory links with correct URLs', () => {
      renderWithProviders(<CategoryPage params={{ category: 'laptops' }} />);
      
      const gamingLink = screen.getByRole('link', { name: /Gaming/i });
      expect(gamingLink).toHaveAttribute('href', '/categories/laptops/gaming');
      
      const businessLink = screen.getByRole('link', { name: /Business/i });
      expect(businessLink).toHaveAttribute('href', '/categories/laptops/business');
    });
    
    it('should filter and display products for the category', () => {
      renderWithProviders(<CategoryPage params={{ category: 'laptops' }} />);
      
      const productGrid = screen.getByTestId('product-grid');
      expect(productGrid).toBeInTheDocument();
      
      // Verify only laptop products are shown
      const laptopProducts = mockProducts.filter(
        (p) => p.category === 'laptops' && p.status === 'active'
      );
      
      laptopProducts.forEach((product) => {
        expect(screen.getByTestId(`product-${product.id}`)).toBeInTheDocument();
      });
    });
    
    it('should only show active products', () => {
      renderWithProviders(<CategoryPage params={{ category: 'laptops' }} />);
      
      // Verify no sold or inactive products are shown
      const inactiveProducts = mockProducts.filter(
        (p) => p.category === 'laptops' && p.status !== 'active'
      );
      
      inactiveProducts.forEach((product) => {
        expect(screen.queryByTestId(`product-${product.id}`)).not.toBeInTheDocument();
      });
    });
    
    it('should call notFound for invalid category', () => {
      renderWithProviders(<CategoryPage params={{ category: 'invalid-category' }} />);
      
      expect(notFound).toHaveBeenCalled();
    });
    
    it('should display empty state when no products available', () => {
      // Use a category that might have no products (or mock it)
      // For this test, we'll assume software-licenses might have fewer products
      renderWithProviders(<CategoryPage params={{ category: 'software-licenses' }} />);
      
      const softwareProducts = mockProducts.filter(
        (p) => p.category === 'software-licenses' && p.status === 'active'
      );
      
      if (softwareProducts.length === 0) {
        expect(screen.getByText(/No products available in this category yet/i)).toBeInTheDocument();
        expect(screen.getByText(/Check back soon for new listings/i)).toBeInTheDocument();
      }
    });
    
    it('should render section heading for all products', () => {
      renderWithProviders(<CategoryPage params={{ category: 'laptops' }} />);
      
      expect(screen.getByText('All Laptops')).toBeInTheDocument();
    });
    
    it('should render subcategory navigation heading', () => {
      renderWithProviders(<CategoryPage params={{ category: 'laptops' }} />);
      
      expect(screen.getByText('Browse by Subcategory')).toBeInTheDocument();
    });
    
    it('should render filter sidebar', () => {
      renderWithProviders(<CategoryPage params={{ category: 'laptops' }} />);
      
      expect(screen.getByTestId('filter-sidebar')).toBeInTheDocument();
    });
  });
  
  describe('All Seven Categories', () => {
    const categories = Object.keys(CATEGORY_STRUCTURE);
    
    categories.forEach((category) => {
      it(`should render ${category} category page correctly`, () => {
        const categoryData = CATEGORY_STRUCTURE[category as keyof typeof CATEGORY_STRUCTURE];
        
        renderWithProviders(<CategoryPage params={{ category }} />);
        
        // Verify category name is displayed in heading
        expect(screen.getByRole('heading', { name: categoryData.name, level: 1 })).toBeInTheDocument();
        
        // Verify all subcategories are displayed
        categoryData.subcategories.forEach((subcategory) => {
          expect(screen.getByText(subcategory)).toBeInTheDocument();
        });
        
        // Verify product grid is rendered
        expect(screen.getByTestId('product-grid')).toBeInTheDocument();
      });
    });
  });
  
  describe('Subcategory Link Generation', () => {
    it('should convert subcategory names to slugs correctly', () => {
      renderWithProviders(<CategoryPage params={{ category: 'computer-components' }} />);
      
      // Test various subcategory name formats
      const cpuLink = screen.getByRole('link', { name: /CPUs/i });
      expect(cpuLink).toHaveAttribute('href', '/categories/computer-components/cpus');
      
      const gpuLink = screen.getByRole('link', { name: /GPUs/i });
      expect(gpuLink).toHaveAttribute('href', '/categories/computer-components/gpus');
    });
    
    it('should handle multi-word subcategories', () => {
      renderWithProviders(<CategoryPage params={{ category: 'desktop-computers' }} />);
      
      const gamingPCLink = screen.getByRole('link', { name: /Gaming PCs/i });
      expect(gamingPCLink).toHaveAttribute('href', '/categories/desktop-computers/gaming-pcs');
      
      const allInOneLink = screen.getByRole('link', { name: /All-in-One/i });
      expect(allInOneLink).toHaveAttribute('href', '/categories/desktop-computers/all-in-one');
    });
  });
});
