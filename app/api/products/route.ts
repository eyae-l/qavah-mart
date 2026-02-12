/**
 * Products API
 * GET /api/products - List products with filters
 * POST /api/products - Create product (authenticated)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

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
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build where clause
    const where: any = {};

    if (category) where.category = category;
    if (subcategory) where.subcategory = subcategory;
    if (condition) where.condition = condition;
    if (city) where.city = city;
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count
    const total = await prisma.product.count({ where });

    // Get products
    const products = await prisma.product.findMany({
      where,
      include: {
        seller: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                city: true,
                region: true,
              },
            },
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Calculate average ratings
    const productsWithRatings = products.map(product => {
      const avgRating = product.reviews.length > 0
        ? product.reviews.reduce((sum: number, r) => sum + r.rating, 0) / product.reviews.length
        : 0;
      
      const { reviews, ...productData } = product;
      
      return {
        ...productData,
        averageRating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
      };
    });

    return NextResponse.json({
      products: productsWithRatings,
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
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      price,
      category,
      subcategory,
      condition,
      images,
      specifications,
      city,
      region,
    } = body;

    // Validate required fields
    if (!title || !description || !price || !category || !subcategory || !condition || !city || !region) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get or create seller for user
    let seller = await prisma.seller.findUnique({
      where: { userId: payload.userId },
    });

    if (!seller) {
      // Create seller profile if doesn't exist
      seller = await prisma.seller.create({
        data: {
          userId: payload.userId,
          businessName: `${payload.email}'s Store`,
          rating: 0,
          totalSales: 0,
        },
      });
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        category,
        subcategory,
        condition,
        images: images || [],
        specifications: specifications || {},
        city,
        region,
        country: 'Ethiopia',
        sellerId: seller.id,
      },
      include: {
        seller: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                city: true,
                region: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Create product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
