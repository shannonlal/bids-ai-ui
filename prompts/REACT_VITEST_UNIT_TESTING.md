# React Component Testing with Vitest - A Comprehensive Guide

## Introduction to Vitest

Vitest is a next-generation testing framework designed to work seamlessly with Vite. It provides a modern, fast, and feature-rich testing environment specifically optimized for React applications. Some key benefits of Vitest include:

- Native ESM support
- Zero-config setup with Vite projects
- Jest-compatible API
- Built-in code coverage
- Watch mode with smart file detection
- Snapshot testing support

## Setting Up Vitest in a React Project

### 1. Install Required Dependencies

```bash
# Install Vitest and testing utilities
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

### 2. Configure Vite

Update your `vite.config.js` to include test configuration:

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

### 3. Create Test Setup File

Create `src/test/setup.ts`:

```typescript
import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

// Automatically clean up after each test
afterEach(() => {
  cleanup();
});
```

### 4. Update Package.json

Add test scripts to your package.json:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Example 1: Button Component with Click Event

### Button Component (`src/components/Button.tsx`)

```tsx
import React from 'react';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 bg-blue-500 text-white rounded"
      data-testid="custom-button"
    >
      {label}
    </button>
  );
};
```

### Button Test (`src/components/Button.test.tsx`)

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders with correct label', () => {
    render(<Button label="Click Me" onClick={() => {}} />);
    expect(screen.getByTestId('custom-button')).toHaveTextContent('Click Me');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button label="Click Me" onClick={handleClick} />);

    fireEvent.click(screen.getByTestId('custom-button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Example 2: Input Field with Text Display

### TextInput Component (`src/components/TextInput.tsx`)

```tsx
import React, { useState } from 'react';

export const TextInput: React.FC = () => {
  const [inputValue, setInputValue] = useState('');

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={inputValue}
        onChange={e => setInputValue(e.target.value)}
        placeholder="Enter text"
        className="border p-2 rounded"
        data-testid="text-input"
      />
      <p data-testid="display-text">You typed: {inputValue || 'Nothing yet'}</p>
    </div>
  );
};
```

### TextInput Test (`src/components/TextInput.test.tsx`)

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextInput } from './TextInput';

describe('TextInput Component', () => {
  it('displays default text when empty', () => {
    render(<TextInput />);
    expect(screen.getByTestId('display-text')).toHaveTextContent('You typed: Nothing yet');
  });

  it('updates display text when user types', () => {
    render(<TextInput />);
    const input = screen.getByTestId('text-input');

    fireEvent.change(input, { target: { value: 'Hello World' } });
    expect(screen.getByTestId('display-text')).toHaveTextContent('You typed: Hello World');
  });
});
```

## Example 3: Movie Search Component

### MovieSearch Component (`src/components/MovieSearch.tsx`)

```tsx
import React, { useState } from 'react';

interface Movie {
  id: string;
  title: string;
  year: string;
}

export const MovieSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const searchMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.example.com/movies?search=${searchTerm}`);
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search movies..."
          className="border p-2 rounded"
          data-testid="movie-search-input"
        />
        <button
          onClick={searchMovies}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          data-testid="search-button"
        >
          Search
        </button>
      </div>

      {loading ? (
        <p data-testid="loading-text">Loading...</p>
      ) : (
        <ul data-testid="movie-list">
          {movies.map(movie => (
            <li key={movie.id} className="border-b py-2">
              {movie.title} ({movie.year})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### MovieSearch Test (`src/components/MovieSearch.test.tsx`)

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MovieSearch } from './MovieSearch';

// Mock the fetch function
const mockMovies = [
  { id: '1', title: 'Test Movie 1', year: '2021' },
  { id: '2', title: 'Test Movie 2', year: '2022' },
];

global.fetch = vi.fn();

describe('MovieSearch Component', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders search input and button', () => {
    render(<MovieSearch />);
    expect(screen.getByTestId('movie-search-input')).toBeInTheDocument();
    expect(screen.getByTestId('search-button')).toBeInTheDocument();
  });

  it('performs search and displays results', async () => {
    // Mock the fetch response
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => mockMovies,
    });

    render(<MovieSearch />);

    // Type search term
    const input = screen.getByTestId('movie-search-input');
    fireEvent.change(input, { target: { value: 'test' } });

    // Click search button
    const button = screen.getByTestId('search-button');
    fireEvent.click(button);

    // Wait for loading state to complete
    await waitFor(() => {
      expect(screen.queryByTestId('loading-text')).not.toBeInTheDocument();
    });

    // Verify results are displayed
    const movieList = screen.getByTestId('movie-list');
    expect(movieList.children).toHaveLength(2);
    expect(movieList).toHaveTextContent('Test Movie 1');
    expect(movieList).toHaveTextContent('Test Movie 2');
  });

  it('shows loading state while fetching', async () => {
    // Mock a delayed response
    (global.fetch as any).mockImplementationOnce(
      () => new Promise(resolve => setTimeout(resolve, 100))
    );

    render(<MovieSearch />);

    const button = screen.getByTestId('search-button');
    fireEvent.click(button);

    expect(screen.getByTestId('loading-text')).toBeInTheDocument();
  });
});
```

## Best Practices for React Testing with Vitest

1. **Test Component Behavior, Not Implementation**

   - Focus on what the component does, not how it does it
   - Test from the user's perspective
   - Use data-testid attributes sparingly

2. **Arrange-Act-Assert Pattern**

   - Arrange: Set up the component and test data
   - Act: Perform the action being tested
   - Assert: Verify the expected outcome

3. **Mock External Dependencies**

   - Use vi.fn() for function mocks
   - Mock API calls and external services
   - Reset mocks between tests

4. **Use Appropriate Queries**

   - Prefer getByRole over getByTestId
   - Use findBy\* for async operations
   - Use queryBy\* when testing that elements don't exist

5. **Clean Up After Tests**

   - Use afterEach cleanup
   - Reset mocks and timers
   - Clean up any side effects

6. **Write Maintainable Tests**
   - Keep tests focused and simple
   - Use descriptive test names
   - Group related tests using describe blocks

Remember that tests should give you confidence in your code's behavior and serve as documentation for how components should be used. Write tests that are resilient to implementation changes but will fail when the component's behavior changes unexpectedly.
