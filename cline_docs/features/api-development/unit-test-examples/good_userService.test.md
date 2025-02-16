# Example: Unit Test for userService.ts (Error Handling and Edge Cases)

This example showcases a unit test for `userService.ts`, focusing on error handling and edge cases. It demonstrates how to mock service dependencies, test for specific error scenarios, and ensure robust error handling.

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import mongoose from 'mongoose';
import { User, IUserDocument } from '../../models/User';
import { userService } from '../userService';

// Mock MongoDB connection
vi.mock('../../lib/mongodb', () => ({
  __esModule: true,
  default: vi.fn().mockResolvedValue(mongoose),
}));

describe('UserService', () => {
  const mockEmail = 'test@example.com';

  const mockUserDoc: Partial<IUserDocument> = {
    _id: new mongoose.Types.ObjectId(),
    email: mockEmail.toLowerCase(),
    firstName: 'John',
    lastName: 'Doe',
    createdAt: '2024-01-29T12:00:00.000Z',
    updatedAt: '2024-01-29T12:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserByEmail', () => {
    it('should return user DTO when user is found', async () => {
      vi.spyOn(User, 'findOne').mockResolvedValueOnce(mockUserDoc as any);

      const result = await userService.getUserByEmail(mockEmail);

      expect(result).toEqual({
        id: mockUserDoc._id!.toString(),
        email: mockUserDoc.email,
        firstName: mockUserDoc.firstName,
        lastName: mockUserDoc.lastName,
        createdAt: mockUserDoc.createdAt,
        updatedAt: mockUserDoc.updatedAt,
      });
    });

    it('should throw error when user is not found', async () => {
      vi.spyOn(User, 'findOne').mockResolvedValueOnce(null);

      await expect(userService.getUserByEmail('nonexistent@example.com')).rejects.toThrow(
        'User not found with email: nonexistent@example.com'
      );
    });
  });

  describe('getAllUsers', () => {
    it('should return all users DTOs', async () => {
      const mockUsers = [mockUserDoc, { ...mockUserDoc, email: 'another@example.com' }];
      vi.spyOn(User, 'find').mockResolvedValueOnce(mockUsers as any);

      const results = await userService.getAllUsers();

      expect(results).toHaveLength(2);
      expect(results[0].email).toBe(mockEmail.toLowerCase());
      expect(results[1].email).toBe('another@example.com');
    });

    it('should return empty array when no users exist', async () => {
      vi.spyOn(User, 'find').mockResolvedValueOnce([]);

      const results = await userService.getAllUsers();
      expect(results).toEqual([]);
    });
  });

  describe('exists', () => {
    it('should return true if user exists', async () => {
      vi.spyOn(User, 'findOne').mockResolvedValueOnce(mockUserDoc as any);

      const result = await userService.exists(mockEmail);
      expect(result).toBe(true);
    });

    it('should return false if user does not exist', async () => {
      vi.spyOn(User, 'findOne').mockResolvedValueOnce(null);

      const result = await userService.exists('nonexistent@example.com');
      expect(result).toBe(false);
    });
  });

  describe('updateUser', () => {
    it('should update user profile and return DTO', async () => {
      const updatedUserDoc = { ...mockUserDoc, firstName: 'Jane', lastName: 'Doe' };
      vi.spyOn(User, 'findOneAndUpdate').mockResolvedValueOnce(updatedUserDoc as any);

      const result = await userService.updateUser(mockEmail, {
        firstName: 'Jane',
        lastName: 'Smith', // User provided lastName is ignored
      });

      expect(result).toEqual({
        id: mockUserDoc._id!.toString(),
        email: mockUserDoc.email,
        firstName: 'Jane',
        lastName: mockUserDoc.lastName, // Should be from updatedUserDoc
        createdAt: mockUserDoc.createdAt,
        updatedAt: mockUserDoc.updatedAt,
      });
    });

    it('should throw error if update fails', async () => {
      vi.spyOn(User, 'findOneAndUpdate').mockRejectedValueOnce(new Error('Update failed'));

      await expect(
        userService.updateUser(mockEmail, { firstName: 'Jane', lastName: 'Doe' })
      ).rejects.toThrow('Update failed');
    });

    it('should throw error if user is not found during update', async () => {
      vi.spyOn(User, 'findOneAndUpdate').mockResolvedValueOnce(null);

      await expect(
        userService.updateUser('nonexistent@example.com', { firstName: 'Jane', lastName: 'Doe' })
      ).rejects.toThrow('User not found with email: nonexistent@example.com');
    });
  });
});
```
