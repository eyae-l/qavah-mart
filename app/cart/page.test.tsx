/**
 * Unit Tests for Cart Page
 * Requirements: Shopping Cart Feature - Requirements 2, 7, 8, 10
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CartPage from './page';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';
import { CartItem as CartItemType } from '@/types';

// Mock the contexts and Next.js hooks
jest.mock('@/contexts/CartContext', () => ({
  useCart: jest.fn(),
}));

jest.mock('@/contexts/ToastContext', () => ({
  useToast: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

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

// Mock CartItem component
jest.mock('@/components/CartItem', () => ({
  CartItem: ({ productId, product, quantity, onUpdateQuantity, onRemove }: any) => (
    <div data-testid={`cart-item-${productId}`}>
      <span>{product.title}</span>
      <span>Quantity: {quantity}</span>
      <button onClick={() => onUpdateQuantity(quantity + 1)}>Increase</button>
      <button onClick={() => onRemove()}>Remove</button>
    </div>
  ),
}));

describe('CartPage', () => {
  const mockUpdateQuantity = jest.fn();
  const mockRemoveItem = jest.fn();
  const mockShowToast = jest.fn();
  const mockPush = jest.fn();

  const mockUseCart = useCart as jest.MockedFunction<typeof useCart>;
  const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;
  const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

  const mockCartItems: CartItemType[] = [
    {
      productId: 'product-1',
      quantity: 2,
      addedAt: new Date('2024-01-01'),
    },
    {
      productId: 'product-2',
      quantity: 1,
      addedAt: new Date('2024-01-02'),
    },
  ];

  const mockProducts = {
    'product-1': {
      id: 'product-1',
      title: 'Product 1',
      description: 'Description 1',
      price: 100.00,
      condition: 'new',
      category: 'electronics',
      subcategory: 'phones',
      images: ['https://example.com/image1.jpg'],
      sellerId: 'seller-1',
      location: 'Addis Ababa',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    'product-2': {
      id: 'product-2',
      title: 'Product 2',
      description: 'Description 2',
      price: 50.00,
      condition: 'used',
      category: 'electronics',
      subcategory: 'laptops',
      images: ['https://example.com/image2.jpg'],
      sellerId: 'seller-2',
      location: 'Addis Ababa',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseCart.mockReturnValue({
      items: mockCartItems,
      itemCount: 3,
      subtotal: 250.00,
      total: 250.00,
      isLoading: false,
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
    } as any);

    mockUseToast.mockReturnValue({
      showToast: mockShowToast,
    } as any);

    mockUseRouter.mockReturnValue({
      push: mockPush,
    } as any);

    mockUpdateQuantity.mockResolvedValue(undefined);
    mockRemoveItem.mockResolvedValue(undefined);

    // Mock fetch for product details
    global.fetch = jest.fn((url) => {
      const productId = url.toString().split('/').pop();
      const product = mockProducts[productId as keyof typeof mockProducts];
      
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(product),
      } as Response);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading spinner when cart is loading', () => {
      mockUseCart.mockReturnValue({
        items: [],
        itemCount: 0,
        subtotal: 0,
        total: 0,
        isLoading: true,
        updateQuantity: mockUpdateQuantity,
        removeItem: mockRemoveItem,
      } as any);

      render(<CartPage />);
      
      const spinner = document.querySelector('.animate-spin');
      expect(spinner).toBeInTheDocument();
    });
  });

  describe('Empty Cart State', () => {
    it('should show empty cart message when cart is empty', () => {
      mockUseCart.mockReturnValue({
        items: [],
        itemCount: 0,
        subtotal: 0,
        total: 0,
        isLoading: false,
        updateQuantity: mockUpdateQuantity,
        removeItem: mockRemoveItem,
      } as any);

      render(<CartPage />);
      
      expect(screen.getByText('Your cart is empty')).toBeInTheDocument();
      expect(screen.getByText(/add some products to your cart/i)).toBeInTheDocument();
    });

    it('should show continue shopping link in empty state', () => {
      mockUseCart.mockReturnValue({
        items: [],
        itemCount: 0,
        subtotal: 0,
        total: 0,
        isLoading: false,
        updateQuantity: mockUpdateQuantity,
        removeItem: mockRemoveItem,
      } as any);

      render(<CartPage />);
      
      const link = screen.getByRole('link', { name: /continue shopping/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/');
    });
  });

  describe('Cart with Items', () => {
    it('should display cart header with item count', async () => {
      render(<CartPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/shopping cart \(3 items\)/i)).toBeInTheDocument();
      });
    });

    it('should display singular "item" for one item', async () => {
      mockUseCart.mockReturnValue({
        items: [mockCartItems[0]],
        itemCount: 1,
        subtotal: 200.00,
        total: 200.00,
        isLoading: false,
        updateQuantity: mockUpdateQuantity,
        removeItem: mockRemoveItem,
      } as any);

      render(<CartPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/shopping cart \(1 item\)/i)).toBeInTheDocument();
      });
    });

    it('should fetch and display product details', async () => {
      render(<CartPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
      });
    });

    it('should render CartItem components for each item', async () => {
      render(<CartPage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('cart-item-product-1')).toBeInTheDocument();
        expect(screen.getByTestId('cart-item-product-2')).toBeInTheDocument();
      });
    });
  });

  describe('Order Summary', () => {
    it('should display subtotal', async () => {
      render(<CartPage />);
      
      await waitFor(() => {
        const prices = screen.getAllByText('ETB 250.00');
        expect(prices.length).toBeGreaterThan(0);
      });
    });

    it('should display total', async () => {
      render(<CartPage />);
      
      await waitFor(() => {
        const prices = screen.getAllByText('ETB 250.00');
        expect(prices.length).toBeGreaterThan(0);
      });
    });

    it('should show shipping message', async () => {
      render(<CartPage />);
      
      await waitFor(() => {
        expect(screen.getByText('Calculated at checkout')).toBeInTheDocument();
      });
    });

    it('should show free shipping message', async () => {
      render(<CartPage />);
      
      await waitFor(() => {
        expect(screen.getByText(/free shipping/i)).toBeInTheDocument();
      });
    });
  });

  describe('Checkout Navigation', () => {
    it('should have proceed to checkout button', async () => {
      render(<CartPage />);
      
      await waitFor(() => {
        const button = screen.getByRole('button', { name: /proceed to checkout/i });
        expect(button).toBeInTheDocument();
      });
    });

    it('should navigate to checkout when button clicked', async () => {
      render(<CartPage />);
      
      await waitFor(() => {
        const button = screen.getByRole('button', { name: /proceed to checkout/i });
        fireEvent.click(button);
      });
      
      expect(mockPush).toHaveBeenCalledWith('/checkout');
    });
  });

  describe('Update Quantity', () => {
    it('should call updateQuantity when quantity changed', async () => {
      render(<CartPage />);
      
      await waitFor(() => {
        const increaseButton = screen.getAllByText('Increase')[0];
        fireEvent.click(increaseButton);
      });
      
      await waitFor(() => {
        expect(mockUpdateQuantity).toHaveBeenCalledWith('product-1', 3);
      });
    });

    it('should show success toast after updating quantity', async () => {
      render(<CartPage />);
      
      await waitFor(() => {
        const increaseButton = screen.getAllByText('Increase')[0];
        fireEvent.click(increaseButton);
      });
      
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('Cart updated', 'success');
      });
    });

    it('should show error toast when update fails', async () => {
      mockUpdateQuantity.mockRejectedValue(new Error('Update failed'));
      
      render(<CartPage />);
      
      await waitFor(() => {
        const increaseButton = screen.getAllByText('Increase')[0];
        fireEvent.click(increaseButton);
      });
      
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('Failed to update quantity', 'error');
      });
    });
  });

  describe('Remove Item', () => {
    it('should call removeItem when remove button clicked', async () => {
      render(<CartPage />);
      
      await waitFor(() => {
        const removeButton = screen.getAllByText('Remove')[0];
        fireEvent.click(removeButton);
      });
      
      await waitFor(() => {
        expect(mockRemoveItem).toHaveBeenCalledWith('product-1');
      });
    });

    it('should show success toast after removing item', async () => {
      render(<CartPage />);
      
      await waitFor(() => {
        const removeButton = screen.getAllByText('Remove')[0];
        fireEvent.click(removeButton);
      });
      
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('Item removed from cart', 'success');
      });
    });

    it('should show error toast when remove fails', async () => {
      mockRemoveItem.mockRejectedValue(new Error('Remove failed'));
      
      render(<CartPage />);
      
      await waitFor(() => {
        const removeButton = screen.getAllByText('Remove')[0];
        fireEvent.click(removeButton);
      });
      
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('Failed to remove item', 'error');
      });
    });
  });

  describe('Continue Shopping Links', () => {
    it('should have continue shopping links', async () => {
      render(<CartPage />);
      
      await waitFor(() => {
        const links = screen.getAllByRole('link', { name: /continue shopping/i });
        expect(links.length).toBeGreaterThan(0);
      });
    });

    it('should link to home page', async () => {
      render(<CartPage />);
      
      await waitFor(() => {
        const links = screen.getAllByRole('link', { name: /continue shopping/i });
        links.forEach(link => {
          expect(link).toHaveAttribute('href', '/');
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle product fetch errors gracefully', async () => {
      global.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
      
      render(<CartPage />);
      
      await waitFor(() => {
        expect(mockShowToast).toHaveBeenCalledWith('Error loading cart items', 'error');
      });
    });

    it('should handle missing product data', async () => {
      global.fetch = jest.fn(() => 
        Promise.resolve({
          ok: false,
          json: () => Promise.resolve(null),
        } as Response)
      );
      
      render(<CartPage />);
      
      await waitFor(() => {
        // Should not crash, just not render items
        expect(screen.queryByTestId('cart-item-product-1')).not.toBeInTheDocument();
      });
    });
  });

  describe('Responsive Design', () => {
    it('should render mobile and desktop continue shopping buttons', async () => {
      render(<CartPage />);
      
      await waitFor(() => {
        const links = screen.getAllByRole('link', { name: /continue shopping/i });
        expect(links.length).toBeGreaterThan(1);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading structure', async () => {
      render(<CartPage />);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /shopping cart/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: /order summary/i })).toBeInTheDocument();
      });
    });

    it('should have accessible buttons', async () => {
      render(<CartPage />);
      
      await waitFor(() => {
        const checkoutButton = screen.getByRole('button', { name: /proceed to checkout/i });
        expect(checkoutButton).toBeInTheDocument();
      });
    });
  });
});
