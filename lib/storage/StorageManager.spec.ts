/**
 * Unit Tests for StorageManager
 * Requirements: Shopping Cart Feature - Requirements 5, 9
 */

import { StorageManager } from './StorageManager';
import { LocalStorageAdapter } from './LocalStorageAdapter';
import { DatabaseAdapter } from './DatabaseAdapter';
import { CartItem } from '@/types';

jest.mock('./LocalStorageAdapter');
jest.mock('./DatabaseAdapter');

describe('StorageManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should use DatabaseAdapter for authenticated user', () => {
    new StorageManager('user-123');
    expect(DatabaseAdapter).toHaveBeenCalledWith('user-123');
  });

  it('should use LocalStorageAdapter for guest user', () => {
    new StorageManager(null);
    expect(LocalStorageAdapter).toHaveBeenCalled();
  });

  it('should delegate getCart to adapter', async () => {
    const mockGetCart = jest.fn().mockResolvedValue([]);
    (LocalStorageAdapter as any).mockImplementation(() => ({
      getCart: mockGetCart,
    }));

    const manager = new StorageManager(null);
    await manager.getCart();

    expect(mockGetCart).toHaveBeenCalled();
  });

  it('should delegate saveCart to adapter', async () => {
    const mockSaveCart = jest.fn().mockResolvedValue(undefined);
    (LocalStorageAdapter as any).mockImplementation(() => ({
      saveCart: mockSaveCart,
    }));

    const manager = new StorageManager(null);
    const items: CartItem[] = [
      { productId: 'product-1', quantity: 1, addedAt: new Date() },
    ];

    await manager.saveCart(items);

    expect(mockSaveCart).toHaveBeenCalledWith(items);
  });

  it('should delegate clearCart to adapter', async () => {
    const mockClearCart = jest.fn().mockResolvedValue(undefined);
    (LocalStorageAdapter as any).mockImplementation(() => ({
      clearCart: mockClearCart,
    }));

    const manager = new StorageManager(null);
    await manager.clearCart();

    expect(mockClearCart).toHaveBeenCalled();
  });

  it('should migrate cart from localStorage to database', async () => {
    const localItems: CartItem[] = [
      { productId: 'product-1', quantity: 1, addedAt: new Date('2024-01-01') },
    ];

    const remoteItems: CartItem[] = [
      { productId: 'product-2', quantity: 1, addedAt: new Date('2024-01-02') },
    ];

    const mergedItems: CartItem[] = [...localItems, ...remoteItems];

    const mockLocalGetCart = jest.fn().mockResolvedValue(localItems);
    const mockLocalClearCart = jest.fn().mockResolvedValue(undefined);
    const mockLocalMergeCart = jest.fn().mockReturnValue(mergedItems);

    const mockDatabaseGetCart = jest.fn().mockResolvedValue(remoteItems);
    const mockDatabaseSaveCart = jest.fn().mockResolvedValue(undefined);

    (LocalStorageAdapter as any).mockImplementation(() => ({
      getCart: mockLocalGetCart,
      clearCart: mockLocalClearCart,
      mergeCart: mockLocalMergeCart,
    }));

    (DatabaseAdapter as any).mockImplementation(() => ({
      getCart: mockDatabaseGetCart,
      saveCart: mockDatabaseSaveCart,
    }));

    const result = await StorageManager.migrateCart('user-123');

    expect(mockLocalGetCart).toHaveBeenCalled();
    expect(mockDatabaseGetCart).toHaveBeenCalled();
    expect(mockLocalMergeCart).toHaveBeenCalledWith(localItems, remoteItems);
    expect(mockDatabaseSaveCart).toHaveBeenCalledWith(mergedItems);
    expect(mockLocalClearCart).toHaveBeenCalled();
    expect(result).toEqual(mergedItems);
  });

  it('should transfer cart from database to localStorage', async () => {
    const databaseItems: CartItem[] = [
      { productId: 'product-1', quantity: 1, addedAt: new Date() },
    ];

    const mockDatabaseGetCart = jest.fn().mockResolvedValue(databaseItems);
    const mockLocalSaveCart = jest.fn().mockResolvedValue(undefined);

    (DatabaseAdapter as any).mockImplementation(() => ({
      getCart: mockDatabaseGetCart,
    }));

    (LocalStorageAdapter as any).mockImplementation(() => ({
      saveCart: mockLocalSaveCart,
    }));

    await StorageManager.transferToLocal('user-123');

    expect(mockDatabaseGetCart).toHaveBeenCalled();
    expect(mockLocalSaveCart).toHaveBeenCalledWith(databaseItems);
  });
});
