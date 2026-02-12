/**
 * Unit tests for Qavah-mart type definitions
 * 
 * These tests verify that the TypeScript interfaces are correctly defined
 * and can be used to create valid data structures.
 */

import {
  SUPPORTED_BRANDS,
  CATEGORY_STRUCTURE,
  type SupportedBrand,
  type CategorySlug,
  type Product,
  type User,
  type Seller,
  type Category,
  type Subcategory,
  type Review,
  type ProductRating,
  type SellerRating,
  type Location,
  type SearchFilters,
  type SearchResult,
  type ProductSpecifications,
  type ProductCondition,
  type ProductStatus,
} from './index';

describe('Type Definitions', () => {
  describe('Brand Configuration', () => {
    it('should have exactly 16 supported brands', () => {
      expect(SUPPORTED_BRANDS).toHaveLength(16);
    });

    it('should include all required computer manufacturers', () => {
      const manufacturers = ['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Apple'];
      manufacturers.forEach(brand => {
        expect(SUPPORTED_BRANDS).toContain(brand);
      });
    });

    it('should include all required component manufacturers', () => {
      const componentMfrs = ['Intel', 'AMD', 'NVIDIA'];
      componentMfrs.forEach(brand => {
        expect(SUPPORTED_BRANDS).toContain(brand);
      });
    });

    it('should include all required peripheral brands', () => {
      const peripheralBrands = ['Corsair', 'Kingston', 'Samsung', 'Logitech', 'Razer', 'SteelSeries'];
      peripheralBrands.forEach(brand => {
        expect(SUPPORTED_BRANDS).toContain(brand);
      });
    });
  });

  describe('Category Structure', () => {
    it('should have exactly 7 main categories', () => {
      const categories = Object.keys(CATEGORY_STRUCTURE);
      expect(categories).toHaveLength(7);
    });

    it('should include all required main categories', () => {
      const requiredCategories = [
        'laptops',
        'desktop-computers',
        'computer-components',
        'peripherals',
        'networking-equipment',
        'software-licenses',
        'computer-accessories'
      ];
      
      requiredCategories.forEach(category => {
        expect(CATEGORY_STRUCTURE).toHaveProperty(category);
      });
    });

    it('should have correct subcategories for Laptops', () => {
      expect(CATEGORY_STRUCTURE.laptops.subcategories).toEqual([
        'Gaming', 'Business', 'Ultrabooks', 'Budget'
      ]);
    });

    it('should have correct subcategories for Desktop Computers', () => {
      expect(CATEGORY_STRUCTURE['desktop-computers'].subcategories).toEqual([
        'Gaming PCs', 'Workstations', 'All-in-One'
      ]);
    });

    it('should have correct subcategories for Computer Components', () => {
      expect(CATEGORY_STRUCTURE['computer-components'].subcategories).toEqual([
        'CPUs', 'GPUs', 'RAM', 'Storage', 'Motherboards'
      ]);
    });

    it('should have correct subcategories for Peripherals', () => {
      expect(CATEGORY_STRUCTURE.peripherals.subcategories).toEqual([
        'Monitors', 'Keyboards', 'Mice', 'Speakers', 'Webcams'
      ]);
    });
  });

  describe('Product Interface', () => {
    it('should create a valid product object', () => {
      const location: Location = {
        city: 'Addis Ababa',
        region: 'Addis Ababa',
        country: 'Ethiopia'
      };

      const product: Product = {
        id: 'prod-001',
        title: 'Dell XPS 15 Gaming Laptop',
        description: 'High-performance gaming laptop',
        price: 85000,
        condition: 'new',
        category: 'laptops',
        subcategory: 'Gaming',
        brand: 'Dell',
        specifications: {
          processor: 'Intel Core i7-12700H',
          memory: '16GB DDR5',
          storage: '512GB NVMe SSD',
          graphics: 'NVIDIA RTX 3060',
          screenSize: '15.6 inch',
          operatingSystem: 'Windows 11 Pro'
        },
        images: ['/images/dell-xps-15.jpg'],
        location,
        sellerId: 'seller-001',
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active',
        views: 0,
        favorites: 0
      };

      expect(product.id).toBe('prod-001');
      expect(product.brand).toBe('Dell');
      expect(product.condition).toBe('new');
      expect(product.status).toBe('active');
    });

    it('should accept all valid product conditions', () => {
      const conditions: ProductCondition[] = ['new', 'used', 'refurbished'];
      conditions.forEach(condition => {
        expect(['new', 'used', 'refurbished']).toContain(condition);
      });
    });

    it('should accept all valid product statuses', () => {
      const statuses: ProductStatus[] = ['active', 'sold', 'inactive'];
      statuses.forEach(status => {
        expect(['active', 'sold', 'inactive']).toContain(status);
      });
    });
  });

  describe('User and Seller Interfaces', () => {
    it('should create a valid user object', () => {
      const user: User = {
        id: 'user-001',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+251911234567',
        location: {
          city: 'Addis Ababa',
          region: 'Addis Ababa',
          country: 'Ethiopia'
        },
        createdAt: new Date(),
        isVerified: true,
        isSeller: false
      };

      expect(user.email).toBe('john@example.com');
      expect(user.isVerified).toBe(true);
    });

    it('should create a valid seller object', () => {
      const seller: Seller = {
        id: 'seller-001',
        email: 'seller@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        location: {
          city: 'Addis Ababa',
          region: 'Addis Ababa',
          country: 'Ethiopia'
        },
        createdAt: new Date(),
        isVerified: true,
        isSeller: true,
        businessName: 'Tech Solutions',
        businessType: 'business',
        verificationStatus: 'verified',
        rating: 4.5,
        totalSales: 150,
        responseTime: 2,
        joinedDate: new Date()
      };

      expect(seller.isSeller).toBe(true);
      expect(seller.verificationStatus).toBe('verified');
      expect(seller.rating).toBe(4.5);
    });
  });

  describe('Review and Rating Interfaces', () => {
    it('should create a valid review object', () => {
      const review: Review = {
        id: 'review-001',
        productId: 'prod-001',
        userId: 'user-001',
        sellerId: 'seller-001',
        rating: 5,
        title: 'Excellent laptop!',
        comment: 'Very fast and reliable. Great for gaming.',
        createdAt: new Date(),
        helpful: 10,
        verified: true
      };

      expect(review.rating).toBe(5);
      expect(review.verified).toBe(true);
    });

    it('should create a valid product rating object', () => {
      const productRating: ProductRating = {
        productId: 'prod-001',
        averageRating: 4.5,
        totalReviews: 25,
        ratingDistribution: {
          5: 15,
          4: 7,
          3: 2,
          2: 1,
          1: 0
        }
      };

      expect(productRating.averageRating).toBe(4.5);
      expect(productRating.totalReviews).toBe(25);
    });

    it('should create a valid seller rating object', () => {
      const sellerRating: SellerRating = {
        sellerId: 'seller-001',
        averageRating: 4.8,
        totalReviews: 100,
        ratingDistribution: {
          5: 80,
          4: 15,
          3: 3,
          2: 1,
          1: 1
        }
      };

      expect(sellerRating.averageRating).toBe(4.8);
      expect(sellerRating.totalReviews).toBe(100);
    });
  });

  describe('Search and Filter Interfaces', () => {
    it('should create a valid search filters object', () => {
      const filters: SearchFilters = {
        query: 'gaming laptop',
        category: 'laptops',
        subcategory: 'Gaming',
        priceMin: 50000,
        priceMax: 100000,
        condition: ['new', 'refurbished'],
        brands: ['Dell', 'ASUS', 'MSI'],
        location: 'Addis Ababa',
        sortBy: 'price-low'
      };

      expect(filters.query).toBe('gaming laptop');
      expect(filters.brands).toHaveLength(3);
      expect(filters.sortBy).toBe('price-low');
    });

    it('should create a valid search result object', () => {
      const searchResult: SearchResult = {
        products: [],
        totalCount: 0,
        facets: {
          categories: [],
          brands: [],
          conditions: [],
          priceRanges: []
        },
        suggestions: ['gaming laptop', 'business laptop']
      };

      expect(searchResult.totalCount).toBe(0);
      expect(searchResult.suggestions).toHaveLength(2);
    });
  });

  describe('Location Interface', () => {
    it('should create a valid location object', () => {
      const location: Location = {
        city: 'Addis Ababa',
        region: 'Addis Ababa',
        country: 'Ethiopia',
        coordinates: {
          lat: 9.0320,
          lng: 38.7469
        }
      };

      expect(location.city).toBe('Addis Ababa');
      expect(location.coordinates?.lat).toBe(9.0320);
    });

    it('should create a location without coordinates', () => {
      const location: Location = {
        city: 'Dire Dawa',
        region: 'Dire Dawa',
        country: 'Ethiopia'
      };

      expect(location.coordinates).toBeUndefined();
    });
  });

  describe('Product Specifications Interface', () => {
    it('should accept computer-specific specifications', () => {
      const specs: ProductSpecifications = {
        processor: 'Intel Core i7-12700H',
        memory: '16GB DDR5',
        storage: '512GB NVMe SSD',
        graphics: 'NVIDIA RTX 3060',
        screenSize: '15.6 inch',
        operatingSystem: 'Windows 11 Pro',
        warranty: '2 years'
      };

      expect(specs.processor).toBe('Intel Core i7-12700H');
      expect(specs.memory).toBe('16GB DDR5');
    });

    it('should accept custom specifications', () => {
      const specs: ProductSpecifications = {
        customField: 'custom value',
        numericField: 100,
        booleanField: true
      };

      expect(specs.customField).toBe('custom value');
      expect(specs.numericField).toBe(100);
      expect(specs.booleanField).toBe(true);
    });
  });

  describe('Category and Subcategory Interfaces', () => {
    it('should create a valid category object', () => {
      const category: Category = {
        id: 'cat-001',
        name: 'Laptops',
        slug: 'laptops',
        description: 'All types of laptops',
        subcategories: [],
        featuredBrands: ['Dell', 'HP', 'Lenovo'],
        specifications: []
      };

      expect(category.name).toBe('Laptops');
      expect(category.featuredBrands).toHaveLength(3);
    });

    it('should create a valid subcategory object', () => {
      const subcategory: Subcategory = {
        id: 'subcat-001',
        name: 'Gaming',
        slug: 'gaming',
        parentCategory: 'laptops',
        specifications: []
      };

      expect(subcategory.name).toBe('Gaming');
      expect(subcategory.parentCategory).toBe('laptops');
    });
  });
});
