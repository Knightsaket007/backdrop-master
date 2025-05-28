import { FolderPlus } from 'lucide-react';

interface EmptyStateProps {
  onCreateNew: () => void;
}

export default function EmptyState({ onCreateNew }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-indigo-50 p-4 rounded-full mb-4">
        <FolderPlus size={32} className="text-indigo-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">No projects yet</h3>
      <p className="text-gray-500 text-center mb-6">Create your first backdrop project to get started</p>
      <button
        onClick={onCreateNew}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors"
      >
        Create New Project
      </button>
    </div>
  );
}