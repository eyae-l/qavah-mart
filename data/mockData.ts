/**
 * Pre-generated Mock Data for Qavah-mart
 * 
 * This file contains the generated mock data that can be imported
 * throughout the application.
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.4, 3.1, 7.1
 */

import { generateCompleteDataset } from './mockDataGenerator';
import { CATEGORY_STRUCTURE } from '../types';

// Cache the dataset to prevent regeneration on every import
// This fixes hydration errors by ensuring server and client use the same data
let cachedDataset: ReturnType<typeof generateCompleteDataset> | null = null;

function getDataset() {
  if (!cachedDataset) {
    cachedDataset = generateCompleteDataset();
  }
  return cachedDataset;
}

// Get the complete dataset
const dataset = getDataset();

// Export individual datasets
export const mockSellers = dataset.sellers;
export const mockUsers = dataset.users;
export const mockProducts = dataset.products;
export const mockReviews = dataset.reviews;
export const mockLocations = dataset.locations;

// Re-export CATEGORY_STRUCTURE for convenience
export { CATEGORY_STRUCTURE };

// Export the complete dataset
export const mockData = dataset;

// Export default
export default mockData;
