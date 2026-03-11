'use client';

/**
 * Cart Icon Component with Item Count Badge
 * Requirements: Shopping Cart Feature - Requirement 6
 */

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

interface CartIconProps {
  className?: string;
}

export function CartIcon({ className = '' }: CartIconProps) {
  const { itemCount, isLoading } = useCart();

  return (
    <Link
      href="/cart"
      className={`relative inline-flex items-center justify-center p-2 rounded-lg hover:bg-primary-50 transition-colors ${className}`}
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      {/* Shopping Cart SVG Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 text-primary-700"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
        />
      </svg>

      {/* Item Count Badge */}
      {!isLoading && itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-primary-600 rounded-full">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}
