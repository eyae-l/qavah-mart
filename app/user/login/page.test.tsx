import { render, screen, waitFor } from '@testing-library/react';
import { useRouter, useSearchParams } from 'next/navigation';
import LoginPage from './page';
import { UserProvider } from '@/contexts/UserContext';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock AuthModal
jest.mock('@/components/AuthModal', () => {
  return function MockAuthModal({ isOpen, onClose, defaultTab }: any) {
    return isOpen ? (
      <div data-testid="auth-modal" data-default-tab={defaultTab}>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null;
  };
});

describe('LoginPage', () => {
  const mockPush = jest.fn();
  const mockGet = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useSearchParams as jest.Mock).mockReturnValue({ get: mockGet });
  });

  const renderWithProvider = (ui: React.ReactElement) => {
    return render(
      <UserProvider>
        {ui}
      </UserProvider>
    );
  };

  it('should render auth modal with login tab', () => {
    mockGet.mockReturnValue(null);
    renderWithProvider(<LoginPage />);
    
    const modal = screen.getByTestId('auth-modal');
    expect(modal).toBeInTheDocument();
    expect(modal).toHaveAttribute('data-default-tab', 'login');
  });

  it('should have proper page styling', () => {
    mockGet.mockReturnValue(null);
    const { container } = renderWithProvider(<LoginPage />);
    
    const pageDiv = container.querySelector('.min-h-screen');
    expect(pageDiv).toBeInTheDocument();
    expect(pageDiv).toHaveClass('bg-neutral-50', 'flex', 'items-center', 'justify-center');
  });

  it('should navigate to home when modal is closed', () => {
    mockGet.mockReturnValue(null);
    renderWithProvider(<LoginPage />);
    
    const closeButton = screen.getByText('Close');
    closeButton.click();

    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should navigate to returnUrl when modal is closed', () => {
    mockGet.mockReturnValue('/categories/laptops');
    renderWithProvider(<LoginPage />);
    
    const closeButton = screen.getByText('Close');
    closeButton.click();

    expect(mockPush).toHaveBeenCalledWith('/categories/laptops');
  });
});
