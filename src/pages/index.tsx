import Head from 'next/head';
import type { NextPage } from 'next';
import { Button } from '../ui-kit/Button';
import { Dropdown } from '../ui-kit/Dropdown';
import { IconPlus } from '../ui-kit/icons/IconPlus';
import { StoryInput } from '../components/story/StoryInput';

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

          <div className="space-y-12">
            {/* Story Input Section */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Story Input</h2>
              <StoryInput
                onSubmit={text => {
                  console.log('Submitted text:', text);
                  // Handle the submitted text here
                }}
              />
            </div>

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
                className="w-64"
                items={[
                  {
                    code: 'EN',
                    label: 'English',
                    onClick: () => console.log('English selected'),
                  },
                  {
                    code: 'FR',
                    label: 'Français',
                    onClick: () => console.log('French selected'),
                  },
                  {
                    code: 'ES',
                    label: 'Español',
                    onClick: () => console.log('Spanish selected'),
                  },
                  {
                    code: 'PT',
                    label: 'Português',
                    onClick: () => console.log('Portuguese selected'),
                  },
                  {
                    code: 'DE',
                    label: 'Deutsch',
                    onClick: () => console.log('German selected'),
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
