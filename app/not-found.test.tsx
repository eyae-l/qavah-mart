import { render, screen } from '@testing-library/react';
import NotFound from './not-found';

// Mock Next.js Link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
});

describe('NotFound Component', () => {
  it('should render 404 message', () => {
    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('should display helpful message', () => {
    render(<NotFound />);

    expect(screen.getByText(/The page you're looking for doesn't exist/)).toBeInTheDocument();
  });

  it('should display Go Home link', () => {
    render(<NotFound />);

    const homeLink = screen.getByRole('link', { name: /Go Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('should display Go Back button', () => {
    render(<NotFound />);

    const backButton = screen.getByRole('button', { name: /Go Back/i });
    expect(backButton).toBeInTheDocument();
  });

  it('should display Search Products link', () => {
    render(<NotFound />);

    const searchLink = screen.getByRole('link', { name: /Search Products/i });
    expect(searchLink).toBeInTheDocument();
    expect(searchLink).toHaveAttribute('href', '/search');
  });
});
