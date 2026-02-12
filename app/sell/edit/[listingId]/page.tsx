'use client';

import { use } from 'react';

interface EditListingPageProps {
  params: Promise<{ listingId: string }>;
}

export default function EditListingPage({ params }: EditListingPageProps) {
  const { listingId } = use(params);
  
  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-neutral-900 mb-8">Edit Listing</h1>
        <p className="text-neutral-600">Listing ID: {listingId}</p>
        <p className="text-neutral-600 mt-4">This feature is currently under development.</p>
      </div>
    </div>
  );
}
