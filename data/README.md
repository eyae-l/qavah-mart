# Mock Data for Qavah-mart

This directory contains mock data generators and pre-generated sample datasets for the Qavah-mart computer e-commerce platform.

## Files

### `mockDataGenerator.ts`
Contains all the generator functions for creating realistic mock data:
- **Product generators**: Generate products across all 7 categories with realistic specifications
- **User generators**: Create user and seller profiles with Ethiopian names and locations
- **Review generators**: Generate reviews with ratings and comments
- **Helper functions**: Utilities for random data generation

### `mockData.ts`
Pre-generated mock dataset that can be imported throughout the application. Includes:
- 30 sellers (mix of individual and business sellers)
- 50 users (buyers and sellers)
- 500+ products across all categories and brands
- Reviews for active products
- Ethiopian locations

## Categories Covered

The mock data includes products from all seven main categories:

1. **Laptops** (Gaming, Business, Ultrabooks, Budget)
2. **Desktop Computers** (Gaming PCs, Workstations, All-in-One)
3. **Computer Components** (CPUs, GPUs, RAM, Storage, Motherboards)
4. **Peripherals** (Monitors, Keyboards, Mice, Speakers, Webcams)
5. **Networking Equipment** (Routers, Switches, Modems, Network Cards, Cables)
6. **Software & Licenses** (Operating Systems, Productivity Software, Security Software, Development Tools)
7. **Computer Accessories** (Bags & Cases, Cables & Adapters, Cooling, Power Supplies, Other Accessories)

## Brands Covered

All 16 supported brands are represented:

**Computer Manufacturers**: Dell, HP, Lenovo, ASUS, Acer, MSI, Apple

**Component Manufacturers**: Intel, AMD, NVIDIA

**Peripheral Brands**: Corsair, Kingston, Samsung, Logitech, Razer, SteelSeries

## Product Specifications

Products include realistic specifications based on their category:

### Laptops & Desktops
- Processors (Intel Core i3-i9, AMD Ryzen 5-9, Apple M1/M2)
- Memory (4GB to 64GB DDR4/DDR5)
- Storage (256GB to 4TB SSD/NVMe)
- Graphics (Integrated to RTX 4090)
- Operating Systems (Windows 11, macOS, Ubuntu)

### Components
- CPUs with socket types and core counts
- GPUs with memory specifications
- RAM with speed ratings
- Storage with capacity and interface types
- Motherboards with form factors and chipsets

### Peripherals
- Monitors with resolution, refresh rate, and panel type
- Keyboards (Membrane, Mechanical)
- Mice with DPI ranges
- Speakers with power ratings
- Webcams with resolution

### Networking
- Routers with speed and band specifications
- Switches with port counts and speeds
- Modems with connection types
- Network cards with speed ratings

## Locations

Products and users are distributed across 10 Ethiopian cities:
- Addis Ababa
- Dire Dawa
- Mekelle
- Gondar
- Bahir Dar
- Hawassa
- Adama
- Jimma
- Dessie
- Harar

## Usage

### Import the complete dataset:
```typescript
import { mockData } from '@/data/mockData';

const { sellers, users, products, reviews, locations } = mockData;
```

### Import specific datasets:
```typescript
import { mockProducts, mockSellers, mockReviews } from '@/data/mockData';
```

### Generate custom data:
```typescript
import { generateProduct, generateSeller, generateReview } from '@/data/mockDataGenerator';

const seller = generateSeller();
const product = generateProduct('laptops', 'Gaming', 'ASUS', seller.id);
const review = generateReview(product.id, userId, seller.id);
```

## Data Characteristics

- **Product Conditions**: Mix of new (40%), used (40%), and refurbished (20%)
- **Product Status**: 90% active, 10% sold/inactive
- **Seller Verification**: 70% verified, 30% pending
- **Review Ratings**: Skewed positive (70% are 4-5 stars)
- **Verified Purchases**: 80% of reviews are verified
- **Prices**: Realistic Ethiopian Birr (ETB) pricing based on category and condition

## Requirements Validation

This mock data satisfies the following requirements:
- **1.1-1.5**: All seven categories with proper subcategories
- **2.4**: All 16 supported brands represented
- **3.1**: Comprehensive product specifications
- **7.1**: Sample reviews with ratings and comments

## Notes

- All email addresses use `@example.com` domain
- Phone numbers use Ethiopian format (+251...)
- Dates are randomized within realistic ranges
- Product images are not included (will use placeholders)
- Prices are in Ethiopian Birr (ETB)
