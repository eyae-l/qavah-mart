import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterSidebar, { FilterSidebarProps } from './FilterSidebar';

// Mock the data imports
jest.mock('@/types', () => ({
  SUPPORTED_BRANDS: ['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer'],
}));

jest.mock('@/data/mockData', () => ({
  mockLocations: [
    { city: 'Addis Ababa', region: 'Addis Ababa', country: 'Ethiopia' },
    { city: 'Dire Dawa', region: 'Dire Dawa', country: 'Ethiopia' },
    { city: 'Mekelle', region: 'Tigray', country: 'Ethiopia' },
  ],
}));

describe('FilterSidebar', () => {
  const mockProps: FilterSidebarProps = {
    onPriceChange: jest.fn(),
    onBrandsChange: jest.fn(),
    onConditionsChange: jest.fn(),
    onLocationChange: jest.fn(),
    onClearAll: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render filter sidebar with title', () => {
      render(<FilterSidebar {...mockProps} />);
      expect(screen.getByText('Filters')).toBeInTheDocument();
    });

    it('should render all filter sections', () => {
      render(<FilterSidebar {...mockProps} />);
      expect(screen.getByText('Price Range (ETB)')).toBeInTheDocument();
      expect(screen.getByText(/Brand/)).toBeInTheDocument();
      expect(screen.getByText(/Condition/)).toBeInTheDocument();
      expect(screen.getByText(/Location/)).toBeInTheDocument();
    });

    it('should show Clear All button when filters are active', () => {
      render(<FilterSidebar {...mockProps} priceMin={100} />);
      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    it('should not show Clear All button when no filters are active', () => {
      render(<FilterSidebar {...mockProps} />);
      expect(screen.queryByText('Clear All')).not.toBeInTheDocument();
    });
  });

  describe('Price Range Filter', () => {
    it('should render price range inputs', () => {
      render(<FilterSidebar {...mockProps} />);
      const minInput = screen.getByPlaceholderText('Min');
      const maxInput = screen.getByPlaceholderText('Max');
      expect(minInput).toBeInTheDocument();
      expect(maxInput).toBeInTheDocument();
    });

    it('should display current price values', () => {
      render(<FilterSidebar {...mockProps} priceMin={100} priceMax={500} />);
      const minInput = screen.getByPlaceholderText('Min') as HTMLInputElement;
      const maxInput = screen.getByPlaceholderText('Max') as HTMLInputElement;
      expect(minInput.value).toBe('100');
      expect(maxInput.value).toBe('500');
    });

    it('should call onPriceChange when Apply button is clicked', () => {
      render(<FilterSidebar {...mockProps} />);
      const minInput = screen.getByPlaceholderText('Min');
      const maxInput = screen.getByPlaceholderText('Max');
      const applyButton = screen.getByText('Apply');

      fireEvent.change(minInput, { target: { value: '200' } });
      fireEvent.change(maxInput, { target: { value: '1000' } });
      fireEvent.click(applyButton);

      expect(mockProps.onPriceChange).toHaveBeenCalledWith(200, 1000);
    });

    it('should handle empty price inputs', () => {
      render(<FilterSidebar {...mockProps} />);
      const applyButton = screen.getByText('Apply');
      fireEvent.click(applyButton);

      expect(mockProps.onPriceChange).toHaveBeenCalledWith(undefined, undefined);
    });

    it('should toggle price section visibility', () => {
      render(<FilterSidebar {...mockProps} />);
      const priceHeader = screen.getByText('Price Range (ETB)');
      
      // Initially visible
      expect(screen.getByPlaceholderText('Min')).toBeInTheDocument();
      
      // Click to collapse
      fireEvent.click(priceHeader);
      expect(screen.queryByPlaceholderText('Min')).not.toBeInTheDocument();
      
      // Click to expand
      fireEvent.click(priceHeader);
      expect(screen.getByPlaceholderText('Min')).toBeInTheDocument();
    });
  });

  describe('Brand Filter', () => {
    it('should render all brand checkboxes', () => {
      render(<FilterSidebar {...mockProps} />);
      expect(screen.getByText('Dell')).toBeInTheDocument();
      expect(screen.getByText('HP')).toBeInTheDocument();
      expect(screen.getByText('Lenovo')).toBeInTheDocument();
      expect(screen.getByText('ASUS')).toBeInTheDocument();
      expect(screen.getByText('Acer')).toBeInTheDocument();
    });

    it('should show selected brand count', () => {
      render(<FilterSidebar {...mockProps} selectedBrands={['Dell', 'HP']} />);
      expect(screen.getByText(/Brand \(2\)/)).toBeInTheDocument();
    });

    it('should check selected brands', () => {
      render(<FilterSidebar {...mockProps} selectedBrands={['Dell']} />);
      const dellCheckbox = screen.getByLabelText('Dell') as HTMLInputElement;
      expect(dellCheckbox.checked).toBe(true);
    });

    it('should call onBrandsChange when brand is selected', () => {
      render(<FilterSidebar {...mockProps} selectedBrands={[]} />);
      const dellCheckbox = screen.getByLabelText('Dell');
      fireEvent.click(dellCheckbox);

      expect(mockProps.onBrandsChange).toHaveBeenCalledWith(['Dell']);
    });

    it('should call onBrandsChange when brand is deselected', () => {
      render(<FilterSidebar {...mockProps} selectedBrands={['Dell', 'HP']} />);
      const dellCheckbox = screen.getByLabelText('Dell');
      fireEvent.click(dellCheckbox);

      expect(mockProps.onBrandsChange).toHaveBeenCalledWith(['HP']);
    });

    it('should toggle brand section visibility', () => {
      render(<FilterSidebar {...mockProps} />);
      const brandHeader = screen.getByText(/Brand/);
      
      // Initially visible
      expect(screen.getByText('Dell')).toBeInTheDocument();
      
      // Click to collapse
      fireEvent.click(brandHeader);
      expect(screen.queryByText('Dell')).not.toBeInTheDocument();
      
      // Click to expand
      fireEvent.click(brandHeader);
      expect(screen.getByText('Dell')).toBeInTheDocument();
    });
  });

  describe('Condition Filter', () => {
    it('should render all condition checkboxes', () => {
      render(<FilterSidebar {...mockProps} />);
      expect(screen.getByText('new')).toBeInTheDocument();
      expect(screen.getByText('used')).toBeInTheDocument();
      expect(screen.getByText('refurbished')).toBeInTheDocument();
    });

    it('should show selected condition count', () => {
      render(<FilterSidebar {...mockProps} selectedConditions={['new', 'used']} />);
      expect(screen.getByText(/Condition \(2\)/)).toBeInTheDocument();
    });

    it('should check selected conditions', () => {
      render(<FilterSidebar {...mockProps} selectedConditions={['new']} />);
      const newCheckbox = screen.getByLabelText('new') as HTMLInputElement;
      expect(newCheckbox.checked).toBe(true);
    });

    it('should call onConditionsChange when condition is selected', () => {
      render(<FilterSidebar {...mockProps} selectedConditions={[]} />);
      const newCheckbox = screen.getByLabelText('new');
      fireEvent.click(newCheckbox);

      expect(mockProps.onConditionsChange).toHaveBeenCalledWith(['new']);
    });

    it('should call onConditionsChange when condition is deselected', () => {
      render(<FilterSidebar {...mockProps} selectedConditions={['new', 'used']} />);
      const newCheckbox = screen.getByLabelText('new');
      fireEvent.click(newCheckbox);

      expect(mockProps.onConditionsChange).toHaveBeenCalledWith(['used']);
    });

    it('should toggle condition section visibility', () => {
      render(<FilterSidebar {...mockProps} />);
      const conditionHeader = screen.getByText(/Condition/);
      
      // Initially visible
      expect(screen.getByText('new')).toBeInTheDocument();
      
      // Click to collapse
      fireEvent.click(conditionHeader);
      expect(screen.queryByText('new')).not.toBeInTheDocument();
      
      // Click to expand
      fireEvent.click(conditionHeader);
      expect(screen.getByText('new')).toBeInTheDocument();
    });
  });

  describe('Location Filter', () => {
    it('should render all location radio buttons', () => {
      render(<FilterSidebar {...mockProps} />);
      expect(screen.getByText('Addis Ababa')).toBeInTheDocument();
      expect(screen.getByText('Dire Dawa')).toBeInTheDocument();
      expect(screen.getByText('Mekelle')).toBeInTheDocument();
    });

    it('should show selected location count', () => {
      render(<FilterSidebar {...mockProps} selectedLocation="Addis Ababa" />);
      expect(screen.getByText(/Location \(1\)/)).toBeInTheDocument();
    });

    it('should check selected location', () => {
      render(<FilterSidebar {...mockProps} selectedLocation="Addis Ababa" />);
      const addisRadio = screen.getByLabelText('Addis Ababa') as HTMLInputElement;
      expect(addisRadio.checked).toBe(true);
    });

    it('should call onLocationChange when location is selected', () => {
      render(<FilterSidebar {...mockProps} />);
      const addisRadio = screen.getByLabelText('Addis Ababa');
      fireEvent.click(addisRadio);

      expect(mockProps.onLocationChange).toHaveBeenCalledWith('Addis Ababa');
    });

    it('should call onLocationChange when different location is selected', () => {
      render(<FilterSidebar {...mockProps} selectedLocation="Addis Ababa" />);
      const direRadio = screen.getByLabelText('Dire Dawa');
      fireEvent.click(direRadio);

      expect(mockProps.onLocationChange).toHaveBeenCalledWith('Dire Dawa');
    });

    it('should toggle location section visibility', () => {
      render(<FilterSidebar {...mockProps} />);
      const locationHeader = screen.getByText(/Location/);
      
      // Initially visible
      expect(screen.getByText('Addis Ababa')).toBeInTheDocument();
      
      // Click to collapse
      fireEvent.click(locationHeader);
      expect(screen.queryByText('Addis Ababa')).not.toBeInTheDocument();
      
      // Click to expand
      fireEvent.click(locationHeader);
      expect(screen.getByText('Addis Ababa')).toBeInTheDocument();
    });
  });

  describe('Clear All Functionality', () => {
    it('should call onClearAll when Clear All button is clicked', () => {
      render(<FilterSidebar {...mockProps} priceMin={100} selectedBrands={['Dell']} />);
      const clearButton = screen.getByText('Clear All');
      fireEvent.click(clearButton);

      expect(mockProps.onClearAll).toHaveBeenCalled();
    });

    it('should show Clear All when price filter is active', () => {
      render(<FilterSidebar {...mockProps} priceMin={100} />);
      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    it('should show Clear All when brand filter is active', () => {
      render(<FilterSidebar {...mockProps} selectedBrands={['Dell']} />);
      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    it('should show Clear All when condition filter is active', () => {
      render(<FilterSidebar {...mockProps} selectedConditions={['new']} />);
      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });

    it('should show Clear All when location filter is active', () => {
      render(<FilterSidebar {...mockProps} selectedLocation="Addis Ababa" />);
      expect(screen.getByText('Clear All')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper labels for inputs', () => {
      render(<FilterSidebar {...mockProps} />);
      expect(screen.getByPlaceholderText('Min')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Max')).toBeInTheDocument();
    });

    it('should have clickable labels for checkboxes', () => {
      render(<FilterSidebar {...mockProps} />);
      const dellLabel = screen.getByText('Dell').closest('label');
      expect(dellLabel).toBeInTheDocument();
    });

    it('should have clickable labels for radio buttons', () => {
      render(<FilterSidebar {...mockProps} />);
      const addisLabel = screen.getByText('Addis Ababa').closest('label');
      expect(addisLabel).toBeInTheDocument();
    });
  });
});
