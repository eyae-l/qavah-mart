import { render, screen, fireEvent } from '@testing-library/react';
import ErrorComponent from './error';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Error Component', () => {
  let mockReset: jest.Mock;
  let mockError: Error;

  beforeEach(() => {
    mockReset = jest.fn();
    mockError = new Error('Test error message');
    jest.clearAllMocks();
    // Suppress console.error for tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render error message', () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/We encountered an unexpected error/)).toBeInTheDocument();
  });

  it('should display Try Again button', () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);

    const tryAgainButton = screen.getByRole('button', { name: /Try Again/i });
    expect(tryAgainButton).toBeInTheDocument();
  });

  it('should display Go Home link', () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);

    const homeLink = screen.getByRole('link', { name: /Go Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should call reset function when Try Again is clicked', () => {
    render(<ErrorComponent error={mockError} reset={mockReset} />);

    const tryAgainButton = screen.getByRole('button', { name: /Try Again/i });
    fireEvent.click(tryAgainButton);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  it('should log error to console', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<ErrorComponent error={mockError} reset={mockReset} />);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Application error:', mockError);

    consoleErrorSpy.mockRestore();
  });
});
