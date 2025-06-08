import { useState } from 'react';
import { Plus, Command, ChevronDown } from 'lucide-react';
// import { Dropdown } from '../ui/Dropdown';

type TopbarProps = {
  createProject: () => void;
};

export default function Topbar({createProject}:TopbarProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  
  const toggleDropdown = () => setShowDropdown(!showDropdown);



  return (
    <header className="bg-white border-b border-gray-100 px-6 h-16 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Command className="h-6 w-6 text-indigo-600" />
        <span className="text-xl font-semibold text-gray-800">Backdrop Master</span>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Balance */}
        <div className="hidden sm:block">
          <p className="text-sm text-gray-500">Available Credits</p>
          <p className="text-sm font-semibold text-gray-800">2,500</p>
        </div>

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
          <button 
            onClick={toggleDropdown}
            className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-lg transition-colors"
          >
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
              A
            </div>
            <ChevronDown size={16} className="text-gray-500" />
          </button>
          
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