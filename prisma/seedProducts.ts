import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample data
const LOCATIONS = [
  { city: 'Addis Ababa', region: 'Addis Ababa' },
  { city: 'Dire Dawa', region: 'Dire Dawa' },
  { city: 'Mekelle', region: 'Tigray' },
  { city: 'Gondar', region: 'Amhara' },
  { city: 'Bahir Dar', region: 'Amhara' },
  { city: 'Hawassa', region: 'Sidama' },
  { city: 'Adama', region: 'Oromia' },
  { city: 'Jimma', region: 'Oromia' },
];

const CONDITIONS = ['new', 'used', 'refurbished'];

// Sample product data by category
const PRODUCT_TEMPLATES = {
  laptops: [
    { title: 'Dell XPS 13', brand: 'Dell', priceRange: [45000, 85000], specs: { processor: 'Intel Core i7', ram: '16GB', storage: '512GB SSD' } },
    { title: 'HP Pavilion 15', brand: 'HP', priceRange: [35000, 55000], specs: { processor: 'Intel Core i5', ram: '8GB', storage: '256GB SSD' } },
    { title: 'Lenovo ThinkPad X1', brand: 'Lenovo', priceRange: [55000, 95000], specs: { processor: 'Intel Core i7', ram: '16GB', storage: '1TB SSD' } },
    { title: 'ASUS ROG Strix', brand: 'ASUS', priceRange: [65000, 120000], specs: { processor: 'Intel Core i9', ram: '32GB', storage: '1TB SSD', gpu: 'RTX 3070' } },
    { title: 'Acer Aspire 5', brand: 'Acer', priceRange: [25000, 40000], specs: { processor: 'Intel Core i3', ram: '8GB', storage: '256GB SSD' } },
  ],
  'desktop-computers': [
    { title: 'Dell OptiPlex Desktop', brand: 'Dell', priceRange: [30000, 50000], specs: { processor: 'Intel Core i5', ram: '16GB', storage: '512GB SSD' } },
    { title: 'HP EliteDesk Workstation', brand: 'HP', priceRange: [40000, 70000], specs: { processor: 'Intel Core i7', ram: '32GB', storage: '1TB SSD' } },
    { title: 'Custom Gaming PC', brand: 'Custom', priceRange: [50000, 150000], specs: { processor: 'AMD Ryzen 7', ram: '32GB', storage: '2TB SSD', gpu: 'RTX 4070' } },
  ],
  'computer-components': [
    { title: 'Intel Core i7-13700K', brand: 'Intel', priceRange: [18000, 25000], specs: { cores: '16', threads: '24', baseClock: '3.4GHz' } },
    { title: 'AMD Ryzen 9 7900X', brand: 'AMD', priceRange: [20000, 28000], specs: { cores: '12', threads: '24', baseClock: '4.7GHz' } },
    { title: 'NVIDIA RTX 4070', brand: 'NVIDIA', priceRange: [35000, 50000], specs: { memory: '12GB GDDR6X', cuda: '5888' } },
    { title: 'Corsair Vengeance 32GB RAM', brand: 'Corsair', priceRange: [6000, 9000], specs: { capacity: '32GB', speed: '3200MHz', type: 'DDR4' } },
    { title: 'Samsung 980 PRO 1TB SSD', brand: 'Samsung', priceRange: [5000, 8000], specs: { capacity: '1TB', interface: 'NVMe', speed: '7000MB/s' } },
  ],
  peripherals: [
    { title: 'Logitech MX Master 3', brand: 'Logitech', priceRange: [4500, 6500], specs: { type: 'Wireless Mouse', dpi: '4000', battery: '70 days' } },
    { title: 'Razer BlackWidow V3', brand: 'Razer', priceRange: [6000, 9000], specs: { type: 'Mechanical Keyboard', switches: 'Green', backlight: 'RGB' } },
    { title: 'Dell UltraSharp 27" Monitor', brand: 'Dell', priceRange: [15000, 25000], specs: { size: '27"', resolution: '2560x1440', refresh: '75Hz' } },
    { title: 'Logitech C920 Webcam', brand: 'Logitech', priceRange: [3000, 5000], specs: { resolution: '1080p', fps: '30', autofocus: 'Yes' } },
  ],
};

// Sample user data (these will be sellers)
const SAMPLE_USERS = [
  { id: 'user_seed_001', email: 'seller1@example.com', firstName: 'Abebe', lastName: 'Kebede' },
  { id: 'user_seed_002', email: 'seller2@example.com', firstName: 'Tigist', lastName: 'Haile' },
  { id: 'user_seed_003', email: 'seller3@example.com', firstName: 'Dawit', lastName: 'Tesfaye' },
  { id: 'user_seed_004', email: 'seller4@example.com', firstName: 'Meron', lastName: 'Alemayehu' },
  { id: 'user_seed_005', email: 'seller5@example.com', firstName: 'Yohannes', lastName: 'Bekele' },
];

