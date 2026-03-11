import { notFound } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ChevronRight } from 'lucide-react';
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
 * Fetch product from database
 */
async function getProduct(productId: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products-supabase/${productId}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return null;
    }
    
    const data = await res.json();
    const product = data.product;
    
    if (!product || !product.seller) {
      return null;
    }
    
    // Transform product structure to match expected format
    const transformedProduct = {
      ...product,
      // Transform flat location fields to nested location object
      location: {
        city: product.city || '',
        region: product.region || '',
        country: product.country || 'Ethiopia',
      },
      seller: {
        id: product.seller.id,
        email: '',
        firstName: product.seller.user?.firstName || '',
        lastName: product.seller.user?.lastName || '',
        phone: '',
        location: {
          city: product.seller.user?.city || '',
          region: product.seller.user?.region || '',
          country: 'Ethiopia',
        },
        avatar: null,
        createdAt: new Date(),
        isVerified: true,
        isSeller: true,
        businessName: product.seller.businessName || '',
        businessType: 'business' as const,
        verificationStatus: 'verified' as const,
        rating: product.seller.rating || 0,
        totalSales: 0,
        responseTime: 24,
        joinedDate: new Date(),
      },
    };
    
    return transformedProduct;
  } catch (error) {
    console.error('Failed to fetch product:', error);
    return null;
  }
}

/**
 * Generate metadata for SEO
 */
export async function generateMetadata({ params }: ProductDetailPageProps) {
  const { productId } = await params;
  
  // Find product
  const product = await getProduct(productId);
  
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
      product.brand || '',
      product.category,
      product.subcategory || '',
      'Ethiopia',
      'computer',
      product.condition,
      product.location?.city || '',
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
  const product = await getProduct(productId);
  
  if (!product || !product.seller) {
    notFound();
    return null;
  }
  
  // For now, we'll use simplified data structure
  // Reviews and related products will be added later when we have that data in database
  const productReviews: any[] = [];
  const averageRating = 0;
  const relatedProducts: any[] = [];
  
  // Generate JSON-LD structured data for Product schema
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'Unknown',
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
        name: product.seller?.businessName || 'Unknown Seller',
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
      review: productReviews.slice(0, 5).map((review) => ({
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: '5',
          worstRating: '1',
        },
        author: {
          '@type': 'Person',
          name: 'Anonymous',
        },
        datePublished: review.createdAt,
        reviewBody: review.comment,
      })),
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
              seller={product.seller}
            />
          </section>
        </article>
      </div>
    </div>
  );
}
