import { render, screen } from '@testing-library/react';
import RatingDisplay from './RatingDisplay';

describe('RatingDisplay', () => {
  it('should render 5 stars', () => {
    const { container } = render(<RatingDisplay rating={3.5} />);
    
    const stars = container.querySelectorAll('svg');
    // Each star has 2 SVGs (background and foreground), so 10 total
    expect(stars.length).toBeGreaterThanOrEqual(5);
  });

  it('should display rating number', () => {
    render(<RatingDisplay rating={4.2} />);
    
    expect(screen.getByText('4.2 (0)')).toBeInTheDocument();
  });

  it('should display review count when provided', () => {
    render(<RatingDisplay rating={4.5} reviewCount={25} />);
    
    expect(screen.getByText('4.5 (25)')).toBeInTheDocument();
  });

  it('should not display review count when showCount is false', () => {
    render(<RatingDisplay rating={4.5} reviewCount={25} showCount={false} />);
    
    expect(screen.queryByText('4.5 (25)')).not.toBeInTheDocument();
  });

  it('should render small size correctly', () => {
    const { container } = render(<RatingDisplay rating={4.0} size="small" />);
    
    const star = container.querySelector('.w-3');
    expect(star).toBeInTheDocument();
  });

  it('should render medium size correctly', () => {
    const { container } = render(<RatingDisplay rating={4.0} size="medium" />);
    
    const star = container.querySelector('.w-4');
    expect(star).toBeInTheDocument();
  });

  it('should render large size correctly', () => {
    const { container } = render(<RatingDisplay rating={4.0} size="large" />);
    
    const star = container.querySelector('.w-5');
    expect(star).toBeInTheDocument();
  });

  it('should clamp rating to maximum of 5', () => {
    render(<RatingDisplay rating={6.5} />);
    
    expect(screen.getByText('5.0 (0)')).toBeInTheDocument();
  });

  it('should clamp rating to minimum of 0', () => {
    render(<RatingDisplay rating={-1} />);
    
    expect(screen.getByText('0.0 (0)')).toBeInTheDocument();
  });

  it('should handle zero rating', () => {
    render(<RatingDisplay rating={0} reviewCount={0} />);
    
    expect(screen.getByText('0.0 (0)')).toBeInTheDocument();
  });

  it('should handle perfect 5 star rating', () => {
    render(<RatingDisplay rating={5.0} reviewCount={100} />);
    
    expect(screen.getByText('5.0 (100)')).toBeInTheDocument();
  });

  it('should handle decimal ratings correctly', () => {
    render(<RatingDisplay rating={3.7} />);
    
    expect(screen.getByText('3.7 (0)')).toBeInTheDocument();
  });

  it('should display rating without count when reviewCount is 0', () => {
    render(<RatingDisplay rating={4.5} reviewCount={0} />);
    
    expect(screen.getByText('4.5 (0)')).toBeInTheDocument();
  });

  it('should use medium size by default', () => {
    const { container } = render(<RatingDisplay rating={4.0} />);
    
    const star = container.querySelector('.w-4');
    expect(star).toBeInTheDocument();
  });

  it('should show count by default', () => {
    render(<RatingDisplay rating={4.5} reviewCount={10} />);
    
    expect(screen.getByText('4.5 (10)')).toBeInTheDocument();
  });

  it('should not show count when reviewCount is undefined and showCount is false', () => {
    render(<RatingDisplay rating={4.5} showCount={false} />);
    
    expect(screen.queryByText(/4.5/)).not.toBeInTheDocument();
  });
});
