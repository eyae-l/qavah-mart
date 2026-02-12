import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import SubcategoryPage from './page';
import { CATEGORY_STRUCTURE } from '@/types';
import { mockProducts } from '@/data/mockData';
import { LocationProvider } from '@/contexts/LocationContext';

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
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

describe('SubcategoryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('SubcategoryPage Component', () => {
    it('should render subcategory page with products', () => {
      renderWithProviders(
        <SubcategoryPage
          params={{ category: 'laptops', subcategory: 'gaming' }}
        />
      );
      
      expect(screen.getByRole('heading', { level: 1, name: 'Gaming' })).toBeInTheDocument();
      expect(screen.getByTestId('product-grid')).toBeInTheDocument();
    });

    it('should display breadcrumb navigation', () => {
      renderWithProviders(
        <SubcategoryPage
          params={{ category: 'laptops', subcategory: 'gaming' }}
        />
      );
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Laptops')).toBeInTheDocument();
      // Check for heading instead of breadcrumb text to avoid multiple matches
      expect(screen.getByRole('heading', { level: 1, name: 'Gaming' })).toBeInTheDocument();
    });

    it('should display product count', () => {
      renderWithProviders(
        <SubcategoryPage
          params={{ category: 'laptops', subcategory: 'gaming' }}
        />
      );
      
      const gamingLaptops = mockProducts.filter(
        (p) => p.category === 'laptops' && p.subcategory === 'Gaming' && p.status === 'active'
      );
      
      const countText = `${gamingLaptops.length} ${gamingLaptops.length === 1 ? 'product' : 'products'} available`;
      expect(screen.getByText(countText)).toBeInTheDocument();
    });

    it('should filter products by category and subcategory', () => {
      renderWithProviders(
        <SubcategoryPage
          params={{ category: 'laptops', subcategory: 'gaming' }}
        />
      );
      
      const gamingLaptops = mockProducts.filter(
        (p) => p.category === 'laptops' && p.subcategory === 'Gaming' && p.status === 'active'
      );
      
      gamingLaptops.forEach((product) => {
        expect(screen.getByTestId(`product-${product.id}`)).toBeInTheDocument();
      });
    });

    it('should only show active products', () => {
      renderWithProviders(
        <SubcategoryPage
          params={{ category: 'laptops', subcategory: 'gaming' }}
        />
      );
      
      const inactiveProducts = mockProducts.filter(
        (p) => p.category === 'laptops' && p.subcategory === 'Gaming' && p.status !== 'active'
      );
      
      inactiveProducts.forEach((product) => {
        expect(screen.queryByTestId(`product-${product.id}`)).not.toBeInTheDocument();
      });
    });

    it('should call notFound for invalid category', () => {
      renderWithProviders(
        <SubcategoryPage
          params={{ category: 'invalid-category', subcategory: 'gaming' }}
        />
      );
      
      expect(notFound).toHaveBeenCalled();
    });

    it('should call notFound for invalid subcategory', () => {
      renderWithProviders(
        <SubcategoryPage
          params={{ category: 'laptops', subcategory: 'invalid-subcategory' }}
        />
      );
      
      expect(notFound).toHaveBeenCalled();
    });

    it('should handle subcategories with spaces in slug', () => {
      renderWithProviders(
        <SubcategoryPage
          params={{ category: 'desktop-computers', subcategory: 'gaming-pcs' }}
        />
      );
      
      expect(screen.getByRole('heading', { level: 1, name: 'Gaming PCs' })).toBeInTheDocument();
    });
    
    it('should render filter sidebar', () => {
      renderWithProviders(
        <SubcategoryPage
          params={{ category: 'laptops', subcategory: 'gaming' }}
        />
      );
      
      expect(screen.getByTestId('filter-sidebar')).toBeInTheDocument();
    });

    it('should display empty state when no products available', () => {
      // Find a subcategory with no products
      const emptySubcategory = CATEGORY_STRUCTURE['software-licenses'].subcategories.find(
        (sub) => {
          const slug = sub.toLowerCase().replace(/\s+/g, '-');
          const products = mockProducts.filter(
            (p) => p.category === 'software-licenses' && p.subcategory === sub && p.status === 'active'
          );
          return products.length === 0;
        }
      );
      
      if (emptySubcategory) {
        const slug = emptySubcategory.toLowerCase().replace(/\s+/g, '-');
        renderWithProviders(
          <SubcategoryPage
            params={{ category: 'software-licenses', subcategory: slug }}
          />
        );
        
        expect(screen.getByText('No products available in this subcategory yet.')).toBeInTheDocument();
        expect(screen.getByText('Check back soon for new listings!')).toBeInTheDocument();
      }
    });

    it('should display link to parent category in empty state', () => {
      // Find a subcategory with no products
      const emptySubcategory = CATEGORY_STRUCTURE['software-licenses'].subcategories.find(
        (sub) => {
          const products = mockProducts.filter(
            (p) => p.category === 'software-licenses' && p.subcategory === sub && p.status === 'active'
          );
          return products.length === 0;
        }
      );
      
      if (emptySubcategory) {
        const slug = emptySubcategory.toLowerCase().replace(/\s+/g, '-');
        renderWithProviders(
          <SubcategoryPage
            params={{ category: 'software-licenses', subcategory: slug }}
          />
        );
        
        const link = screen.getByText('Browse All Software & Licenses');
        expect(link).toBeInTheDocument();
        expect(link.closest('a')).toHaveAttribute('href', '/categories/software-licenses');
      }
    });

    it('should render correct breadcrumb links', () => {
      renderWithProviders(
        <SubcategoryPage
          params={{ category: 'laptops', subcategory: 'gaming' }}
        />
      );
      
      const homeLink = screen.getByText('Home').closest('a');
      const categoryLink = screen.getByText('Laptops').closest('a');
      
      expect(homeLink).toHaveAttribute('href', '/');
      expect(categoryLink).toHaveAttribute('href', '/categories/laptops');
    });

    it('should display subcategory header', () => {
      renderWithProviders(
        <SubcategoryPage
          params={{ category: 'laptops', subcategory: 'business' }}
        />
      );
      
      expect(screen.getByRole('heading', { level: 1, name: 'Business' })).toBeInTheDocument();
    });

    it('should handle all laptop subcategories', () => {
      const subcategories = ['gaming', 'business', 'ultrabooks', 'budget'];
      
      subcategories.forEach((subcategory) => {
        const { unmount } = renderWithProviders(
          <SubcategoryPage
            params={{ category: 'laptops', subcategory }}
          />
        );
        
        expect(notFound).not.toHaveBeenCalled();
        unmount();
      });
    });

    it('should handle all desktop computer subcategories', () => {
      const subcategories = ['gaming-pcs', 'workstations', 'all-in-one'];
      
      subcategories.forEach((subcategory) => {
        const { unmount } = renderWithProviders(
          <SubcategoryPage
            params={{ category: 'desktop-computers', subcategory }}
          />
        );
        
        expect(notFound).not.toHaveBeenCalled();
        unmount();
      });
    });

    it('should handle all computer component subcategories', () => {
      const subcategories = ['cpus', 'gpus', 'ram', 'storage', 'motherboards'];
      
      subcategories.forEach((subcategory) => {
        const { unmount } = renderWithProviders(
          <SubcategoryPage
            params={{ category: 'computer-components', subcategory }}
          />
        );
        
        expect(notFound).not.toHaveBeenCalled();
        unmount();
      });
    });

    it('should match subcategory case-insensitively', () => {
      renderWithProviders(
        <SubcategoryPage
          params={{ category: 'laptops', subcategory: 'gaming' }}
        />
      );
      
      // Should match "Gaming" subcategory
      expect(screen.getByRole('heading', { level: 1, name: 'Gaming' })).toBeInTheDocument();
      expect(notFound).not.toHaveBeenCalled();
    });
  });
});
