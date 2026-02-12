import { render, screen } from '@testing-library/react';
import Loading from './loading';

describe('Loading Component', () => {
  it('should render loading message', () => {
    render(<Loading />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display loading spinner', () => {
    const { container } = render(<Loading />);

    // Check for spinner elements
    const spinners = container.querySelectorAll('.animate-spin');
    expect(spinners.length).toBeGreaterThan(0);
  });

  it('should have proper styling', () => {
    const { container } = render(<Loading />);

    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('min-h-screen');
    expect(mainDiv).toHaveClass('bg-white');
  });
});
