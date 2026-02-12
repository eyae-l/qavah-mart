import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import EditProfilePage from './page';
import { useUser } from '@/contexts/UserContext';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock UserContext
jest.mock('@/contexts/UserContext', () => ({
  useUser: jest.fn(),
}));

describe('EditProfilePage', () => {
  const mockPush = jest.fn();
  const mockUpdateProfile = jest.fn();
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+251911234567',
    location: {
      city: 'Addis Ababa',
      region: 'Addis Ababa',
      country: 'Ethiopia',
    },
    createdAt: new Date('2024-01-01'),
    isVerified: true,
    isSeller: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
  });

  describe('Authentication', () => {
    it('should redirect to login if user is not authenticated', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
        updateProfile: mockUpdateProfile,
      });

      render(<EditProfilePage />);

      expect(mockPush).toHaveBeenCalledWith('/user/login?returnUrl=/user/profile/edit');
    });

    it('should show loading state while checking authentication', () => {
      (useUser as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
        updateProfile: mockUpdateProfile,
      });

      render(<EditProfilePage />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Form Display', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        updateProfile: mockUpdateProfile,
      });
    });

    it('should display page title and description', () => {
      render(<EditProfilePage />);

      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
      expect(screen.getByText('Update your personal information')).toBeInTheDocument();
    });

    it('should display back to profile button', () => {
      render(<EditProfilePage />);

      expect(screen.getByText('Back to Profile')).toBeInTheDocument();
    });

    it('should pre-populate form with user data', async () => {
      render(<EditProfilePage />);

      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
        expect(screen.getByDisplayValue('+251911234567')).toBeInTheDocument();
        const cityInput = screen.getByLabelText(/city/i) as HTMLInputElement;
        expect(cityInput.value).toBe('Addis Ababa');
        const regionInput = screen.getByLabelText(/region/i) as HTMLInputElement;
        expect(regionInput.value).toBe('Addis Ababa');
      });
    });

    it('should display email as read-only', () => {
      render(<EditProfilePage />);

      const emailInput = screen.getByDisplayValue('test@example.com');
      expect(emailInput).toBeDisabled();
      expect(screen.getByText('Email cannot be changed')).toBeInTheDocument();
    });

    it('should display all form fields', () => {
      render(<EditProfilePage />);

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/region/i)).toBeInTheDocument();
    });

    it('should display save and cancel buttons', () => {
      render(<EditProfilePage />);

      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        updateProfile: mockUpdateProfile,
      });
    });

    it('should show error for empty first name', async () => {
      render(<EditProfilePage />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: '' } });
      fireEvent.blur(firstNameInput);

      const submitButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/first name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('should show error for short first name', async () => {
      render(<EditProfilePage />);

      const firstNameInput = screen.getByLabelText(/first name/i);
      fireEvent.change(firstNameInput, { target: { value: 'J' } });

      const submitButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/first name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('should show error for empty last name', async () => {
      render(<EditProfilePage />);

      const lastNameInput = screen.getByLabelText(/last name/i);
      fireEvent.change(lastNameInput, { target: { value: '' } });

      const submitButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/last name must be at least 2 characters/i)).toBeInTheDocument();
      });
    });

    it('should show error for invalid phone number', async () => {
      render(<EditProfilePage />);

      const phoneInput = screen.getByLabelText(/phone number/i);
      fireEvent.change(phoneInput, { target: { value: '123' } });

      const submitButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/phone number must be 10-15 digits/i)).toBeInTheDocument();
      });
    });

    it('should show error for empty city', async () => {
      render(<EditProfilePage />);

      const cityInput = screen.getByLabelText(/city/i);
      fireEvent.change(cityInput, { target: { value: '' } });

      const submitButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/city is required/i)).toBeInTheDocument();
      });
    });

    it('should show error for empty region', async () => {
      render(<EditProfilePage />);

      const regionInput = screen.getByLabelText(/region/i);
      fireEvent.change(regionInput, { target: { value: '' } });

      const submitButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/region is required/i)).toBeInTheDocument();
      });
    });

    it('should allow empty phone number', async () => {
      render(<EditProfilePage />);

      await waitFor(() => {
        const phoneInput = screen.getByLabelText(/phone number/i);
        fireEvent.change(phoneInput, { target: { value: '' } });
      });

      const submitButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateProfile).toHaveBeenCalled();
      });
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        updateProfile: mockUpdateProfile,
      });
    });

    it('should call updateProfile with correct data on submit', async () => {
      mockUpdateProfile.mockResolvedValue(undefined);

      render(<EditProfilePage />);

      await waitFor(() => {
        const firstNameInput = screen.getByLabelText(/first name/i);
        fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
      });

      const submitButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateProfile).toHaveBeenCalledWith({
          firstName: 'Jane',
          lastName: 'Doe',
          phone: '+251911234567',
          location: {
            city: 'Addis Ababa',
            region: 'Addis Ababa',
            country: 'Ethiopia',
          },
        });
      });
    });

    it('should show success message after successful update', async () => {
      mockUpdateProfile.mockResolvedValue(undefined);

      render(<EditProfilePage />);

      await waitFor(() => {
        const firstNameInput = screen.getByLabelText(/first name/i);
        fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
      });

      const submitButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument();
      });
    });

    it('should redirect to profile page after successful update', async () => {
      jest.useFakeTimers();
      mockUpdateProfile.mockResolvedValue(undefined);

      render(<EditProfilePage />);

      await waitFor(() => {
        const firstNameInput = screen.getByLabelText(/first name/i);
        fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
      });

      const submitButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument();
      });

      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/user/profile');
      });

      jest.useRealTimers();
    });

    it('should show error message on update failure', async () => {
      mockUpdateProfile.mockRejectedValue(new Error('Update failed'));

      render(<EditProfilePage />);

      await waitFor(() => {
        const firstNameInput = screen.getByLabelText(/first name/i);
        fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
      });

      const submitButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to update profile. Please try again.')).toBeInTheDocument();
      });
    });

    it('should disable form during submission', async () => {
      mockUpdateProfile.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      render(<EditProfilePage />);

      await waitFor(() => {
        const firstNameInput = screen.getByLabelText(/first name/i);
        fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
      });

      const submitButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
      });
    });

    it('should handle phone number removal', async () => {
      mockUpdateProfile.mockResolvedValue(undefined);

      render(<EditProfilePage />);

      await waitFor(() => {
        const phoneInput = screen.getByLabelText(/phone number/i);
        fireEvent.change(phoneInput, { target: { value: '' } });
      });

      const submitButton = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockUpdateProfile).toHaveBeenCalledWith(
          expect.objectContaining({
            phone: undefined,
          })
        );
      });
    });
  });

  describe('Navigation', () => {
    beforeEach(() => {
      (useUser as jest.Mock).mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        updateProfile: mockUpdateProfile,
      });
    });

    it('should navigate back to profile on back button click', () => {
      render(<EditProfilePage />);

      const backButton = screen.getByText('Back to Profile');
      fireEvent.click(backButton);

      expect(mockPush).toHaveBeenCalledWith('/user/profile');
    });

    it('should navigate back to profile on cancel button click', () => {
      render(<EditProfilePage />);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockPush).toHaveBeenCalledWith('/user/profile');
    });
  });

  describe('User without phone', () => {
    it('should handle user without phone number', async () => {
      const userWithoutPhone = { ...mockUser, phone: undefined };
      (useUser as jest.Mock).mockReturnValue({
        user: userWithoutPhone,
        isAuthenticated: true,
        updateProfile: mockUpdateProfile,
      });

      render(<EditProfilePage />);

      await waitFor(() => {
        const phoneInput = screen.getByLabelText(/phone number/i) as HTMLInputElement;
        expect(phoneInput.value).toBe('');
      });
    });
  });
});
