'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthModal from '@/components/AuthModal';
import { useUser } from '@/contexts/UserContext';

/**
 * Login Page
 * 
 * Displays authentication modal for user login.
 * Redirects to previous page or home after successful login.
 * 
 * Requirements: 4.1, 4.2
 */
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(true);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const returnUrl = searchParams.get('returnUrl') || '/';
      router.push(returnUrl);
    }
  }, [user, router, searchParams]);

  const handleClose = () => {
    setIsModalOpen(false);
    // Navigate back or to home
    const returnUrl = searchParams.get('returnUrl') || '/';
    router.push(returnUrl);
  };

  // Don't render if user is already logged in
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <AuthModal 
        isOpen={isModalOpen} 
        onClose={handleClose}
        defaultTab="login"
      />
    </div>
  );
}
