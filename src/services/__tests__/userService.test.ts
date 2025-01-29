import { describe, it, expect, vi, beforeEach } from 'vitest';
import mongoose from 'mongoose';
import { userService } from '../userService';
import { User, IUserDocument } from '../../models/User';
import connectDB from '../../lib/mongodb';

// Mock the MongoDB connection
vi.mock('../../lib/mongodb', () => ({
  default: vi.fn().mockResolvedValue(mongoose),
}));

describe('UserService', () => {
  const mockUser: Partial<IUserDocument> = {
    _id: new mongoose.Types.ObjectId(),
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserByEmail', () => {
    it('should return user when found', async () => {
      // Mock the User.findOne method
      vi.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser as IUserDocument);

      const result = await userService.getUserByEmail('test@example.com');

      expect(connectDB).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
      expect(result).toEqual({
        id: mockUser._id!.toString(),
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        createdAt: mockUser.createdAt!.toISOString(),
        updatedAt: mockUser.updatedAt!.toISOString(),
      });
    });

    it('should throw error when user not found', async () => {
      // Mock the User.findOne method to return null
      vi.spyOn(User, 'findOne').mockResolvedValueOnce(null);

      await expect(userService.getUserByEmail('nonexistent@example.com')).rejects.toThrow(
        'User not found with email: nonexistent@example.com'
      );

      expect(connectDB).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalledWith({
        email: 'nonexistent@example.com',
      });
    });
  });

  describe('exists', () => {
    it('should return true when user exists', async () => {
      vi.spyOn(User, 'findOne').mockResolvedValueOnce(mockUser as IUserDocument);

      const result = await userService.exists('test@example.com');

      expect(result).toBe(true);
      expect(connectDB).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });

    it('should return false when user does not exist', async () => {
      vi.spyOn(User, 'findOne').mockResolvedValueOnce(null);

      const result = await userService.exists('nonexistent@example.com');

      expect(result).toBe(false);
      expect(connectDB).toHaveBeenCalled();
      expect(User.findOne).toHaveBeenCalledWith({
        email: 'nonexistent@example.com',
      });
    });
  });
});
