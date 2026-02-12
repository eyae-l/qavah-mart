import Link from 'next/link';
import { Metadata } from 'next';
import ProductGrid from '@/components/ProductGrid';
import { mockProducts } from '@/data/mockData';

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

export default function Home() {
  // Get first 8 products for featured section
  const featuredProducts = mockProducts.slice(0, 8);

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
