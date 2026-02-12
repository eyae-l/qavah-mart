import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Toast from './Toast';

describe('Toast Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should render toast with message', () => {
    render(<Toast message="Test message" />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should render success toast', () => {
    render(<Toast message="Success" type="success" />);
    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-green-50');
  });

  it('should render error toast', () => {
    render(<Toast message="Error" type="error" />);
    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-red-50');
  });

  it('should render warning toast', () => {
    render(<Toast message="Warning" type="warning" />);
    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-yellow-50');
  });

  it('should render info toast', () => {
    render(<Toast message="Info" type="info" />);
    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-blue-50');
  });

  it('should auto-dismiss after duration', async () => {
    const onClose = jest.fn();
    render(<Toast message="Test" duration={1000} onClose={onClose} />);

    expect(screen.getByText('Test')).toBeInTheDocument();

    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('should close when close button is clicked', () => {
    const onClose = jest.fn();
    render(<Toast message="Test" onClose={onClose} />);

    const closeButton = screen.getByLabelText('Close notification');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalled();
  });

  it('should have proper accessibility attributes', () => {
    render(<Toast message="Test" />);
    const toast = screen.getByRole('alert');
    expect(toast).toHaveAttribute('aria-live', 'polite');
  });
});
