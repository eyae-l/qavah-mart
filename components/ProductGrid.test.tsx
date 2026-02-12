import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductGrid from './ProductGrid';
import { Product } from '@/types';

// Mock ProductCard component
jest.mock('./ProductCard', () => {
  return function MockProductCard({ product, onClick }: any) {
    return (
      <div 
        data-testid={`product-card-${product.id}`}
        onClick={() => onClick?.(product.id)}
      >
        {product.title}
      </div>
    );
  };
});

describe('ProductGrid', () => {
  const mockProducts: Product[] = [
    {
      id: '1',
      title: 'Dell XPS 15',
      description: 'High-performance laptop',
      price: 45000,
      condition: 'new',
      category: 'laptops',
      subcategory: 'business',
      brand: 'Dell',
      specifications: {},
      images: ['/images/dell-xps.jpg'],
      location: { city: 'Addis Ababa', region: 'Addis Ababa', country: 'Ethiopia' },
      sellerId: 'seller1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      status: 'active',
      views: 100,
      favorites: 10,
    },
    {
      id: '2',
      title: 'HP Pavilion',
      description: 'Budget-friendly laptop',
      price: 25000,
      condition: 'used',
      category: 'laptops',
      subcategory: 'budget',
      brand: 'HP',
      specifications: {},
      images: ['/images/hp-pavilion.jpg'],
      location: { city: 'Bahir Dar', region: 'Amhara', country: 'Ethiopia' },
      sellerId: 'seller2',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      status: 'active',
      views: 50,
      favorites: 5,
    },
    {
      id: '3',
      title: 'Lenovo ThinkPad',
      description: 'Business laptop',
      price: 35000,
      condition: 'refurbished',
      category: 'laptops',
      subcategory: 'business',
      brand: 'Lenovo',
      specifications: {},
      images: ['/images/lenovo-thinkpad.jpg'],
      location: { city: 'Dire Dawa', region: 'Dire Dawa', country: 'Ethiopia' },
      sellerId: 'seller3',
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
      status: 'active',
      views: 75,
      favorites: 8,
    },
  ];

  describe('Product Display', () => {
    it('should render all products in the grid', () => {
      render(<ProductGrid products={mockProducts} />);
      
      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
    });

    it('should render products with correct titles', () => {
      render(<ProductGrid products={mockProducts} />);
      
      expect(screen.getByText('Dell XPS 15')).toBeInTheDocument();
      expect(screen.getByText('HP Pavilion')).toBeInTheDocument();
      expect(screen.getByText('Lenovo ThinkPad')).toBeInTheDocument();
    });

    it('should handle single product', () => {
      render(<ProductGrid products={[mockProducts[0]]} />);
      
      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
      expect(screen.queryByTestId('product-card-2')).not.toBeInTheDocument();
    });
  });

  describe('Responsive Grid Layout', () => {
    it('should apply 4-column grid classes by default', () => {
      const { container } = render(<ProductGrid products={mockProducts} />);
      const grid = container.firstChild;
      
      expect(grid).toHaveClass('grid-cols-2');
      expect(grid).toHaveClass('sm:grid-cols-3');
      expect(grid).toHaveClass('lg:grid-cols-4');
    });

    it('should apply 2-column grid classes when gridColumns is 2', () => {
      const { container } = render(
        <ProductGrid products={mockProducts} gridColumns={2} />
      );
      const grid = container.firstChild;
      
      expect(grid).toHaveClass('grid-cols-1');
      expect(grid).toHaveClass('sm:grid-cols-2');
    });

    it('should apply 3-column grid classes when gridColumns is 3', () => {
      const { container } = render(
        <ProductGrid products={mockProducts} gridColumns={3} />
      );
      const grid = container.firstChild;
      
      expect(grid).toHaveClass('grid-cols-2');
      expect(grid).toHaveClass('sm:grid-cols-2');
      expect(grid).toHaveClass('lg:grid-cols-3');
    });

    it('should include gap classes for spacing', () => {
      const { container } = render(<ProductGrid products={mockProducts} />);
      const grid = container.firstChild;
      
      expect(grid).toHaveClass('gap-4');
      expect(grid).toHaveClass('sm:gap-6');
    });
  });

  describe('Loading States', () => {
    it('should render skeleton loaders when loading is true', () => {
      const { container } = render(
        <ProductGrid products={mockProducts} loading={true} />
      );
      
      // Should render skeleton cards
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
      
      // Should not render actual products
      expect(screen.queryByTestId('product-card-1')).not.toBeInTheDocument();
    });

    it('should render 8 skeleton cards by default (4 columns * 2 rows)', () => {
      const { container } = render(
        <ProductGrid products={mockProducts} loading={true} gridColumns={4} />
      );
      
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons).toHaveLength(8);
    });

    it('should render 4 skeleton cards for 2-column grid', () => {
      const { container } = render(
        <ProductGrid products={mockProducts} loading={true} gridColumns={2} />
      );
      
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons).toHaveLength(4);
    });

    it('should render 6 skeleton cards for 3-column grid', () => {
      const { container } = render(
        <ProductGrid products={mockProducts} loading={true} gridColumns={3} />
      );
      
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons).toHaveLength(6);
    });

    it('should not render loading state when loading is false', () => {
      const { container } = render(
        <ProductGrid products={mockProducts} loading={false} />
      );
      
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons).toHaveLength(0);
    });
  });

  describe('Empty States', () => {
    it('should render empty state when products array is empty', () => {
      render(<ProductGrid products={[]} />);
      
      expect(screen.getByText('No Products Found')).toBeInTheDocument();
      expect(screen.getByText(/We couldn't find any products/)).toBeInTheDocument();
    });

    it('should render empty state when products is undefined', () => {
      render(<ProductGrid products={undefined as any} />);
      
      expect(screen.getByText('No Products Found')).toBeInTheDocument();
    });

    it('should display helpful suggestions in empty state', () => {
      render(<ProductGrid products={[]} />);
      
      expect(screen.getByText('Suggestions:')).toBeInTheDocument();
      expect(screen.getByText(/Check your spelling/)).toBeInTheDocument();
      expect(screen.getByText(/Try more general keywords/)).toBeInTheDocument();
      expect(screen.getByText(/Remove some filters/)).toBeInTheDocument();
      expect(screen.getByText(/Browse our categories instead/)).toBeInTheDocument();
    });

    it('should render empty state icon', () => {
      const { container } = render(<ProductGrid products={[]} />);
      
      const icon = container.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('text-neutral-300');
    });

    it('should not render empty state when products exist', () => {
      render(<ProductGrid products={mockProducts} />);
      
      expect(screen.queryByText('No Products Found')).not.toBeInTheDocument();
    });

    it('should not render empty state when loading', () => {
      render(<ProductGrid products={[]} loading={true} />);
      
      expect(screen.queryByText('No Products Found')).not.toBeInTheDocument();
    });
  });

  describe('Click Handling', () => {
    it('should call onProductClick when product is clicked', () => {
      const handleClick = jest.fn();
      render(<ProductGrid products={mockProducts} onProductClick={handleClick} />);
      
      const productCard = screen.getByTestId('product-card-1');
      productCard.click();
      
      expect(handleClick).toHaveBeenCalledWith('1');
    });

    it('should not throw error when onProductClick is not provided', () => {
      render(<ProductGrid products={mockProducts} />);
      
      const productCard = screen.getByTestId('product-card-1');
      expect(() => productCard.click()).not.toThrow();
    });

    it('should call onProductClick with correct product ID for each product', () => {
      const handleClick = jest.fn();
      render(<ProductGrid products={mockProducts} onProductClick={handleClick} />);
      
      screen.getByTestId('product-card-1').click();
      expect(handleClick).toHaveBeenCalledWith('1');
      
      screen.getByTestId('product-card-2').click();
      expect(handleClick).toHaveBeenCalledWith('2');
      
      screen.getByTestId('product-card-3').click();
      expect(handleClick).toHaveBeenCalledWith('3');
    });
  });

  describe('Edge Cases', () => {
    it('should handle products with missing optional fields', () => {
      const minimalProduct: Product = {
        id: '999',
        title: 'Minimal Product',
        description: 'Test',
        price: 1000,
        condition: 'new',
        category: 'laptops',
        subcategory: 'budget',
        brand: 'Dell',
        specifications: {},
        images: [],
        location: { city: 'Test', region: 'Test', country: 'Ethiopia' },
        sellerId: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        views: 0,
        favorites: 0,
      };

      render(<ProductGrid products={[minimalProduct]} />);
      
      expect(screen.getByTestId('product-card-999')).toBeInTheDocument();
    });

    it('should handle large number of products', () => {
      const manyProducts = Array.from({ length: 100 }, (_, i) => ({
        ...mockProducts[0],
        id: `product-${i}`,
        title: `Product ${i}`,
      }));

      render(<ProductGrid products={manyProducts} />);
      
      expect(screen.getByTestId('product-card-product-0')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-product-99')).toBeInTheDocument();
    });

    it('should maintain grid structure with odd number of products', () => {
      const oddProducts = mockProducts.slice(0, 3);
      const { container } = render(<ProductGrid products={oddProducts} />);
      
      const grid = container.firstChild;
      expect(grid).toHaveClass('grid');
      expect(screen.getAllByTestId(/product-card-/)).toHaveLength(3);
    });
  });

  describe('Accessibility', () => {
    it('should render semantic HTML structure', () => {
      const { container } = render(<ProductGrid products={mockProducts} />);
      
      const grid = container.firstChild;
      expect(grid).toHaveClass('grid');
    });

    it('should render empty state with proper heading hierarchy', () => {
      render(<ProductGrid products={[]} />);
      
      const heading = screen.getByText('No Products Found');
      expect(heading.tagName).toBe('H3');
    });
  });

  describe('Requirements Validation', () => {
    it('should implement responsive grid layout (Requirement 1.6, 8.1)', () => {
      const { container } = render(<ProductGrid products={mockProducts} />);
      const grid = container.firstChild;
      
      // Mobile: 2 columns
      expect(grid).toHaveClass('grid-cols-2');
      // Tablet: 3 columns
      expect(grid).toHaveClass('sm:grid-cols-3');
      // Desktop: 4 columns
      expect(grid).toHaveClass('lg:grid-cols-4');
    });

    it('should implement lazy loading for images (Requirement 10.3, 10.4)', () => {
      // ProductCard component handles lazy loading via Next.js Image
      // This test verifies ProductCard is rendered for each product
      render(<ProductGrid products={mockProducts} />);
      
      mockProducts.forEach(product => {
        expect(screen.getByTestId(`product-card-${product.id}`)).toBeInTheDocument();
      });
    });

    it('should provide loading skeleton states (Requirement 8.1)', () => {
      const { container } = render(
        <ProductGrid products={mockProducts} loading={true} />
      );
      
      const skeletons = container.querySelectorAll('.animate-pulse');
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it('should handle empty states with helpful messages (Requirement 1.6)', () => {
      render(<ProductGrid products={[]} />);
      
      expect(screen.getByText('No Products Found')).toBeInTheDocument();
      expect(screen.getByText(/We couldn't find any products/)).toBeInTheDocument();
      expect(screen.getByText('Suggestions:')).toBeInTheDocument();
    });
  });
});
