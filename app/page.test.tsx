import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Home from './page';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock ProductGrid component
jest.mock('@/components/ProductGrid', () => {
  return function MockProductGrid({ products }: any) {
    return (
      <div data-testid="product-grid">
        {products.map((product: any) => (
          <div
            key={product.id}
            data-testid={`product-${product.id}`}
          >
            {product.title}
          </div>
        ))}
      </div>
    );
  };
});

// Mock mockData
jest.mock('@/data/mockData', () => ({
  mockProducts: Array.from({ length: 10 }, (_, i) => ({
    id: `product-${i + 1}`,
    title: `Test Product ${i + 1}`,
    price: 1000 + i * 100,
    condition: 'new',
    category: 'laptops',
    subcategory: 'gaming',
  })),
  CATEGORY_STRUCTURE: {
    'laptops': { name: 'Laptops', subcategories: ['gaming', 'business'] },
    'desktop-computers': { name: 'Desktop Computers', subcategories: ['gaming-pcs', 'workstations'] },
    'computer-components': { name: 'Computer Components', subcategories: ['cpus', 'gpus'] },
    'peripherals': { name: 'Peripherals', subcategories: ['monitors', 'keyboards'] },
    'networking-equipment': { name: 'Networking Equipment', subcategories: ['routers', 'switches'] },
    'software-licenses': { name: 'Software & Licenses', subcategories: ['operating-systems', 'productivity'] },
    'computer-accessories': { name: 'Computer Accessories', subcategories: ['cables', 'adapters'] },
  },
}));

describe('Home Page', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  describe('Welcome Section', () => {
    it('should render welcome section with title and description', () => {
      render(<Home />);
      
      expect(screen.getByText('Welcome to Qavah-mart')).toBeInTheDocument();
      expect(screen.getByText(/Your trusted marketplace for computers/)).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(<Home />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Welcome to Qavah-mart');
      
      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2).toHaveTextContent('Featured Products');
    });
  });

  describe('Featured Products Section', () => {
    it('should render featured products section', () => {
      render(<Home />);
      
      expect(screen.getByText('Featured Products')).toBeInTheDocument();
    });

    it('should render ProductGrid component', () => {
      render(<Home />);
      
      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
    });

    it('should display first 8 products', () => {
      render(<Home />);
      
      // Check that 8 products are rendered
      for (let i = 1; i <= 8; i++) {
        expect(screen.getByTestId(`product-product-${i}`)).toBeInTheDocument();
      }
      
      // 9th and 10th products should not be rendered
      expect(screen.queryByTestId('product-product-9')).not.toBeInTheDocument();
      expect(screen.queryByTestId('product-product-10')).not.toBeInTheDocument();
    });

    it('should render products without onClick handler (uses Link navigation)', () => {
      render(<Home />);
      
      const product = screen.getByTestId('product-product-1');
      expect(product).toBeInTheDocument();
      
      // Homepage is now a Server Component, so products use Link navigation
      // No onClick handler is passed to ProductGrid
    });
  });

  describe('Layout and Styling', () => {
    it('should render main content sections', () => {
      const { container } = render(<Home />);
      
      // Check for welcome section
      const welcomeSection = container.querySelector('section[aria-labelledby="welcome-heading"]');
      expect(welcomeSection).toBeInTheDocument();
      
      // Check for featured products section
      const featuredSection = container.querySelector('section[aria-labelledby="featured-heading"]');
      expect(featuredSection).toBeInTheDocument();
    });

    it('should have centered welcome section', () => {
      const { container } = render(<Home />);
      
      const welcomeSection = container.querySelector('section.text-center');
      expect(welcomeSection).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<Home />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Welcome to Qavah-mart');
      
      const h2 = screen.getByRole('heading', { level: 2 });
      expect(h2).toHaveTextContent('Featured Products');
    });
  });
});
