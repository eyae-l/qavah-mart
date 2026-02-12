/**
 * @jest-environment node
 */
import { GET } from './route';
import { NextRequest } from 'next/server';
import { mockProducts } from '@/data/mockData';

describe('Search API Route', () => {
  // Helper function to create a mock request
  function createMockRequest(searchParams: Record<string, string> = {}) {
    const url = new URL('http://localhost:3000/api/search');
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    
    return new NextRequest(url);
  }

  describe('GET /api/search', () => {
    it('should return all active products when no query provided', async () => {
      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.products).toBeDefined();
      expect(data.totalCount).toBeDefined();
      expect(data.facets).toBeDefined();
      
      // Should only include active products
      const activeProducts = mockProducts.filter((p) => p.status === 'active');
      expect(data.totalCount).toBe(activeProducts.length);
    });

    it('should search in product titles', async () => {
      const request = createMockRequest({ q: 'Dell' });
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.products.length).toBeGreaterThan(0);
      
      // All results should contain 'Dell' in title, description, or specs
      data.products.forEach((product: any) => {
        const hasMatch = 
          product.title.toLowerCase().includes('dell') ||
          product.description.toLowerCase().includes('dell') ||
          Object.values(product.specifications).some((v: any) => 
            typeof v === 'string' && v.toLowerCase().includes('dell')
          );
        expect(hasMatch).toBe(true);
      });
    });

    it('should search in product descriptions', async () => {
      const request = createMockRequest({ q: 'performance' });
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.products.length).toBeGreaterThan(0);
    });

    it('should search in product specifications', async () => {
      const request = createMockRequest({ q: 'Intel' });
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.products.length).toBeGreaterThan(0);
    });

    it('should filter by category', async () => {
      const request = createMockRequest({ category: 'laptops' });
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      data.products.forEach((product: any) => {
        expect(product.category).toBe('laptops');
      });
    });

    it('should filter by subcategory', async () => {
      const request = createMockRequest({ 
        category: 'laptops',
        subcategory: 'Gaming'
      });
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      data.products.forEach((product: any) => {
        expect(product.category).toBe('laptops');
        expect(product.subcategory).toBe('Gaming');
      });
    });

    it('should filter by price range', async () => {
      const request = createMockRequest({ 
        priceMin: '10000',
        priceMax: '50000'
      });
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      data.products.forEach((product: any) => {
        expect(product.price).toBeGreaterThanOrEqual(10000);
        expect(product.price).toBeLessThanOrEqual(50000);
      });
    });

    it('should filter by condition', async () => {
      const request = createMockRequest({ condition: 'new' });
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      data.products.forEach((product: any) => {
        expect(product.condition).toBe('new');
      });
    });

    it('should filter by multiple conditions', async () => {
      const request = createMockRequest({ condition: 'new,used' });
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      data.products.forEach((product: any) => {
        expect(['new', 'used']).toContain(product.condition);
      });
    });

    it('should filter by brand', async () => {
      const request = createMockRequest({ brands: 'Dell' });
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      data.products.forEach((product: any) => {
        expect(product.brand).toBe('Dell');
      });
    });

    it('should filter by multiple brands', async () => {
      const request = createMockRequest({ brands: 'Dell,HP' });
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      data.products.forEach((product: any) => {
        expect(['Dell', 'HP']).toContain(product.brand);
      });
    });

    it('should filter by location', async () => {
      const request = createMockRequest({ location: 'Addis Ababa' });
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      data.products.forEach((product: any) => {
        expect(product.location.city).toBe('Addis Ababa');
      });
    });

    it('should combine multiple filters', async () => {
      const request = createMockRequest({ 
        q: 'laptop',
        category: 'laptops',
        priceMin: '10000',
        priceMax: '100000',
        condition: 'new'
      });
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      data.products.forEach((product: any) => {
        expect(product.category).toBe('laptops');
        expect(product.price).toBeGreaterThanOrEqual(10000);
        expect(product.price).toBeLessThanOrEqual(100000);
        expect(product.condition).toBe('new');
      });
    });

    it('should sort by price (low to high)', async () => {
      const request = createMockRequest({ sortBy: 'price-low' });
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      
      // Check if sorted correctly
      for (let i = 1; i < data.products.length; i++) {
        expect(data.products[i].price).toBeGreaterThanOrEqual(data.products[i - 1].price);
      }
    });

    it('should sort by price (high to low)', async () => {
      const request = createMockRequest({ sortBy: 'price-high' });
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      
      // Check if sorted correctly
      for (let i = 1; i < data.products.length; i++) {
        expect(data.products[i].price).toBeLessThanOrEqual(data.products[i - 1].price);
      }
    });

    it('should sort by newest', async () => {
      const request = createMockRequest({ sortBy: 'newest' });
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      
      // Check if sorted correctly
      for (let i = 1; i < data.products.length; i++) {
        const date1 = new Date(data.products[i - 1].createdAt).getTime();
        const date2 = new Date(data.products[i].createdAt).getTime();
        expect(date2).toBeLessThanOrEqual(date1);
      }
    });

    it('should sort by oldest', async () => {
      const request = createMockRequest({ sortBy: 'oldest' });
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      
      // Check if sorted correctly
      for (let i = 1; i < data.products.length; i++) {
        const date1 = new Date(data.products[i - 1].createdAt).getTime();
        const date2 = new Date(data.products[i].createdAt).getTime();
        expect(date2).toBeGreaterThanOrEqual(date1);
      }
    });

    it('should sort by relevance when query provided', async () => {
      const request = createMockRequest({ 
        q: 'Dell',
        sortBy: 'relevance'
      });
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      
      // First result should have 'Dell' in title (highest relevance)
      if (data.products.length > 0) {
        expect(data.products[0].title.toLowerCase()).toContain('dell');
      }
    });

    it('should paginate results', async () => {
      const request1 = createMockRequest({ page: '1', limit: '5' });
      const response1 = await GET(request1);
      const data1 = await response1.json();
      
      const request2 = createMockRequest({ page: '2', limit: '5' });
      const response2 = await GET(request2);
      const data2 = await response2.json();
      
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(data1.products.length).toBeLessThanOrEqual(5);
      expect(data2.products.length).toBeLessThanOrEqual(5);
      
      // Products should be different
      if (data1.products.length > 0 && data2.products.length > 0) {
        expect(data1.products[0].id).not.toBe(data2.products[0].id);
      }
    });

    it('should return facets for filtering', async () => {
      const request = createMockRequest({ q: 'laptop' });
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.facets).toBeDefined();
      expect(data.facets.categories).toBeDefined();
      expect(data.facets.brands).toBeDefined();
      expect(data.facets.conditions).toBeDefined();
      expect(data.facets.priceRanges).toBeDefined();
      
      // Facets should have counts
      expect(Array.isArray(data.facets.categories)).toBe(true);
      expect(Array.isArray(data.facets.brands)).toBe(true);
      expect(Array.isArray(data.facets.conditions)).toBe(true);
      expect(Array.isArray(data.facets.priceRanges)).toBe(true);
    });

    it('should return search suggestions', async () => {
      const request = createMockRequest({ q: 'Dell' });
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.suggestions).toBeDefined();
      expect(Array.isArray(data.suggestions)).toBe(true);
    });

    it('should return empty results for non-matching query', async () => {
      const request = createMockRequest({ q: 'xyznonexistentproduct123' });
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      expect(data.products).toEqual([]);
      expect(data.totalCount).toBe(0);
    });

    it('should validate pagination parameters', async () => {
      const request = createMockRequest({ page: '0', limit: '10' });
      const response = await GET(request);
      
      expect(response.status).toBe(400);
    });

    it('should validate limit parameter', async () => {
      const request = createMockRequest({ page: '1', limit: '200' });
      const response = await GET(request);
      
      expect(response.status).toBe(400);
    });

    it('should handle errors gracefully', async () => {
      // Create a request that might cause an error
      const request = createMockRequest({ priceMin: 'invalid' });
      const response = await GET(request);
      
      // Should still return a response (either 200 with filtered results or 500)
      expect([200, 400, 500]).toContain(response.status);
    });

    it('should only return active products', async () => {
      const request = createMockRequest();
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      data.products.forEach((product: any) => {
        expect(product.status).toBe('active');
      });
    });

    it('should handle case-insensitive search', async () => {
      const request1 = createMockRequest({ q: 'DELL' });
      const response1 = await GET(request1);
      const data1 = await response1.json();
      
      const request2 = createMockRequest({ q: 'dell' });
      const response2 = await GET(request2);
      const data2 = await response2.json();
      
      expect(response1.status).toBe(200);
      expect(response2.status).toBe(200);
      expect(data1.totalCount).toBe(data2.totalCount);
    });

    it('should return total count correctly', async () => {
      const request = createMockRequest({ category: 'laptops' });
      const response = await GET(request);
      const data = await response.json();
      
      expect(response.status).toBe(200);
      
      const laptopCount = mockProducts.filter(
        (p) => p.category === 'laptops' && p.status === 'active'
      ).length;
      
      expect(data.totalCount).toBe(laptopCount);
    });
  });
});
