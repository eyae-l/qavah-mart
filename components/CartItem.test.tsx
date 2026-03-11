/**
 * Unit Tests for CartItem Component
 * Requirements: Shopping Cart Feature - Requirements 2, 3, 4
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CartItem } from './CartItem';
import { Product } from '@/types';

// Mock Next.js components
jest.mock('next/link', () => {
  return ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>;
  };
});

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} {...props} />;
  },
}));

describe('CartItem', () => {
  const mockProduct: Product = {
    id: 'product-1',
    title: 'Test Product',
    description: 'Test description',
    price: 100.00,
    condition: 'new',
    category: 'electronics',
    subcategory: 'phones',
    images: ['https://example.com/image.jpg'],
    sellerId: 'seller-1',
    location: 'Addis Ababa',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const defaultProps = {
    productId: 'product-1',
    product: mockProduct,
    quantity: 2,
    onUpdateQuantity: jest.fn(),
    onRemove: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render product information', () => {
      render(<CartItem {...defaultProps} />);
      
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText(/new/i)).toBeInTheDocument();
      expect(screen.getByText('ETB 100.00')).toBeInTheDocument();
    });

    it('should render product image', () => {
      render(<CartItem {...defaultProps} />);
      
      const image = screen.getByAltText('Test Product');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
    });

    it('should render placeholder when no image', () => {
      const productWithoutImage = { ...mockProduct, images: [] };
      render(<CartItem {...defaultProps} product={productWithoutImage} />);
      
      expect(screen.getByText('No image')).toBeInTheDocument();
    });

    it('should display correct quantity', () => {
      render(<CartItem {...defaultProps} quantity={5} />);
      
      const inputs = screen.getAllByLabelText('Quantity');
      inputs.forEach(input => {
        expect(input).toHaveValue(5);
      });
    });

    it('should calculate and display line total', () => {
      render(<CartItem {...defaultProps} quantity={3} />);
      
      // Line total = 100 * 3 = 300
      const subtotals = screen.getAllByText('ETB 300.00');
      expect(subtotals.length).toBeGreaterThan(0);
    });
  });

  describe('Quantity Controls', () => {
    it('should call onUpdateQuantity when increment button clicked', async () => {
      const onUpdateQuantity = jest.fn().mockResolvedValue(undefined);
      render(<CartItem {...defaultProps} onUpdateQuantity={onUpdateQuantity} />);
      
      const incrementButtons = screen.getAllByLabelText('Increase quantity');
      fireEvent.click(incrementButtons[0]);
      
      await waitFor(() => {
        expect(onUpdateQuantity).toHaveBeenCalledWith(3);
      });
    });

    it('should call onUpdateQuantity when decrement button clicked', async () => {
      const onUpdateQuantity = jest.fn().mockResolvedValue(undefined);
      render(<CartItem {...defaultProps} quantity={3} onUpdateQuantity={onUpdateQuantity} />);
      
      const decrementButtons = screen.getAllByLabelText('Decrease quantity');
      fireEvent.click(decrementButtons[0]);
      
      await waitFor(() => {
        expect(onUpdateQuantity).toHaveBeenCalledWith(2);
      });
    });

    it('should not decrement below 1', async () => {
      const onUpdateQuantity = jest.fn();
      render(<CartItem {...defaultProps} quantity={1} onUpdateQuantity={onUpdateQuantity} />);
      
      const decrementButtons = screen.getAllByLabelText('Decrease quantity');
      fireEvent.click(decrementButtons[0]);
      
      await waitFor(() => {
        expect(onUpdateQuantity).not.toHaveBeenCalled();
      });
    });

    it('should disable decrement button when quantity is 1', () => {
      render(<CartItem {...defaultProps} quantity={1} />);
      
      const decrementButtons = screen.getAllByLabelText('Decrease quantity');
      decrementButtons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });

    it('should disable increment button when quantity is 99', () => {
      render(<CartItem {...defaultProps} quantity={99} />);
      
      const incrementButtons = screen.getAllByLabelText('Increase quantity');
      incrementButtons.forEach(button => {
        expect(button).toBeDisabled();
      });
    });

    it('should call onUpdateQuantity when quantity input changed', async () => {
      const onUpdateQuantity = jest.fn().mockResolvedValue(undefined);
      render(<CartItem {...defaultProps} onUpdateQuantity={onUpdateQuantity} />);
      
      const inputs = screen.getAllByLabelText('Quantity');
      fireEvent.change(inputs[0], { target: { value: '5' } });
      
      await waitFor(() => {
        expect(onUpdateQuantity).toHaveBeenCalledWith(5);
      });
    });

    it('should not call onUpdateQuantity for invalid input', async () => {
      const onUpdateQuantity = jest.fn();
      render(<CartItem {...defaultProps} onUpdateQuantity={onUpdateQuantity} />);
      
      const inputs = screen.getAllByLabelText('Quantity');
      fireEvent.change(inputs[0], { target: { value: '0' } });
      
      await waitFor(() => {
        expect(onUpdateQuantity).not.toHaveBeenCalled();
      });
    });

    it('should not call onUpdateQuantity for non-numeric input', async () => {
      const onUpdateQuantity = jest.fn();
      render(<CartItem {...defaultProps} onUpdateQuantity={onUpdateQuantity} />);
      
      const inputs = screen.getAllByLabelText('Quantity');
      fireEvent.change(inputs[0], { target: { value: 'abc' } });
      
      await waitFor(() => {
        expect(onUpdateQuantity).not.toHaveBeenCalled();
      });
    });
  });

  describe('Remove Functionality', () => {
    it('should call onRemove when remove button clicked', async () => {
      const onRemove = jest.fn().mockResolvedValue(undefined);
      render(<CartItem {...defaultProps} onRemove={onRemove} />);
      
      const removeButtons = screen.getAllByLabelText('Remove item');
      fireEvent.click(removeButtons[0]);
      
      await waitFor(() => {
        expect(onRemove).toHaveBeenCalled();
      });
    });

    it('should disable all buttons during remove operation', async () => {
      const onRemove = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
      render(<CartItem {...defaultProps} onRemove={onRemove} />);
      
      const removeButtons = screen.getAllByLabelText('Remove item');
      fireEvent.click(removeButtons[0]);
      
      // Check buttons are disabled during operation
      const incrementButtons = screen.getAllByLabelText('Increase quantity');
      const decrementButtons = screen.getAllByLabelText('Decrease quantity');
      
      incrementButtons.forEach(button => expect(button).toBeDisabled());
      decrementButtons.forEach(button => expect(button).toBeDisabled());
      removeButtons.forEach(button => expect(button).toBeDisabled());
      
      await waitFor(() => {
        expect(onRemove).toHaveBeenCalled();
      });
    });
  });

  describe('Loading States', () => {
    it('should disable buttons during quantity update', async () => {
      const onUpdateQuantity = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
      render(<CartItem {...defaultProps} onUpdateQuantity={onUpdateQuantity} />);
      
      const incrementButtons = screen.getAllByLabelText('Increase quantity');
      fireEvent.click(incrementButtons[0]);
      
      // Buttons should be disabled during operation
      const allIncrementButtons = screen.getAllByLabelText('Increase quantity');
      const allDecrementButtons = screen.getAllByLabelText('Decrease quantity');
      
      allIncrementButtons.forEach(button => expect(button).toBeDisabled());
      allDecrementButtons.forEach(button => expect(button).toBeDisabled());
      
      await waitFor(() => {
        expect(onUpdateQuantity).toHaveBeenCalled();
      });
    });
  });

  describe('Links', () => {
    it('should link to product detail page', () => {
      render(<CartItem {...defaultProps} />);
      
      const links = screen.getAllByRole('link');
      const productLinks = links.filter(link => 
        link.getAttribute('href') === '/products/product-1'
      );
      
      expect(productLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('should render both desktop and mobile controls', () => {
      render(<CartItem {...defaultProps} />);
      
      // Should have multiple quantity controls (desktop + mobile)
      const quantityInputs = screen.getAllByLabelText('Quantity');
      expect(quantityInputs.length).toBeGreaterThan(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria-labels for buttons', () => {
      render(<CartItem {...defaultProps} />);
      
      expect(screen.getAllByLabelText('Increase quantity').length).toBeGreaterThan(0);
      expect(screen.getAllByLabelText('Decrease quantity').length).toBeGreaterThan(0);
      expect(screen.getAllByLabelText('Remove item').length).toBeGreaterThan(0);
      expect(screen.getAllByLabelText('Quantity').length).toBeGreaterThan(0);
    });
  });

  describe('Price Calculations', () => {
    it('should calculate line total correctly for different quantities', () => {
      const { rerender } = render(<CartItem {...defaultProps} quantity={1} />);
      expect(screen.getAllByText('ETB 100.00').length).toBeGreaterThan(0);
      
      rerender(<CartItem {...defaultProps} quantity={5} />);
      expect(screen.getAllByText('ETB 500.00').length).toBeGreaterThan(0);
    });

    it('should format prices with 2 decimal places', () => {
      const productWithDecimal = { ...mockProduct, price: 99.99 };
      render(<CartItem {...defaultProps} product={productWithDecimal} quantity={2} />);
      
      expect(screen.getByText('ETB 99.99')).toBeInTheDocument();
      expect(screen.getAllByText('ETB 199.98').length).toBeGreaterThan(0);
    });
  });
});
