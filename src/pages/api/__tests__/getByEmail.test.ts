import { describe, it, expect, vi } from 'vitest';
import { createMocks } from 'node-mocks-http';
import handler from '../users/getByEmail';
import { userService } from '../../../services/userService';
import { User } from '../../../types/user';

vi.mock('../../../services/userService', () => ({
  userService: {
    getUserByEmail: vi.fn(),
  },
}));

describe('GET /api/users/getByEmail', () => {
  const mockUser: User = {
    id: '507f1f77bcf86cd799439011',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: '2024-01-29T12:00:00.000Z',
    updatedAt: '2024-01-29T12:00:00.000Z',
  };

  it('should return 405 for non-GET requests', async () => {
    const { req, res } = createMocks({
      method: 'POST',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Method not allowed',
    });
  });

  it('should return 400 if email is missing', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: {},
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Email parameter is required',
    });
  });

  it('should return 200 and user data when found', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { email: 'test@example.com' },
    });

    vi.mocked(userService.getUserByEmail).mockResolvedValueOnce(mockUser);

    await handler(req, res);

    expect(userService.getUserByEmail).toHaveBeenCalledWith('test@example.com');
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ user: mockUser });
  });

  it('should return 404 when user is not found', async () => {
    const { req, res } = createMocks({
      method: 'GET',
      query: { email: 'nonexistent@example.com' },
    });

    vi.mocked(userService.getUserByEmail).mockRejectedValueOnce(
      new Error('User not found with email: nonexistent@example.com')
    );

    await handler(req, res);

    expect(userService.getUserByEmail).toHaveBeenCalledWith('nonexistent@example.com');
    expect(res._getStatusCode()).toBe(404);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'User not found with email: nonexistent@example.com',
    });
  });
});
