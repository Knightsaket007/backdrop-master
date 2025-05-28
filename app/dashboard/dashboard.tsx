import { useState } from 'react';
// import Topbar from '../components/layout/Topbar';
import Topbar from '@/app/components/dashboard/Topbar';
import ProjectCard from '@/app/components/dashboard/ProjectCard';
import EmptyState from '@/app/components/dashboard/EmptyState';

// Sample project data
const sampleProjects = [
  {
    id: '1',
    title: 'Summer Collection Backdrop',
    imageUrl: 'https://images.pexels.com/photos/5876695/pexels-photo-5876695.jpeg',
    createdAt: '2 days ago'
  },
  {
    id: '2',
    title: 'Product Showcase',
    imageUrl: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
    createdAt: '1 week ago'
  },
  {
    id: '3',
    title: 'Portrait Setup',
    imageUrl: 'https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg',
    createdAt: '2 weeks ago'
  }
];

export default function Dashboard() {
  const [projects, setProjects] = useState(sampleProjects);

  const handleCreateNew = () => {
    console.log('Creating new project');
  };

  const handleEdit = (id: string) => {
    console.log('Editing project:', id);
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter(project => project.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {projects.length === 0 ? (
          <EmptyState onCreateNew={handleCreateNew} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}