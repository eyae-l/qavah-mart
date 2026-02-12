import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { LocationProvider, useLocation } from './LocationContext';
import { mockLocations } from '@/data/mockData';

// Test component that uses the LocationContext
function TestComponent() {
  const { currentLocation, availableLocations, setLocation, clearLocation } = useLocation();

  return (
    <div>
      <div data-testid="current-location">{currentLocation || 'No location'}</div>
      <div data-testid="available-count">{availableLocations.length}</div>
      <button onClick={() => setLocation('Addis Ababa')}>Set Addis Ababa</button>
      <button onClick={() => setLocation('Dire Dawa')}>Set Dire Dawa</button>
      <button onClick={clearLocation}>Clear Location</button>
    </div>
  );
}

describe('LocationContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Provider', () => {
    it('should provide location context to children', () => {
      render(
        <LocationProvider>
          <TestComponent />
        </LocationProvider>
      );

      expect(screen.getByTestId('current-location')).toHaveTextContent('No location');
    });

    it('should provide available locations from mock data', () => {
      render(
        <LocationProvider>
          <TestComponent />
        </LocationProvider>
      );

      const availableCount = screen.getByTestId('available-count');
      expect(availableCount).toHaveTextContent(mockLocations.length.toString());
    });

    it('should throw error when useLocation is used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useLocation must be used within a LocationProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('setLocation', () => {
    it('should set current location', () => {
      render(
        <LocationProvider>
          <TestComponent />
        </LocationProvider>
      );

      const setButton = screen.getByText('Set Addis Ababa');
      act(() => {
        setButton.click();
      });

      expect(screen.getByTestId('current-location')).toHaveTextContent('Addis Ababa');
    });

    it('should save location to localStorage', () => {
      render(
        <LocationProvider>
          <TestComponent />
        </LocationProvider>
      );

      const setButton = screen.getByText('Set Addis Ababa');
      act(() => {
        setButton.click();
      });

      expect(localStorage.getItem('qavah_location')).toBe('Addis Ababa');
    });

    it('should update location when set multiple times', () => {
      render(
        <LocationProvider>
          <TestComponent />
        </LocationProvider>
      );

      const setAddisButton = screen.getByText('Set Addis Ababa');
      const setDireButton = screen.getByText('Set Dire Dawa');

      act(() => {
        setAddisButton.click();
      });

      expect(screen.getByTestId('current-location')).toHaveTextContent('Addis Ababa');

      act(() => {
        setDireButton.click();
      });

      expect(screen.getByTestId('current-location')).toHaveTextContent('Dire Dawa');
      expect(localStorage.getItem('qavah_location')).toBe('Dire Dawa');
    });
  });

  describe('clearLocation', () => {
    it('should clear current location', () => {
      render(
        <LocationProvider>
          <TestComponent />
        </LocationProvider>
      );

      const setButton = screen.getByText('Set Addis Ababa');
      const clearButton = screen.getByText('Clear Location');

      act(() => {
        setButton.click();
      });

      expect(screen.getByTestId('current-location')).toHaveTextContent('Addis Ababa');

      act(() => {
        clearButton.click();
      });

      expect(screen.getByTestId('current-location')).toHaveTextContent('No location');
    });

    it('should remove location from localStorage', () => {
      render(
        <LocationProvider>
          <TestComponent />
        </LocationProvider>
      );

      const setButton = screen.getByText('Set Addis Ababa');
      const clearButton = screen.getByText('Clear Location');

      act(() => {
        setButton.click();
      });

      expect(localStorage.getItem('qavah_location')).toBe('Addis Ababa');

      act(() => {
        clearButton.click();
      });

      expect(localStorage.getItem('qavah_location')).toBeNull();
    });

    it('should handle clearing when no location is set', () => {
      render(
        <LocationProvider>
          <TestComponent />
        </LocationProvider>
      );

      const clearButton = screen.getByText('Clear Location');

      act(() => {
        clearButton.click();
      });

      expect(screen.getByTestId('current-location')).toHaveTextContent('No location');
      expect(localStorage.getItem('qavah_location')).toBeNull();
    });
  });

  describe('localStorage persistence', () => {
    it('should load location from localStorage on mount', async () => {
      localStorage.setItem('qavah_location', 'Bahir Dar');

      render(
        <LocationProvider>
          <TestComponent />
        </LocationProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-location')).toHaveTextContent('Bahir Dar');
      });
    });

    it('should handle invalid localStorage data gracefully', async () => {
      localStorage.setItem('qavah_location', 'Test Location');

      render(
        <LocationProvider>
          <TestComponent />
        </LocationProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-location')).toHaveTextContent('Test Location');
      });
    });

    it('should start with no location when localStorage is empty', () => {
      render(
        <LocationProvider>
          <TestComponent />
        </LocationProvider>
      );

      expect(screen.getByTestId('current-location')).toHaveTextContent('No location');
    });
  });

  describe('availableLocations', () => {
    it('should provide all available locations', () => {
      render(
        <LocationProvider>
          <TestComponent />
        </LocationProvider>
      );

      const availableCount = screen.getByTestId('available-count');
      expect(parseInt(availableCount.textContent || '0')).toBeGreaterThan(0);
    });

    it('should not modify available locations when setting current location', () => {
      render(
        <LocationProvider>
          <TestComponent />
        </LocationProvider>
      );

      const initialCount = screen.getByTestId('available-count').textContent;

      const setButton = screen.getByText('Set Addis Ababa');
      act(() => {
        setButton.click();
      });

      expect(screen.getByTestId('available-count')).toHaveTextContent(initialCount || '');
    });
  });

  describe('Multiple consumers', () => {
    function SecondTestComponent() {
      const { currentLocation } = useLocation();
      return <div data-testid="second-location">{currentLocation || 'No location'}</div>;
    }

    it('should share state between multiple consumers', () => {
      render(
        <LocationProvider>
          <TestComponent />
          <SecondTestComponent />
        </LocationProvider>
      );

      const setButton = screen.getByText('Set Addis Ababa');
      act(() => {
        setButton.click();
      });

      expect(screen.getByTestId('current-location')).toHaveTextContent('Addis Ababa');
      expect(screen.getByTestId('second-location')).toHaveTextContent('Addis Ababa');
    });

    it('should update all consumers when location changes', () => {
      render(
        <LocationProvider>
          <TestComponent />
          <SecondTestComponent />
        </LocationProvider>
      );

      const setButton = screen.getByText('Set Addis Ababa');
      const clearButton = screen.getByText('Clear Location');

      act(() => {
        setButton.click();
      });

      expect(screen.getByTestId('current-location')).toHaveTextContent('Addis Ababa');
      expect(screen.getByTestId('second-location')).toHaveTextContent('Addis Ababa');

      act(() => {
        clearButton.click();
      });

      expect(screen.getByTestId('current-location')).toHaveTextContent('No location');
      expect(screen.getByTestId('second-location')).toHaveTextContent('No location');
    });
  });
});
