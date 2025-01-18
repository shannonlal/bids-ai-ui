import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useEffect } from 'react';
import React from 'react';
import { FrenchIdolProvider, useFrenchIdol } from './FrenchIdolContext';

// Test component that uses the context
function TestComponent() {
  const { displayStoryUpload, setDisplayStoryUpload } = useFrenchIdol();

  useEffect(() => {
    // Toggle the value after render
    setDisplayStoryUpload(!displayStoryUpload);
  }, []);

  return <div data-testid="test-value">{displayStoryUpload.toString()}</div>;
}

describe('FrenchIdolContext', () => {
  it('provides displayStoryUpload state and setter', () => {
    render(
      <FrenchIdolProvider>
        <TestComponent />
      </FrenchIdolProvider>
    );

    // Initial value should be true
    expect(screen.getByTestId('test-value')).toHaveTextContent('false');
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
