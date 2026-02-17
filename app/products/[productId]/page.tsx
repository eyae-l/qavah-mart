import { notFound } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ChevronRight } from 'lucide-react';
import { mockProducts, mockSellers, mockReviews, mockUsers } from '@/data/mockData';
import ProductDetails from '@/components/ProductDetails';

// Dynamic imports for heavy components
const ProductImageGallery = dynamic(() => import('@/components/ProductImageGallery'), {
  loading: () => (
    <div className="w-full aspect-square bg-neutral-100 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-neutral-400">Loading gallery...</div>
    </div>
  ),
});

const ReviewSection = dynamic(() => import('@/components/ReviewSection'), {
  loading: () => (
    <div className="border-t border-neutral-200 pt-12 mb-12">
      <div className="h-64 bg-neutral-100 rounded-lg animate-pulse"></div>
    </div>
  ),
});

/**
 * Product Detail Page
 * 
 * Displays comprehensive product information with:
 * - SSR (Server-Side Rendering) for dynamic content
 * - Two-column layout (images left, details right)
 * - Responsive design (stacked on mobile)
 * - Product image gallery with zoom
 * - Comprehensive product details
 * - Seller information
 * - Customer reviews with rating distribution
 * - Related products section
 * 
 * Requirements: 3.1, 3.4, 3.5, 7.2, 7.3, 8.1, 10.3
 */

interface ProductDetailPageProps {
  params: Promise<{
    productId: string;
  }>;
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { productId } = await params;
  
  // Find product
  const product = mockProducts.find((p) => p.id === productId);
  
  if (!product) {
    return {
      title: 'Product Not Found | Qavah-mart',
      description: 'The product you are looking for could not be found.',
    };
  }
  
  const priceFormatted = new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: 'ETB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);
  
