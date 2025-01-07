import Head from 'next/head';
import type { NextPage } from 'next';
import { Button } from '../ui-kit/Button';
import { Dropdown } from '../ui-kit/Dropdown';
import { IconPlus } from '../ui-kit/icons/IconPlus';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Tailwind Components Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Tailwind Components Demo</h1>

          <div className="space-y-8">
            {/* Buttons Section */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Buttons</h2>
              <div className="space-x-4">
                <Button icon={<IconPlus />}>Create New</Button>
                <Button>SEE MORE</Button>
              </div>
            </div>

            {/* Dropdown Section */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Dropdown</h2>
              <Dropdown
                trigger={<Button variant="secondary">Open Dropdown</Button>}
                items={[
                  {
                    label: 'Profile',
                    onClick: () => console.log('Profile clicked'),
                  },
                  {
                    label: 'Settings',
                    onClick: () => console.log('Settings clicked'),
                  },
                  {
                    label: 'Sign out',
                    onClick: () => console.log('Sign out clicked'),
                  },
                ]}
              />
            </div>

            {/* Input Section */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Input</h2>
              <input type="text" placeholder="Type something..." className="input" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
