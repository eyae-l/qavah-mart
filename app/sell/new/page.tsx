/**
 * New Listing Page
 * Create a new product listing
 * 
 * Requirements: 5.1, 5.2, 5.3
 */

'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useUser } from '@/contexts/UserContext';

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

export default function NewListingPage() {
  const router = useRouter();
  const { user } = useUser();

  const handleSubmit = async (data: any, images: File[]) => {
    try {
      // TODO: Upload images to storage
      const imageUrls: string[] = [];
      
      // TODO: Create product via API
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

      // const response = await fetch('/api/products', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${user?.token}`,
      //   },
      //   body: JSON.stringify(productData),
      // });

      // if (!response.ok) throw new Error('Failed to create listing');

      // const product = await response.json();
      
      // Redirect to product detail page or dashboard
      alert('Listing created successfully! (Mock - will be implemented with backend)');
      router.push('/user/dashboard');
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Create New Listing</h1>
          <p className="text-neutral-600">
            Fill in the details below to list your product on Qavah-mart
          </p>
        </div>

        <ListingForm onSubmit={handleSubmit} submitLabel="Create Listing" />
      </div>
    </div>
  );
}

