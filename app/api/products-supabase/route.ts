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

    // Build filter string for Supabase REST API
    let filters = '';
    if (category) filters += `&category=eq.${encodeURIComponent(category)}`;
    if (subcategory) filters += `&subcategory=eq.${encodeURIComponent(subcategory)}`;
    if (condition) filters += `&condition=eq.${encodeURIComponent(condition)}`;
    if (city) filters += `&city=eq.${encodeURIComponent(city)}`;
    if (minPrice) filters += `&price=gte.${parseFloat(minPrice)}`;
    if (maxPrice) filters += `&price=lte.${parseFloat(maxPrice)}`;

    // Build search filter
    let searchFilter = '';
    if (search) {
      const encoded = encodeURIComponent(search);
      searchFilter = `&or=(title.ilike.*${encoded}*,description.ilike.*${encoded}*,brand.ilike.*${encoded}*)`;
    }

    // Calculate pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;

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

    const url = `${supabaseUrl}/rest/v1/products?select=*&order=createdAt.desc${filters}${searchFilter}&limit=${limit}&offset=${from}`;

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
    const countUrl = `${supabaseUrl}/rest/v1/products?select=count()${filters}${searchFilter}`;
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
