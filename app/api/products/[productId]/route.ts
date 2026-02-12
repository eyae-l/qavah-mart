/**
 * Single Product API
 * GET /api/products/[productId] - Get single product
 * PUT /api/products/[productId] - Update product (authenticated, owner only)
 * DELETE /api/products/[productId] - Delete product (authenticated, owner only)
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        seller: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                city: true,
                region: true,
                createdAt: true,
              },
            },
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Calculate average rating
    const avgRating = product.reviews.length > 0
      ? product.reviews.reduce((sum: number, r) => sum + r.rating, 0) / product.reviews.length
      : 0;

    return NextResponse.json({
      ...product,
      averageRating: Math.round(avgRating * 10) / 10,
      reviewCount: product.reviews.length,
    });
  } catch (error) {
    console.error('Get product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

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

    // Get product to check ownership
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        seller: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user owns this product
    if (product.seller.userId !== payload.userId) {
      return NextResponse.json(
        { error: 'Forbidden: You can only update your own products' },
        { status: 403 }
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

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price }),
        ...(category && { category }),
        ...(subcategory && { subcategory }),
        ...(condition && { condition }),
        ...(images && { images }),
        ...(specifications && { specifications }),
        ...(city && { city }),
        ...(region && { region }),
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

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

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

    // Get product to check ownership
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        seller: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if user owns this product
    if (product.seller.userId !== payload.userId) {
      return NextResponse.json(
        { error: 'Forbidden: You can only delete your own products' },
        { status: 403 }
      );
    }

    // Delete product (reviews will be cascade deleted)
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
