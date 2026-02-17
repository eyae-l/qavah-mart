/**
 * EmptyState Component
 * 
 * Reusable empty state component for various scenarios.
 * Provides consistent empty state experience across the app.
 * 
 * Requirements: 21.3 - Empty states
 */

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  suggestions?: string[];
  children?: ReactNode;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  suggestions,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        {Icon && (
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-neutral-100 rounded-full">
              <Icon className="w-10 h-10 text-neutral-400" aria-hidden="true" />
            </div>
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-semibold text-neutral-900 mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-neutral-600 mb-6">
          {description}
        </p>

        {/* Action Button */}
        {action && (
          <button
            onClick={action.onClick}
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors mb-6"
          >
            {action.label}
          </button>
        )}

        {/* Suggestions */}
        {suggestions && suggestions.length > 0 && (
          <div className="text-left bg-neutral-50 rounded-lg p-4 border border-neutral-200">
            <p className="text-sm font-medium text-neutral-900 mb-2">
              Suggestions:
            </p>
            <ul className="text-sm text-neutral-600 space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index}>• {suggestion}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Custom Children */}
        {children}
      </div>
    </div>
  );
}
