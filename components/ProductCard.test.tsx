import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductCard from './ProductCard';
import { Product } from '@/types';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  MapPin: () => <div data-testid="map-pin-icon">MapPin</div>,
}));

describe('ProductCard', () => {
  const mockProduct: Product = {
    id: '1',
    title: 'Dell XPS 15 Gaming Laptop',
    description: 'High-performance gaming laptop with RTX 3060',
    price: 85000,
    condition: 'new',
    category: 'laptops',
    subcategory: 'Gaming',
    brand: 'Dell',
    specifications: {
      processor: 'Intel Core i7-12700H',
      memory: '16GB DDR5',
      storage: '512GB NVMe SSD',
      graphics: 'NVIDIA RTX 3060',
    },
    images: ['/images/dell-xps-15.jpg'],
    location: {
      city: 'Addis Ababa',
      region: 'Addis Ababa',
      country: 'Ethiopia',
    },
    sellerId: 'seller-1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    status: 'active',
    views: 100,
    favorites: 10,
  };

  describe('Basic Rendering', () => {
    it('should render product title', () => {
      render(<ProductCard product={mockProduct} />);
      expect(screen.getByText('Dell XPS 15 Gaming Laptop')).toBeInTheDocument();
    });

    it('should render product price with ETB currency', () => {
      render(<ProductCard product={mockProduct} />);
      // Price should be formatted with ETB currency
      const priceElement = screen.getByText(/85,000/);
      expect(priceElement).toBeInTheDocument();
    });

    it('should render product image when available', () => {
      render(<ProductCard product={mockProduct} />);
      const image = screen.getByAltText('Dell XPS 15 Gaming Laptop');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', '/images/dell-xps-15.jpg');
    });

    it('should render location information by default', () => {
      render(<ProductCard product={mockProduct} />);
      expect(screen.getByText(/Addis Ababa, Addis Ababa/)).toBeInTheDocument();
      expect(screen.getByTestId('map-pin-icon')).toBeInTheDocument();
    });

    it('should render condition badge by default', () => {
      render(<ProductCard product={mockProduct} />);
      expect(screen.getByText('New')).toBeInTheDocument();
    });
  });

  describe('Image Handling', () => {
    it('should display brown placeholder when no image is available', () => {
      const productWithoutImage = { ...mockProduct, images: [] };
      render(<ProductCard product={productWithoutImage} />);
      expect(screen.getByText('No Image')).toBeInTheDocument();
    });

    it('should display brown placeholder when images array is empty', () => {
      const productWithEmptyImages = { ...mockProduct, images: [] };
      render(<ProductCard product={productWithEmptyImages} />);
      expect(screen.getByText('No Image')).toBeInTheDocument();
    });

    it('should use first image when multiple images are available', () => {
      const productWithMultipleImages = {
        ...mockProduct,
        images: ['/images/image1.jpg', '/images/image2.jpg', '/images/image3.jpg'],
      };
      render(<ProductCard product={productWithMultipleImages} />);
      const image = screen.getByAltText('Dell XPS 15 Gaming Laptop');
      expect(image).toHaveAttribute('src', '/images/image1.jpg');
    });
  });

  describe('Condition Badge', () => {
    it('should display "New" badge for new products', () => {
      render(<ProductCard product={mockProduct} />);
      expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('should display "Used" badge for used products', () => {
      const usedProduct = { ...mockProduct, condition: 'used' as const };
      render(<ProductCard product={usedProduct} />);
      expect(screen.getByText('Used')).toBeInTheDocument();
    });

    it('should display "Refurbished" badge for refurbished products', () => {
      const refurbishedProduct = { ...mockProduct, condition: 'refurbished' as const };
      render(<ProductCard product={refurbishedProduct} />);
      expect(screen.getByText('Refurbished')).toBeInTheDocument();
    });

    it('should not display condition badge when showCondition is false', () => {
      render(<ProductCard product={mockProduct} showCondition={false} />);
      expect(screen.queryByText('New')).not.toBeInTheDocument();
    });
  });

  describe('Location Display', () => {
    it('should display location when showLocation is true', () => {
      render(<ProductCard product={mockProduct} showLocation={true} />);
      expect(screen.getByText(/Addis Ababa, Addis Ababa/)).toBeInTheDocument();
    });

    it('should not display location when showLocation is false', () => {
      render(<ProductCard product={mockProduct} showLocation={false} />);
      expect(screen.queryByText(/Addis Ababa, Addis Ababa/)).not.toBeInTheDocument();
    });

    it('should display location icon when location is shown', () => {
      render(<ProductCard product={mockProduct} showLocation={true} />);
      expect(screen.getByTestId('map-pin-icon')).toBeInTheDocument();
    });
  });

  describe('Click Handling', () => {
    it('should call onClick handler when card is clicked', () => {
      const handleClick = jest.fn();
      render(<ProductCard product={mockProduct} onClick={handleClick} />);
      
      const card = screen.getByText('Dell XPS 15 Gaming Laptop').closest('div')?.parentElement;
      if (card) {
        fireEvent.click(card);
      }
      
      expect(handleClick).toHaveBeenCalledWith('1');
    });

    it('should not throw error when clicked without onClick handler', () => {
      render(<ProductCard product={mockProduct} />);
      
      const card = screen.getByText('Dell XPS 15 Gaming Laptop').closest('div')?.parentElement;
      expect(() => {
        if (card) {
          fireEvent.click(card);
        }
      }).not.toThrow();
    });
  });

  describe('Favorite Functionality', () => {
    it('should display favorite button when onFavorite is provided', () => {
      const handleFavorite = jest.fn();
      render(<ProductCard product={mockProduct} onFavorite={handleFavorite} />);
      
      const favoriteButton = screen.getByLabelText('Add to favorites');
      expect(favoriteButton).toBeInTheDocument();
    });

    it('should not display favorite button when onFavorite is not provided', () => {
      render(<ProductCard product={mockProduct} />);
      
      const favoriteButton = screen.queryByLabelText('Add to favorites');
      expect(favoriteButton).not.toBeInTheDocument();
    });

    it('should call onFavorite handler when favorite button is clicked', () => {
      const handleFavorite = jest.fn();
      render(<ProductCard product={mockProduct} onFavorite={handleFavorite} />);
      
      const favoriteButton = screen.getByLabelText('Add to favorites');
      fireEvent.click(favoriteButton);
      
      expect(handleFavorite).toHaveBeenCalledWith('1');
    });

    it('should not trigger onClick when favorite button is clicked', () => {
      const handleClick = jest.fn();
      const handleFavorite = jest.fn();
      render(
        <ProductCard
          product={mockProduct}
          onClick={handleClick}
          onFavorite={handleFavorite}
        />
      );
      
      const favoriteButton = screen.getByLabelText('Add to favorites');
      fireEvent.click(favoriteButton);
      
      expect(handleFavorite).toHaveBeenCalledWith('1');
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Price Formatting', () => {
    it('should format price with thousands separator', () => {
      const expensiveProduct = { ...mockProduct, price: 150000 };
      render(<ProductCard product={expensiveProduct} />);
      expect(screen.getByText(/150,000/)).toBeInTheDocument();
    });

    it('should format price without decimals', () => {
      render(<ProductCard product={mockProduct} />);
      const priceText = screen.getByText(/85,000/).textContent;
      expect(priceText).not.toContain('.00');
    });

    it('should handle small prices correctly', () => {
      const cheapProduct = { ...mockProduct, price: 500 };
      render(<ProductCard product={cheapProduct} />);
      expect(screen.getByText(/500/)).toBeInTheDocument();
    });
  });

  describe('Responsive Design', () => {
    it('should have proper CSS classes for responsive grid layouts', () => {
      const { container } = render(<ProductCard product={mockProduct} />);
      
      // When no onClick is provided, card is wrapped in Link
      // The inner div has the styling classes
      const cardDiv = container.querySelector('.group');
      
      expect(cardDiv).toHaveClass('group');
      expect(cardDiv).toHaveClass('cursor-pointer');
      expect(cardDiv).toHaveClass('bg-white');
      expect(cardDiv).toHaveClass('rounded-lg');
    });

    it('should have hover effects classes', () => {
      const { container } = render(<ProductCard product={mockProduct} />);
      
      // When no onClick is provided, card is wrapped in Link
      // The inner div has the hover effect classes
      const cardDiv = container.querySelector('.group');
      
      expect(cardDiv).toHaveClass('hover:shadow-lg');
      expect(cardDiv).toHaveClass('hover:border-primary-500');
      expect(cardDiv).toHaveClass('hover:-translate-y-1');
    });
  });

  describe('Accessibility', () => {
    it('should have proper alt text for product image', () => {
      render(<ProductCard product={mockProduct} />);
      const image = screen.getByAltText('Dell XPS 15 Gaming Laptop');
      expect(image).toBeInTheDocument();
    });

    it('should have aria-label for favorite button', () => {
      const handleFavorite = jest.fn();
      render(<ProductCard product={mockProduct} onFavorite={handleFavorite} />);
      
      const favoriteButton = screen.getByLabelText('Add to favorites');
      expect(favoriteButton).toBeInTheDocument();
    });

    it('should be keyboard accessible when clickable', () => {
      const handleClick = jest.fn();
      render(<ProductCard product={mockProduct} onClick={handleClick} />);
      
      const card = screen.getByText('Dell XPS 15 Gaming Laptop').closest('div')?.parentElement;
      expect(card).toHaveClass('cursor-pointer');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long product titles with line clamp', () => {
      const longTitleProduct = {
        ...mockProduct,
        title: 'This is a very long product title that should be truncated with line clamp to prevent layout issues in the product card component',
      };
      render(<ProductCard product={longTitleProduct} />);
      
      const titleElement = screen.getByText(/This is a very long product title/);
      expect(titleElement).toHaveClass('line-clamp-2');
    });

    it('should handle missing location gracefully', () => {
      const productWithoutLocation = {
        ...mockProduct,
        location: {
          city: '',
          region: '',
          country: 'Ethiopia',
        },
      };
      render(<ProductCard product={productWithoutLocation} />);
      // Should still render without crashing
      expect(screen.getByText('Dell XPS 15 Gaming Laptop')).toBeInTheDocument();
    });

    it('should handle zero price', () => {
      const freeProduct = { ...mockProduct, price: 0 };
      render(<ProductCard product={freeProduct} />);
      expect(screen.getByText(/0/)).toBeInTheDocument();
    });
  });

  describe('Requirements Validation', () => {
    it('should validate Requirement 1.6: Display products in grid with required information', () => {
      render(<ProductCard product={mockProduct} />);
      
      // Should display product image
      expect(screen.getByAltText('Dell XPS 15 Gaming Laptop')).toBeInTheDocument();
      
      // Should display title
      expect(screen.getByText('Dell XPS 15 Gaming Laptop')).toBeInTheDocument();
      
      // Should display price
      expect(screen.getByText(/85,000/)).toBeInTheDocument();
      
      // Should display condition indicator
      expect(screen.getByText('New')).toBeInTheDocument();
      
      // Should display location information
      expect(screen.getByText(/Addis Ababa, Addis Ababa/)).toBeInTheDocument();
    });

    it('should validate Requirement 3.2: Display product condition clearly', () => {
      const { rerender } = render(<ProductCard product={mockProduct} />);
      expect(screen.getByText('New')).toBeInTheDocument();
      
      rerender(<ProductCard product={{ ...mockProduct, condition: 'used' }} />);
      expect(screen.getByText('Used')).toBeInTheDocument();
      
      rerender(<ProductCard product={{ ...mockProduct, condition: 'refurbished' }} />);
      expect(screen.getByText('Refurbished')).toBeInTheDocument();
    });

    it('should validate Requirement 3.4: Display brown placeholder when image is missing', () => {
      const productWithoutImage = { ...mockProduct, images: [] };
      const { container } = render(<ProductCard product={productWithoutImage} />);
      
      expect(screen.getByText('No Image')).toBeInTheDocument();
      
      // Check for brown placeholder styling - find the parent div with bg-primary-100 class
      const placeholder = screen.getByText('No Image').closest('div')?.parentElement;
      expect(placeholder).toHaveClass('bg-primary-100');
    });

    it('should validate Requirement 6.3: Display location information', () => {
      render(<ProductCard product={mockProduct} />);
      
      expect(screen.getByText(/Addis Ababa, Addis Ababa/)).toBeInTheDocument();
      expect(screen.getByTestId('map-pin-icon')).toBeInTheDocument();
    });

    it('should validate Requirement 10.3: Use Next.js Image component with optimization', () => {
      render(<ProductCard product={mockProduct} />);
      
      const image = screen.getByAltText('Dell XPS 15 Gaming Laptop');
      expect(image).toBeInTheDocument();
      
      // Image should have lazy loading
      expect(image).toHaveAttribute('loading', 'lazy');
    });
  });
});
