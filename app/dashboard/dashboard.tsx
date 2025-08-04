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


type Project = {
  _id: string;
  title: string;
  backgroundImage: string;
};

export default function Dashboard() {
  // const [projects, setProjects] = useState(sampleProjects);
  const [projects, setProjects] = useState<Project[]>([]);
  const { userId, isLoaded } = useAuth();
  const [openloader, setopenloader] = useState(false)

  const fetchProjects = async () => {
    try {
      if (userId) {
        const result = await fetch(`/api/get-projects?id=${userId}`);
        const res = await result.json();
        console.log("result is..", res)
        setProjects(res);
        setopenloader(false);
      }
    }
    catch (error) {
      console.error("Error fetching projects:", error);
      toast("Failed to fetch projects");
      return;
    }

  }

  useEffect(() => {
    setopenloader(true);
    fetchProjects();
  }, [userId])

  const handleCreateNew = () => {
    console.log("Creating new project");
  };


  const handleDelete = async (id: string) => {
    const result = await fetch("/api/delete-project", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: userId, id }),
    });

    if (!result.ok) {

      toast("Failed to delete project")
      return;
    }
    toast("Project deleted successfully")
    
    console.log("result is..", result)

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
          <EmptyState onCreateNew={createProject} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
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


      {/*=-=--=- shadcn components -=-=-=-=-*/}
      <Toaster position='top-center' theme='light' />


    </div>
  );
}
