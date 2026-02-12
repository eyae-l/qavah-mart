import { render, screen } from '@testing-library/react';
import { notFound } from 'next/navigation';
import ProductDetailPage, { generateMetadata } from './page';
import { mockProducts, mockSellers, mockReviews, mockUsers } from '@/data/mockData';

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

// Mock ProductImageGallery component
jest.mock('@/components/ProductImageGallery', () => ({
  __esModule: true,
  default: ({ images, productTitle }: { images: string[]; productTitle: string }) => (
    <div data-testid="product-image-gallery">
      {images.length > 0 ? (
        <>
          <img src={images[0]} alt={productTitle} />
          {images.slice(1, 5).map((img, idx) => (
            <img key={idx} src={img} alt={`${productTitle} - Image ${idx + 2}`} />
          ))}
        </>
      ) : (
        <div className="bg-primary-100">No Images Available</div>
      )}
    </div>
  ),
}));

// Mock ProductDetails component
jest.mock('@/components/ProductDetails', () => ({
  __esModule: true,
  default: ({ product, seller }: any) => (
    <div data-testid="product-details">
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      <div>{new Intl.NumberFormat('en-ET', { style: 'currency', currency: 'ETB' }).format(product.price)}</div>
      <span>{product.condition.charAt(0).toUpperCase() + product.condition.slice(1)}</span>
      <span>{product.status === 'active' ? 'Available' : product.status === 'sold' ? 'Sold Out' : product.status}</span>
      <div>Description</div>
      {Object.keys(product.specifications).length > 0 && <div>Specifications</div>}
      {Object.entries(product.specifications).map(([key, value]) => (
        <div key={key}>{String(value)}</div>
      ))}
      <div>Seller Information</div>
      <div>{seller.firstName} {seller.lastName}</div>
      <div>{product.location.city}, {product.location.region}</div>
      {seller.isVerified && <div>Verified Seller</div>}
      <button disabled={product.status === 'sold'}>
        {product.status === 'sold' ? 'Sold Out' : 'Contact Seller'}
      </button>
      <div>Product ID: {product.id}</div>
      <div>Listed: {new Date(product.createdAt).toLocaleDateString()}</div>
      <div>Views: {product.views}</div>
    </div>
  ),
}));

// Mock RatingDisplay component
jest.mock('@/components/RatingDisplay', () => ({
  __esModule: true,
  default: ({ rating, reviewCount }: any) => (
    <div data-testid="rating-display">
      Rating: {rating.toFixed(1)} ({reviewCount} reviews)
    </div>
  ),
}));

// Mock RatingDistribution component
jest.mock('@/components/RatingDistribution', () => ({
  __esModule: true,
  default: ({ reviews }: any) => (
    <div data-testid="rating-distribution">
      Distribution of {reviews.length} reviews
    </div>
  ),
}));

// Mock ReviewList component
jest.mock('@/components/ReviewList', () => ({
  __esModule: true,
  default: ({ reviews }: any) => (
    <div data-testid="review-list">
      {reviews.map((review: any) => (
        <div key={review.id} data-testid="review-item">
          {review.title}
        </div>
      ))}
    </div>
  ),
}));

