'use client'

import { Pencil, Trash2, MoreVertical } from 'lucide-react';
import { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from 'next/navigation';

interface Project {
  _id: string;
  title: string;
  backgroundImage: string;
  createdAt?: string;
}

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const [openDialog, setOpenDialog] = useState(false);

  const handleDelete = () => {
    setOpenDialog(true); // 👈 Open the dialog from inside your function
  };

  const confirmDelete = () => {
    onDelete(project._id);
    setOpenDialog(false);
  };

  const router = useRouter();

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
        {/* Image */}
        <div className="aspect-video w-full overflow-hidden bg-gray-100">
          {
            project.backgroundImage ? (
              <img
                src={project.backgroundImage}
                alt={project._id}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                onClick={()=> router.push(`/editor/${project._id}`)}
              />
            ) :
              (
                <img
                  src="https://placehold.co/300x200?text=Empty"
                  alt={project._id}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                  onClick={()=> router.push(`/editor/${project._id}`)}
                />
              )

          }

        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-gray-900">{project.title}</h3>
              <p className="text-sm text-gray-500 mt-1">Created {project.createdAt}</p>
            </div>
            {/* Actions */}
            <div className="relative flex items-center justify-end gap-2">
              {/* <button
                onClick={() => onEdit(project._id)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <Pencil size={18} />
              </button> */}

              <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Controlled AlertDialog */}
      <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
