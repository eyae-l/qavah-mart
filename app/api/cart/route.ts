/**
 * Cart API Routes
 * Requirements: Shopping Cart Feature - Requirements 5.2, 5.4, 5.6, 9.2
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '@/lib/clerkAuth';

const prisma = new PrismaClient();

/**
 * GET /api/cart
 * Retrieve cart for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    console.log('[API /api/cart GET] Request received');
    const user = await requireAuth();
    console.log('[API /api/cart GET] Authenticated user:', user.userId);

    const cart = await prisma.cart.findUnique({
      where: { userId: user.userId }
    });

    console.log('[API /api/cart GET] Cart found:', cart ? 'YES' : 'NO');
    console.log('[API /api/cart GET] Cart data:', JSON.stringify(cart));

    if (!cart) {
      console.log('[API /api/cart GET] No cart found, returning empty array');
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    console.log('[API /api/cart GET] Returning cart with items:', cart.items);
    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error('[API /api/cart GET] Error:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/cart
 * Create or update cart for authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    console.log('[API /api/cart POST] Request received');
    const user = await requireAuth();
    console.log('[API /api/cart POST] Authenticated user:', user.userId);
    
    const body = await request.json();
    console.log('[API /api/cart POST] Request body:', body);

    const { items } = body;

    if (!Array.isArray(items)) {
      console.error('[API /api/cart POST] Invalid items - not an array');
      return NextResponse.json(
        { error: 'Invalid cart items' },
        { status: 400 }
      );
    }

    // Validate cart items
    for (const item of items) {
      if (!item.productId || typeof item.quantity !== 'number' || item.quantity < 1) {
        console.error('[API /api/cart POST] Invalid item format:', item);
        return NextResponse.json(
          { error: 'Invalid cart item format' },
          { status: 400 }
        );
      }
    }

    console.log('[API /api/cart POST] Upserting cart with', items.length, 'items');
    const cart = await prisma.cart.upsert({
      where: { userId: user.userId },
      update: {
        items: items as any,
        updatedAt: new Date()
      },
      create: {
        userId: user.userId,
        items: items as any
      }
    });

    console.log('[API /api/cart POST] Cart saved successfully:', cart.id);
    return NextResponse.json(cart, { status: 200 });
  } catch (error) {
    console.error('[API /api/cart POST] Error:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/cart
 * Clear cart for authenticated user
 */
export async function DELETE(request: NextRequest) {
  try {
    const user = await requireAuth();

    await prisma.cart.delete({
      where: { userId: user.userId }
    }).catch(() => {
      // Ignore error if cart doesn't exist
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error clearing cart:', error);
    
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
