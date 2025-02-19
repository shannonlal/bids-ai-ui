# Comprehensive User Service Unit Testing Guide

## Overview

This document provides an advanced example of unit testing for a user service, demonstrating robust testing strategies, error handling, and comprehensive coverage.

## Key Testing Principles

### 1. Comprehensive Test Coverage

- Test successful scenarios
- Cover error and edge cases
- Validate input handling
- Ensure robust error responses

### 2. Mocking Strategies

```typescript
// Effective dependency mocking
vi.mock('../../lib/mongodb', () => ({
  __esModule: true,
  default: vi.fn().mockResolvedValue(mongoose),
}));

// Mock external dependencies
vi.mock('bcrypt', () => ({
  hash: vi.fn().mockResolvedValue('hashedPassword'),
  compare: vi.fn().mockResolvedValue(true),
}));
```

### 3. Error Handling Tests

```typescript
describe('Error Scenarios', () => {
  it('should throw validation error for invalid email', async () => {
    await expect(
      userService.createUser({
        email: 'invalid-email',
        password: 'validPassword123',
        firstName: 'John',
        lastName: 'Doe',
      })
    ).rejects.toThrow(UserValidationError);
  });

  it('should prevent duplicate user creation', async () => {
    vi.spyOn(User, 'findOne').mockResolvedValueOnce(existingUser);

    await expect(userService.createUser(existingUserData)).rejects.toThrow('User already exists');
  });
});
```

### 4. Input Validation

```typescript
describe('Input Validation', () => {
  it('should reject weak passwords', async () => {
    await expect(
      userService.createUser({
        email: 'test@example.com',
        password: '123',
        firstName: 'John',
        lastName: 'Doe',
      })
    ).rejects.toThrow('Password too weak');
  });

  it('should normalize email to lowercase', async () => {
    const result = await userService.createUser({
      email: 'Test@Example.COM',
      password: 'strongPassword123',
      firstName: 'John',
      lastName: 'Doe',
    });

    expect(result.email).toBe('test@example.com');
  });
});
```

### 5. Edge Case Testing

```typescript
describe('Edge Cases', () => {
  it('should handle unicode characters in names', async () => {
    const result = await userService.createUser({
      email: 'unicode@example.com',
      password: 'strongPassword123',
      firstName: 'José',
      lastName: 'García',
    });

    expect(result.firstName).toBe('José');
    expect(result.lastName).toBe('García');
  });

  it('should trim whitespace from names', async () => {
    const result = await userService.createUser({
      email: 'whitespace@example.com',
      password: 'strongPassword123',
      firstName: '  John  ',
      lastName: '  Doe  ',
    });

    expect(result.firstName).toBe('John');
    expect(result.lastName).toBe('Doe');
  });
});
```

### 6. Performance and Security Considerations

```typescript
describe('Performance Tests', () => {
  it('should hash password with recommended work factor', async () => {
    const hashSpy = vi.spyOn(bcrypt, 'hash');

    await userService.createUser({
      email: 'performance@test.com',
      password: 'securePassword123',
      firstName: 'Performance',
      lastName: 'Test',
    });

    expect(hashSpy).toHaveBeenCalledWith(
      expect.any(String),
      10 // Recommended work factor
    );
  });
});
```

## Best Practices

- Use meaningful test descriptions
- Cover multiple scenarios for each method
- Mock external dependencies
- Test both successful and failure paths
- Validate input sanitization
- Check error handling
- Ensure type safety

## Recommended Tools

- Vitest for testing
- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting

## Continuous Improvement

- Regularly update tests
- Review and refactor test cases
- Stay informed about security best practices
