import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders with custom message', () => {
    render(<LoadingSpinner message="Loading products..." />);
    expect(screen.getByText('Loading products...')).toBeInTheDocument();
  });

  it('renders small size', () => {
    const { container } = render(<LoadingSpinner size="small" />);
    const spinner = container.querySelector('.w-6');
    expect(spinner).toBeInTheDocument();
  });

  it('renders medium size', () => {
    const { container } = render(<LoadingSpinner size="medium" />);
    const spinner = container.querySelector('.w-12');
    expect(spinner).toBeInTheDocument();
  });

  it('renders large size', () => {
    const { container } = render(<LoadingSpinner size="large" />);
    const spinner = container.querySelector('.w-20');
    expect(spinner).toBeInTheDocument();
  });

  it('renders fullScreen mode', () => {
    const { container } = render(<LoadingSpinner fullScreen />);
    const fullScreenDiv = container.querySelector('.min-h-screen');
    expect(fullScreenDiv).toBeInTheDocument();
  });

  it('renders without fullScreen mode by default', () => {
    const { container } = render(<LoadingSpinner />);
    const fullScreenDiv = container.querySelector('.min-h-screen');
    expect(fullScreenDiv).not.toBeInTheDocument();
  });
});