describe('ProductDetailPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateMetadata', () => {
    it('should generate metadata for valid product', async () => {
      const product = mockProducts[0];
      const metadata = await generateMetadata({
        params: Promise.resolve({ productId: product.id }),
      });
      
      expect(metadata.title).toContain(product.title);
      expect(metadata.title).toContain('Qavah-mart');
      // Description should be truncated to 160 characters for SEO best practices
      expect(metadata.description).toBe(product.description.substring(0, 160));
      expect(metadata.keywords).toContain(product.title);
      expect(metadata.keywords).toContain(product.brand);
    });

    it('should return not found metadata for invalid product', async () => {
      const metadata = await generateMetadata({
        params: Promise.resolve({ productId: 'invalid-id' }),
      });
      
      expect(metadata.title).toBe('Product Not Found | Qavah-mart');
    });
  });

  describe('ProductDetailPage Component', () => {
    it('should render product detail page', async () => {
      const product = mockProducts[0];
      
      const result = await ProductDetailPage({ params: Promise.resolve({ productId: product.id }) });
      render(result);
      
      expect(screen.getByRole('heading', { level: 1, name: product.title })).toBeInTheDocument();
      expect(screen.getByText(product.description)).toBeInTheDocument();
    });

    it('should call notFound for invalid product ID', async () => {
      const result = await ProductDetailPage({ params: Promise.resolve({ productId: 'invalid-id' }) });
      render(result);
      
      expect(notFound).toHaveBeenCalled();
    });

    it('should display breadcrumb navigation', async () => {
      const product = mockProducts[0];
      
      const result = await ProductDetailPage({ params: Promise.resolve({ productId: product.id }) });
      render(result);
      
      expect(screen.getByText('Home')).toBeInTheDocument();
      const categoryLink = screen.getByText(product.category.replace(/-/g, ' '), { exact: false });
      expect(categoryLink).toBeInTheDocument();
    });

    it('should display related products section', async () => {
      const product = mockProducts[0];
      
      const result = await ProductDetailPage({ params: Promise.resolve({ productId: product.id }) });
      render(result);
      
      expect(screen.getByText('Related Products')).toBeInTheDocument();
    });
  });

  describe('Reviews Section', () => {
    it('displays customer reviews section', async () => {
      const product = mockProducts[0];
      const params = Promise.resolve({ productId: product.id });

      render(await ProductDetailPage({ params }));

      expect(screen.getByText('Customer Reviews')).toBeInTheDocument();
    });

    it('displays rating summary when reviews exist', async () => {
      const productWithReviews = mockProducts.find(p => 
        mockReviews.some(r => r.productId === p.id)
      );

      if (productWithReviews) {
        const params = Promise.resolve({ productId: productWithReviews.id });
        render(await ProductDetailPage({ params }));

        expect(screen.getByTestId('rating-display')).toBeInTheDocument();
        expect(screen.getByTestId('rating-distribution')).toBeInTheDocument();
        expect(screen.getByTestId('review-list')).toBeInTheDocument();
      }
    });

    it('displays empty state when no reviews exist', async () => {
      const productWithoutReviews = mockProducts.find(p => 
        !mockReviews.some(r => r.productId === p.id)
      );

      if (productWithoutReviews) {
        const params = Promise.resolve({ productId: productWithoutReviews.id });
        render(await ProductDetailPage({ params }));

        expect(screen.getByText(/No reviews yet for this product/)).toBeInTheDocument();
        expect(screen.getByText(/Be the first to share your experience!/)).toBeInTheDocument();
      }
    });

    it('calculates and displays average rating correctly', async () => {
      const productWithReviews = mockProducts.find(p => 
        mockReviews.some(r => r.productId === p.id)
      );

      if (productWithReviews) {
        const params = Promise.resolve({ productId: productWithReviews.id });
        const productReviews = mockReviews.filter(r => r.productId === productWithReviews.id);
        const averageRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;

        render(await ProductDetailPage({ params }));

        expect(screen.getByText(averageRating.toFixed(1))).toBeInTheDocument();
      }
    });

    it('displays review count', async () => {
      const productWithReviews = mockProducts.find(p => 
        mockReviews.some(r => r.productId === p.id)
      );

      if (productWithReviews) {
        const params = Promise.resolve({ productId: productWithReviews.id });
        const productReviews = mockReviews.filter(r => r.productId === productWithReviews.id);

        render(await ProductDetailPage({ params }));

        const reviewText = productReviews.length === 1 ? 'review' : 'reviews';
        expect(screen.getByText(new RegExp(`Based on ${productReviews.length} ${reviewText}`))).toBeInTheDocument();
      }
    });

    it('displays rating breakdown section', async () => {
      const productWithReviews = mockProducts.find(p => 
        mockReviews.some(r => r.productId === p.id)
      );

      if (productWithReviews) {
        const params = Promise.resolve({ productId: productWithReviews.id });
        render(await ProductDetailPage({ params }));

        expect(screen.getByText('Rating Breakdown')).toBeInTheDocument();
      }
    });
  });
});
