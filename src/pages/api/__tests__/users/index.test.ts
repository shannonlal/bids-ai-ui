import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import { userService } from '../../../../services/userService';
import handler from '../../../../pages/api/users/index';

// Mock the entire userService module
vi.mock('../../../../services/userService', () => ({
  userService: {
    createUser: vi.fn(),
    getAllUsers: vi.fn(),
  },
}));

describe('Users API Route Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/users', () => {
    it('should create a new user successfully', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          password: 'password123',
          role: 'user',
        },
      });

      const mockUser = {
        id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      vi.mocked(userService.createUser).mockResolvedValue(mockUser);

      await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

      expect(res._getStatusCode()).toBe(201);
      expect(JSON.parse(res._getData())).toEqual({ user: mockUser });
      expect(userService.createUser).toHaveBeenCalledWith(req.body);
    });

    it('should handle user creation error', async () => {
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          password: 'password123',
          role: 'user',
        },
      });

      vi.mocked(userService.createUser).mockRejectedValue(new Error('User creation failed'));

      await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

      expect(res._getStatusCode()).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'User creation failed',
      });
    });
  });

  describe('GET /api/users', () => {
    it('should retrieve all users successfully', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      const mockUsers = [
        {
          id: '1',
          email: 'user1@example.com',
          firstName: 'John',
          lastName: 'Doe',
          role: 'user',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          email: 'user2@example.com',
          firstName: 'Jane',
          lastName: 'Smith',
          role: 'admin',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      vi.mocked(userService.getAllUsers).mockResolvedValue(mockUsers);

      await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({ users: mockUsers });
    });

    it('should handle error when retrieving users', async () => {
      const { req, res } = createMocks({
        method: 'GET',
      });

      vi.mocked(userService.getAllUsers).mockRejectedValue(new Error('Failed to retrieve users'));

      await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

      expect(res._getStatusCode()).toBe(500);
      expect(JSON.parse(res._getData())).toEqual({
        error: 'Failed to retrieve users',
      });
    });
  });

  describe('Unsupported Methods', () => {
    it('should return 405 for unsupported HTTP methods', async () => {
      const { req, res } = createMocks({
        method: 'PUT',
      });

      await handler(req as unknown as NextApiRequest, res as unknown as NextApiResponse);

      expect(res._getStatusCode()).toBe(405);
      expect(res.getHeader('Allow')).toBe('GET, POST');
    });
  });
});
