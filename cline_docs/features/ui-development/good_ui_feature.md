# UI Development Mode in Roo Code: Examples and Guidelines

## Building Components with UI Development Mode

This document provides examples and guidelines for building UI components using Roo Code's UI Development Mode. This mode is specifically tailored to assist with creating and maintaining user interface components within React and Next.js projects.

### Example 1: Creating a New Button Component

#### User Prompt

Create a new React button component in src/ui-kit/Button.tsx that uses Tailwind CSS for stylx`ing and supports primary and secondary variants.

#### Response

````

#### Roo Code Response

```xml
<write_to_file>
<path>src/ui-kit/Button.tsx</path>
<content>
import React from 'react';
import { cn } from './utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  children,
  className = '',
  ...props
}) => {
  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';

  return (
    <button className={\`\${baseClass} \${className}\`} {...props}>
      {children}
    </button>
  );
};

Button.displayName = 'Button';
</content>
<line_count>18</line_count>
</write_to_file>
````

#### Code Explanation

This code defines a functional React component Button that accepts variant and children props. It uses Tailwind CSS classes for styling and includes two variants: primary and secondary.

### Example 2: Adding Unit Tests for a UI Component

#### User Prompt

```
Add unit tests for the Button component in src/ui-kit/Button.test.tsx using Vitest and React Testing Library to ensure it renders correctly and handles click events.
```

#### Roo Code Response

```
<write_to_file>
<path>src/ui-kit/Button.test.tsx</path>
<content>
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';
import React from 'react';

describe('Button Component', () => {
  it('renders with primary variant by default', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByTestId('custom-button')).toHaveClass('btn-primary');
  });

  it('renders with secondary variant when specified', () => {
    render(<Button variant="secondary">Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('btn-secondary');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('merges additional className with base classes', () => {
    render(<Button className="custom-class">Click me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('btn-primary', 'custom-class');
  });
});
</content>
<line_count>41</line_count>
</write_to_file>
```
