/**
 * Single Product API using Supabase REST API
 * GET /api/products-supabase/[productId] - Get product by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Mark as dynamic to prevent pre-rendering during build
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    // Fetch product with seller info
    const { data: product, error } = await supabase
      .from('products')
      .select(`
        *,
        seller:sellers!inner(
          id,
          businessName,
          rating,
          user:users!inner(
            firstName,
            lastName,
            city,
            region
          )
        )
      `)
      .eq('id', productId)
      .single();

    if (error || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
