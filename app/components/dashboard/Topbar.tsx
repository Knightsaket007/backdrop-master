import { Plus } from 'lucide-react';
import { SignedIn, UserButton } from '@clerk/nextjs';
// import { Dropdown } from '../ui/Dropdown';

type TopbarProps = {
  createProject: () => void;
};

export default function Topbar({ createProject }: TopbarProps) {

  return (
    <header className="bg-white border-b border-gray-100 px-6 h-16 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-semibold tracking-tight text-gray-800">BackdropMaster</span>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Create New Button */}
        <button
          onClick={createProject}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Create New</span>
        </button>

        {/* User Profile */}
        <div className="relative">

          <SignedIn>
            <UserButton
            // userProfileMode="navigation"
            // userProfileUrl="/profile"
            // redirectUrl="/"
            />
          </SignedIn>


          {/* {showDropdown && (
            <Dropdown 
              items={[
                { label: 'Profile', onClick: () => console.log('Profile clicked') },
                { label: 'Settings', onClick: () => console.log('Settings clicked') },
                { label: 'Logout', onClick: () => console.log('Logout clicked') }
              ]}
            />
          )} */}
        </div>
      </div>
    </header>
  );
}
