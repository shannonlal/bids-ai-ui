import { describe, it, expect, beforeEach, vi } from 'vitest';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User, IUserDocument } from '../../models/User';
import { userService } from '../userService';

// Mock MongoDB connection
vi.mock('../../lib/mongodb', () => ({
  __esModule: true,
  default: vi.fn().mockResolvedValue(mongoose),
}));

// Mock bcrypt with a default export
vi.mock('bcryptjs', async importOriginal => {
  const actual = await importOriginal<typeof import('bcryptjs')>();
  return {
    ...actual,
    hash: vi.fn(actual.hash),
  };
});

describe('UserService', () => {
  const mockEmail = 'test@example.com';
  const mockPassword = 'password123';

  const mockUserDoc: Partial<IUserDocument> = {
    _id: new mongoose.Types.ObjectId(),
    email: mockEmail.toLowerCase(),
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
    createdAt: '2024-01-29T12:00:00.000Z',
    updatedAt: '2024-01-29T12:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(User, 'findOne').mockResolvedValueOnce(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as any);
      const saveMock = vi.fn().mockResolvedValue(mockUserDoc);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(User.prototype, 'save').mockImplementation(saveMock);

      const result = await userService.createUser({
        email: mockEmail,
        firstName: 'John',
        lastName: 'Doe',
        password: mockPassword,
        role: 'user',
      });

      // Use partial matching to ignore dynamic timestamps
      expect(result).toMatchObject({
        email: mockEmail.toLowerCase(),
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10);
    });

    it('should throw error if user already exists', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(User, 'findOne').mockResolvedValueOnce(mockUserDoc as any);

      await expect(
        userService.createUser({
          email: mockEmail,
          firstName: 'John',
          lastName: 'Doe',
          password: mockPassword,
          role: 'user',
        })
      ).rejects.toThrow('User with this email already exists');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(User, 'deleteOne').mockResolvedValueOnce({ deletedCount: 1 } as any);

      await expect(userService.deleteUser(mockEmail)).resolves.not.toThrow();
    });

    it('should throw error if user not found', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(User, 'deleteOne').mockResolvedValueOnce({ deletedCount: 0 } as any);

      await expect(userService.deleteUser(mockEmail)).rejects.toThrow(
        `User not found with email: ${mockEmail}`
      );
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      const newPassword = 'newPassword123';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(bcrypt, 'hash').mockResolvedValue('newHashedPassword' as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(User, 'findOneAndUpdate').mockResolvedValueOnce(mockUserDoc as any);

      await expect(userService.resetPassword(mockEmail, newPassword)).resolves.not.toThrow();
    });

    it('should throw error for short password', async () => {
      await expect(userService.resetPassword(mockEmail, '123')).rejects.toThrow(
        'Password must be at least 8 characters long'
      );
    });

    it('should throw error if user not found during password reset', async () => {
      const newPassword = 'newPassword123';
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(bcrypt, 'hash').mockResolvedValue('newHashedPassword' as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vi.spyOn(User, 'findOneAndUpdate').mockResolvedValueOnce(null);

      await expect(userService.resetPassword(mockEmail, newPassword)).rejects.toThrow(
        `User not found with email: ${mockEmail}`
      );
    });
  });
});
