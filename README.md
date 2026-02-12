# Qavah-mart - Computer E-commerce Marketplace

A specialized computer e-commerce platform built with Next.js that provides a marketplace for computers and computer accessories in Ethiopia.

## Tech Stack

- **Framework**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom brown/white theme
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Testing**: fast-check for property-based testing
- **Image Optimization**: Next.js Image component with WebP/AVIF support

## Project Structure

```
qavah-mart/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── products/
│   │   ├── search/
│   │   ├── users/
│   │   └── reviews/
│   ├── categories/               # Category pages
│   │   └── [category]/
│   │       └── [subcategory]/
│   ├── products/                 # Product detail pages
│   │   └── [productId]/
│   ├── user/                     # User pages
│   │   ├── login/
│   │   ├── register/
│   │   ├── profile/
│   │   └── dashboard/
│   ├── sell/                     # Seller pages
│   │   ├── new/
│   │   └── edit/[listingId]/
│   ├── search/                   # Search results
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── Header.tsx
│   ├── CategoryNav.tsx
│   └── Footer.tsx
├── lib/                          # Utility functions
├── types/                        # TypeScript type definitions
├── data/                         # Mock data
└── public/                       # Static assets
```

## Color Theme

The application uses a professional brown and white color scheme:

- **Primary Brown**: `#9c6644` (primary-700)
- **Light Brown**: `#c9a997` (primary-500)
- **Dark Brown**: `#7f5539` (primary-800)
- **White**: `#ffffff`
- **Neutral Scale**: From `#fafafa` to `#171717`

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Features

- **Product Catalog**: Browse computers by 7 main categories
- **Search & Filter**: Advanced search with filters for price, brand, condition, and location
- **User Authentication**: Register, login, and manage profiles
- **Seller Dashboard**: Post and manage product listings
- **Reviews & Ratings**: Rate products and sellers
- **Location-Based**: Filter products by location
- **Responsive Design**: Optimized for desktop, tablet, and mobile
- **SEO Optimized**: Meta tags, structured data, and semantic HTML
- **Performance**: Image optimization, lazy loading, and code splitting

## Development

### Requirements Mapping

This project implements requirements 8.3, 10.2, and 10.3:
- **8.3**: Professional brown and white color scheme
- **10.2**: SEO best practices with meta tags
- **10.3**: Image optimization for web delivery

### Next Steps

See `.kiro/specs/qavah-mart/tasks.md` for the complete implementation plan.

## License

All rights reserved.

