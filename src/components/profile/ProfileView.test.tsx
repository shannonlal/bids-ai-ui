import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProfileView } from './ProfileView';
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

describe('ProfileView', () => {
  const mockEmail = 'test@example.com';
  const mockOnEditClick = vi.fn();

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

    render(<ProfileView email={mockEmail} onEditClick={mockOnEditClick} />);

    expect(screen.getByText('Loading profile...')).toBeInTheDocument();
  });

  it('renders error state', () => {
    vi.mocked(useProfile).mockReturnValue({
      profile: null,
      loading: false,
      error: 'Failed to load',
      fetchProfile: vi.fn(),
      updateProfile: vi.fn(),
    });

    render(<ProfileView email={mockEmail} onEditClick={mockOnEditClick} />);

    expect(screen.getByText(/Error loading profile: Failed to load/)).toBeInTheDocument();
  });

  it('renders profile details when profile is available', () => {
    vi.mocked(useProfile).mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: null,
      fetchProfile: vi.fn(),
      updateProfile: vi.fn(),
    });

    render(<ProfileView email={mockEmail} onEditClick={mockOnEditClick} />);

    expect(screen.getByText('User Profile')).toBeInTheDocument();
    expect(screen.getByText(/Name:/)).toBeInTheDocument();
    expect(screen.getByText(/John/)).toBeInTheDocument();
    expect(screen.getByText(/Doe/)).toBeInTheDocument();
    expect(screen.getByText(/Email:/)).toBeInTheDocument();
    expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/Role:/)).toBeInTheDocument();
    expect(screen.getByText(/user/)).toBeInTheDocument();
    expect(screen.getByText('Edit Profile')).toBeInTheDocument();
  });

  it('calls onEditClick when Edit Profile button is clicked', () => {
    vi.mocked(useProfile).mockReturnValue({
      profile: mockProfile,
      loading: false,
      error: null,
      fetchProfile: vi.fn(),
      updateProfile: vi.fn(),
    });

    render(<ProfileView email={mockEmail} onEditClick={mockOnEditClick} />);

    const editButton = screen.getByText('Edit Profile');
    editButton.click();

    expect(mockOnEditClick).toHaveBeenCalledOnce();
  });
});