  return {
    title: `${product.title} - ${priceFormatted} | Qavah-mart`,
    description: product.description.substring(0, 160),
    keywords: [
      product.title,
      product.brand,
      product.category,
      product.subcategory,
      'Ethiopia',
      'computer',
      product.condition,
      product.location.city,
    ],
    alternates: {
      canonical: `https://qavah-mart.com/products/${productId}`,
    },
    openGraph: {
      title: `${product.title} - ${priceFormatted}`,
      description: product.description,
      type: 'website',
      url: `https://qavah-mart.com/products/${productId}`,
      images: product.images.length > 0 ? [
        {
          url: product.images[0],
          width: 800,
          height: 600,
          alt: product.title,
        },
      ] : [],
      siteName: 'Qavah-mart',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.title} - ${priceFormatted}`,
      description: product.description.substring(0, 200),
      images: product.images.length > 0 ? [product.images[0]] : [],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Product Detail Page Component
 */
export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { productId } = await params;
  
  // Find product
  const product = mockProducts.find((p) => p.id === productId);
  
  if (!product) {
    notFound();
    return null; // TypeScript safety
  }
  
  // Find seller
  const seller = mockSellers.find((s) => s.id === product.sellerId);
  
  if (!seller) {
    notFound();
    return null; // TypeScript safety
  }
  
  // Find product reviews
  const productReviews = mockReviews.filter((r) => r.productId === product.id);
  
  // Calculate average rating
  const averageRating = productReviews.length > 0
    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
    : 0;
  
  // Find related products
  // Priority: same subcategory > same brand > same category
  const relatedProducts = mockProducts
    .filter((p) => p.id !== product.id && p.status === 'active') // Exclude current product and inactive products
    .map((p) => {
      let score = 0;
      
      // Same subcategory gets highest priority
      if (p.subcategory === product.subcategory) score += 10;
      
      // Same brand gets medium priority
      if (p.brand === product.brand) score += 5;
      
      // Same category gets low priority
      if (p.category === product.category) score += 2;
      
      // Similar price range (within 20%)
      const priceDiff = Math.abs(p.price - product.price) / product.price;
      if (priceDiff < 0.2) score += 3;
      
      return { product: p, score };
    })
    .filter((item) => item.score > 0) // Only include products with some similarity
    .sort((a, b) => b.score - a.score) // Sort by relevance score
    .slice(0, 8) // Take top 8 related products
    .map((item) => item.product);
  
  // Generate JSON-LD structured data for Product schema
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    image: product.images.length > 0 ? product.images : undefined,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'ETB',
      availability: product.status === 'active' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: product.condition === 'new' 
        ? 'https://schema.org/NewCondition' 
        : product.condition === 'refurbished'
        ? 'https://schema.org/RefurbishedCondition'
        : 'https://schema.org/UsedCondition',
      seller: {
        '@type': 'Organization',
        name: `${seller.firstName} ${seller.lastName}`,
      },
    },
    ...(productReviews.length > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating.toFixed(1),
        reviewCount: productReviews.length,
        bestRating: '5',
        worstRating: '1',
      },
    }),
    ...(productReviews.length > 0 && {
      review: productReviews.slice(0, 5).map((review) => {
        const reviewer = mockUsers.find((u) => u.id === review.userId);
        return {
          '@type': 'Review',
          reviewRating: {
            '@type': 'Rating',
            ratingValue: review.rating,
            bestRating: '5',
            worstRating: '1',
          },
          author: {
            '@type': 'Person',
            name: reviewer ? `${reviewer.firstName} ${reviewer.lastName}` : 'Anonymous',
          },
          datePublished: review.createdAt,
          reviewBody: review.comment,
          ...(review.title && { headline: review.title }),
        };
      }),
    }),
  };
  
  // Generate JSON-LD structured data for BreadcrumbList schema
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://qavah-mart.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: product.category.replace(/-/g, ' '),
        item: `https://qavah-mart.com/categories/${product.category}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: product.title,
        item: `https://qavah-mart.com/products/${productId}`,
      },
    ],
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
          <Link
            href="/"
            className="text-neutral-600 hover:text-primary-700 transition-colors"
          >
            Home
          </Link>
          <ChevronRight className="w-4 h-4 text-neutral-400" aria-hidden="true" />
          <Link
            href={`/categories/${product.category}`}
            className="text-neutral-600 hover:text-primary-700 transition-colors capitalize"
          >
            {product.category.replace(/-/g, ' ')}
          </Link>
          <ChevronRight className="w-4 h-4 text-neutral-400" aria-hidden="true" />
          <span className="text-neutral-900 font-medium truncate" aria-current="page">{product.title}</span>
        </nav>
        
        {/* Product Content - Two Column Layout */}
        <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Left Column - Image Gallery */}
          <section aria-label="Product images">
            <ProductImageGallery
              images={product.images}
              productTitle={product.title}
            />
          </section>
          
          {/* Right Column - Product Details */}
          <section aria-labelledby="product-details-heading">
            <h1 id="product-details-heading" className="sr-only">Product Details</h1>
            <ProductDetails
              product={product}
              seller={seller}
            />
          </section>
        </article>
        
        {/* Reviews Section */}
        <ReviewSection
          productId={product.id}
          sellerId={product.sellerId}
          reviews={productReviews}
          users={mockUsers}
          averageRating={averageRating}
        />
        
        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="border-t border-neutral-200 pt-12" aria-labelledby="related-products-heading">
            <h2 id="related-products-heading" className="text-2xl font-bold text-neutral-900 mb-6">
              Related Products
            </h2>
            
            {/* Horizontal Scrollable Grid */}
            <div className="relative">
              <div className="overflow-x-auto pb-4 -mx-4 px-4">
                <div className="flex gap-4 min-w-min" role="list">
                  {relatedProducts.map((relatedProduct) => (
                    <article key={relatedProduct.id} className="flex-shrink-0 w-64" role="listitem">
                      <Link
                        href={`/products/${relatedProduct.id}`}
                        className="block group"
                      >
                        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200">
                          {/* Product Image */}
                          <div className="relative w-full h-48 bg-primary-50">
                            {relatedProduct.images.length > 0 ? (
                              <img
                                src={relatedProduct.images[0]}
                                alt={relatedProduct.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <svg
                                  className="w-16 h-16 text-primary-300"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  aria-hidden="true"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                              </div>
                            )}
                            
                            {/* Condition Badge */}
                            <div className="absolute top-2 left-2">
                              <span
                                className={`inline-block px-2 py-1 text-xs font-semibold rounded border ${
                                  relatedProduct.condition === 'new'
                                    ? 'bg-green-100 text-green-800 border-green-200'
                                    : relatedProduct.condition === 'used'
                                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                                    : 'bg-orange-100 text-orange-800 border-orange-200'
                                }`}
                              >
                                {relatedProduct.condition.charAt(0).toUpperCase() + relatedProduct.condition.slice(1)}
                              </span>
                            </div>
                          </div>
                          
                          {/* Product Info */}
                          <div className="p-4">
                            <h3 className="text-sm font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-700 transition-colors">
                              {relatedProduct.title}
                            </h3>
                            
                            <div className="text-lg font-bold text-primary-700 mb-2">
                              {new Intl.NumberFormat('en-ET', {
                                style: 'currency',
                                currency: 'ETB',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              }).format(relatedProduct.price)}
                            </div>
                            
                            <div className="text-xs text-neutral-600">
                              {relatedProduct.location.city}, {relatedProduct.location.region}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
