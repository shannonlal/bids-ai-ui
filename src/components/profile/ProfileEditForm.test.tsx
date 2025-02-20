import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProfileEditForm } from './ProfileEditForm';
import { useProfile } from '../../hooks/useProfile';
import { User } from '../../types/user';
import '@testing-library/jest-dom';

// Mock the useProfile hook
vi.mock('../../hooks/useProfile');
vi.mock('../layout/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="layout">{children}</div>
  ),
}));

describe('ProfileEditForm', () => {
  const mockEmail = 'test@example.com';
  const mockOnCancel = vi.fn();
  const mockOnProfileUpdated = vi.fn();

  const mockProfile: User = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'test@example.com',
    role: 'user',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  };

  it('renders loading state', () => {
    vi.mocked(useProfile).mockReturnValue({
      profile: null,
      loading: true,
      error: null,
      fetchProfile: vi.fn(),
      updateProfile: vi.fn(),
    });

    render(
      <ProfileEditForm
        email={mockEmail}
        onCancel={mockOnCancel}
        onProfileUpdated={mockOnProfileUpdated}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    vi.mocked(useProfile).mockReturnValue({
      profile: null,
      loading: false,
      error: 'Failed to load',
      fetchProfile: vi.fn(),
      updateProfile: vi.fn(),
    });

    render(
      <ProfileEditForm
        email={mockEmail}
        onCancel={mockOnCancel}
        onProfileUpdated={mockOnProfileUpdated}
      />
    );

    expect(screen.getByText('Error: Failed to load')).toBeInTheDocument();
  });

  it('renders form with initial profile data', () => {
    vi.mocked(useProfile).mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: null,
      fetchProfile: vi.fn(),
      updateProfile: vi.fn(),
    });

    render(
      <ProfileEditForm
        email={mockEmail}
        onCancel={mockOnCancel}
        onProfileUpdated={mockOnProfileUpdated}
      />
    );

    const firstNameInput = screen.getByLabelText('First Name') as HTMLInputElement;
    const lastNameInput = screen.getByLabelText('Last Name') as HTMLInputElement;

    expect(firstNameInput.value).toBe(mockProfile.firstName);
    expect(lastNameInput.value).toBe(mockProfile.lastName);
  });

  it('handles form submission with valid data', async () => {
    const mockUpdateProfile = vi.fn().mockResolvedValue({});
    vi.mocked(useProfile).mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: null,
      fetchProfile: vi.fn(),
      updateProfile: mockUpdateProfile,
    });

    render(
      <ProfileEditForm
        email={mockEmail}
        onCancel={mockOnCancel}
        onProfileUpdated={mockOnProfileUpdated}
      />
    );

    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const saveButton = screen.getByText('Save Changes');

    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    fireEvent.change(lastNameInput, { target: { value: 'Smith' } });

    fireEvent.click(saveButton);

    await screen.findByText('Edit Profile');

    expect(mockUpdateProfile).toHaveBeenCalledWith({
      firstName: 'Jane',
      lastName: 'Smith',
    });
    expect(mockOnProfileUpdated).toHaveBeenCalledOnce();
  });

  it('calls onCancel when Cancel button is clicked', () => {
    vi.mocked(useProfile).mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: null,
      fetchProfile: vi.fn(),
      updateProfile: vi.fn(),
    });

    render(
      <ProfileEditForm
        email={mockEmail}
        onCancel={mockOnCancel}
        onProfileUpdated={mockOnProfileUpdated}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    cancelButton.click();

    expect(mockOnCancel).toHaveBeenCalledOnce();
  });
});
