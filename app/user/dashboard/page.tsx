/**
 * Seller Dashboard Page
 * Displays seller's listings, analytics, and management options
 */

import { Suspense } from 'react';
import Link from 'next/link';
import { Package, TrendingUp, Eye, Heart, Star, Plus } from 'lucide-react';

export default async function DashboardPage() {
  // TODO: Fetch real data from API when user is authenticated
  const mockData = {
    activeListings: 12,
    soldItems: 45,
    totalViews: 3420,
    totalFavorites: 234,
    averageRating: 4.7,
    totalSales: 125000,
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Seller Dashboard</h1>
            <p className="text-neutral-600">Manage your listings and track performance</p>
          </div>
          <Link
            href="/sell/new"
            className="mt-4 md:mt-0 inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create New Listing
          </Link>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">{mockData.activeListings}</span>
            </div>
            <h3 className="text-neutral-600 font-medium">Active Listings</h3>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">{mockData.soldItems}</span>
            </div>
            <h3 className="text-neutral-600 font-medium">Items Sold</h3>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">{mockData.totalViews.toLocaleString()}</span>
            </div>
            <h3 className="text-neutral-600 font-medium">Total Views</h3>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">{mockData.totalFavorites}</span>
            </div>
            <h3 className="text-neutral-600 font-medium">Favorites</h3>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">{mockData.averageRating}</span>
            </div>
            <h3 className="text-neutral-600 font-medium">Average Rating</h3>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary-600" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">{mockData.totalSales.toLocaleString()} ETB</span>
            </div>
            <h3 className="text-neutral-600 font-medium">Total Sales</h3>
          </div>
        </div>

        {/* Listings Section */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-bold text-neutral-900">Your Listings</h2>
          </div>
          
          <div className="p-6">
            <Suspense fallback={<div className="text-center py-8">Loading listings...</div>}>
              <div className="text-center py-12 text-neutral-500">
                <Package className="w-16 h-16 mx-auto mb-4 text-neutral-300" />
                <p className="text-lg mb-2">No listings yet</p>
                <p className="text-sm mb-4">Create your first listing to start selling</p>
                <Link
                  href="/sell/new"
                  className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Listing
                </Link>
              </div>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
