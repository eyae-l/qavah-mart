/**
 * Edit Listing Page
 * Edit an existing product listing
 * 
 * Requirements: 5.4
 */

'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useUser } from '@/contexts/UserContext';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Product } from '@/types';

// Dynamic import for heavy ListingForm component
const ListingForm = dynamic(() => import('@/components/ListingForm'), {
  loading: () => (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="space-y-6">
        <div className="h-10 bg-neutral-100 rounded animate-pulse"></div>
        <div className="h-32 bg-neutral-100 rounded animate-pulse"></div>
        <div className="h-10 bg-neutral-100 rounded animate-pulse"></div>
        <div className="h-10 bg-neutral-100 rounded animate-pulse"></div>
      </div>
    </div>
  ),
});

interface EditListingPageProps {
  params: Promise<{ listingId: string }>;
}

export default function EditListingPage({ params }: EditListingPageProps) {
  const { listingId } = use(params);
  const router = useRouter();
  const { user } = useUser();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // TODO: Fetch product from API
        // const response = await fetch(`/api/products/${listingId}`);
        // if (!response.ok) throw new Error('Product not found');
        // const data = await response.json();
        
        // Verify user is the owner
        // if (data.sellerId !== user?.id) {
        //   setError('You do not have permission to edit this listing');
        //   return;
        // }
        
        // setProduct(data);
        
        // Mock: Show error for now
        setError('Product not found (Mock - will be implemented with backend)');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [listingId, user]);

  const handleSubmit = async (data: any, images: File[]) => {
    try {
      // TODO: Upload new images if any
      const imageUrls = product?.images || [];
      
      // TODO: Update product via API
      const productData = {
        title: data.title,
        description: data.description,
        price: data.price,
        condition: data.condition,
        category: data.category,
        subcategory: data.subcategory,
        brand: data.brand,
        specifications: {
          processor: data.processor,
          memory: data.memory,
          storage: data.storage,
          graphics: data.graphics,
          screenSize: data.screenSize,
          operatingSystem: data.operatingSystem,
          warranty: data.warranty,
        },
        images: imageUrls,
        city: data.city,
        region: data.region,
      };

      // const response = await fetch(`/api/products/${listingId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${user?.token}`,
      //   },
      //   body: JSON.stringify(productData),
      // });

      // if (!response.ok) throw new Error('Failed to update listing');

      alert('Listing updated successfully! (Mock - will be implemented with backend)');
      router.push('/user/dashboard');
    } catch (error) {
      console.error('Error updating listing:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <LoadingSpinner message="Loading listing..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-red-900 mb-2">Error</h2>
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => router.push('/user/dashboard')}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Edit Listing</h1>
          <p className="text-neutral-600">
            Update your product details below
          </p>
        </div>

        {product && (
          <ListingForm
            initialData={product}
            onSubmit={handleSubmit}
            submitLabel="Update Listing"
          />
        )}
      </div>
    </div>
  );
}

