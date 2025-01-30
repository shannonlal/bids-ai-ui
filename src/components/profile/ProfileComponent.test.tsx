/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ProfileComponent } from './ProfileComponent';
import { useProfile } from '../../hooks/useProfile';

// Mock the useProfile hook
vi.mock('../../hooks/useProfile');
const mockUseProfile = vi.mocked(useProfile);

describe('ProfileComponent', () => {
  const mockProfile = {
    id: '1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: '2024-01-30T12:00:00Z',
    updatedAt: '2024-01-30T12:00:00Z',
  };

  const mockUpdateProfile = vi.fn();

  beforeEach(() => {
    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: null,
      fetchProfile: vi.fn(),
      updateProfile: mockUpdateProfile,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders profile information in display mode', () => {
    render(<ProfileComponent email="test@example.com" />);

    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Doe')).toBeInTheDocument();
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
  });

  it('switches to edit mode when edit button is clicked', () => {
    render(<ProfileComponent email="test@example.com" />);

    fireEvent.click(screen.getByText('Edit Profile'));

    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('handles profile update successfully', async () => {
    render(<ProfileComponent email="test@example.com" />);

    // Enter edit mode
    fireEvent.click(screen.getByText('Edit Profile'));

    // Update form fields
    const firstNameInput = screen.getByDisplayValue('John');
    const lastNameInput = screen.getByDisplayValue('Doe');

    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    fireEvent.change(lastNameInput, { target: { value: 'Smith' } });

    // Submit form
    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        firstName: 'Jane',
        lastName: 'Smith',
      });
    });
  });

  it('displays loading state', () => {
    mockUseProfile.mockReturnValue({
      profile: null,
      loading: true,
      error: null,
      fetchProfile: vi.fn(),
      updateProfile: mockUpdateProfile,
    });

    render(<ProfileComponent email="test@example.com" />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays error state', () => {
    const errorMessage = 'Failed to load profile';
    mockUseProfile.mockReturnValue({
      profile: null,
      loading: false,
      error: errorMessage,
      fetchProfile: vi.fn(),
      updateProfile: mockUpdateProfile,
    });

    render(<ProfileComponent email="test@example.com" />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('handles cancel button click', () => {
    render(<ProfileComponent email="test@example.com" />);

    // Enter edit mode
    fireEvent.click(screen.getByText('Edit Profile'));

    // Update form field
    const firstNameInput = screen.getByDisplayValue('John');
    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });

    // Click cancel
    fireEvent.click(screen.getByText('Cancel'));

    // Verify we're back in display mode with original values
    expect(screen.getByText('John')).toBeInTheDocument();
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
  });
});