// Sample review comments
const REVIEW_COMMENTS = [
  'Great product! Works perfectly as described.',
  'Good quality for the price. Highly recommended.',
  'Fast delivery and excellent condition.',
  'Exactly what I was looking for. Very satisfied.',
  'Good seller, responsive and helpful.',
  'Product is in excellent condition. Worth the money.',
  'Quick transaction and good communication.',
  'Very happy with this purchase!',
];

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomPrice(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDescription(title: string, condition: string): string {
  const descriptions = [
    `${title} in ${condition} condition. Well maintained and fully functional.`,
    `Selling my ${title}. ${condition === 'new' ? 'Brand new, never used.' : 'Used but in great condition.'}`,
    `${title} for sale. ${condition === 'new' ? 'Sealed in original packaging.' : 'Tested and working perfectly.'}`,
  ];
  return randomElement(descriptions);
}

async function main() {
  console.log('🌱 Starting product seed...\n');

  // Check if categories exist
  const categoryCount = await prisma.category.count();
  if (categoryCount === 0) {
    console.log('❌ No categories found. Please run: npm run seed:categories first');
    process.exit(1);
  }

  // Create sample users and sellers
  console.log('👥 Creating sample users and sellers...');
  const sellers = [];
  
  for (const userData of SAMPLE_USERS) {
    const location = randomElement(LOCATIONS);
    
    // Create user
    const user = await prisma.user.upsert({
      where: { id: userData.id },
      update: {},
      create: {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        city: location.city,
        region: location.region,
        isVerified: true,
        isSeller: true,
      },
    });

    // Create seller profile
    const seller = await prisma.seller.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        businessName: `${userData.firstName}'s Tech Store`,
        businessType: 'individual',
        verificationStatus: 'verified',
        rating: 4.5 + Math.random() * 0.5, // 4.5-5.0
        totalSales: Math.floor(Math.random() * 50) + 10,
        responseTime: Math.floor(Math.random() * 12) + 1,
      },
    });

    sellers.push(seller);
    console.log(`  ✓ Created seller: ${userData.firstName} ${userData.lastName}`);
  }
  console.log(`✅ Created ${sellers.length} sellers\n`);

  // Get all categories and subcategories
  const categories = await prisma.category.findMany({
    include: { subcategories: true },
  });

  // Create products
  console.log('📦 Creating products...');
  let totalProducts = 0;

  for (const category of categories) {
    const templates = PRODUCT_TEMPLATES[category.slug as keyof typeof PRODUCT_TEMPLATES];
    if (!templates) continue;

    for (const template of templates) {
      // Create 2-3 products per template with different conditions
      const numProducts = Math.floor(Math.random() * 2) + 2;
      
      for (let i = 0; i < numProducts; i++) {
        const seller = randomElement(sellers);
        const location = randomElement(LOCATIONS);
        const condition = randomElement(CONDITIONS);
        const subcategory = randomElement(category.subcategories);
        const price = randomPrice(template.priceRange[0], template.priceRange[1]);
        
        // Adjust price based on condition
        const adjustedPrice = condition === 'new' ? price : 
                            condition === 'refurbished' ? Math.floor(price * 0.8) :
                            Math.floor(price * 0.6);

        const product = await prisma.product.create({
          data: {
            title: template.title,
            description: generateDescription(template.title, condition),
            price: adjustedPrice,
            condition,
            category: category.slug,
            subcategory: subcategory.slug,
            brand: template.brand,
            images: [
              'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
              'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
            ],
            specifications: template.specs,
            city: location.city,
            region: location.region,
            sellerId: seller.id,
            status: 'active',
            views: Math.floor(Math.random() * 100),
          },
        });

        totalProducts++;
      }
    }
  }
  console.log(`✅ Created ${totalProducts} products\n`);

  // Create reviews
  console.log('⭐ Creating reviews...');
  const products = await prisma.product.findMany({ take: 50 });
  let totalReviews = 0;

  for (const product of products) {
    // 30% chance of having reviews
    if (Math.random() > 0.7) continue;

    const numReviews = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < numReviews; i++) {
      const reviewer = randomElement(SAMPLE_USERS);
      const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars mostly
      
      try {
        await prisma.review.create({
          data: {
            productId: product.id,
            userId: reviewer.id,
            sellerId: product.sellerId,
            rating,
            title: rating >= 4 ? 'Great product!' : 'Good product',
            comment: randomElement(REVIEW_COMMENTS),
            verified: Math.random() > 0.5,
          },
        });
        totalReviews++;
      } catch (error) {
        // Skip if duplicate review
      }
    }
  }
  console.log(`✅ Created ${totalReviews} reviews\n`);

  console.log('✨ Product seed completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`  - ${sellers.length} sellers`);
  console.log(`  - ${totalProducts} products`);
  console.log(`  - ${totalReviews} reviews`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding products:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
