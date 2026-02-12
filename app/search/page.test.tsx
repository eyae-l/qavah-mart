import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchPage from './page';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
  useRouter: jest.fn(),
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

// Mock fetch
global.fetch = jest.fn();

describe('SearchPage', () => {
  const mockSearchParams = {
    get: jest.fn(),
  };

  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    mockSearchParams.get.mockReturnValue('');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render search page', () => {
    mockSearchParams.get.mockReturnValue('laptop');
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [],
        totalCount: 0,
        facets: {
          categories: [],
          brands: [],
          conditions: [],
          priceRanges: [],
        },
      }),
    });
    
    render(<SearchPage />);
    
    expect(screen.getByText('Search Results for "laptop"')).toBeInTheDocument();
  });

  it('should display loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );
    
    render(<SearchPage />);
    
    // Check for loading spinner
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('should fetch and display search results', async () => {
    mockSearchParams.get.mockReturnValue('laptop');
    
    const mockProducts = [
      {
        id: '1',
        title: 'Dell Laptop',
        price: 50000,
        condition: 'new',
        category: 'laptops',
        subcategory: 'Gaming',
        brand: 'Dell',
        specifications: {},
        images: [],
        location: { city: 'Addis Ababa', region: 'Addis Ababa', country: 'Ethiopia' },
        sellerId: 'seller1',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        views: 0,
        favorites: 0,
        description: 'Test laptop',
      },
    ];
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: mockProducts,
        totalCount: 1,
        facets: {
          categories: [],
          brands: [],
          conditions: [],
          priceRanges: [],
        },
      }),
    });
    
    render(<SearchPage />);
    
    await waitFor(() => {
      expect(screen.getByText('1 product found')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('product-grid')).toBeInTheDocument();
    expect(screen.getByTestId('product-1')).toBeInTheDocument();
  });

  it('should display breadcrumb navigation', () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [],
        totalCount: 0,
        facets: {
          categories: [],
          brands: [],
          conditions: [],
          priceRanges: [],
        },
      }),
    });
    
    render(<SearchPage />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Search Results')).toBeInTheDocument();
  });

  it('should display correct product count', async () => {
    mockSearchParams.get.mockReturnValue('laptop');
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [{}, {}, {}],
        totalCount: 3,
        facets: {
          categories: [],
          brands: [],
          conditions: [],
          priceRanges: [],
        },
      }),
    });
    
    render(<SearchPage />);
    
    await waitFor(() => {
      expect(screen.getByText('3 products found')).toBeInTheDocument();
    });
  });

  it('should display singular product count', async () => {
    mockSearchParams.get.mockReturnValue('laptop');
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [{}],
        totalCount: 1,
        facets: {
          categories: [],
          brands: [],
          conditions: [],
          priceRanges: [],
        },
      }),
    });
    
    render(<SearchPage />);
    
    await waitFor(() => {
      expect(screen.getByText('1 product found')).toBeInTheDocument();
    });
  });

  it('should display sort options', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [],
        totalCount: 0,
        facets: {
          categories: [],
          brands: [],
          conditions: [],
          priceRanges: [],
        },
      }),
    });
    
    render(<SearchPage />);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Sort by:')).toBeInTheDocument();
    });
    
    const sortSelect = screen.getByLabelText('Sort by:') as HTMLSelectElement;
    expect(sortSelect).toHaveValue('relevance');
  });

  it('should change sort order', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        products: [],
        totalCount: 0,
        facets: {
          categories: [],
          brands: [],
          conditions: [],
          priceRanges: [],
        },
      }),
    });
    
    render(<SearchPage />);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Sort by:')).toBeInTheDocument();
    });
    
    const sortSelect = screen.getByLabelText('Sort by:');
    fireEvent.change(sortSelect, { target: { value: 'price-low' } });
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('sortBy=price-low')
      );
    });
  });

  it('should display empty state when no results', async () => {
    mockSearchParams.get.mockReturnValue('nonexistent');
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [],
        totalCount: 0,
        facets: {
          categories: [],
          brands: [],
          conditions: [],
          priceRanges: [],
        },
      }),
    });
    
    render(<SearchPage />);
    
    await waitFor(() => {
      expect(screen.getByText('No products found')).toBeInTheDocument();
    });
    
    expect(screen.getByText(/We couldn't find any products matching/)).toBeInTheDocument();
  });

  it('should display suggestions in empty state', async () => {
    mockSearchParams.get.mockImplementation((key) => {
      if (key === 'q') return 'laptop';
      return null;
    });
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [],
        totalCount: 0,
        facets: {
          categories: [],
          brands: [],
          conditions: [],
          priceRanges: [],
        },
        suggestions: ['Dell Laptop', 'HP Laptop'],
      }),
    });
    
    render(<SearchPage />);
    
    await waitFor(() => {
      expect(screen.getByText('No products found')).toBeInTheDocument();
    });
    
    // Suggestions should be displayed
    expect(screen.getByText('Did you mean:')).toBeInTheDocument();
    expect(screen.getByText('Dell Laptop')).toBeInTheDocument();
    expect(screen.getByText('HP Laptop')).toBeInTheDocument();
  });

  it('should display error state on fetch failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    render(<SearchPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to load search results/)).toBeInTheDocument();
    });
    
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('should handle API error response', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });
    
    render(<SearchPage />);
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to load search results/)).toBeInTheDocument();
    });
  });

  it('should display "All Products" when no query', async () => {
    mockSearchParams.get.mockReturnValue('');
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [],
        totalCount: 0,
        facets: {
          categories: [],
          brands: [],
          conditions: [],
          priceRanges: [],
        },
      }),
    });
    
    render(<SearchPage />);
    
    await waitFor(() => {
      expect(screen.getByText('All Products')).toBeInTheDocument();
    });
  });

  it('should include query in API request', async () => {
    mockSearchParams.get.mockReturnValue('laptop');
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [],
        totalCount: 0,
        facets: {
          categories: [],
          brands: [],
          conditions: [],
          priceRanges: [],
        },
      }),
    });
    
    render(<SearchPage />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('q=laptop')
      );
    });
  });

  it('should include sortBy in API request', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [],
        totalCount: 0,
        facets: {
          categories: [],
          brands: [],
          conditions: [],
          priceRanges: [],
        },
      }),
    });
    
    render(<SearchPage />);
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('sortBy=relevance')
      );
    });
  });

  it('should have link to browse all products in empty state', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [],
        totalCount: 0,
        facets: {
          categories: [],
          brands: [],
          conditions: [],
          priceRanges: [],
        },
      }),
    });
    
    render(<SearchPage />);
    
    await waitFor(() => {
      const link = screen.getByText('Browse All Products');
      expect(link).toBeInTheDocument();
      expect(link.closest('a')).toHaveAttribute('href', '/');
    });
  });

  it('should have breadcrumb link to home', () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        products: [],
        totalCount: 0,
        facets: {
          categories: [],
          brands: [],
          conditions: [],
          priceRanges: [],
        },
      }),
    });
    
    render(<SearchPage />);
    
    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
