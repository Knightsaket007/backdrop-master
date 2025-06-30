"use client";

import { useEffect, useState } from "react";
import Topbar from "@/app/components/dashboard/Topbar";
import ProjectCard from "@/app/components/dashboard/ProjectCard";
import EmptyState from "@/app/components/dashboard/EmptyState";
import { useAuth, useUser } from "@clerk/nextjs";
import LoaderComp from "../components/LoaderComp";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Sample project data
const sampleProjects = [
  {
    id: "1",
    title: "Summer Collection Backdrop",
    imageUrl:
      "https://images.pexels.com/photos/5876695/pexels-photo-5876695.jpeg",
    createdAt: "2 days ago",
  },
  {
    id: "2",
    title: "Product Showcase",
    imageUrl:
      "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
    createdAt: "1 week ago",
  },
  {
    id: "3",
    title: "Portrait Setup",
    imageUrl:
      "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
    createdAt: "2 weeks ago",
  },
];

export default function Dashboard() {
  // const [projects, setProjects] = useState(sampleProjects);
  const [projects, setProjects] = useState([]);
  const { userId, isLoaded } = useAuth();
  const [openloader, setopenloader] = useState(false)

  useEffect(()=>{

    console.log("userId isss..", userId)
    const fetchProjects =async ()=>{
      if(userId ){
        const result = await fetch(`/api/get-projects?id=${userId}`);
        const res = await result.json();
        console.log("result is..", res)
        // setProjects(res);
      }
    }

   fetchProjects(); 
  },[userId])

  const handleCreateNew = () => {
    console.log("Creating new project");
  };

  const handleEdit = (id: string) => {
    console.log("Editing project:", id);
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter((project) => project._id !== id));
  };


  const router = useRouter();
  const createProject = async () => {
    setopenloader(true);
    if (!userId || !isLoaded) {
      console.log("User not authenticated");
      setopenloader(false);
      toast("User not authenticated")
      return;
    }

    try {
      const res = await fetch("/api/create-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setopenloader(false);
        toast("Failed to create project")
        throw new Error(data.error || "Failed to create project");
      }

      setopenloader(false);
      // window.open(`/editor/${data?.data}`, '_blank')
      router.push(`/editor/${data?.data}`)
      console.log("✅ Project created:", data.data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar createProject={createProject} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {projects.length === 0 ? (
          <EmptyState onCreateNew={handleCreateNew} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {
        openloader && (
          <LoaderComp />
        )
      }

      <Toaster position='top-center' theme='light' />

    </div>
  );
}
