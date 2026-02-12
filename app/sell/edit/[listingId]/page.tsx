/**
 * Edit Listing Page
 * Allows sellers to edit their existing product listings
 */

'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/contexts/ToastContext';
import ListingForm from '@/components/ListingForm';
import type { Product } from '@/types';

interface EditListingPageProps {
  params: Promise<{ listingId: string }>;
}

export default function EditListingPage({ params }: EditListingPageProps) {
  const { listingId } = use(params);
  const router = useRouter();
  const { user } = useUser();
  const { showToast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${listingId}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        
        // Verify user owns this listing
        if (data.seller.userId !== user?.id) {
          showToast('You do not have permission to edit this listing', 'error');
          router.push('/user/dashboard');
          return;
        }
        
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        showToast('Failed to load listing', 'error');
        router.push('/user/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProduct();
    } else {
      router.push('/user/login?redirect=/sell/edit/' + listingId);
    }
  }, [listingId, user, router, showToast]);

  const handleSubmit = async (data: any) => {
    try {
      const response = await fetch(`/api/products/${listingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update listing');
      }

      showToast('Listing updated successfully!', 'success');
      router.push(`/products/${listingId}`);
    } catch (error) {
      console.error('Error updating listing:', error);
      showToast('Failed to update listing. Please try again.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-neutral-200 rounded w-1/3"></div>
              <div className="h-4 bg-neutral-200 rounded w-2/3"></div>
              <div className="h-32 bg-neutral-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const initialData = {
    title: product.title,
    description: product.description,
    price: product.price,
    category: product.category,
    subcategory: product.subcategory,
    brand: product.brand,
    condition: product.condition,
    city: product.city,
    region: product.region,
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Edit Listing</h1>
          <p className="text-neutral-600">Update your product details</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 md:p-8">
          <ListingForm 
            initialData={initialData}
            onSubmit={handleSubmit}
            isEditing={true}
          />
        </div>
      </div>
    </div>
  );
}
