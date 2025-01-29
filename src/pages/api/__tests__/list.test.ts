import { describe, it, expect, vi } from 'vitest';
import { createMocks } from 'node-mocks-http';
import handler from '../users/list';
import { userService } from '../../../services/userService';
import { User } from '../../../types/user';

vi.mock('../../../services/userService', () => ({
  userService: {
    getAllUsers: vi.fn(),
  },
}));

describe('GET /api/users/list', () => {
  const mockUsers: User[] = [
    {
      id: '507f1f77bcf86cd799439011',
      email: 'test1@example.com',
      firstName: 'John',
      lastName: 'Doe',
      createdAt: '2024-01-29T12:00:00.000Z',
      updatedAt: '2024-01-29T12:00:00.000Z',
    },
    {
      id: '507f1f77bcf86cd799439012',
      email: 'test2@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      createdAt: '2024-01-29T12:00:00.000Z',
      updatedAt: '2024-01-29T12:00:00.000Z',
    },
  ];

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

  it('should return 200 and users list when successful', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    vi.mocked(userService.getAllUsers).mockResolvedValueOnce(mockUsers);

    await handler(req, res);

    expect(userService.getAllUsers).toHaveBeenCalled();
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ users: mockUsers });
  });

  it('should return 500 when service throws error', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    const error = new Error('Database connection failed');
    vi.mocked(userService.getAllUsers).mockRejectedValueOnce(error);

    await handler(req, res);

    expect(userService.getAllUsers).toHaveBeenCalled();
    expect(res._getStatusCode()).toBe(500);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Database connection failed',
    });
  });

  it('should return empty array when no users exist', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    vi.mocked(userService.getAllUsers).mockResolvedValueOnce([]);

    await handler(req, res);

    expect(userService.getAllUsers).toHaveBeenCalled();
    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ users: [] });
  });
});
