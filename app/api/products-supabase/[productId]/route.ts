/**
 * Single Product API using Supabase REST API
 * GET /api/products-supabase/[productId] - Get product by ID
 */

import { NextRequest, NextResponse } from 'next/server';

// Mark as dynamic to prevent pre-rendering during build
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    // Build REST API URL for single product with seller info
    const url = `${supabaseUrl}/rest/v1/products?select=*,seller:sellers!inner(id,businessName,rating,user:users!inner(firstName,lastName,city,region))&id=eq.${productId}`;

    console.log('Fetching product from Supabase REST API:', productId);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('Supabase response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase error response:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch product', details: errorText },
        { status: response.status }
      );
    }

    const products = await response.json();
    const product = products[0];

    if (!product || !product.seller) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
