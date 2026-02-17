import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import Footer from "@/components/Footer";
import { Providers } from "@/contexts/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
  preload: false, // Only preload primary font
});

export const metadata: Metadata = {
  title: "Qavah-mart - Computer E-commerce Marketplace",
  description: "Buy and sell computers, computer components, and accessories in Ethiopia. Find laptops, desktops, peripherals, and more.",
  keywords: ["computers", "laptops", "desktops", "computer accessories", "Ethiopia", "e-commerce", "marketplace", "Qavah-mart", "computer components", "peripherals", "networking equipment"],
  authors: [{ name: "Qavah-mart" }],
  creator: "Qavah-mart",
  publisher: "Qavah-mart",
  openGraph: {
    type: "website",
    locale: "en_ET",
    url: "https://qavah-mart.com",
    siteName: "Qavah-mart",
    title: "Qavah-mart - Computer E-commerce Marketplace in Ethiopia",
    description: "Buy and sell computers, computer components, and accessories in Ethiopia. Find laptops, desktops, peripherals, and more.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Qavah-mart - Computer E-commerce Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Qavah-mart - Computer E-commerce Marketplace",
    description: "Buy and sell computers, computer components, and accessories in Ethiopia.",
    images: ["/twitter-image.jpg"],
    creator: "@qavahmart",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

/**
 * Root layout component for Qavah-mart
 * Provides consistent header, navigation, and footer across all pages
 * Wraps the app with context providers for global state management
 * 
 * Requirements: 8.3, 9.1, 9.5
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-white`}
      >
        <Providers>
          <Header />
          <CategoryNav />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
