import { useState, useEffect } from "react";
import { 
  useGetProfile, 
  useUpdateProfile, 
  useGetProjects, 
  useCreateProject, 
  useUpdateProject, 
  useDeleteProject,
  getGetProfileQueryKey,
  getGetProjectsQueryKey
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Admin() {
  const queryClient = useQueryClient();
  
  const { data: profile, isLoading: profileLoading } = useGetProfile();
  const { data: projects, isLoading: projectsLoading } = useGetProjects();
  
  const updateProfile = useUpdateProfile();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [profileForm, setProfileForm] = useState({
    name: "", title: "", bio: "", email: "", location: "", website: "", avatarUrl: ""
  });

  const [projectForm, setProjectForm] = useState({
    title: "", description: "", category: "", year: new Date().getFullYear(), coverImage: "", tools: "", tags: ""
  });
  
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name || "",
        title: profile.title || "",
        bio: profile.bio || "",
        email: profile.email || "",
        location: profile.location || "",
        website: profile.website || "",
        avatarUrl: profile.avatarUrl || ""
      });
    }
  }, [profile]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ data: profileForm }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
        alert("Profile updated successfully!");
      }
    });
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...projectForm,
      year: Number(projectForm.year),
      tools: projectForm.tools.split(",").map(t => t.trim()).filter(Boolean),
      tags: projectForm.tags.split(",").map(t => t.trim()).filter(Boolean),
      images: [],
      featured: false
    };

    if (editingProjectId) {
      updateProject.mutate({ id: editingProjectId, data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetProjectsQueryKey() });
          setEditingProjectId(null);
          resetProjectForm();
          alert("Project updated!");
        }
      });
    } else {
      createProject.mutate({ data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetProjectsQueryKey() });
          resetProjectForm();
          alert("Project created!");
        }
      });
    }
  };

  const resetProjectForm = () => {
    setProjectForm({ title: "", description: "", category: "", year: new Date().getFullYear(), coverImage: "", tools: "", tags: "" });
    setEditingProjectId(null);
  };

  const handleEditProject = (p: any) => {
    setEditingProjectId(p.id);
    setProjectForm({
      title: p.title,
      description: p.description,
      category: p.category,
      year: p.year,
      coverImage: p.coverImage,
      tools: p.tools?.join(", ") || "",
      tags: p.tags?.join(", ") || ""
    });
  };

  const handleDeleteProject = (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetProjectsQueryKey() });
        }
      });
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-6 container mx-auto bg-background">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-4xl font-display font-bold mb-12">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Profile Section */}
          <section className="bg-muted/10 p-8 rounded-2xl border border-border/50">
            <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
            {profileLoading ? <Skeleton className="h-64 w-full" /> : (
              <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm mb-1 text-muted-foreground">Name</label>
                  <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-muted-foreground">Title</label>
                  <input type="text" value={profileForm.title} onChange={e => setProfileForm({...profileForm, title: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-muted-foreground">Bio</label>
                  <textarea value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2 min-h-[100px]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-muted-foreground">Email</label>
                    <input type="email" value={profileForm.email} onChange={e => setProfileForm({...profileForm, email: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-muted-foreground">Location</label>
                    <input type="text" value={profileForm.location} onChange={e => setProfileForm({...profileForm, location: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2" />
                  </div>
                </div>
                <button type="submit" disabled={updateProfile.isPending} className="mt-4 bg-primary text-primary-foreground py-2 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  {updateProfile.isPending ? "Saving..." : "Save Profile"}
                </button>
              </form>
            )}
          </section>

          {/* Projects Section */}
          <section className="bg-muted/10 p-8 rounded-2xl border border-border/50">
            <h2 className="text-2xl font-bold mb-6">{editingProjectId ? "Edit Project" : "Add Project"}</h2>
            <form onSubmit={handleProjectSubmit} className="flex flex-col gap-4 mb-12">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-muted-foreground">Title</label>
                  <input required type="text" value={projectForm.title} onChange={e => setProjectForm({...projectForm, title: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-muted-foreground">Category</label>
                  <input required type="text" value={projectForm.category} onChange={e => setProjectForm({...projectForm, category: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2" />
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1 text-muted-foreground">Description</label>
                <textarea required value={projectForm.description} onChange={e => setProjectForm({...projectForm, description: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-sm mb-1 text-muted-foreground">Cover Image URL</label>
                <input required type="text" value={projectForm.coverImage} onChange={e => setProjectForm({...projectForm, coverImage: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1 text-muted-foreground">Year</label>
                  <input required type="number" value={projectForm.year} onChange={e => setProjectForm({...projectForm, year: Number(e.target.value)})} className="w-full bg-background border border-border rounded-lg p-2" />
                </div>
                <div>
                  <label className="block text-sm mb-1 text-muted-foreground">Tools (comma separated)</label>
                  <input type="text" value={projectForm.tools} onChange={e => setProjectForm({...projectForm, tools: e.target.value})} className="w-full bg-background border border-border rounded-lg p-2" />
                </div>
              </div>
              <div className="flex gap-4 mt-4">
                <button type="submit" disabled={createProject.isPending || updateProject.isPending} className="bg-primary text-primary-foreground py-2 px-6 rounded-lg font-medium hover:bg-primary/90 transition-colors flex-1">
                  {editingProjectId ? "Update Project" : "Create Project"}
                </button>
                {editingProjectId && (
                  <button type="button" onClick={resetProjectForm} className="bg-muted text-foreground py-2 px-6 rounded-lg font-medium hover:bg-muted/80 transition-colors">
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <h3 className="text-xl font-bold mb-4">Existing Projects</h3>
            <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-2">
              {projectsLoading ? <Skeleton className="h-20 w-full" /> : projects?.map(p => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-background border border-border rounded-xl">
                  <div>
                    <h4 className="font-bold">{p.title}</h4>
                    <span className="text-sm text-muted-foreground">{p.category} • {p.year}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditProject(p)} className="text-sm px-3 py-1.5 bg-muted rounded-md hover:text-primary transition-colors">Edit</button>
                    <button onClick={() => handleDeleteProject(p.id)} className="text-sm px-3 py-1.5 bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 transition-colors">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
