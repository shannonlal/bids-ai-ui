import React, { useEffect, useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { TextInput } from '../../ui-kit/TextInput';
import { Button } from '../../ui-kit/Button';

interface ProfileComponentProps {
  email: string;
}

export const ProfileComponent: React.FC<ProfileComponentProps> = ({ email }) => {
  const { profile, loading, error, fetchProfile, updateProfile } = useProfile(email);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
  });
  const [updateError, setUpdateError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError(null);

    try {
      await updateProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
      });
      setIsEditing(false);
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  if (loading && !profile) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!profile) {
    return <div className="text-red-500 p-4">Profile not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>

      {/* Display Mode */}
      {!isEditing && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <p className="mt-1 text-gray-900">{profile.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">First Name</label>
            <p className="mt-1 text-gray-900">{profile.firstName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Last Name</label>
            <p className="mt-1 text-gray-900">{profile.lastName}</p>
          </div>
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        </div>
      )}

      {/* Edit Mode */}
      {isEditing && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <p className="mt-1 text-gray-900">{profile.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">First Name</label>
            <TextInput
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Last Name</label>
            <TextInput
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
          {updateError && <div className="text-red-500 text-sm">{updateError}</div>}
          <div className="flex space-x-4">
            <Button type="submit">Save Changes</Button>
            <Button
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  firstName: profile.firstName,
                  lastName: profile.lastName,
                });
                setUpdateError(null);
              }}
              variant="secondary"
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
