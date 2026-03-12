import { Metadata } from 'next';
import ProductGrid from '@/components/ProductGrid';

export const metadata: Metadata = {
  title: "Qavah-mart - Buy and Sell Computers in Ethiopia",
  description: "Discover the best deals on computers and computer accessories in Ethiopia. Browse laptops, desktops, components, peripherals, and more from trusted sellers.",
  keywords: ["computers Ethiopia", "buy laptops", "sell computers", "computer marketplace", "computer accessories", "gaming laptops", "business computers", "computer components"],
  alternates: {
    canonical: "https://qavah-mart.com",
  },
  openGraph: {
    title: "Qavah-mart - Buy and Sell Computers in Ethiopia",
    description: "Discover the best deals on computers and computer accessories in Ethiopia. Browse laptops, desktops, components, peripherals, and more.",
    type: "website",
    url: "https://qavah-mart.com",
    images: [
      {
        url: "/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Qavah-mart Homepage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qavah-mart - Buy and Sell Computers in Ethiopia",
    description: "Discover the best deals on computers and computer accessories in Ethiopia.",
    images: ["/twitter-home.jpg"],
  },
};

async function getFeaturedProducts() {
  try {
    // During build, skip fetching - just return empty array
    if (process.env.NODE_ENV === 'production' && !process.env.VERCEL_URL) {
      return [];
    }
    
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';
    
    const res = await fetch(`${baseUrl}/api/products-supabase?limit=8`, {
      next: { revalidate: 60 }, // Cache for 1 minute
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export default async function Home() {
  // Get products from database
  const featuredProducts = await getFeaturedProducts();

  // Generate JSON-LD structured data for Organization schema
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Qavah-mart',
    url: 'https://qavah-mart.com',
    logo: 'https://qavah-mart.com/logo.png',
    description: 'Your trusted marketplace for computers and computer accessories in Ethiopia',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ET',
    },
    sameAs: [
      'https://facebook.com/qavahmart',
      'https://twitter.com/qavahmart',
      'https://instagram.com/qavahmart',
    ],
  };

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      {/* Welcome Section */}
      <section className="text-center py-12 bg-primary-50" aria-labelledby="welcome-heading">
        <div className="container mx-auto px-4">
          <h1 id="welcome-heading" className="text-4xl font-bold text-primary-700 mb-4">
            Welcome to Qavah-mart
          </h1>
          <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
            Your trusted marketplace for computers and computer accessories in Ethiopia
          </p>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto px-4 py-12" aria-labelledby="featured-heading">
        <h2 id="featured-heading" className="text-3xl font-bold text-neutral-900 mb-6">
          Featured Products
        </h2>
        <ProductGrid 
          products={featuredProducts}
        />
      </section>
    </div>
  );
}
