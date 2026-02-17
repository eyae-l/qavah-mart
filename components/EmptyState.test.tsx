import { render, screen, fireEvent } from '@testing-library/react';
import { Package } from 'lucide-react';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  it('renders with title and description', () => {
    render(
      <EmptyState
        title="No items found"
        description="There are no items to display"
      />
    );
    
    expect(screen.getByText('No items found')).toBeInTheDocument();
    expect(screen.getByText('There are no items to display')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    const { container } = render(
      <EmptyState
        icon={Package}
        title="No items"
        description="No items available"
      />
    );
    
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders without icon', () => {
    const { container } = render(
      <EmptyState
        title="No items"
        description="No items available"
      />
    );
    
    const icon = container.querySelector('svg');
    expect(icon).not.toBeInTheDocument();
  });

  it('renders with action button', () => {
    const handleClick = jest.fn();
    render(
      <EmptyState
        title="No items"
        description="No items available"
        action={{
          label: 'Create Item',
          onClick: handleClick,
        }}
      />
    );
    
    const button = screen.getByRole('button', { name: 'Create Item' });
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders without action button', () => {
    render(
      <EmptyState
        title="No items"
        description="No items available"
      />
    );
    
    const button = screen.queryByRole('button');
    expect(button).not.toBeInTheDocument();
  });

  it('renders with suggestions', () => {
    render(
      <EmptyState
        title="No items"
        description="No items available"
        suggestions={[
          'Try different keywords',
          'Remove some filters',
          'Browse categories',
        ]}
      />
    );
    
    expect(screen.getByText('Suggestions:')).toBeInTheDocument();
    expect(screen.getByText('• Try different keywords')).toBeInTheDocument();
    expect(screen.getByText('• Remove some filters')).toBeInTheDocument();
    expect(screen.getByText('• Browse categories')).toBeInTheDocument();
  });

  it('renders without suggestions', () => {
    render(
      <EmptyState
        title="No items"
        description="No items available"
      />
    );
    
    expect(screen.queryByText('Suggestions:')).not.toBeInTheDocument();
  });

  it('renders with custom children', () => {
    render(
      <EmptyState
        title="No items"
        description="No items available"
      >
        <div data-testid="custom-content">Custom content</div>
      </EmptyState>
    );
    
    expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    expect(screen.getByText('Custom content')).toBeInTheDocument();
  });
});
