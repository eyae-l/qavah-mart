/**
 * Unit tests for CategoryNav component
 * 
 * Tests:
 * - Renders all seven main categories
 * - Shows subcategories on hover (desktop)
 * - Highlights active category
 * - Mobile hamburger menu functionality
 * - Dropdown toggle functionality
 * 
 * Requirements: 9.3, 9.4, 8.1, 1.1
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import CategoryNav from './CategoryNav';
import { CATEGORY_STRUCTURE } from '@/types';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('CategoryNav', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Desktop Navigation', () => {
    test('renders all seven main categories', () => {
      render(<CategoryNav />);

      // Check that all seven categories are rendered
      expect(screen.getByText('Laptops')).toBeInTheDocument();
      expect(screen.getByText('Desktop Computers')).toBeInTheDocument();
      expect(screen.getByText('Computer Components')).toBeInTheDocument();
      expect(screen.getByText('Peripherals')).toBeInTheDocument();
      expect(screen.getByText('Networking Equipment')).toBeInTheDocument();
      expect(screen.getByText('Software & Licenses')).toBeInTheDocument();
      expect(screen.getByText('Computer Accessories')).toBeInTheDocument();
    });

    test('category links have correct href attributes', () => {
      render(<CategoryNav />);

      const laptopsLink = screen.getAllByRole('link', { name: /Laptops/i })[0];
      expect(laptopsLink).toHaveAttribute('href', '/categories/laptops');

      const desktopLink = screen.getAllByRole('link', { name: /Desktop Computers/i })[0];
      expect(desktopLink).toHaveAttribute('href', '/categories/desktop-computers');
    });

    test('highlights active category', () => {
      (usePathname as jest.Mock).mockReturnValue('/categories/laptops');
      render(<CategoryNav />);

      const laptopsLink = screen.getAllByRole('link', { name: /Laptops/i })[0];
      expect(laptopsLink).toHaveClass('bg-primary-600', 'text-white');
    });

    test('shows subcategories on mouse enter', async () => {
      render(<CategoryNav />);

      const laptopsLink = screen.getAllByRole('link', { name: /Laptops/i })[0];
      const parentLi = laptopsLink.closest('li');

      // Initially, subcategories should not be visible
      expect(screen.queryByText('Gaming')).not.toBeInTheDocument();

      // Hover over the category
      if (parentLi) {
        fireEvent.mouseEnter(parentLi);
      }

      // Subcategories should now be visible
      await waitFor(() => {
        expect(screen.getByText('Gaming')).toBeInTheDocument();
        expect(screen.getByText('Business')).toBeInTheDocument();
        expect(screen.getByText('Ultrabooks')).toBeInTheDocument();
        expect(screen.getByText('Budget')).toBeInTheDocument();
      });
    });

    test('hides subcategories on mouse leave', async () => {
      render(<CategoryNav />);

      const laptopsLink = screen.getAllByRole('link', { name: /Laptops/i })[0];
      const parentLi = laptopsLink.closest('li');

      // Hover over the category
      if (parentLi) {
        fireEvent.mouseEnter(parentLi);
      }

      // Wait for subcategories to appear
      await waitFor(() => {
        expect(screen.getByText('Gaming')).toBeInTheDocument();
      });

      // Mouse leave
      if (parentLi) {
        fireEvent.mouseLeave(parentLi);
      }

      // Wait for subcategories to disappear (with timeout delay)
      await waitFor(
        () => {
          expect(screen.queryByText('Gaming')).not.toBeInTheDocument();
        },
        { timeout: 300 }
      );
    });

    test('subcategory links have correct href attributes', async () => {
      render(<CategoryNav />);

      const laptopsLink = screen.getAllByRole('link', { name: /Laptops/i })[0];
      const parentLi = laptopsLink.closest('li');

      // Hover to show subcategories
      if (parentLi) {
        fireEvent.mouseEnter(parentLi);
      }

      await waitFor(() => {
        const gamingLink = screen.getByRole('link', { name: 'Gaming' });
        expect(gamingLink).toHaveAttribute('href', '/categories/laptops/gaming');
      });
    });

    test('highlights active subcategory', async () => {
      (usePathname as jest.Mock).mockReturnValue('/categories/laptops/gaming');
      render(<CategoryNav />);

      const laptopsLink = screen.getAllByRole('link', { name: /Laptops/i })[0];
      const parentLi = laptopsLink.closest('li');

      // Hover to show subcategories
      if (parentLi) {
        fireEvent.mouseEnter(parentLi);
      }

      await waitFor(() => {
        const gamingLink = screen.getByRole('link', { name: 'Gaming' });
        expect(gamingLink).toHaveClass('bg-primary-50', 'text-primary-700', 'font-medium');
      });
    });

    test('shows chevron icon for categories with subcategories', () => {
      render(<CategoryNav />);

      // Laptops has subcategories, should have chevron
      const laptopsLink = screen.getAllByRole('link', { name: /Laptops/i })[0];
      const chevron = laptopsLink.querySelector('svg');
      expect(chevron).toBeInTheDocument();
    });
  });

  describe('Mobile Navigation', () => {
    test('shows mobile menu button', () => {
      render(<CategoryNav />);

      const menuButton = screen.getByRole('button', { name: /Toggle categories menu/i });
      expect(menuButton).toBeInTheDocument();
      expect(menuButton).toHaveTextContent('Categories');
    });

    test('opens mobile menu on button click', () => {
      render(<CategoryNav />);

      const menuButton = screen.getByRole('button', { name: /Toggle categories menu/i });
      fireEvent.click(menuButton);

      // Mobile menu should be open - check for backdrop
      const backdrop = document.querySelector('.fixed.inset-0.bg-black');
      expect(backdrop).toBeInTheDocument();
    });

    test('closes mobile menu on backdrop click', () => {
      render(<CategoryNav />);

      const menuButton = screen.getByRole('button', { name: /Toggle categories menu/i });
      fireEvent.click(menuButton);

      // Click backdrop
      const backdrop = document.querySelector('.fixed.inset-0.bg-black');
      if (backdrop) {
        fireEvent.click(backdrop);
      }

      // Menu should be closed
      const backdropAfter = document.querySelector('.fixed.inset-0.bg-black');
      expect(backdropAfter).not.toBeInTheDocument();
    });

    test('closes mobile menu on escape key', () => {
      render(<CategoryNav />);

      const menuButton = screen.getByRole('button', { name: /Toggle categories menu/i });
      fireEvent.click(menuButton);

      // Press escape
      fireEvent.keyDown(document, { key: 'Escape' });

      // Menu should be closed
      const backdrop = document.querySelector('.fixed.inset-0.bg-black');
      expect(backdrop).not.toBeInTheDocument();
    });

    test('toggles subcategories in mobile menu', () => {
      render(<CategoryNav />);

      // Open mobile menu
      const menuButton = screen.getByRole('button', { name: /Toggle categories menu/i });
      fireEvent.click(menuButton);

      // Find and click the subcategory toggle for Laptops
      const subcategoryToggle = screen.getByRole('button', {
        name: /Toggle Laptops subcategories/i,
      });
      fireEvent.click(subcategoryToggle);

      // Subcategories should be visible
      expect(screen.getByText('Gaming')).toBeInTheDocument();
      expect(screen.getByText('Business')).toBeInTheDocument();

      // Click again to close
      fireEvent.click(subcategoryToggle);

      // Subcategories should be hidden
      expect(screen.queryByText('Gaming')).not.toBeInTheDocument();
    });

    test('mobile menu shows all categories', () => {
      render(<CategoryNav />);

      // Open mobile menu
      const menuButton = screen.getByRole('button', { name: /Toggle categories menu/i });
      fireEvent.click(menuButton);

      // All categories should be visible (using getAllByText since categories appear in both desktop and mobile)
      const categories = Object.values(CATEGORY_STRUCTURE);
      categories.forEach((category) => {
        const elements = screen.getAllByText(category.name);
        expect(elements.length).toBeGreaterThan(0);
      });
    });

    test('prevents body scroll when mobile menu is open', () => {
      render(<CategoryNav />);

      // Initially, body should be scrollable
      expect(document.body.style.overflow).toBe('');

      // Open mobile menu
      const menuButton = screen.getByRole('button', { name: /Toggle categories menu/i });
      fireEvent.click(menuButton);

      // Body scroll should be prevented
      expect(document.body.style.overflow).toBe('hidden');
    });
  });

  describe('Responsive Behavior', () => {
    test('desktop navigation is hidden on mobile', () => {
      render(<CategoryNav />);

      const desktopNav = document.querySelector('.hidden.md\\:block');
      expect(desktopNav).toBeInTheDocument();
    });

    test('mobile navigation is hidden on desktop', () => {
      render(<CategoryNav />);

      const mobileNav = document.querySelector('.md\\:hidden');
      expect(mobileNav).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('mobile menu button has proper aria attributes', () => {
      render(<CategoryNav />);

      const menuButton = screen.getByRole('button', { name: /Toggle categories menu/i });
      expect(menuButton).toHaveAttribute('aria-label', 'Toggle categories menu');
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');

      // Open menu
      fireEvent.click(menuButton);
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    });

    test('subcategory toggle buttons have proper aria attributes', () => {
      render(<CategoryNav />);

      // Open mobile menu
      const menuButton = screen.getByRole('button', { name: /Toggle categories menu/i });
      fireEvent.click(menuButton);

      const subcategoryToggle = screen.getByRole('button', {
        name: /Toggle Laptops subcategories/i,
      });
      expect(subcategoryToggle).toHaveAttribute('aria-label', 'Toggle Laptops subcategories');
      expect(subcategoryToggle).toHaveAttribute('aria-expanded', 'false');

      // Open subcategories
      fireEvent.click(subcategoryToggle);
      expect(subcategoryToggle).toHaveAttribute('aria-expanded', 'true');
    });

    test('all category links are keyboard accessible', () => {
      render(<CategoryNav />);

      const laptopsLink = screen.getAllByRole('link', { name: /Laptops/i })[0];
      expect(laptopsLink).toBeInTheDocument();
      
      // Link should be focusable
      laptopsLink.focus();
      expect(document.activeElement).toBe(laptopsLink);
    });
  });

  describe('Brown Theme Colors', () => {
    test('uses brown theme colors for active state', () => {
      (usePathname as jest.Mock).mockReturnValue('/categories/laptops');
      render(<CategoryNav />);

      const laptopsLink = screen.getAllByRole('link', { name: /Laptops/i })[0];
      expect(laptopsLink).toHaveClass('bg-primary-600', 'text-white');
    });

    test('uses brown theme colors for hover state', () => {
      render(<CategoryNav />);

      const laptopsLink = screen.getAllByRole('link', { name: /Laptops/i })[0];
      expect(laptopsLink).toHaveClass('hover:bg-primary-100', 'hover:text-primary-800');
    });

    test('navigation background uses brown theme', () => {
      render(<CategoryNav />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveClass('bg-primary-50', 'border-primary-200');
    });
  });
});
