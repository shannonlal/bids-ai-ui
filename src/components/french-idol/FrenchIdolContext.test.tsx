import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { FrenchIdolProvider, useFrenchIdol } from './FrenchIdolContext';

// Test component that uses the context
function TestComponent() {
  const { displayStoryUpload, setDisplayStoryUpload } = useFrenchIdol();
  return (
    <div>
      <div data-testid="test-value">{displayStoryUpload.toString()}</div>
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
  it('provides displayStoryUpload state with correct initial value', () => {
    render(
      <FrenchIdolProvider>
        <TestComponent />
      </FrenchIdolProvider>
    );

    // Initial value should be true (as defined in context)
    expect(screen.getByTestId('test-value')).toHaveTextContent('true');
  });

  it('allows updating displayStoryUpload state', () => {
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
