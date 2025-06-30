import { Pencil, Trash2, MoreVertical } from 'lucide-react';
import { useState } from 'react';

interface Project {
  id: string;
  title: string;
  imageUrl: string;
  createdAt: string;
}

interface ProjectCardProps {
  project: Project;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(project._id);
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
      {/* Image Preview */}
      <div className="aspect-video w-full overflow-hidden bg-gray-100">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium text-gray-900">{project.title}</h3>
            <p className="text-sm text-gray-500 mt-1">Created {project.createdAt}</p>
          </div>
          <div className="relative">
            <button className="p-1 rounded-lg hover:bg-gray-100">
              <MoreVertical size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 mt-4">
          <button
            onClick={() => onEdit(project.id)}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={handleDelete}
            className={`p-1.5 rounded-lg transition-colors ${showDeleteConfirm
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'hover:bg-gray-100 text-gray-600'
              }`}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}