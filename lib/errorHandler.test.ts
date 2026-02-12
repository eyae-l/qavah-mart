import {
  createError,
  getUserFriendlyMessage,
  handleAsync,
  isNetworkError,
  withErrorHandling,
  logError,
} from './errorHandler';

describe('Error Handler', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createError', () => {
    it('should create an error object with all properties', () => {
      const originalError = new Error('Original error');
      const error = createError('network', 'Network error', originalError, 500);

      expect(error.type).toBe('network');
      expect(error.message).toBe('Network error');
      expect(error.originalError).toBe(originalError);
      expect(error.statusCode).toBe(500);
    });

    it('should create an error object without optional properties', () => {
      const error = createError('validation', 'Validation error');

      expect(error.type).toBe('validation');
      expect(error.message).toBe('Validation error');
      expect(error.originalError).toBeUndefined();
      expect(error.statusCode).toBeUndefined();
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should return network error message', () => {
      const error = createError('network', 'Network error');
      expect(getUserFriendlyMessage(error)).toBe(
        'Unable to connect. Please check your internet connection and try again.'
      );
    });

    it('should return validation error message', () => {
      const error = createError('validation', 'Invalid input');
      expect(getUserFriendlyMessage(error)).toBe('Invalid input');
    });

    it('should return authentication error message', () => {
      const error = createError('authentication', 'Not authenticated');
      expect(getUserFriendlyMessage(error)).toBe('Please log in to continue.');
    });

    it('should return authorization error message', () => {
      const error = createError('authorization', 'Not authorized');
      expect(getUserFriendlyMessage(error)).toBe(
        'You do not have permission to perform this action.'
      );
    });

    it('should return not found error message', () => {
      const error = createError('not_found', 'Resource not found');
      expect(getUserFriendlyMessage(error)).toBe('The requested resource was not found.');
    });

    it('should return server error message', () => {
      const error = createError('server', 'Server error');
      expect(getUserFriendlyMessage(error)).toBe(
        'Something went wrong on our end. Please try again later.'
      );
    });

    it('should return generic error message for unknown type', () => {
      const error = createError('unknown', 'Unknown error');
      expect(getUserFriendlyMessage(error)).toBe(
        'An unexpected error occurred. Please try again.'
      );
    });

    it('should handle regular Error objects', () => {
      const error = new Error('Regular error');
      expect(getUserFriendlyMessage(error)).toBe(
        'An unexpected error occurred. Please try again.'
      );
    });
  });

  describe('handleAsync', () => {
    it('should return data on successful operation', async () => {
      const operation = jest.fn().mockResolvedValue('success');
      const result = await handleAsync(operation);

      expect(result.data).toBe('success');
      expect(result.error).toBeUndefined();
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should return error on failed operation', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Failed'));
      const result = await handleAsync(operation, 'network');

      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error?.type).toBe('network');
    });

    it('should retry on network errors', async () => {
      const operation = jest
        .fn()
        .mockRejectedValueOnce(new Error('Failed'))
        .mockRejectedValueOnce(new Error('Failed'))
        .mockResolvedValue('success');

      const result = await handleAsync(operation, 'network', 2);

      expect(result.data).toBe('success');
      expect(operation).toHaveBeenCalledTimes(3);
    });

    it('should not retry on validation errors', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Invalid'));
      const result = await handleAsync(operation, 'validation', 2);

      expect(result.error).toBeDefined();
      expect(operation).toHaveBeenCalledTimes(1);
    });

    it('should not retry on authentication errors', async () => {
      const operation = jest.fn().mockRejectedValue(new Error('Not authenticated'));
      const result = await handleAsync(operation, 'authentication', 2);

      expect(result.error).toBeDefined();
      expect(operation).toHaveBeenCalledTimes(1);
    });
  });

  describe('isNetworkError', () => {
    it('should identify network errors', () => {
      expect(isNetworkError(new Error('Failed to fetch'))).toBe(true);
      expect(isNetworkError(new Error('network error'))).toBe(true);
      expect(isNetworkError(new Error('fetch failed'))).toBe(true);
    });

    it('should not identify non-network errors', () => {
      expect(isNetworkError(new Error('Validation error'))).toBe(false);
      expect(isNetworkError(new Error('Not found'))).toBe(false);
    });
  });

  describe('withErrorHandling', () => {
    it('should wrap synchronous functions', () => {
      const fn = jest.fn().mockReturnValue('success');
      const wrapped = withErrorHandling(fn);

      expect(wrapped()).toBe('success');
      expect(fn).toHaveBeenCalled();
    });

    it('should handle synchronous errors', () => {
      const fn = jest.fn().mockImplementation(() => {
        throw new Error('Sync error');
      });
      const wrapped = withErrorHandling(fn, 'validation');

      expect(() => wrapped()).toThrow();
    });

    it('should wrap asynchronous functions', async () => {
      const fn = jest.fn().mockResolvedValue('success');
      const wrapped = withErrorHandling(fn);

      await expect(wrapped()).resolves.toBe('success');
      expect(fn).toHaveBeenCalled();
    });

    it('should handle asynchronous errors', async () => {
      const fn = jest.fn().mockRejectedValue(new Error('Async error'));
      const wrapped = withErrorHandling(fn, 'network');

      await expect(wrapped()).rejects.toMatchObject({
        type: 'network',
        originalError: expect.any(Error),
      });
    });
  });

  describe('logError', () => {
    it('should log errors in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = createError('network', 'Network error');
      logError(error);

      expect(console.error).toHaveBeenCalledWith('Error:', error);

      process.env.NODE_ENV = originalEnv;
    });

    it('should handle regular Error objects', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Regular error');
      logError(error);

      expect(console.error).toHaveBeenCalledWith('Error:', error);

      process.env.NODE_ENV = originalEnv;
    });
  });
});
