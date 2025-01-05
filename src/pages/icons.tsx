import React from 'react';
import { IconAdd } from '../ui-kit/icons/IconAdd';
import { IconArrowDown } from '../ui-kit/icons/IconArrowDown';
import { IconArrowDownUp } from '../ui-kit/icons/IconArrowDownUp';
import { IconArrowLeft } from '../ui-kit/icons/IconArrowLeft';
import { IconButton } from '../ui-kit/icons/IconButton';
import { IconCopy } from '../ui-kit/icons/IconCopy';
import { IconCreate } from '../ui-kit/icons/IconCreate';
import { IconDelete } from '../ui-kit/icons/IconDelete';
import { IconDownload } from '../ui-kit/icons/IconDownload';
import { IconEdit } from '../ui-kit/icons/IconEdit';
import { IconError } from '../ui-kit/icons/IconError';
import { IconHelp } from '../ui-kit/icons/IconHelp';
import { IconLike } from '../ui-kit/icons/IconLike';
import { IconLogo } from '../ui-kit/icons/IconLogo';
import { IconMenu } from '../ui-kit/icons/IconMenu';
import { IconMinus } from '../ui-kit/icons/IconMinus';
import { IconPlus } from '../ui-kit/icons/IconPlus';
import { IconRedo } from '../ui-kit/icons/IconRedo';
import { IconReload } from '../ui-kit/icons/IconReload';
import { IconSave } from '../ui-kit/icons/IconSave';
import { IconSearch } from '../ui-kit/icons/IconSearch';
import { IconSend } from '../ui-kit/icons/IconSend';
import { IconSettings } from '../ui-kit/icons/IconSettings';
import { IconUser } from '../ui-kit/icons/IconUser';

const icons = [
  { name: 'Add', component: IconAdd },
  { name: 'ArrowDown', component: IconArrowDown },
  { name: 'ArrowDownUp', component: IconArrowDownUp },
  { name: 'ArrowLeft', component: IconArrowLeft },
  { name: 'Button', component: IconButton },
  { name: 'Copy', component: IconCopy },
  { name: 'Create', component: IconCreate },
  { name: 'Delete', component: IconDelete },
  { name: 'Download', component: IconDownload },
  { name: 'Edit', component: IconEdit },
  { name: 'Error', component: IconError },
  { name: 'Help', component: IconHelp },
  { name: 'Like', component: IconLike },
  { name: 'Logo', component: IconLogo },
  { name: 'Menu', component: IconMenu },
  { name: 'Minus', component: IconMinus },
  { name: 'Plus', component: IconPlus },
  { name: 'Redo', component: IconRedo },
  { name: 'Reload', component: IconReload },
  { name: 'Save', component: IconSave },
  { name: 'Search', component: IconSearch },
  { name: 'Send', component: IconSend },
  { name: 'Settings', component: IconSettings },
  { name: 'User', component: IconUser },
].sort((a, b) => a.name.localeCompare(b.name));

// Helper function to chunk array into groups of n
const chunkArray = <T,>(arr: T[], size: number): T[][] => {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size)
  );
};

const IconsPage = () => {
  const iconRows = chunkArray(icons, 5);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Icons</h1>
      <div className="overflow-hidden border rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            {iconRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {row.map(({ name, component: Icon }) => (
                  <td key={name} className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col items-center">
                      <Icon size={24} className="text-gray-500 mb-2" />
                      <div className="text-sm text-gray-900">{name}</div>
                    </div>
                  </td>
                ))}
                {/* Add empty cells to maintain 5 columns if row is not complete */}
                {Array.from({ length: 5 - row.length }).map((_, i) => (
                  <td key={`empty-${i}`} className="px-6 py-4 whitespace-nowrap" />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IconsPage;
