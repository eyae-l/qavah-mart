import { render, screen, fireEvent } from '@testing-library/react';
import ProductDetails from './ProductDetails';
import { Product, Seller } from '@/types';

describe('ProductDetails', () => {
  const mockProduct: Product = {
    id: '1',
    title: 'Dell XPS 15 Laptop',
    description: 'High-performance laptop with excellent display and build quality.',
    price: 85000,
    condition: 'new',
    category: 'laptops',
    subcategory: 'Business',
    brand: 'Dell',
    specifications: {
      processor: 'Intel Core i7-12700H',
      memory: '16GB DDR5',
      storage: '512GB NVMe SSD',
      graphics: 'NVIDIA GeForce RTX 3050',
      screenSize: '15.6" FHD',
      operatingSystem: 'Windows 11 Pro',
      warranty: '1 Year',
    },
    images: ['image1.jpg'],
    location: {
      city: 'Addis Ababa',
      region: 'Addis Ababa',
      country: 'Ethiopia',
    },
    sellerId: 'seller1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    status: 'active',
    views: 100,
    favorites: 10,
  };

  const mockSeller: Seller = {
    id: 'seller1',
    email: 'seller@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+251911234567',
    location: {
      city: 'Addis Ababa',
      region: 'Addis Ababa',
      country: 'Ethiopia',
    },
    createdAt: new Date('2023-01-01'),
    isVerified: true,
    isSeller: true,
    businessName: 'Tech Solutions',
    businessType: 'business',
    verificationStatus: 'verified',
    rating: 4.5,
    totalSales: 50,
    responseTime: 2,
    joinedDate: new Date('2023-01-01'),
  };

  it('should render product title', () => {
    render(<ProductDetails product={mockProduct} seller={mockSeller} />);
    
    expect(screen.getByText('Dell XPS 15 Laptop')).toBeInTheDocument();
  });

  it('should render product price', () => {
    render(<ProductDetails product={mockProduct} seller={mockSeller} />);
    
    expect(screen.getByText(/85,000/)).toBeInTheDocument();
  });

  it('should render condition badge', () => {
    render(<ProductDetails product={mockProduct} seller={mockSeller} />);
    
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('should render status badge', () => {
    render(<ProductDetails product={mockProduct} seller={mockSeller} />);
    
    expect(screen.getByText('Available')).toBeInTheDocument();
  });

  it('should render product description', () => {
    render(<ProductDetails product={mockProduct} seller={mockSeller} />);
    
    expect(screen.getByText(/High-performance laptop/)).toBeInTheDocument();
  });

  it('should render specifications table', () => {
    render(<ProductDetails product={mockProduct} seller={mockSeller} />);
    
    expect(screen.getByText('Specifications')).toBeInTheDocument();
    expect(screen.getByText('Intel Core i7-12700H')).toBeInTheDocument();
    expect(screen.getByText('16GB DDR5')).toBeInTheDocument();
    expect(screen.getByText('512GB NVMe SSD')).toBeInTheDocument();
  });

  it('should render seller name', () => {
    render(<ProductDetails product={mockProduct} seller={mockSeller} />);
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should render seller business name', () => {
    render(<ProductDetails product={mockProduct} seller={mockSeller} />);
    
    expect(screen.getByText('Tech Solutions')).toBeInTheDocument();
  });

  it('should render seller location', () => {
    render(<ProductDetails product={mockProduct} seller={mockSeller} />);
    
    const sellerLocations = screen.getAllByText(/Addis Ababa/);
    expect(sellerLocations.length).toBeGreaterThan(0);
  });

  it('should show verified badge for verified seller', () => {
    render(<ProductDetails product={mockProduct} seller={mockSeller} />);
    
    const verifiedIcon = screen.getByTitle('Verified Seller');
    expect(verifiedIcon).toBeInTheDocument();
  });

  it('should not show verified badge for unverified seller', () => {
    const unverifiedSeller = { ...mockSeller, isVerified: false };
    render(<ProductDetails product={mockProduct} seller={unverifiedSeller} />);
    
    const verifiedIcon = screen.queryByTitle('Verified Seller');
    expect(verifiedIcon).not.toBeInTheDocument();
  });

  it('should render seller rating', () => {
    render(<ProductDetails product={mockProduct} seller={mockSeller} />);
    
    expect(screen.getByText(/4\.5/)).toBeInTheDocument();
    expect(screen.getByText(/50 sales/)).toBeInTheDocument();
  });

  it('should render contact seller button', () => {
    render(<ProductDetails product={mockProduct} seller={mockSeller} />);
    
    expect(screen.getByText('Contact Seller')).toBeInTheDocument();
  });

  it('should call onContactSeller when button is clicked', () => {
    const onContactSeller = jest.fn();
    render(
      <ProductDetails
        product={mockProduct}
        seller={mockSeller}
        onContactSeller={onContactSeller}
      />
    );
    
    const button = screen.getByText('Contact Seller');
    fireEvent.click(button);
    
    expect(onContactSeller).toHaveBeenCalledTimes(1);
  });

  it('should disable contact button for sold products', () => {
    const soldProduct = { ...mockProduct, status: 'sold' as const };
    render(<ProductDetails product={soldProduct} seller={mockSeller} />);
    
    const button = screen.getByText('Sold Out');
    expect(button).toBeDisabled();
  });

  it('should render product location', () => {
    render(<ProductDetails product={mockProduct} seller={mockSeller} />);
    
    expect(screen.getByText(/Addis Ababa, Addis Ababa, Ethiopia/)).toBeInTheDocument();
  });

  it('should render used condition badge correctly', () => {
    const usedProduct = { ...mockProduct, condition: 'used' as const };
    render(<ProductDetails product={usedProduct} seller={mockSeller} />);
    
    expect(screen.getByText('Used')).toBeInTheDocument();
  });

  it('should render refurbished condition badge correctly', () => {
    const refurbishedProduct = { ...mockProduct, condition: 'refurbished' as const };
    render(<ProductDetails product={refurbishedProduct} seller={mockSeller} />);
    
    expect(screen.getByText('Refurbished')).toBeInTheDocument();
  });

  it('should render sold status badge correctly', () => {
    const soldProduct = { ...mockProduct, status: 'sold' as const };
    render(<ProductDetails product={soldProduct} seller={mockSeller} />);
    
    expect(screen.getByText('Sold')).toBeInTheDocument();
  });

  it('should handle empty specifications', () => {
    const productWithoutSpecs = { ...mockProduct, specifications: {} };
    render(<ProductDetails product={productWithoutSpecs} seller={mockSeller} />);
    
    expect(screen.queryByText('Specifications')).not.toBeInTheDocument();
  });

  it('should handle seller without avatar', () => {
    const sellerWithoutAvatar = { ...mockSeller, avatar: undefined };
    render(<ProductDetails product={mockProduct} seller={sellerWithoutAvatar} />);
    
    // Should render default avatar icon
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should handle seller without business name', () => {
    const sellerWithoutBusiness = { ...mockSeller, businessName: undefined };
    render(<ProductDetails product={mockProduct} seller={sellerWithoutBusiness} />);
    
    expect(screen.queryByText('Tech Solutions')).not.toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should handle seller with zero rating', () => {
    const sellerWithoutRating = { ...mockSeller, rating: 0 };
    render(<ProductDetails product={mockProduct} seller={sellerWithoutRating} />);
    
    // Rating section should not be displayed
    expect(screen.queryByText(/sales/)).not.toBeInTheDocument();
  });

  it('should format specification keys properly', () => {
    const productWithCamelCase = {
      ...mockProduct,
      specifications: {
        operatingSystem: 'Windows 11',
        screenSize: '15.6"',
      },
    };
    render(<ProductDetails product={productWithCamelCase} seller={mockSeller} />);
    
    // Should convert camelCase to readable format
    expect(screen.getByText(/Operating System/)).toBeInTheDocument();
    expect(screen.getByText(/Screen Size/)).toBeInTheDocument();
  });

  it('should handle boolean specifications', () => {
    const productWithBoolean = {
      ...mockProduct,
      specifications: {
        touchscreen: true,
        backlit: false,
      },
    };
    render(<ProductDetails product={productWithBoolean} seller={mockSeller} />);
    
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  it('should render all star ratings correctly', () => {
    render(<ProductDetails product={mockProduct} seller={mockSeller} />);
    
    // Should render rating with stars - check for rating text
    expect(screen.getByText(/4\.5/)).toBeInTheDocument();
    expect(screen.getByText(/50 sales/)).toBeInTheDocument();
  });

  it('should have proper styling for active status', () => {
    render(<ProductDetails product={mockProduct} seller={mockSeller} />);
    
    const statusBadge = screen.getByText('Available');
    expect(statusBadge).toHaveClass('bg-green-100');
  });

  it('should have proper styling for sold status', () => {
    const soldProduct = { ...mockProduct, status: 'sold' as const };
    render(<ProductDetails product={soldProduct} seller={mockSeller} />);
    
    const statusBadge = screen.getByText('Sold');
    expect(statusBadge).toHaveClass('bg-red-100');
  });
});
