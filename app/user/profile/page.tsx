'use client';

import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { mockProducts } from '@/data/mockData';
import { Product } from '@/types';
import { useRouter } from 'next/navigation';
import { MapPin, Mail, Phone, CheckCircle, XCircle, Package } from 'lucide-react';
import ProductCard from '@/components/ProductCard';

export default function ProfilePage() {
  const { user, isAuthenticated } = useUser();
  const router = useRouter();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/user/login?returnUrl=/user/profile');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Get user's listings (filter products by sellerId matching user id)
  const userListings: Product[] = mockProducts.filter(
    (product) => product.sellerId === user.id
  );

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between">
            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-primary-200 flex items-center justify-center text-primary-700 text-2xl font-semibold">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
                
                {/* Name and Verification */}
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900">
                    {user.firstName} {user.lastName}
                  </h1>
                  <div className="flex items-center gap-2 mt-1">
                    {user.isVerified ? (
                      <span className="flex items-center gap-1 text-sm text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        Verified User
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-sm text-neutral-500">
                        <XCircle className="w-4 h-4" />
                        Not Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-neutral-600">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                
                {user.phone && (
                  <div className="flex items-center gap-2 text-neutral-600">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-neutral-600">
                  <MapPin className="w-4 h-4" />
                  <span>{user.location.city}, {user.location.region}</span>
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => router.push('/user/profile/edit')}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Listing History */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold text-neutral-900">
              My Listings ({userListings.length})
            </h2>
          </div>

          {userListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userListings.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showLocation={true}
                  showCondition={true}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-600 mb-4">You haven't created any listings yet</p>
              <button
                onClick={() => router.push('/sell/new')}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Your First Listing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
