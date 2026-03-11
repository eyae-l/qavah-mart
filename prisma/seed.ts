import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample data
const CATEGORIES = [
  {
    name: 'Laptops',
    slug: 'laptops',
    description: 'Portable computers for work, gaming, and everyday use',
    featuredBrands: ['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Apple'],
    subcategories: ['Gaming Laptops', 'Business Laptops', 'Ultrabooks', 'Budget Laptops']
  },
  {
    name: 'Desktop Computers',
    slug: 'desktop-computers',
    description: 'Complete desktop systems and custom builds',
    featuredBrands: ['Dell', 'HP', 'Lenovo', 'ASUS'],
    subcategories: ['Gaming Desktops', 'Workstations', 'All-in-One PCs', 'Mini PCs']
  },
  {
    name: 'Computer Components',
    slug: 'computer-components',
    description: 'Build or upgrade your PC with quality components',
    featuredBrands: ['Intel', 'AMD', 'NVIDIA', 'Corsair', 'Kingston', 'Samsung'],
    subcategories: ['Processors (CPUs)', 'Graphics Cards (GPUs)', 'RAM Memory', 'Storage Drives', 'Motherboards', 'Power Supplies', 'PC Cases', 'Cooling Systems']
  },
  {
    name: 'Peripherals',
    slug: 'peripherals',
    description: 'Keyboards, mice, monitors, and more',
    featuredBrands: ['Logitech', 'Razer', 'SteelSeries', 'Corsair', 'Dell', 'HP', 'Samsung'],
    subcategories: ['Keyboards', 'Mice', 'Monitors', 'Webcams', 'Headsets', 'Speakers']
  },
  {
    name: 'Networking Equipment',
    slug: 'networking-equipment',
    description: 'Routers, switches, and network accessories',
    featuredBrands: ['TP-Link', 'Netgear', 'ASUS', 'Linksys'],
    subcategories: ['Routers', 'Switches', 'Network Adapters', 'Modems']
  },
  {
    name: 'Software & Licenses',
    slug: 'software-licenses',
    description: 'Operating systems and software licenses',
    featuredBrands: ['Microsoft', 'Adobe', 'Autodesk'],
    subcategories: ['Operating Systems', 'Office Software', 'Antivirus', 'Design Software']
  },
  {
    name: 'Computer Accessories',
    slug: 'computer-accessories',
    description: 'Cables, adapters, and other accessories',
    featuredBrands: ['Anker', 'Belkin', 'Cable Matters'],
    subcategories: ['Cables', 'Adapters', 'USB Hubs', 'Laptop Bags', 'Cleaning Kits', 'Stands']
  }
];

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

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.seller.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  console.log('✅ Existing data cleared\n');

  // Seed Categories and Subcategories
  console.log('📁 Seeding categories and subcategories...');
  for (const cat of CATEGORIES) {
    const category = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        featuredBrands: cat.featuredBrands,
        specifications: [],
        subcategories: {
          create: cat.subcategories.map((sub) => ({
            name: sub,
            slug: sub.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, ''),
            specifications: [],
          })),
        },
      },
    });
    console.log(`  ✓ Created category: ${category.name} with ${cat.subcategories.length} subcategories`);
  }
  console.log('✅ Categories seeded\n');

  console.log('✨ Database seeded successfully!');
  console.log('\n📊 Summary:');
  console.log(`  - ${CATEGORIES.length} categories`);
  console.log(`  - ${CATEGORIES.reduce((sum, cat) => sum + cat.subcategories.length, 0)} subcategories`);
  console.log('\n💡 Next steps:');
  console.log('  1. Sign up users through Clerk (they will auto-sync to database)');
  console.log('  2. Create products through the UI');
  console.log('  3. Add reviews to products');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
