import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToastProvider, useToast } from './ToastContext';

// Test component that uses the toast context
function TestComponent() {
  const { showToast, showSuccess, showError, showWarning, showInfo } = useToast();

  return (
    <div>
      <button onClick={() => showToast('Test toast')}>Show Toast</button>
      <button onClick={() => showSuccess('Success message')}>Show Success</button>
      <button onClick={() => showError('Error message')}>Show Error</button>
      <button onClick={() => showWarning('Warning message')}>Show Warning</button>
      <button onClick={() => showInfo('Info message')}>Show Info</button>
    </div>
  );
}

describe('ToastContext', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should throw error when useToast is used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useToast must be used within ToastProvider');

    consoleSpy.mockRestore();
  });

  it('should show toast when showToast is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText('Show Toast');
    fireEvent.click(button);

    expect(screen.getByText('Test toast')).toBeInTheDocument();
  });

  it('should show success toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText('Show Success');
    fireEvent.click(button);

    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('should show error toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText('Show Error');
    fireEvent.click(button);

    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should show warning toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText('Show Warning');
    fireEvent.click(button);

    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('should show info toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const button = screen.getByText('Show Info');
    fireEvent.click(button);

    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('should show multiple toasts', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Success'));
    fireEvent.click(screen.getByText('Show Error'));

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should remove toast after duration', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Show Toast'));
    expect(screen.getByText('Test toast')).toBeInTheDocument();

    jest.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(screen.queryByText('Test toast')).not.toBeInTheDocument();
    });
  });
});
