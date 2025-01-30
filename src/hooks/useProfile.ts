import { useState, useCallback } from 'react';
import { User } from '../types/user';

interface UseProfileReturn {
  profile: User | null;
  loading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: { firstName: string; lastName: string }) => Promise<void>;
}

export const useProfile = (email: string): UseProfileReturn => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/users/getByEmail?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile');
      }

      setProfile(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [email]);

  const updateProfile = useCallback(
    async (updates: { firstName: string; lastName: string }) => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/users/updateProfile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            ...updates,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to update profile');
        }

        setProfile(data.user);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        throw err; // Re-throw to handle in the component
      } finally {
        setLoading(false);
      }
    },
    [email]
  );

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
  };
};
