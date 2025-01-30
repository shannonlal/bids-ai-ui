import { NextPage } from 'next';
import { Layout } from '../components/layout/Layout';
import { ProfileComponent } from '../components/profile/ProfileComponent';

const ProfilePage: NextPage = () => {
  // TODO: In a real application, this would come from an auth context or session
  const testEmail = 'vincent@gmail.com';

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <ProfileComponent email={testEmail} />
      </div>
    </Layout>
  );
};

export default ProfilePage;
