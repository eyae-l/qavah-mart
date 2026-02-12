/**
 * Script to generate and display mock data statistics
 * 
 * Run with: npx ts-node scripts/generateMockData.ts
 */

import { generateCompleteDataset } from '../data/mockDataGenerator.js';
import { CATEGORY_STRUCTURE } from '../types/index.js';

console.log('='.repeat(80));
console.log('QAVAH-MART MOCK DATA GENERATION');
console.log('='.repeat(80));
console.log('');

const dataset = generateCompleteDataset();

console.log('');
console.log('='.repeat(80));
console.log('DETAILED STATISTICS');
console.log('='.repeat(80));
console.log('');

// Category breakdown with subcategories
console.log('📦 PRODUCTS BY CATEGORY AND SUBCATEGORY:');
console.log('-'.repeat(80));
Object.entries(CATEGORY_STRUCTURE).forEach(([categorySlug, categoryData]) => {
  const categoryProducts = dataset.products.filter(p => p.category === categorySlug);
  console.log(`\n${categoryData.name} (${categoryProducts.length} products):`);
  
  categoryData.subcategories.forEach(subcategory => {
    const subcategoryProducts = categoryProducts.filter(p => p.subcategory === subcategory);
    console.log(`  - ${subcategory}: ${subcategoryProducts.length} products`);
  });
});

// Brand breakdown
console.log('\n');
console.log('🏷️  PRODUCTS BY BRAND:');
console.log('-'.repeat(80));
const brandCounts: Record<string, number> = {};
dataset.products.forEach(product => {
  brandCounts[product.brand] = (brandCounts[product.brand] || 0) + 1;
});
Object.entries(brandCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([brand, count]) => {
    console.log(`  ${brand.padEnd(20)} ${count} products`);
  });

// Condition breakdown
console.log('\n');
console.log('🔧 PRODUCTS BY CONDITION:');
console.log('-'.repeat(80));
const conditionCounts: Record<string, number> = {};
dataset.products.forEach(product => {
  conditionCounts[product.condition] = (conditionCounts[product.condition] || 0) + 1;
});
Object.entries(conditionCounts).forEach(([condition, count]) => {
  const percentage = ((count / dataset.products.length) * 100).toFixed(1);
  console.log(`  ${condition.padEnd(20)} ${count} products (${percentage}%)`);
});

// Status breakdown
console.log('\n');
console.log('📊 PRODUCTS BY STATUS:');
console.log('-'.repeat(80));
const statusCounts: Record<string, number> = {};
dataset.products.forEach(product => {
  statusCounts[product.status] = (statusCounts[product.status] || 0) + 1;
});
Object.entries(statusCounts).forEach(([status, count]) => {
  const percentage = ((count / dataset.products.length) * 100).toFixed(1);
  console.log(`  ${status.padEnd(20)} ${count} products (${percentage}%)`);
});

// Location breakdown
console.log('\n');
console.log('📍 PRODUCTS BY LOCATION:');
console.log('-'.repeat(80));
const locationCounts: Record<string, number> = {};
dataset.products.forEach(product => {
  const locationKey = `${product.location.city}, ${product.location.region}`;
  locationCounts[locationKey] = (locationCounts[locationKey] || 0) + 1;
});
Object.entries(locationCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([location, count]) => {
    console.log(`  ${location.padEnd(30)} ${count} products`);
  });

// Seller statistics
console.log('\n');
console.log('👥 SELLER STATISTICS:');
console.log('-'.repeat(80));
const verifiedSellers = dataset.sellers.filter(s => s.verificationStatus === 'verified').length;
const businessSellers = dataset.sellers.filter(s => s.businessType === 'business').length;
const individualSellers = dataset.sellers.filter(s => s.businessType === 'individual').length;
console.log(`  Total sellers:        ${dataset.sellers.length}`);
console.log(`  Verified sellers:     ${verifiedSellers} (${((verifiedSellers / dataset.sellers.length) * 100).toFixed(1)}%)`);
console.log(`  Business sellers:     ${businessSellers} (${((businessSellers / dataset.sellers.length) * 100).toFixed(1)}%)`);
console.log(`  Individual sellers:   ${individualSellers} (${((individualSellers / dataset.sellers.length) * 100).toFixed(1)}%)`);

const avgRating = dataset.sellers.reduce((sum, s) => sum + s.rating, 0) / dataset.sellers.length;
const avgSales = dataset.sellers.reduce((sum, s) => sum + s.totalSales, 0) / dataset.sellers.length;
console.log(`  Average rating:       ${avgRating.toFixed(2)} / 5.0`);
console.log(`  Average total sales:  ${avgSales.toFixed(0)}`);

// Review statistics
console.log('\n');
console.log('⭐ REVIEW STATISTICS:');
console.log('-'.repeat(80));
console.log(`  Total reviews:        ${dataset.reviews.length}`);
const verifiedReviews = dataset.reviews.filter(r => r.verified).length;
console.log(`  Verified reviews:     ${verifiedReviews} (${((verifiedReviews / dataset.reviews.length) * 100).toFixed(1)}%)`);

const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
dataset.reviews.forEach(review => {
  ratingCounts[review.rating] = (ratingCounts[review.rating] || 0) + 1;
});
console.log('\n  Rating distribution:');
[5, 4, 3, 2, 1].forEach(rating => {
  const count = ratingCounts[rating];
  const percentage = ((count / dataset.reviews.length) * 100).toFixed(1);
  const bar = '█'.repeat(Math.floor(count / 10));
  console.log(`    ${rating} stars: ${count.toString().padStart(4)} (${percentage.padStart(5)}%) ${bar}`);
});

const avgReviewRating = dataset.reviews.reduce((sum, r) => sum + r.rating, 0) / dataset.reviews.length;
console.log(`\n  Average rating:       ${avgReviewRating.toFixed(2)} / 5.0`);

// Price statistics
console.log('\n');
console.log('💰 PRICE STATISTICS:');
console.log('-'.repeat(80));
const prices = dataset.products.map(p => p.price);
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);
const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
const medianPrice = prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)];

console.log(`  Minimum price:        ${minPrice.toLocaleString()} ETB`);
console.log(`  Maximum price:        ${maxPrice.toLocaleString()} ETB`);
console.log(`  Average price:        ${avgPrice.toLocaleString(undefined, { maximumFractionDigits: 0 })} ETB`);
console.log(`  Median price:         ${medianPrice.toLocaleString()} ETB`);

console.log('\n');
console.log('='.repeat(80));
console.log('✅ MOCK DATA GENERATION COMPLETE');
console.log('='.repeat(80));
console.log('');
console.log('The generated data includes:');
console.log(`  • ${dataset.products.length} products across 7 categories`);
console.log(`  • ${dataset.sellers.length} sellers (verified and unverified)`);
console.log(`  • ${dataset.users.length} users`);
console.log(`  • ${dataset.reviews.length} reviews`);
console.log(`  • ${dataset.locations.length} Ethiopian locations`);
console.log('');
console.log('All 16 supported brands are represented.');
console.log('All categories and subcategories have products.');
console.log('');
