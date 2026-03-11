'use client';

/**
 * Cart Item Component
 * Requirements: Shopping Cart Feature - Requirements 2, 3, 4
 */

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';
import { Trash2, Plus, Minus } from 'lucide-react';

interface CartItemProps {
  productId: string;
  product: Product;
  quantity: number;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export function CartItem({ productId, product, quantity, onUpdateQuantity, onRemove }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);

  const lineTotal = product.price * quantity;

  const handleIncrement = async () => {
    setIsUpdating(true);
    try {
      await onUpdateQuantity(quantity + 1);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDecrement = async () => {
    if (quantity > 1) {
      setIsUpdating(true);
      try {
        await onUpdateQuantity(quantity - 1);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleQuantityChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setIsUpdating(true);
      try {
        await onUpdateQuantity(value);
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await onRemove();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white border border-neutral-200 rounded-lg">
      {/* Product Image */}
      <Link href={`/products/${productId}`} className="flex-shrink-0">
        <div className="relative w-full sm:w-24 h-48 sm:h-24 bg-neutral-100 rounded-lg overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 96px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              No image
            </div>
          )}
        </div>
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link href={`/products/${productId}`} className="block">
          <h3 className="text-lg font-semibold text-neutral-900 hover:text-primary-700 transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>
        
        <p className="text-sm text-neutral-600 mt-1">
          Condition: <span className="capitalize">{product.condition}</span>
        </p>

        <div className="flex items-center justify-between mt-3 sm:mt-4">
          {/* Price */}
          <div>
            <p className="text-sm text-neutral-600">Price</p>
            <p className="text-lg font-bold text-primary-700">
              ETB {product.price.toFixed(2)}
            </p>
          </div>

          {/* Quantity Controls - Desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={handleDecrement}
              disabled={isUpdating || quantity <= 1}
              className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <input
              type="number"
              min="1"
              max="99"
              value={quantity}
              onChange={handleQuantityChange}
              disabled={isUpdating}
              className="w-16 px-2 py-2 text-center border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Quantity"
            />
            
            <button
              onClick={handleIncrement}
              disabled={isUpdating || quantity >= 99}
              className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Line Total - Desktop */}
          <div className="hidden sm:block text-right">
            <p className="text-sm text-neutral-600">Subtotal</p>
            <p className="text-xl font-bold text-neutral-900">
              ETB {lineTotal.toFixed(2)}
            </p>
          </div>

          {/* Remove Button - Desktop */}
          <button
            onClick={handleRemove}
            disabled={isUpdating}
            className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="sm:hidden mt-4 space-y-3">
          {/* Quantity Controls - Mobile */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Quantity</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecrement}
                disabled={isUpdating || quantity <= 1}
                className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              
              <input
                type="number"
                min="1"
                max="99"
                value={quantity}
                onChange={handleQuantityChange}
                disabled={isUpdating}
                className="w-16 px-2 py-2 text-center border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Quantity"
              />
              
              <button
                onClick={handleIncrement}
                disabled={isUpdating || quantity >= 99}
                className="p-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors touch-manipulation"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Line Total - Mobile */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-neutral-600">Subtotal</span>
            <span className="text-lg font-bold text-neutral-900">
              ETB {lineTotal.toFixed(2)}
            </span>
          </div>

          {/* Remove Button - Mobile */}
          <button
            onClick={handleRemove}
            disabled={isUpdating}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-red-600 border border-red-300 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 touch-manipulation"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
            Remove from Cart
          </button>
        </div>
      </div>
    </div>
  );
}
