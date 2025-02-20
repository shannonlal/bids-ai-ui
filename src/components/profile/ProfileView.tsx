import React, { useEffect } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { Layout } from '../layout/Layout';
import { Button } from '../../ui-kit/Button';

interface ProfileViewProps {
  email: string;
  onEditClick: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ email, onEditClick }) => {
  const { profile, loading, error, fetchProfile } = useProfile(email);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (error) {
    return <div>Error loading profile: {error}</div>;
  }

  if (!profile) {
    return <div>No profile found</div>;
  }

  return (
    <Layout>
      <div className="profile-view">
        <h1>User Profile</h1>
        <div className="profile-details">
          <p>
            <strong>Name:</strong> {profile.firstName} {profile.lastName}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Role:</strong> {profile.role}
          </p>
          <p>
            <strong>Member Since:</strong> {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Button onClick={onEditClick}>Edit Profile</Button>
      </div>
    </Layout>
  );
};
