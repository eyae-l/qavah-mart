/**
 * Tests for pre-generated mock data
 * 
 * Validates that the mock data can be imported and used correctly
 */

import { mockData, mockProducts, mockSellers, mockUsers, mockReviews, mockLocations, CATEGORY_STRUCTURE } from './mockData';
import { SUPPORTED_BRANDS } from '../types';

describe('Mock Data', () => {
  describe('mockData export', () => {
    it('should export complete dataset', () => {
      expect(mockData).toBeDefined();
      expect(mockData).toHaveProperty('sellers');
      expect(mockData).toHaveProperty('users');
      expect(mockData).toHaveProperty('products');
      expect(mockData).toHaveProperty('reviews');
      expect(mockData).toHaveProperty('locations');
    });
  });

  describe('mockProducts', () => {
    it('should be an array of products', () => {
      expect(Array.isArray(mockProducts)).toBe(true);
      expect(mockProducts.length).toBeGreaterThan(0);
    });

    it('should have products from all categories', () => {
      const categories = Object.keys(CATEGORY_STRUCTURE);
      categories.forEach(category => {
        const categoryProducts = mockProducts.filter(p => p.category === category);
        expect(categoryProducts.length).toBeGreaterThan(0);
      });
    });

    it('should have products from all brands', () => {
      SUPPORTED_BRANDS.forEach(brand => {
        const brandProducts = mockProducts.filter(p => p.brand === brand);
        expect(brandProducts.length).toBeGreaterThan(0);
      });
    });

    it('should have valid product structure', () => {
      const product = mockProducts[0];
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('title');
      expect(product).toHaveProperty('description');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('condition');
      expect(product).toHaveProperty('category');
      expect(product).toHaveProperty('subcategory');
      expect(product).toHaveProperty('brand');
      expect(product).toHaveProperty('specifications');
      expect(product).toHaveProperty('location');
      expect(product).toHaveProperty('sellerId');
    });
  });

  describe('mockSellers', () => {
    it('should be an array of sellers', () => {
      expect(Array.isArray(mockSellers)).toBe(true);
      expect(mockSellers.length).toBeGreaterThan(0);
    });

    it('should have valid seller structure', () => {
      const seller = mockSellers[0];
      expect(seller).toHaveProperty('id');
      expect(seller).toHaveProperty('email');
      expect(seller).toHaveProperty('firstName');
      expect(seller).toHaveProperty('lastName');
      expect(seller).toHaveProperty('businessType');
      expect(seller).toHaveProperty('verificationStatus');
      expect(seller).toHaveProperty('rating');
      expect(seller).toHaveProperty('totalSales');
      expect(seller.isSeller).toBe(true);
    });
  });

  describe('mockUsers', () => {
    it('should be an array of users', () => {
      expect(Array.isArray(mockUsers)).toBe(true);
      expect(mockUsers.length).toBeGreaterThan(0);
    });

    it('should have valid user structure', () => {
      const user = mockUsers[0];
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('firstName');
      expect(user).toHaveProperty('lastName');
      expect(user).toHaveProperty('location');
      expect(user).toHaveProperty('isVerified');
      expect(user).toHaveProperty('isSeller');
    });
  });

  describe('mockReviews', () => {
    it('should be an array of reviews', () => {
      expect(Array.isArray(mockReviews)).toBe(true);
      expect(mockReviews.length).toBeGreaterThan(0);
    });

    it('should have valid review structure', () => {
      const review = mockReviews[0];
      expect(review).toHaveProperty('id');
      expect(review).toHaveProperty('productId');
      expect(review).toHaveProperty('userId');
      expect(review).toHaveProperty('sellerId');
      expect(review).toHaveProperty('rating');
      expect(review).toHaveProperty('title');
      expect(review).toHaveProperty('comment');
      expect(review.rating).toBeGreaterThanOrEqual(1);
      expect(review.rating).toBeLessThanOrEqual(5);
    });

    it('should reference valid products', () => {
      const productIds = new Set(mockProducts.map(p => p.id));
      mockReviews.forEach(review => {
        expect(productIds.has(review.productId)).toBe(true);
      });
    });

    it('should reference valid users', () => {
      const userIds = new Set(mockUsers.map(u => u.id));
      mockReviews.forEach(review => {
        expect(userIds.has(review.userId)).toBe(true);
      });
    });

    it('should reference valid sellers', () => {
      const sellerIds = new Set(mockSellers.map(s => s.id));
      mockReviews.forEach(review => {
        expect(sellerIds.has(review.sellerId)).toBe(true);
      });
    });
  });

  describe('mockLocations', () => {
    it('should be an array of locations', () => {
      expect(Array.isArray(mockLocations)).toBe(true);
      expect(mockLocations.length).toBeGreaterThan(0);
    });

    it('should have valid location structure', () => {
      const location = mockLocations[0];
      expect(location).toHaveProperty('city');
      expect(location).toHaveProperty('region');
      expect(location).toHaveProperty('country');
      expect(location.country).toBe('Ethiopia');
    });

    it('should have Ethiopian cities', () => {
      const cities = mockLocations.map(l => l.city);
      expect(cities).toContain('Addis Ababa');
      expect(cities).toContain('Dire Dawa');
    });
  });

  describe('Data relationships', () => {
    it('should have products with valid seller IDs', () => {
      const sellerIds = new Set(mockSellers.map(s => s.id));
      mockProducts.forEach(product => {
        expect(sellerIds.has(product.sellerId)).toBe(true);
      });
    });

    it('should have consistent data across exports', () => {
      expect(mockData.products).toEqual(mockProducts);
      expect(mockData.sellers).toEqual(mockSellers);
      expect(mockData.users).toEqual(mockUsers);
      expect(mockData.reviews).toEqual(mockReviews);
      expect(mockData.locations).toEqual(mockLocations);
    });
  });
});
