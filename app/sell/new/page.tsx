/**
 * Create New Listing Page
 * Allows sellers to create new product listings
 */

'use client';

import { useRouter } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/contexts/ToastContext';
import ListingForm from '@/components/ListingForm';

export default function NewListingPage() {
  const router = useRouter();
  const { user } = useUser();
  const { showToast } = useToast();

  // Redirect if not logged in
  if (!user) {
    router.push('/user/login?redirect=/sell/new');
    return null;
  }

  const handleSubmit = async (data: any) => {
    try {
      // TODO: Replace with actual API call
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          ...data,
          specifications: {}, // TODO: Add specifications based on category
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create listing');
      }

      const product = await response.json();
      
      showToast('Listing created successfully!', 'success');
      router.push(`/products/${product.id}`);
    } catch (error) {
      console.error('Error creating listing:', error);
      showToast('Failed to create listing. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Create New Listing</h1>
          <p className="text-neutral-600">Fill in the details to list your product for sale</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6 md:p-8">
          <ListingForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
