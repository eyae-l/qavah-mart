/**
 * Products API using Supabase REST API
 * This works even when direct database connections are blocked
 * GET /api/products-supabase - List products with filters
 */

import { NextRequest, NextResponse } from 'next/server';

// Mark as dynamic to prevent pre-rendering during build
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const condition = searchParams.get('condition');
    const city = searchParams.get('city');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    console.log('Fetching products with params:', { category, subcategory, page, limit });

    // Build REST API URL
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials');
      return NextResponse.json(
        { error: 'Supabase not configured' },
        { status: 500 }
      );
    }

    // Build URL with query parameters
    const urlParams = new URLSearchParams();
    urlParams.append('select', '*');
    urlParams.append('order', 'createdAt.desc');
    
    // Add filters
    if (category) urlParams.append('category', `eq.${category}`);
    if (subcategory) urlParams.append('subcategory', `eq.${subcategory}`);
    if (condition) urlParams.append('condition', `eq.${condition}`);
    if (city) urlParams.append('city', `eq.${city}`);
    if (minPrice) urlParams.append('price', `gte.${parseFloat(minPrice)}`);
    if (maxPrice) urlParams.append('price', `lte.${parseFloat(maxPrice)}`);
    
    // Add pagination
    urlParams.append('limit', limit.toString());
    urlParams.append('offset', ((page - 1) * limit).toString());

    const url = `${supabaseUrl}/rest/v1/products?${urlParams.toString()}`;

    console.log('Calling Supabase REST API:', url.replace(supabaseKey, '***'));

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
        { error: 'Failed to fetch products', details: errorText },
        { status: response.status }
      );
    }

    const products = await response.json();
    console.log('Products fetched:', products.length);

    // Get total count
    const countParams = new URLSearchParams();
    countParams.append('select', 'count()');
    if (category) countParams.append('category', `eq.${category}`);
    if (subcategory) countParams.append('subcategory', `eq.${subcategory}`);
    if (condition) countParams.append('condition', `eq.${condition}`);
    if (city) countParams.append('city', `eq.${city}`);
    if (minPrice) countParams.append('price', `gte.${parseFloat(minPrice)}`);
    if (maxPrice) countParams.append('price', `lte.${parseFloat(maxPrice)}`);
    
    const countUrl = `${supabaseUrl}/rest/v1/products?${countParams.toString()}`;
    const countResponse = await fetch(countUrl, {
      method: 'GET',
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
    });

    let total = 0;
    if (countResponse.ok) {
      const countData = await countResponse.json();
      total = countData[0]?.count || 0;
    }

    return NextResponse.json({
      products: products || [],
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}
