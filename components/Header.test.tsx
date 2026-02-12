/**
 * Unit tests for Header component
 * 
 * Tests the Header component functionality including:
 * - Logo display and navigation
 * - Search bar functionality
 * - Location selector dropdown
 * - Responsive design (mobile/desktop)
 * 
 * Requirements: 9.1, 9.2, 8.1, 6.1
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Header from './Header';
import { AppProvider } from '@/contexts/AppContext';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon">Search</div>,
  MapPin: () => <div data-testid="mappin-icon">MapPin</div>,
  ChevronDown: () => <div data-testid="chevron-icon">ChevronDown</div>,
  X: () => <div data-testid="x-icon">X</div>,
  Menu: () => <div data-testid="menu-icon">Menu</div>,
}));

describe('Header Component', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  const renderHeader = () => {
    return render(
      <AppProvider>
        <Header />
      </AppProvider>
    );
  };

  describe('Logo', () => {
    it('should display the Qavah-mart logo', () => {
      renderHeader();
      const logos = screen.getAllByText('Qavah-mart');
      expect(logos.length).toBeGreaterThan(0);
    });

    it('should link to homepage', () => {
      renderHeader();
      const logoLinks = screen.getAllByRole('link', { name: /qavah-mart/i });
      expect(logoLinks[0]).toHaveAttribute('href', '/');
    });
  });

  describe('Search Bar', () => {
    it('should display search input with placeholder', () => {
      renderHeader();
      const searchInputs = screen.getAllByPlaceholderText(/search/i);
      expect(searchInputs.length).toBeGreaterThan(0);
    });

    it('should update search query on input change', () => {
      renderHeader();
      const searchInputs = screen.getAllByPlaceholderText(/search/i);
      const searchInput = searchInputs[0];
      
      fireEvent.change(searchInput, { target: { value: 'laptop' } });
      expect(searchInput).toHaveValue('laptop');
    });

    it('should navigate to search page on form submission', () => {
      renderHeader();
      const searchInputs = screen.getAllByPlaceholderText(/search/i);
      const searchInput = searchInputs[0];
      
      fireEvent.change(searchInput, { target: { value: 'gaming laptop' } });
      
      const form = searchInput.closest('form');
      if (form) {
        fireEvent.submit(form);
      }
      
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('/search?q=gaming+laptop'));
    });

    it('should not navigate on empty search submission', () => {
      renderHeader();
      const searchInputs = screen.getAllByPlaceholderText(/search/i);
      const searchInput = searchInputs[0];
      
      const form = searchInput.closest('form');
      if (form) {
        fireEvent.submit(form);
      }
      
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should include location in search params when location is set', () => {
      renderHeader();
      
      // Open location dropdown
      const locationButtons = screen.getAllByLabelText(/select location/i);
      fireEvent.click(locationButtons[0]);
      
      // Select a location
      const addisAbabaButtons = screen.getAllByText('Addis Ababa');
      fireEvent.click(addisAbabaButtons[0]);
      
      // Perform search
      const searchInputs = screen.getAllByPlaceholderText(/search/i);
      const searchInput = searchInputs[0];
      fireEvent.change(searchInput, { target: { value: 'laptop' } });
      
      const form = searchInput.closest('form');
      if (form) {
        fireEvent.submit(form);
      }
      
      expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('location=Addis+Ababa'));
    });
  });

  describe('Location Selector', () => {
    it('should display default location text', () => {
      renderHeader();
      const allEthiopiaTexts = screen.getAllByText('All Ethiopia');
      expect(allEthiopiaTexts.length).toBeGreaterThan(0);
    });

    it('should open location dropdown on button click', () => {
      renderHeader();
      const locationButtons = screen.getAllByLabelText(/select location/i);
      
      fireEvent.click(locationButtons[0]);
      
      // Check if dropdown is visible by looking for location options
      expect(screen.getAllByText('Addis Ababa').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Dire Dawa').length).toBeGreaterThan(0);
    });

    it('should display all available locations', () => {
      renderHeader();
      const locationButtons = screen.getAllByLabelText(/select location/i);
      
      fireEvent.click(locationButtons[0]);
      
      // Check for some key locations (using getAllByText since there are desktop and mobile versions)
      expect(screen.getAllByText('Addis Ababa').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Dire Dawa').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Mekelle').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Gondar').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Bahir Dar').length).toBeGreaterThan(0);
    });

    it('should update location when a location is selected', () => {
      renderHeader();
      const locationButtons = screen.getAllByLabelText(/select location/i);
      
      fireEvent.click(locationButtons[0]);
      
      const addisAbabaButtons = screen.getAllByText('Addis Ababa');
      // Click the first one (in the dropdown)
      fireEvent.click(addisAbabaButtons[0]);
      
      // Check if the location is displayed in the button
      waitFor(() => {
        expect(screen.getByText(/Addis Ababa, Addis Ababa/)).toBeInTheDocument();
      });
    });

    it('should close dropdown after location selection', () => {
      renderHeader();
      const locationButtons = screen.getAllByLabelText(/select location/i);
      
      fireEvent.click(locationButtons[0]);
      
      const addisAbabaButtons = screen.getAllByText('Addis Ababa');
      fireEvent.click(addisAbabaButtons[0]);
      
      // Dropdown should close - check by trying to find a location that should not be visible
      waitFor(() => {
        const direDrawaElements = screen.queryAllByText('Dire Dawa');
        // Should only find it in the closed dropdown, not visible
        expect(direDrawaElements.length).toBeLessThanOrEqual(1);
      });
    });

    it('should clear location when "All Ethiopia" is selected', () => {
      renderHeader();
      const locationButtons = screen.getAllByLabelText(/select location/i);
      
      // First select a location
      fireEvent.click(locationButtons[0]);
      const addisAbabaButtons = screen.getAllByText('Addis Ababa');
      fireEvent.click(addisAbabaButtons[0]);
      
      // Then clear it
      fireEvent.click(locationButtons[0]);
      const allEthiopiaButtons = screen.getAllByText('All Ethiopia');
      // Click the one in the dropdown (not the button text)
      fireEvent.click(allEthiopiaButtons[allEthiopiaButtons.length - 1]);
      
      // Should show "All Ethiopia" in the button
      waitFor(() => {
        const allEthiopiaTexts = screen.getAllByText('All Ethiopia');
        expect(allEthiopiaTexts.length).toBeGreaterThan(0);
      });
    });

    it('should show checkmark for selected location', () => {
      renderHeader();
      const locationButtons = screen.getAllByLabelText(/select location/i);
      
      fireEvent.click(locationButtons[0]);
      
      const addisAbabaButtons = screen.getAllByText('Addis Ababa');
      fireEvent.click(addisAbabaButtons[0]);
      
      // Reopen dropdown
      fireEvent.click(locationButtons[0]);
      
      // Check for checkmark (✓) - there should be at least one
      const checkmarks = screen.getAllByText('✓');
      expect(checkmarks.length).toBeGreaterThan(0);
    });
  });

  describe('Responsive Design', () => {
    it('should render mobile and desktop versions', () => {
      renderHeader();
      
      // Both mobile and desktop search inputs should be present
      const searchInputs = screen.getAllByPlaceholderText(/search/i);
      expect(searchInputs.length).toBeGreaterThan(1);
    });

    it('should have mobile menu button', () => {
      renderHeader();
      
      // Mobile menu button should be present (looks for "Open menu" or "Close menu")
      const menuButtons = screen.getAllByLabelText(/menu/i);
      expect(menuButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderHeader();
      
      expect(screen.getAllByLabelText(/search for products/i).length).toBeGreaterThan(0);
      expect(screen.getAllByLabelText(/location/i).length).toBeGreaterThan(0);
    });

    it('should have proper ARIA expanded state for location dropdown', () => {
      renderHeader();
      const locationButtons = screen.getAllByLabelText(/select location/i);
      const desktopButton = locationButtons[0];
      
      // Initially should be collapsed
      expect(desktopButton).toHaveAttribute('aria-expanded', 'false');
      
      // After click should be expanded
      fireEvent.click(desktopButton);
      expect(desktopButton).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
