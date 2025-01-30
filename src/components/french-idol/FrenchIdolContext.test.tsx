import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { FrenchIdolProvider, useFrenchIdol } from './FrenchIdolContext';

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Test component that uses the context
function TestComponent() {
  const { displayStoryUpload, setDisplayStoryUpload, currentUser, isLoading, error } =
    useFrenchIdol();
  return (
    <div>
      <div data-testid="test-value">{displayStoryUpload.toString()}</div>
      <div data-testid="loading-value">{isLoading.toString()}</div>
      <div data-testid="error-value">{error || 'no error'}</div>
      <div data-testid="user-value">{currentUser ? currentUser.email : 'no user'}</div>
      <button
        data-testid="toggle-button"
        onClick={() => setDisplayStoryUpload(!displayStoryUpload)}
      >
        Toggle
      </button>
    </div>
  );
}

describe('FrenchIdolContext', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('provides displayStoryUpload state with correct initial value', async () => {
    // Mock user fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: { email: 'vincent@gmail.com' } }),
    });
    // Mock stories fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ stories: [] }),
    });

    render(
      <FrenchIdolProvider>
        <TestComponent />
      </FrenchIdolProvider>
    );

    // Initial value should be true (as defined in context)
    expect(screen.getByTestId('test-value')).toHaveTextContent('true');
  });

  it('allows updating displayStoryUpload state', async () => {
    // Mock user fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: { email: 'vincent@gmail.com' } }),
    });
    // Mock stories fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ stories: [] }),
    });

    render(
      <FrenchIdolProvider>
        <TestComponent />
      </FrenchIdolProvider>
    );

    // Initial value should be true
    expect(screen.getByTestId('test-value')).toHaveTextContent('true');

    // Click button to toggle value
    fireEvent.click(screen.getByTestId('toggle-button'));

    // Value should now be false
    expect(screen.getByTestId('test-value')).toHaveTextContent('false');
  });

  it('loads user data on mount', async () => {
    const mockUser = {
      email: 'vincent@gmail.com',
      firstName: 'Vincent',
      lastName: 'Test',
      id: '123',
      createdAt: '2024-01-29',
      updatedAt: '2024-01-29',
    };

    // Mock user fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ user: mockUser }),
    });
    // Mock stories fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ stories: [] }),
    });

    render(
      <FrenchIdolProvider>
        <TestComponent />
      </FrenchIdolProvider>
    );

    // Should show loading initially
    expect(screen.getByTestId('loading-value')).toHaveTextContent('true');

    // Wait for user data to load
    await screen.findByText(mockUser.email);

    // Loading should be false
    expect(screen.getByTestId('loading-value')).toHaveTextContent('false');
    expect(screen.getByTestId('error-value')).toHaveTextContent('no error');
  });

  it('handles user loading error', async () => {
    // Mock user fetch error
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });
    // Mock stories fetch (even though it won't be called due to user fetch error)
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ stories: [] }),
    });

    render(
      <FrenchIdolProvider>
        <TestComponent />
      </FrenchIdolProvider>
    );

    // Wait for error state
    await screen.findByText('Failed to fetch user');

    expect(screen.getByTestId('loading-value')).toHaveTextContent('false');
    expect(screen.getByTestId('user-value')).toHaveTextContent('no user');
  });

  it('throws error when used outside provider', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error');
    consoleSpy.mockImplementation(() => {});

    expect(() => render(<TestComponent />)).toThrow(
      'useFrenchIdol must be used within a FrenchIdolProvider'
    );

    consoleSpy.mockRestore();
  });
});
