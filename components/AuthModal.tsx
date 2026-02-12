'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

/**
 * AuthModal Component
 * 
 * Modal with tabs for login and register forms.
 * Features:
 * - Tab switching between login and register
 * - Form validation using React Hook Form and Zod
 * - Error messages for validation failures
 * - Authentication success/failure handling
 * 
 * Requirements: 4.1, 4.2
 */

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  region: z.string().min(1, 'Region is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [authError, setAuthError] = useState<string | null>(null);
  const { login, register } = useUser();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const handleLoginSubmit = async (data: LoginFormData) => {
    try {
      setAuthError(null);
      await login({ email: data.email, password: data.password });
      onClose();
      loginForm.reset();
    } catch (error) {
      setAuthError('Invalid email or password');
    }
  };

  const handleRegisterSubmit = async (data: RegisterFormData) => {
    try {
      setAuthError(null);
      await register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        location: {
          city: data.city,
          region: data.region,
          country: 'Ethiopia',
        },
      });
      onClose();
      registerForm.reset();
    } catch (error) {
      setAuthError('Registration failed. Please try again.');
    }
  };

  const handleClose = () => {
    setAuthError(null);
    loginForm.reset();
    registerForm.reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200">
          <h2 className="text-2xl font-bold text-neutral-900">
            {activeTab === 'login' ? 'Login' : 'Create Account'}
          </h2>
          <button
            onClick={handleClose}
            className="text-neutral-400 hover:text-neutral-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200">
          <button
            onClick={() => {
              setActiveTab('login');
              setAuthError(null);
            }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'login'
                ? 'text-primary-700 border-b-2 border-primary-700'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setActiveTab('register');
              setAuthError(null);
            }}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'register'
                ? 'text-primary-700 border-b-2 border-primary-700'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Auth Error */}
          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{authError}</p>
            </div>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium text-neutral-700 mb-1">
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  {...loginForm.register('email')}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
                {loginForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-neutral-700 mb-1">
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  {...loginForm.register('password')}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                {loginForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loginForm.formState.isSubmitting}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loginForm.formState.isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="register-firstName" className="block text-sm font-medium text-neutral-700 mb-1">
                    First Name
                  </label>
                  <input
                    id="register-firstName"
                    type="text"
                    {...registerForm.register('firstName')}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="John"
                  />
                  {registerForm.formState.errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.firstName.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="register-lastName" className="block text-sm font-medium text-neutral-700 mb-1">
                    Last Name
                  </label>
                  <input
                    id="register-lastName"
                    type="text"
                    {...registerForm.register('lastName')}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Doe"
                  />
                  {registerForm.formState.errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-neutral-700 mb-1">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  {...registerForm.register('email')}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
                {registerForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="register-phone" className="block text-sm font-medium text-neutral-700 mb-1">
                  Phone (Optional)
                </label>
                <input
                  id="register-phone"
                  type="tel"
                  {...registerForm.register('phone')}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="+251 912 345 678"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="register-city" className="block text-sm font-medium text-neutral-700 mb-1">
                    City
                  </label>
                  <input
                    id="register-city"
                    type="text"
                    {...registerForm.register('city')}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Addis Ababa"
                  />
                  {registerForm.formState.errors.city && (
                    <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="register-region" className="block text-sm font-medium text-neutral-700 mb-1">
                    Region
                  </label>
                  <input
                    id="register-region"
                    type="text"
                    {...registerForm.register('region')}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Addis Ababa"
                  />
                  {registerForm.formState.errors.region && (
                    <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.region.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-neutral-700 mb-1">
                  Password
                </label>
                <input
                  id="register-password"
                  type="password"
                  {...registerForm.register('password')}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                {registerForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="register-confirmPassword" className="block text-sm font-medium text-neutral-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="register-confirmPassword"
                  type="password"
                  {...registerForm.register('confirmPassword')}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{registerForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={registerForm.formState.isSubmitting}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {registerForm.formState.isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
