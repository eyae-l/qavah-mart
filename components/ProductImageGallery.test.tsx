import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductImageGallery from './ProductImageGallery';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe('ProductImageGallery', () => {
  const mockImages = [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ];

  const productTitle = 'Test Product';

  it('should render with images', () => {
    render(<ProductImageGallery images={mockImages} productTitle={productTitle} />);
    
    // Check if main image is displayed
    const mainImage = screen.getByAltText(`${productTitle} - Image 1`);
    expect(mainImage).toBeInTheDocument();
    expect(mainImage).toHaveAttribute('src', mockImages[0]);
  });

  it('should render placeholder when no images', () => {
    render(<ProductImageGallery images={[]} productTitle={productTitle} />);
    
    expect(screen.getByText('No Images Available')).toBeInTheDocument();
  });

  it('should display thumbnail navigation for multiple images', () => {
    render(<ProductImageGallery images={mockImages} productTitle={productTitle} />);
    
    // Check if thumbnails are displayed
    const thumbnails = screen.getAllByRole('button', { name: /View image/i });
    expect(thumbnails).toHaveLength(3);
  });

  it('should not display thumbnails for single image', () => {
    render(<ProductImageGallery images={[mockImages[0]]} productTitle={productTitle} />);
    
    // Thumbnails should not be present
    const thumbnails = screen.queryAllByRole('button', { name: /View image/i });
    expect(thumbnails).toHaveLength(0);
  });

  it('should change image when thumbnail is clicked', () => {
    render(<ProductImageGallery images={mockImages} productTitle={productTitle} />);
    
    // Click second thumbnail
    const thumbnails = screen.getAllByRole('button', { name: /View image/i });
    fireEvent.click(thumbnails[1]);
    
    // Check if main image changed
    const mainImage = screen.getByAltText(`${productTitle} - Image 2`);
    expect(mainImage).toHaveAttribute('src', mockImages[1]);
  });

  it('should navigate to next image', () => {
    render(<ProductImageGallery images={mockImages} productTitle={productTitle} />);
    
    // Click next button
    const nextButton = screen.getByRole('button', { name: 'Next image' });
    fireEvent.click(nextButton);
    
    // Check if image changed to second image
    const mainImage = screen.getByAltText(`${productTitle} - Image 2`);
    expect(mainImage).toHaveAttribute('src', mockImages[1]);
  });

  it('should navigate to previous image', () => {
    render(<ProductImageGallery images={mockImages} productTitle={productTitle} />);
    
    // Click previous button (should wrap to last image)
    const prevButton = screen.getByRole('button', { name: 'Previous image' });
    fireEvent.click(prevButton);
    
    // Check if image changed to last image
    const mainImage = screen.getByAltText(`${productTitle} - Image 3`);
    expect(mainImage).toHaveAttribute('src', mockImages[2]);
  });

  it('should wrap to first image when clicking next on last image', () => {
    render(<ProductImageGallery images={mockImages} productTitle={productTitle} />);
    
    // Navigate to last image
    const nextButton = screen.getByRole('button', { name: 'Next image' });
    fireEvent.click(nextButton); // Image 2
    fireEvent.click(nextButton); // Image 3
    fireEvent.click(nextButton); // Should wrap to Image 1
    
    // Check if wrapped to first image
    const mainImage = screen.getByAltText(`${productTitle} - Image 1`);
    expect(mainImage).toHaveAttribute('src', mockImages[0]);
  });

  it('should display image counter', () => {
    render(<ProductImageGallery images={mockImages} productTitle={productTitle} />);
    
    expect(screen.getByText('1 / 3')).toBeInTheDocument();
  });

  it('should update image counter when navigating', () => {
    render(<ProductImageGallery images={mockImages} productTitle={productTitle} />);
    
    // Click next button
    const nextButton = screen.getByRole('button', { name: 'Next image' });
    fireEvent.click(nextButton);
    
    expect(screen.getByText('2 / 3')).toBeInTheDocument();
  });

  it('should open zoom modal when zoom button is clicked', () => {
    render(<ProductImageGallery images={mockImages} productTitle={productTitle} />);
    
    // Click zoom button
    const zoomButton = screen.getByRole('button', { name: 'Zoom image' });
    fireEvent.click(zoomButton);
    
    // Check if zoomed image is displayed
    const zoomedImage = screen.getByAltText(`${productTitle} - Zoomed`);
    expect(zoomedImage).toBeInTheDocument();
  });

  it('should close zoom modal when close button is clicked', () => {
    render(<ProductImageGallery images={mockImages} productTitle={productTitle} />);
    
    // Open zoom
    const zoomButton = screen.getByRole('button', { name: 'Zoom image' });
    fireEvent.click(zoomButton);
    
    // Verify zoom is open
    expect(screen.getByAltText(`${productTitle} - Zoomed`)).toBeInTheDocument();
    
    // Close zoom
    const closeButton = screen.getByRole('button', { name: 'Close zoom' });
    fireEvent.click(closeButton);
    
    // Check if zoom modal is closed
    expect(screen.queryByAltText(`${productTitle} - Zoomed`)).not.toBeInTheDocument();
  });

  it('should close zoom modal when clicking outside', () => {
    render(<ProductImageGallery images={mockImages} productTitle={productTitle} />);
    
    // Open zoom
    const zoomButton = screen.getByRole('button', { name: 'Zoom image' });
    fireEvent.click(zoomButton);
    
    // Verify zoom is open
    const zoomedImage = screen.getByAltText(`${productTitle} - Zoomed`);
    expect(zoomedImage).toBeInTheDocument();
    
    // Find the modal backdrop (the outermost div with the click handler)
    const modal = document.querySelector('.fixed.inset-0.z-50');
    if (modal) {
      fireEvent.click(modal);
      
      // Check if zoom modal is closed
      expect(screen.queryByAltText(`${productTitle} - Zoomed`)).not.toBeInTheDocument();
    }
  });

  it('should navigate images in zoom mode', () => {
    render(<ProductImageGallery images={mockImages} productTitle={productTitle} />);
    
    // Open zoom
    const zoomButton = screen.getByRole('button', { name: 'Zoom image' });
    fireEvent.click(zoomButton);
    
    // Navigate to next image in zoom mode
    const nextButtons = screen.getAllByRole('button', { name: 'Next image' });
    const zoomNextButton = nextButtons[nextButtons.length - 1]; // Get the one in zoom modal
    fireEvent.click(zoomNextButton);
    
    // Check if image counter updated
    const counters = screen.getAllByText('2 / 3');
    expect(counters.length).toBeGreaterThan(0);
  });

  it('should not show navigation arrows for single image', () => {
    render(<ProductImageGallery images={[mockImages[0]]} productTitle={productTitle} />);
    
    // Navigation arrows should not be present
    const nextButton = screen.queryByRole('button', { name: 'Next image' });
    const prevButton = screen.queryByRole('button', { name: 'Previous image' });
    
    expect(nextButton).not.toBeInTheDocument();
    expect(prevButton).not.toBeInTheDocument();
  });

  it('should not show image counter for single image', () => {
    render(<ProductImageGallery images={[mockImages[0]]} productTitle={productTitle} />);
    
    expect(screen.queryByText('1 / 1')).not.toBeInTheDocument();
  });

  it('should have zoom button for images', () => {
    render(<ProductImageGallery images={mockImages} productTitle={productTitle} />);
    
    const zoomButton = screen.getByRole('button', { name: 'Zoom image' });
    expect(zoomButton).toBeInTheDocument();
  });

  it('should not have zoom button when no images', () => {
    render(<ProductImageGallery images={[]} productTitle={productTitle} />);
    
    const zoomButton = screen.queryByRole('button', { name: 'Zoom image' });
    expect(zoomButton).not.toBeInTheDocument();
  });

  it('should highlight selected thumbnail', () => {
    render(<ProductImageGallery images={mockImages} productTitle={productTitle} />);
    
    const thumbnails = screen.getAllByRole('button', { name: /View image/i });
    
    // First thumbnail should have selected styling
    expect(thumbnails[0]).toHaveClass('border-primary-600');
    
    // Click second thumbnail
    fireEvent.click(thumbnails[1]);
    
    // Second thumbnail should now have selected styling
    expect(thumbnails[1]).toHaveClass('border-primary-600');
  });
});

