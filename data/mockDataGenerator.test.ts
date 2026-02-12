/**
 * Tests for Mock Data Generator
 * 
 * Validates that the mock data generator creates valid data
 * that conforms to the type definitions and requirements.
 */

import {
  generateProduct,
  generateSeller,
  generateUser,
  generateReview,
  generateProductDataset,
  generateSellerDataset,
  generateUserDataset,
  generateReviewDataset,
  generateCompleteDataset,
} from './mockDataGenerator';
import {
  SUPPORTED_BRANDS,
  CATEGORY_STRUCTURE,
  CategorySlug,
} from '../types';

describe('Mock Data Generator', () => {
  describe('generateUser', () => {
    it('should generate a valid user', () => {
      const user = generateUser(false);
      
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('firstName');
      expect(user).toHaveProperty('lastName');
      expect(user).toHaveProperty('location');
      expect(user).toHaveProperty('createdAt');
      expect(user).toHaveProperty('isVerified');
      expect(user).toHaveProperty('isSeller');
      
      expect(typeof user.id).toBe('string');
      expect(typeof user.email).toBe('string');
      expect(user.email).toContain('@');
      expect(typeof user.firstName).toBe('string');
      expect(typeof user.lastName).toBe('string');
      expect(typeof user.isVerified).toBe('boolean');
      expect(typeof user.isSeller).toBe('boolean');
      expect(user.isSeller).toBe(false);
    });
  });

  describe('generateSeller', () => {
    it('should generate a valid seller', () => {
      const seller = generateSeller();
      
      expect(seller).toHaveProperty('id');
      expect(seller).toHaveProperty('email');
      expect(seller).toHaveProperty('businessType');
      expect(seller).toHaveProperty('verificationStatus');
      expect(seller).toHaveProperty('rating');
      expect(seller).toHaveProperty('totalSales');
      expect(seller).toHaveProperty('responseTime');
      expect(seller).toHaveProperty('joinedDate');
      expect(seller.isSeller).toBe(true);
      
      expect(['individual', 'business']).toContain(seller.businessType);
      expect(['pending', 'verified', 'rejected']).toContain(seller.verificationStatus);
      expect(seller.rating).toBeGreaterThanOrEqual(0);
      expect(seller.rating).toBeLessThanOrEqual(5);
      expect(seller.totalSales).toBeGreaterThanOrEqual(0);
      expect(seller.responseTime).toBeGreaterThan(0);
    });

    it('should have businessName for business type sellers', () => {
      // Generate multiple sellers to test
      const sellers = Array.from({ length: 20 }, () => generateSeller());
      const businessSellers = sellers.filter(s => s.businessType === 'business');
      
      businessSellers.forEach(seller => {
        expect(seller.businessName).toBeDefined();
        expect(typeof seller.businessName).toBe('string');
      });
    });
  });

  describe('generateProduct', () => {
    it('should generate a valid product', () => {
      const seller = generateSeller();
      const product = generateProduct('laptops', 'Gaming', 'ASUS', seller.id);
      
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('title');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('condition');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('subcategory');
      expect(product).toHaveProperty('brand');
      expect(product).toHaveProperty('specifications');
      expect(product).toHaveProperty('images');
      expect(product).toHaveProperty('location');
      expect(product).toHaveProperty('sellerId');
      expect(product).toHaveProperty('createdAt');
      expect(product).toHaveProperty('updatedAt');
      expect(product).toHaveProperty('status');
      expect(product).toHaveProperty('views');
      expect(product).toHaveProperty('favorites');
      
      expect(product.category).toBe('laptops');
      expect(product.subcategory).toBe('Gaming');
      expect(product.brand).toBe('ASUS');
      expect(product.sellerId).toBe(seller.id);
      expect(['new', 'used', 'refurbished']).toContain(product.condition);
      expect(['active', 'sold', 'inactive']).toContain(product.status);
      expect(product.price).toBeGreaterThan(0);
      expect(product.views).toBeGreaterThanOrEqual(0);
      expect(product.favorites).toBeGreaterThanOrEqual(0);
    });

    it('should generate laptop-specific specifications', () => {
      const seller = generateSeller();
      const product = generateProduct('laptops', 'Gaming', 'Dell', seller.id);
      
      expect(product.specifications).toHaveProperty('processor');
      expect(product.specifications).toHaveProperty('memory');
      expect(product.specifications).toHaveProperty('storage');
      expect(product.specifications).toHaveProperty('graphics');
      expect(product.specifications).toHaveProperty('screenSize');
      expect(product.specifications).toHaveProperty('operatingSystem');
      expect(product.specifications).toHaveProperty('warranty');
    });

    it('should generate desktop-specific specifications', () => {
      const seller = generateSeller();
      const product = generateProduct('desktop-computers', 'Gaming PCs', 'HP', seller.id);
      
      expect(product.specifications).toHaveProperty('processor');
      expect(product.specifications).toHaveProperty('memory');
      expect(product.specifications).toHaveProperty('storage');
      expect(product.specifications).toHaveProperty('graphics');
      expect(product.specifications).toHaveProperty('operatingSystem');
      expect(product.specifications).toHaveProperty('warranty');
    });

    it('should generate component-specific specifications', () => {
      const seller = generateSeller();
      const cpuProduct = generateProduct('computer-components', 'CPUs', 'Intel', seller.id);
      
      expect(cpuProduct.specifications).toHaveProperty('socket');
      expect(cpuProduct.specifications).toHaveProperty('cores');
      expect(cpuProduct.specifications).toHaveProperty('warranty');
    });

    it('should generate peripheral-specific specifications', () => {
      const seller = generateSeller();
      const monitorProduct = generateProduct('peripherals', 'Monitors', 'Samsung', seller.id);
      
      expect(monitorProduct.specifications).toHaveProperty('size');
      expect(monitorProduct.specifications).toHaveProperty('resolution');
      expect(monitorProduct.specifications).toHaveProperty('refreshRate');
      expect(monitorProduct.specifications).toHaveProperty('panelType');
      expect(monitorProduct.specifications).toHaveProperty('warranty');
    });
  });

  describe('generateReview', () => {
    it('should generate a valid review', () => {
      const review = generateReview('product-123', 'user-456', 'seller-789');
      
      expect(review).toHaveProperty('id');
      expect(review).toHaveProperty('productId');
      expect(review).toHaveProperty('userId');
      expect(review).toHaveProperty('sellerId');
      expect(review).toHaveProperty('rating');
      expect(review).toHaveProperty('title');
      expect(review).toHaveProperty('comment');
      expect(review).toHaveProperty('createdAt');
      expect(review).toHaveProperty('helpful');
      expect(review).toHaveProperty('verified');
      
      expect(review.productId).toBe('product-123');
      expect(review.userId).toBe('user-456');
      expect(review.sellerId).toBe('seller-789');
      expect(review.rating).toBeGreaterThanOrEqual(1);
      expect(review.rating).toBeLessThanOrEqual(5);
      expect(typeof review.title).toBe('string');
      expect(typeof review.comment).toBe('string');
      expect(review.helpful).toBeGreaterThanOrEqual(0);
      expect(typeof review.verified).toBe('boolean');
    });
  });

  describe('generateProductDataset', () => {
    it('should generate products for all categories', () => {
      const sellers = generateSellerDataset(10);
      const products = generateProductDataset(2, sellers);
      
      expect(products.length).toBeGreaterThan(0);
      
      // Check that all categories are represented
      const categories = Object.keys(CATEGORY_STRUCTURE);
      categories.forEach(category => {
        const categoryProducts = products.filter(p => p.category === category);
        expect(categoryProducts.length).toBeGreaterThan(0);
      });
    });

    it('should generate products for all brands', () => {
      const sellers = generateSellerDataset(10);
      const products = generateProductDataset(3, sellers);
      
      // Check that all brands are represented
      SUPPORTED_BRANDS.forEach(brand => {
        const brandProducts = products.filter(p => p.brand === brand);
        expect(brandProducts.length).toBeGreaterThan(0);
      });
    });

    it('should generate products for all subcategories', () => {
      const sellers = generateSellerDataset(10);
      const products = generateProductDataset(2, sellers);
      
      // Check that all subcategories are represented
      Object.entries(CATEGORY_STRUCTURE).forEach(([category, data]) => {
        data.subcategories.forEach(subcategory => {
          const subcategoryProducts = products.filter(
            p => p.category === category && p.subcategory === subcategory
          );
          expect(subcategoryProducts.length).toBeGreaterThan(0);
        });
      });
    });

    it('should only assign brands to appropriate categories', () => {
      const sellers = generateSellerDataset(10);
      const products = generateProductDataset(2, sellers);
      
      products.forEach(product => {
        // Intel, AMD, NVIDIA should only be in computer-components or software-licenses
        if (['Intel', 'AMD', 'NVIDIA'].includes(product.brand)) {
          expect(['computer-components', 'software-licenses']).toContain(product.category);
        }
        
        // Apple should only be in laptops, desktop-computers, or software-licenses
        if (product.brand === 'Apple') {
          expect(['laptops', 'desktop-computers', 'software-licenses']).toContain(product.category);
        }
      });
    });
  });

  describe('generateSellerDataset', () => {
    it('should generate the specified number of sellers', () => {
      const sellers = generateSellerDataset(10);
      expect(sellers.length).toBe(10);
      
      sellers.forEach(seller => {
        expect(seller.isSeller).toBe(true);
        expect(seller).toHaveProperty('businessType');
        expect(seller).toHaveProperty('verificationStatus');
        expect(seller).toHaveProperty('rating');
      });
    });
  });

  describe('generateUserDataset', () => {
    it('should generate the specified number of users', () => {
      const users = generateUserDataset(20);
      expect(users.length).toBe(20);
      
      users.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('firstName');
        expect(user).toHaveProperty('lastName');
      });
    });
  });

  describe('generateReviewDataset', () => {
    it('should generate reviews for products', () => {
      const sellers = generateSellerDataset(5);
      const products = Array.from({ length: 10 }, (_, i) => 
        generateProduct('laptops', 'Gaming', 'ASUS', sellers[i % sellers.length].id)
      );
      const users = generateUserDataset(10);
      
      const reviews = generateReviewDataset(products, users, 2);
      
      expect(reviews.length).toBeGreaterThan(0);
      
      reviews.forEach(review => {
        expect(review).toHaveProperty('productId');
        expect(review).toHaveProperty('userId');
        expect(review).toHaveProperty('sellerId');
        expect(review.rating).toBeGreaterThanOrEqual(1);
        expect(review.rating).toBeLessThanOrEqual(5);
      });
    });
  });

  describe('generateCompleteDataset', () => {
    it('should generate a complete dataset with all components', () => {
      const dataset = generateCompleteDataset();
      
      expect(dataset).toHaveProperty('sellers');
      expect(dataset).toHaveProperty('users');
      expect(dataset).toHaveProperty('products');
      expect(dataset).toHaveProperty('reviews');
      expect(dataset).toHaveProperty('locations');
      
      expect(dataset.sellers.length).toBeGreaterThan(0);
      expect(dataset.users.length).toBeGreaterThan(0);
      expect(dataset.products.length).toBeGreaterThan(0);
      expect(dataset.reviews.length).toBeGreaterThan(0);
      expect(dataset.locations.length).toBeGreaterThan(0);
    });

    it('should have valid relationships between entities', () => {
      const dataset = generateCompleteDataset();
      
      // Check that all products have valid seller IDs
      const sellerIds = new Set(dataset.sellers.map(s => s.id));
      dataset.products.forEach(product => {
        expect(sellerIds.has(product.sellerId)).toBe(true);
      });
      
      // Check that all reviews reference valid products and users
      const productIds = new Set(dataset.products.map(p => p.id));
      const userIds = new Set(dataset.users.map(u => u.id));
      
      dataset.reviews.forEach(review => {
        expect(productIds.has(review.productId)).toBe(true);
        expect(userIds.has(review.userId)).toBe(true);
        expect(sellerIds.has(review.sellerId)).toBe(true);
      });
    });
  });
});
