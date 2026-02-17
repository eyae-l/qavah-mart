/**
 * Seller Dashboard Page
 * Displays seller's listings, analytics, and management options
 * 
 * Requirements: 5.4, 5.5, 7.5, 21.3
 */

'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Package, TrendingUp, Eye, Heart, Star, Plus, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Product, ProductStatus } from '@/types';
import { useUser } from '@/contexts/UserContext';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useUser();
  const [listings, setListings] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'sold' | 'inactive'>('active');

  useEffect(() => {
    // Fetch seller's listings
    // For now, using mock data - will be replaced with API call
    const fetchListings = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/products?sellerId=${user?.id}`);
        // const data = await response.json();
        // setListings(data.products);
        setListings([]);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user]);

  const activeListings = listings.filter(l => l.status === 'active');
  const soldListings = listings.filter(l => l.status === 'sold');
  const inactiveListings = listings.filter(l => l.status === 'inactive');

  const stats = {
    activeListings: activeListings.length,
    soldItems: soldListings.length,
    totalViews: listings.reduce((sum, l) => sum + l.views, 0),
    totalFavorites: listings.reduce((sum, l) => sum + l.favorites, 0),
    averageRating: 0, // TODO: Calculate from reviews
    totalSales: soldListings.reduce((sum, l) => sum + l.price, 0),
  };

  const hasListings = listings.length > 0;

  const handleStatusChange = async (productId: string, newStatus: ProductStatus) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/products/${productId}`, {
      //   method: 'PUT',
      //   body: JSON.stringify({ status: newStatus }),
      // });
      
      setListings(prev => prev.map(l => 
        l.id === productId ? { ...l, status: newStatus } : l
      ));
    } catch (error) {
      console.error('Error updating listing status:', error);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/products/${productId}`, { method: 'DELETE' });
      
      setListings(prev => prev.filter(l => l.id !== productId));
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const currentListings = activeTab === 'active' ? activeListings : 
                         activeTab === 'sold' ? soldListings : inactiveListings;

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
            <Plus className="w-5 h-5" aria-hidden="true" />
            Create New Listing
          </Link>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Package className="w-6 h-6 text-primary-600" aria-hidden="true" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">{stats.activeListings}</span>
            </div>
            <h3 className="text-neutral-600 font-medium">Active Listings</h3>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" aria-hidden="true" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">{stats.soldItems}</span>
            </div>
            <h3 className="text-neutral-600 font-medium">Items Sold</h3>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Eye className="w-6 h-6 text-blue-600" aria-hidden="true" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">{stats.totalViews.toLocaleString()}</span>
            </div>
            <h3 className="text-neutral-600 font-medium">Total Views</h3>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Heart className="w-6 h-6 text-red-600" aria-hidden="true" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">{stats.totalFavorites}</span>
            </div>
            <h3 className="text-neutral-600 font-medium">Favorites</h3>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" aria-hidden="true" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">
                {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '—'}
              </span>
            </div>
            <h3 className="text-neutral-600 font-medium">Average Rating</h3>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-primary-600" aria-hidden="true" />
              </div>
              <span className="text-2xl font-bold text-neutral-900">{stats.totalSales.toLocaleString()} ETB</span>
            </div>
            <h3 className="text-neutral-600 font-medium">Total Sales</h3>
          </div>
        </div>

        {/* Listings Section */}
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
          <div className="p-6 border-b border-neutral-200">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">Your Listings</h2>
            
            {/* Tabs */}
            <div className="flex gap-4 border-b border-neutral-200 -mb-6">
              <button
                onClick={() => setActiveTab('active')}
                className={`pb-4 px-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'active'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Active ({activeListings.length})
              </button>
              <button
                onClick={() => setActiveTab('sold')}
                className={`pb-4 px-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'sold'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Sold ({soldListings.length})
              </button>
              <button
                onClick={() => setActiveTab('inactive')}
                className={`pb-4 px-2 font-medium transition-colors border-b-2 ${
                  activeTab === 'inactive'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900'
                }`}
              >
                Inactive ({inactiveListings.length})
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {loading ? (
              <LoadingSpinner message="Loading listings..." />
            ) : !hasListings ? (
              <EmptyState
                icon={Package}
                title="No listings yet"
                description="Create your first listing to start selling on Qavah-mart. It only takes a few minutes!"
                action={{
                  label: 'Create Listing',
                  onClick: () => router.push('/sell/new'),
                }}
                suggestions={[
                  'Take clear photos of your product',
                  'Write a detailed description',
                  'Set a competitive price',
                  'Choose the right category',
                ]}
              />
            ) : currentListings.length === 0 ? (
              <div className="text-center py-12 text-neutral-600">
                <Package className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
                <p>No {activeTab} listings</p>
              </div>
            ) : (
              <div className="space-y-4">
                {currentListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="flex flex-col md:flex-row gap-4 p-4 border border-neutral-200 rounded-lg hover:border-primary-300 transition-colors"
                  >
                    {/* Product Image */}
                    <div className="relative w-full md:w-32 h-32 flex-shrink-0 bg-primary-100 rounded-lg overflow-hidden">
                      {listing.images[0] ? (
                        <Image
                          src={listing.images[0]}
                          alt={listing.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-12 h-12 text-primary-600" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-neutral-900 mb-1 truncate">
                        {listing.title}
                      </h3>
                      <p className="text-2xl font-bold text-primary-600 mb-2">
                        {listing.price.toLocaleString()} ETB
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-neutral-600">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {listing.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          {listing.favorites} favorites
                        </span>
                        <span className="capitalize">
                          {listing.condition}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-2">
                      <Link
                        href={`/sell/edit/${listing.id}`}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </Link>
                      
                      {activeTab === 'active' && (
                        <button
                          onClick={() => handleStatusChange(listing.id, 'sold')}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">Mark Sold</span>
                        </button>
                      )}
                      
                      {activeTab === 'active' && (
                        <button
                          onClick={() => handleStatusChange(listing.id, 'inactive')}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">Deactivate</span>
                        </button>
                      )}
                      
                      {activeTab === 'inactive' && (
                        <button
                          onClick={() => handleStatusChange(listing.id, 'active')}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span className="hidden sm:inline">Reactivate</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
