'use client';

/**
 * Add to Cart Button Component
 * Requirements: Shopping Cart Feature - Requirement 1
 */

import React, { useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { ShoppingCart, Check } from 'lucide-react';

interface AddToCartButtonProps {
  productId: string;
  productTitle: string;
  disabled?: boolean;
  className?: string;
}

export function AddToCartButton({ 
  productId, 
  productTitle, 
  disabled = false, 
  className = '' 
}: AddToCartButtonProps) {
  const { addItem, hasItem } = useCart();
  const { showToast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const inCart = hasItem(productId);

  const handleAddToCart = async () => {
    if (disabled || isAdding) return;

    setIsAdding(true);
    try {
      await addItem(productId, 1);
      setJustAdded(true);
      showToast(`${productTitle} added to cart`, 'success');
      
      // Reset "just added" state after 2 seconds
      setTimeout(() => {
        setJustAdded(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      showToast('Failed to add item to cart', 'error');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      className={`
        flex items-center justify-center gap-2 px-6 py-3 
        font-semibold rounded-lg transition-all
        disabled:opacity-50 disabled:cursor-not-allowed
        touch-manipulation
        ${justAdded 
          ? 'bg-green-600 hover:bg-green-700 text-white' 
          : 'bg-primary-600 hover:bg-primary-700 text-white'
        }
        ${className}
      `}
      aria-label={inCart ? 'Add another to cart' : 'Add to cart'}
    >
      {isAdding ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          <span>Adding...</span>
        </>
      ) : justAdded ? (
        <>
          <Check className="w-5 h-5" />
          <span>Added to Cart!</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          <span>{inCart ? 'Add Another' : 'Add to Cart'}</span>
        </>
      )}
    </button>
  );
}
