import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import ProfilePage from './page';
import { useUser } from '@/contexts/UserContext';
import { mockProducts } from '@/data/mockData';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock UserContext
jest.mock('@/contexts/UserContext', () => ({
  useUser: jest.fn(),
}));

// Mock ProductCard component
jest.mock('@/components/ProductCard', () => {
  return function MockProductCard({ product }: any) {
    return <div data-testid={`product-card-${product.id}`}>{product.title}</div>;
  };
});

// Mock RatingDisplay component
jest.mock('@/components/RatingDisplay', () => {
  return function MockRatingDisplay({ rating, reviewCount }: any) {
    return <div data-testid="rating-display">{rating.toFixed(1)} ({reviewCount} reviews)</div>;
  };
});

// Mock mockProducts
jest.mock('@/data/mockData', () => ({
  mockProducts: [
    {
      id: 'product-1',
      title: 'Test Product 1',
      sellerId: 'user-123',
      price: 1000,
      condition: 'new',
      category: 'laptops',
      subcategory: 'Gaming',
      brand: 'Dell',
      images: [],
      location: { city: 'Addis Ababa', region: 'Addis Ababa', country: 'Ethiopia' },
      status: 'active',
    },
    {
      id: 'product-2',
      title: 'Test Product 2',
      sellerId: 'user-123',
      price: 2000,
      condition: 'used',
      category: 'desktop-computers',
      subcategory: 'Gaming PCs',
      brand: 'HP',
      images: [],
      location: { city: 'Addis Ababa', region: 'Addis Ababa', country: 'Ethiopia' },
      status: 'active',
    },
    {
      id: 'product-3',
      title: 'Other User Product',
      sellerId: 'user-456',
      price: 3000,
      condition: 'new',
      category: 'laptops',
      subcategory: 'Business',
      brand: 'Lenovo',
      images: [],
      location: { city: 'Dire Dawa', region: 'Dire Dawa', country: 'Ethiopia' },
      status: 'active',
    },
  ],
  mockReviews: [],
}));

describe('ProfilePage', () => {
  const mockPush = jest.fn();
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+251911234567',
    location: {
      city: 'Addis Ababa',
      region: 'Addis Ababa',
      country: 'Ethiopia',
    },
    createdAt: new Date('2024-01-01'),
    isVerified: true,
    isSeller: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  describe('Authentication', () => {
    it('should redirect to login if user is not authenticated', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
      });

      render(<ProfilePage />);

      expect(mockPush).toHaveBeenCalledWith('/user/login?returnUrl=/user/profile');
    });

    it('should show loading state while checking authentication', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
      });

      render(<ProfilePage />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('User Information Display', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
      });
    });

    it('should display user name', () => {
      render(<ProfilePage />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('should display user initials in avatar', () => {
      render(<ProfilePage />);

      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should display user email', () => {
      render(<ProfilePage />);

      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('should display user phone when available', () => {
      render(<ProfilePage />);

      expect(screen.getByText('+251911234567')).toBeInTheDocument();
    });

    it('should not display phone section when phone is not available', () => {
      const userWithoutPhone = { ...mockUser, phone: undefined };
      (useUser as jest.Mock).mockReturnValue({
        user: userWithoutPhone,
        isAuthenticated: true,
      });

      render(<ProfilePage />);

      expect(screen.queryByText('+251911234567')).not.toBeInTheDocument();
    });

    it('should display user location', () => {
      render(<ProfilePage />);

      expect(screen.getByText('Addis Ababa, Addis Ababa')).toBeInTheDocument();
    });
  });

  describe('Verification Status', () => {
    it('should show verified badge for verified users', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
      });

      render(<ProfilePage />);

      expect(screen.getByText('Verified User')).toBeInTheDocument();
    });

    it('should show not verified badge for unverified users', () => {
      const unverifiedUser = { ...mockUser, isVerified: false };
      (useUser as jest.Mock).mockReturnValue({
        user: unverifiedUser,
        isAuthenticated: true,
      });

      render(<ProfilePage />);

      expect(screen.getByText('Not Verified')).toBeInTheDocument();
    });
  });

  describe('Edit Profile Button', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
      });
    });

    it('should display edit profile button', () => {
      render(<ProfilePage />);

      expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
    });

    it('should navigate to edit profile page when clicked', () => {
      render(<ProfilePage />);

      const editButton = screen.getByRole('button', { name: /edit profile/i });
      editButton.click();

      expect(mockPush).toHaveBeenCalledWith('/user/profile/edit');
    });
  });

  describe('Listing History', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
      });
    });

    it('should display listing history section', () => {
      render(<ProfilePage />);

      expect(screen.getByText(/my listings/i)).toBeInTheDocument();
    });

    it('should display correct number of user listings', () => {
      render(<ProfilePage />);

      expect(screen.getByText('My Listings (2)')).toBeInTheDocument();
    });

    it('should display only user\'s own listings', () => {
      render(<ProfilePage />);

      expect(screen.getByTestId('product-card-product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-product-2')).toBeInTheDocument();
      expect(screen.queryByTestId('product-card-product-3')).not.toBeInTheDocument();
    });

    it('should show empty state when user has no listings', () => {
      const userWithNoListings = { ...mockUser, id: 'user-999' };
      (useUser as jest.Mock).mockReturnValue({
        user: userWithNoListings,
        isAuthenticated: true,
      });

      render(<ProfilePage />);

      expect(screen.getByText('You haven\'t created any listings yet')).toBeInTheDocument();
    });

    it('should show create listing button in empty state', () => {
      const userWithNoListings = { ...mockUser, id: 'user-999' };
      (useUser as jest.Mock).mockReturnValue({
        user: userWithNoListings,
        isAuthenticated: true,
      });

      render(<ProfilePage />);

      const createButton = screen.getByRole('button', { name: /create your first listing/i });
      expect(createButton).toBeInTheDocument();
    });

    it('should navigate to create listing page when empty state button is clicked', () => {
      const userWithNoListings = { ...mockUser, id: 'user-999' };
      (useUser as jest.Mock).mockReturnValue({
        user: userWithNoListings,
        isAuthenticated: true,
      });

      render(<ProfilePage />);

      const createButton = screen.getByRole('button', { name: /create your first listing/i });
      createButton.click();

      expect(mockPush).toHaveBeenCalledWith('/sell/new');
    });
  });

  describe('Responsive Layout', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
      });
    });

    it('should render with proper styling classes for responsive design', () => {
      const { container } = render(<ProfilePage />);

      // Check for responsive grid classes
      const gridElement = container.querySelector('.grid');
      expect(gridElement).toHaveClass('grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-4');
    });

    it('should have proper container max-width', () => {
      const { container } = render(<ProfilePage />);

      const mainContainer = container.querySelector('.max-w-7xl');
      expect(mainContainer).toBeInTheDocument();
    });
  });
});
