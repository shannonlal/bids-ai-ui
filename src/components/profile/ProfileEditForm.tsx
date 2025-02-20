import React, { useState, FormEvent, useEffect } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { Layout } from '../layout/Layout';
import { TextInput } from '../../ui-kit/TextInput';
import { Button } from '../../ui-kit/Button';

interface ProfileEditFormProps {
  email: string;
  onCancel: () => void;
  onProfileUpdated?: () => void;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  email,
  onCancel,
  onProfileUpdated,
}) => {
  const { profile, loading, error, updateProfile } = useProfile(email);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName);
      setLastName(profile.lastName);
    }
  }, [profile]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setFormError('First name and last name are required');
      return;
    }

    try {
      await updateProfile({ firstName, lastName });
      onProfileUpdated?.();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>No profile found</div>;
  }

  return (
    <Layout>
      <div className="profile-edit-form">
        <h1>Edit Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <TextInput
              id="firstName"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Enter first name"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <TextInput
              id="lastName"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Enter last name"
              required
            />
          </div>
          {formError && (
            <div className="error-message" role="alert">
              {formError}
            </div>
          )}
          <div className="form-actions">
            <Button type="submit">Save Changes</Button>
            <Button type="button" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
