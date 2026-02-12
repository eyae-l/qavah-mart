/**
 * Error Handling Utilities
 * 
 * Provides centralized error handling, logging, and user-friendly error messages
 * for the Qavah-mart application.
 */

export type ErrorType = 
  | 'network'
  | 'validation'
  | 'authentication'
  | 'authorization'
  | 'not_found'
  | 'server'
  | 'unknown';

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: Error;
  statusCode?: number;
}

/**
 * Creates a standardized error object
 */
export function createError(
  type: ErrorType,
  message: string,
  originalError?: Error,
  statusCode?: number
): AppError {
  return {
    type,
    message,
    originalError,
    statusCode,
  };
}

/**
 * Logs errors appropriately based on environment
 */
export function logError(error: AppError | Error): void {
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error);
  }
  // In production, this would send to a monitoring service
}

/**
 * Gets a user-friendly error message based on error type
 */
export function getUserFriendlyMessage(error: AppError | Error): string {
  if ('type' in error) {
    switch (error.type) {
      case 'network':
        return 'Unable to connect. Please check your internet connection and try again.';
      case 'validation':
        return error.message || 'Please check your input and try again.';
      case 'authentication':
        return 'Please log in to continue.';
      case 'authorization':
        return 'You do not have permission to perform this action.';
      case 'not_found':
        return 'The requested resource was not found.';
      case 'server':
        return 'Something went wrong on our end. Please try again later.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  }
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Handles async operations with automatic error handling
 */
export async function handleAsync<T>(
  operation: () => Promise<T>,
  errorType: ErrorType = 'unknown',
  retryCount: number = 0
): Promise<{ data?: T; error?: AppError }> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      const data = await operation();
      return { data };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      logError(lastError);

      // Don't retry on validation or authentication errors
      if (errorType === 'validation' || errorType === 'authentication') {
        break;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < retryCount) {
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  const error = createError(
    errorType,
    getUserFriendlyMessage(createError(errorType, '', lastError)),
    lastError
  );

  return { error };
}

/**
 * Checks if an error is a network error
 */
export function isNetworkError(error: Error): boolean {
  return (
    error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('Failed to fetch')
  );
}

/**
 * Wraps a function with error handling
 */
export function withErrorHandling<T extends (...args: any[]) => any>(
  fn: T,
  errorType: ErrorType = 'unknown'
): T {
  return ((...args: Parameters<T>) => {
    try {
      const result = fn(...args);
      if (result instanceof Promise) {
        return result.catch((err: Error) => {
          const error = createError(errorType, '', err);
          logError(error);
          return Promise.reject(error);
        });
      }
      return result;
    } catch (err) {
      const error = createError(errorType, '', err instanceof Error ? err : new Error(String(err)));
      logError(error);
      throw error;
    }
  }) as T;
}
