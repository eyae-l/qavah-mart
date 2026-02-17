import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReviewForm from './ReviewForm';
import { ReviewFormData } from '@/types';

describe('ReviewForm', () => {
  const mockProps = {
    productId: 'product-1',
    sellerId: 'seller-1',
    userId: 'user-1',
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields', () => {
    render(<ReviewForm {...mockProps} />);

    expect(screen.getByText(/your rating/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/review title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/your review/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit review/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('displays 5 star rating buttons', () => {
    render(<ReviewForm {...mockProps} />);

    for (let i = 1; i <= 5; i++) {
      expect(screen.getByLabelText(`Rate ${i} stars`)).toBeInTheDocument();
    }
  });

  it('updates rating when star is clicked', () => {
    render(<ReviewForm {...mockProps} />);

    const star3 = screen.getByLabelText('Rate 3 stars');
    fireEvent.click(star3);

    expect(screen.getByText('3 stars')).toBeInTheDocument();
  });

  it('updates title input value', () => {
    render(<ReviewForm {...mockProps} />);

    const titleInput = screen.getByLabelText(/review title/i) as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: 'Great product!' } });

    expect(titleInput.value).toBe('Great product!');
  });

  it('updates comment textarea value', () => {
    render(<ReviewForm {...mockProps} />);

    const commentTextarea = screen.getByLabelText(/your review/i) as HTMLTextAreaElement;
    fireEvent.change(commentTextarea, { target: { value: 'This is a detailed review.' } });

    expect(commentTextarea.value).toBe('This is a detailed review.');
  });

  it('shows character count for title', () => {
    render(<ReviewForm {...mockProps} />);

    const titleInput = screen.getByLabelText(/review title/i);
    fireEvent.change(titleInput, { target: { value: 'Test' } });

    expect(screen.getByText('4/100')).toBeInTheDocument();
  });

  it('shows character count for comment', () => {
    render(<ReviewForm {...mockProps} />);

    const commentTextarea = screen.getByLabelText(/your review/i);
    fireEvent.change(commentTextarea, { target: { value: 'Test comment' } });

    expect(screen.getByText('12/1000')).toBeInTheDocument();
  });

  it('shows validation error when rating is not selected', async () => {
    render(<ReviewForm {...mockProps} />);

    const titleInput = screen.getByLabelText(/review title/i);
    const commentTextarea = screen.getByLabelText(/your review/i);

    fireEvent.change(titleInput, { target: { value: 'Great product' } });
    fireEvent.change(commentTextarea, { target: { value: 'This is a great product with excellent features.' } });

    const submitButton = screen.getByRole('button', { name: /submit review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please select a rating')).toBeInTheDocument();
    });

    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error when title is empty', async () => {
    render(<ReviewForm {...mockProps} />);

    const star5 = screen.getByLabelText('Rate 5 stars');
    const commentTextarea = screen.getByLabelText(/your review/i);

    fireEvent.click(star5);
    fireEvent.change(commentTextarea, { target: { value: 'This is a great product with excellent features.' } });

    const submitButton = screen.getByRole('button', { name: /submit review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a title for your review')).toBeInTheDocument();
    });

    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error when title is too short', async () => {
    render(<ReviewForm {...mockProps} />);

    const star5 = screen.getByLabelText('Rate 5 stars');
    const titleInput = screen.getByLabelText(/review title/i);
    const commentTextarea = screen.getByLabelText(/your review/i);

    fireEvent.click(star5);
    fireEvent.change(titleInput, { target: { value: 'Hi' } });
    fireEvent.change(commentTextarea, { target: { value: 'This is a great product with excellent features.' } });

    const submitButton = screen.getByRole('button', { name: /submit review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title must be at least 3 characters')).toBeInTheDocument();
    });

    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error when comment is empty', async () => {
    render(<ReviewForm {...mockProps} />);

    const star5 = screen.getByLabelText('Rate 5 stars');
    const titleInput = screen.getByLabelText(/review title/i);

    fireEvent.click(star5);
    fireEvent.change(titleInput, { target: { value: 'Great product' } });

    const submitButton = screen.getByRole('button', { name: /submit review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter your review')).toBeInTheDocument();
    });

    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('shows validation error when comment is too short', async () => {
    render(<ReviewForm {...mockProps} />);

    const star5 = screen.getByLabelText('Rate 5 stars');
    const titleInput = screen.getByLabelText(/review title/i);
    const commentTextarea = screen.getByLabelText(/your review/i);

    fireEvent.click(star5);
    fireEvent.change(titleInput, { target: { value: 'Great product' } });
    fireEvent.change(commentTextarea, { target: { value: 'Short' } });

    const submitButton = screen.getByRole('button', { name: /submit review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Review must be at least 10 characters')).toBeInTheDocument();
    });

    expect(mockProps.onSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    render(<ReviewForm {...mockProps} />);

    const star4 = screen.getByLabelText('Rate 4 stars');
    const titleInput = screen.getByLabelText(/review title/i);
    const commentTextarea = screen.getByLabelText(/your review/i);

    fireEvent.click(star4);
    fireEvent.change(titleInput, { target: { value: 'Excellent laptop' } });
    fireEvent.change(commentTextarea, { target: { value: 'This laptop exceeded my expectations. Great performance and build quality.' } });

    const submitButton = screen.getByRole('button', { name: /submit review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        rating: 4,
        title: 'Excellent laptop',
        comment: 'This laptop exceeded my expectations. Great performance and build quality.',
      });
    });
  });

  it('trims whitespace from title and comment before submission', async () => {
    render(<ReviewForm {...mockProps} />);

    const star5 = screen.getByLabelText('Rate 5 stars');
    const titleInput = screen.getByLabelText(/review title/i);
    const commentTextarea = screen.getByLabelText(/your review/i);

    fireEvent.click(star5);
    fireEvent.change(titleInput, { target: { value: '  Great product  ' } });
    fireEvent.change(commentTextarea, { target: { value: '  This is a great product with excellent features.  ' } });

    const submitButton = screen.getByRole('button', { name: /submit review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockProps.onSubmit).toHaveBeenCalledWith({
        rating: 5,
        title: 'Great product',
        comment: 'This is a great product with excellent features.',
      });
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<ReviewForm {...mockProps} />);

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockProps.onCancel).toHaveBeenCalled();
  });

  it('disables buttons while submitting', async () => {
    const slowOnSubmit = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<ReviewForm {...mockProps} onSubmit={slowOnSubmit} />);

    const star5 = screen.getByLabelText('Rate 5 stars');
    const titleInput = screen.getByLabelText(/review title/i);
    const commentTextarea = screen.getByLabelText(/your review/i);

    fireEvent.click(star5);
    fireEvent.change(titleInput, { target: { value: 'Great product' } });
    fireEvent.change(commentTextarea, { target: { value: 'This is a great product with excellent features.' } });

    const submitButton = screen.getByRole('button', { name: /submit review/i });
    const cancelButton = screen.getByRole('button', { name: /cancel/i });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });
  });

  it('clears rating error when rating is selected', async () => {
    render(<ReviewForm {...mockProps} />);

    const titleInput = screen.getByLabelText(/review title/i);
    const commentTextarea = screen.getByLabelText(/your review/i);

    fireEvent.change(titleInput, { target: { value: 'Great product' } });
    fireEvent.change(commentTextarea, { target: { value: 'This is a great product with excellent features.' } });

    const submitButton = screen.getByRole('button', { name: /submit review/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please select a rating')).toBeInTheDocument();
    });

    const star5 = screen.getByLabelText('Rate 5 stars');
    fireEvent.click(star5);

    expect(screen.queryByText('Please select a rating')).not.toBeInTheDocument();
  });

  it('enforces maximum title length via maxLength attribute', () => {
    render(<ReviewForm {...mockProps} />);

    const titleInput = screen.getByLabelText(/review title/i) as HTMLInputElement;

    expect(titleInput).toHaveAttribute('maxLength', '100');
  });

  it('enforces maximum comment length via maxLength attribute', () => {
    render(<ReviewForm {...mockProps} />);

    const commentTextarea = screen.getByLabelText(/your review/i) as HTMLTextAreaElement;

    expect(commentTextarea).toHaveAttribute('maxLength', '1000');
  });
});
