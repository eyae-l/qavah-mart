'use client';

/**
 * Shopping Cart Page
 * Requirements: Shopping Cart Feature - Requirements 2, 7, 8, 10
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { CartItem } from '@/components/CartItem';
import { Product } from '@/types';
import { ShoppingBag, ArrowLeft } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { items, itemCount, subtotal, total, isLoading, updateQuantity, removeItem } = useCart();
  const { showToast } = useToast();
  const [products, setProducts] = useState<Map<string, Product>>(new Map());
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Fetch product details for cart items
  useEffect(() => {
    const fetchProducts = async () => {
      if (items.length === 0) {
        setLoadingProducts(false);
        return;
      }

      try {
        const responses = await Promise.all(
          items.map(item => fetch(`/api/products-supabase/${item.productId}`))
        );
        
        const productData = await Promise.all(
          responses.map(async res => {
            if (res.ok) {
              const data = await res.json();
              return data.product; // Extract product from response
            }
            return null;
          })
        );

        const productMap = new Map<string, Product>();
        productData.forEach((product, index) => {
          if (product) {
            productMap.set(items[index].productId, product);
          }
        });

        setProducts(productMap);
      } catch (error) {
        console.error('Error fetching products:', error);
        showToast('Error loading cart items', 'error');
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [items]);

  const handleUpdateQuantity = async (productId: string, quantity: number) => {
    try {
      await updateQuantity(productId, quantity);
      showToast('Cart updated', 'success');
    } catch (error) {
      showToast('Failed to update quantity', 'error');
    }
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await removeItem(productId);
      showToast('Item removed from cart', 'success');
    } catch (error) {
      showToast('Failed to remove item', 'error');
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (isLoading || loadingProducts) {
    return (
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-neutral-900 mb-8">Shopping Cart</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">Your cart is empty</h2>
            <p className="text-neutral-600 mb-6">
              Add some products to your cart to get started
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">
            Shopping Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
          <Link
            href="/"
            className="hidden sm:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => {
              const product = products.get(item.productId);
              if (!product) return null;

              return (
                <CartItem
                  key={item.productId}
                  productId={item.productId}
                  product={product}
                  quantity={item.quantity}
                  onUpdateQuantity={(qty) => handleUpdateQuantity(item.productId, qty)}
                  onRemove={() => handleRemoveItem(item.productId)}
                />
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-xl font-bold text-neutral-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-neutral-600">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                  <span className="font-medium">ETB {subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex items-center justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>
                
                <div className="border-t border-neutral-200 pt-3">
                  <div className="flex items-center justify-between text-lg font-bold text-neutral-900">
                    <span>Total</span>
                    <span className="text-primary-700">ETB {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors mb-3"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/"
                className="block w-full py-3 text-center border border-neutral-300 text-neutral-700 font-medium rounded-lg hover:bg-neutral-50 transition-colors"
              >
                Continue Shopping
              </Link>

              <div className="mt-6 pt-6 border-t border-neutral-200">
                <p className="text-sm text-neutral-600">
                  <strong>Free shipping</strong> on orders over ETB 5,000
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Continue Shopping Button */}
        <div className="sm:hidden mt-6">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-3 text-primary-600 border border-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
