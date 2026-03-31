import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  useGetProfile,
  useUpdateProfile,
  useGetProjects,
  useGetProjectStats,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  getGetProfileQueryKey,
  getGetProjectsQueryKey,
  getGetProjectStatsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FolderOpen,
  User,
  Eye,
  Heart,
  BarChart3,
  Star,
  Plus,
  Pencil,
  Trash2,
  X,
  ExternalLink,
  ChevronRight,
  Save,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
  Tag,
  Wrench,
  Calendar,
  Building2,
  Globe,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "@/components/theme-provider";
import { Moon, Sun } from "lucide-react";

type Section = "overview" | "projects" | "profile";

type ProjectFormData = {
  title: string;
  description: string;
  longDescription: string;
  coverImage: string;
  images: string;
  category: string;
  tags: string;
  year: number;
  client: string;
  tools: string;
  featured: boolean;
  projectUrl: string;
};

const EMPTY_PROJECT_FORM: ProjectFormData = {
  title: "",
  description: "",
  longDescription: "",
  coverImage: "",
  images: "",
  category: "",
  tags: "",
  year: new Date().getFullYear(),
  client: "",
  tools: "",
  featured: false,
  projectUrl: "",
};

const CATEGORIES = [
  { value: "ui-design", label: "UI Design" },
  { value: "branding", label: "Branding" },
  { value: "photography", label: "Photography" },
  { value: "illustration", label: "Illustration" },
  { value: "web-development", label: "Web Development" },
  { value: "motion", label: "Motion" },
];

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl border text-sm font-medium ${
        type === "success"
          ? "bg-[#0a0a0a] border-primary/30 text-foreground"
          : "bg-[#0a0a0a] border-red-500/30 text-red-400"
      }`}
    >
      {type === "success" ? (
        <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
      ) : (
        <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
      )}
      {message}
    </motion.div>
  );
}

function StatCard({ label, value, icon: Icon, sub }: { label: string; value: string | number; icon: any; sub?: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </div>
      <div>
        <div className="text-3xl font-display font-bold text-foreground">{value}</div>
        {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
      </div>
    </div>
  );
}

function ProjectModal({
  open,
  onClose,
  editingProject,
  onSubmit,
  isPending,
}: {
  open: boolean;
  onClose: () => void;
  editingProject: any | null;
  onSubmit: (data: ProjectFormData) => void;
  isPending: boolean;
}) {
  const [form, setForm] = useState<ProjectFormData>(EMPTY_PROJECT_FORM);

  useEffect(() => {
    if (editingProject) {
      setForm({
        title: editingProject.title ?? "",
        description: editingProject.description ?? "",
        longDescription: editingProject.longDescription ?? "",
        coverImage: editingProject.coverImage ?? "",
        images: (editingProject.images ?? []).join("\n"),
        category: editingProject.category ?? "",
        tags: (editingProject.tags ?? []).join(", "),
        year: editingProject.year ?? new Date().getFullYear(),
        client: editingProject.client ?? "",
        tools: (editingProject.tools ?? []).join(", "),
        featured: editingProject.featured ?? false,
        projectUrl: editingProject.projectUrl ?? "",
      });
    } else {
      setForm(EMPTY_PROJECT_FORM);
    }
  }, [editingProject, open]);

  const set = (k: keyof ProjectFormData, v: any) => setForm((f) => ({ ...f, [k]: v }));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative z-10 bg-[#0d0d0d] border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-display font-bold">{editingProject ? "Edit Project" : "New Project"}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{editingProject ? "Update project details" : "Add a new project to your portfolio"}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 flex flex-col gap-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Title *</label>
              <input
                data-testid="input-project-title"
                required
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Project name"
                className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Category *</label>
              <select
                data-testid="select-project-category"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all appearance-none"
              >
                <option value="">Select category</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Year *</label>
              <input
                data-testid="input-project-year"
                type="number"
                value={form.year}
                onChange={(e) => set("year", Number(e.target.value))}
                className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Short Description *</label>
            <textarea
              data-testid="textarea-project-description"
              required
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="A brief description shown in the project cards"
              rows={2}
              className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 resize-none transition-all placeholder:text-muted-foreground/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Long Description</label>
            <textarea
              value={form.longDescription}
              onChange={(e) => set("longDescription", e.target.value)}
              placeholder="Full project story shown on the detail page"
              rows={4}
              className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 resize-none transition-all placeholder:text-muted-foreground/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
              <span className="flex items-center gap-1.5"><ImageIcon className="w-3.5 h-3.5" /> Cover Image URL *</span>
            </label>
            <input
              required
              value={form.coverImage}
              onChange={(e) => set("coverImage", e.target.value)}
              placeholder="https://..."
              className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
            />
            {form.coverImage && (
              <div className="mt-2 rounded-lg overflow-hidden h-24 w-full">
                <img src={form.coverImage} className="w-full h-full object-cover" alt="Cover preview" onError={(e) => (e.currentTarget.style.display = "none")} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Gallery Images (one URL per line)</label>
            <textarea
              value={form.images}
              onChange={(e) => set("images", e.target.value)}
              placeholder={"https://...\nhttps://...\nhttps://..."}
              rows={3}
              className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-primary/50 resize-none transition-all placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Tags (comma separated)</span>
              </label>
              <input
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="Brand Identity, UI Design"
                className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                <span className="flex items-center gap-1.5"><Wrench className="w-3.5 h-3.5" /> Tools (comma separated)</span>
              </label>
              <input
                value={form.tools}
                onChange={(e) => set("tools", e.target.value)}
                placeholder="Figma, React, Illustrator"
                className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                <span className="flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Client</span>
              </label>
              <input
                value={form.client}
                onChange={(e) => set("client", e.target.value)}
                placeholder="Client name"
                className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Project URL</span>
              </label>
              <input
                value={form.projectUrl}
                onChange={(e) => set("projectUrl", e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              data-testid="toggle-featured"
              onClick={() => set("featured", !form.featured)}
              className={`relative w-11 h-6 rounded-full transition-colors ${form.featured ? "bg-primary" : "bg-muted"}`}
            >
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${form.featured ? "translate-x-5" : "translate-x-0"}`} />
            </div>
            <div>
              <div className="text-sm font-medium">Featured project</div>
              <div className="text-xs text-muted-foreground">Shown on the homepage hero section</div>
            </div>
          </label>
        </div>

        <div className="p-6 border-t border-border flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-medium bg-muted/50 hover:bg-muted transition-colors">Cancel</button>
          <button
            data-testid="button-save-project"
            onClick={() => onSubmit(form)}
            disabled={isPending || !form.title || !form.description || !form.coverImage || !form.category}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isPending ? "Saving..." : editingProject ? "Update Project" : "Create Project"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function DeleteConfirmModal({ open, project, onConfirm, onClose, isPending }: { open: boolean; project: any; onConfirm: () => void; onClose: () => void; isPending: boolean }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 bg-[#0d0d0d] border border-red-500/20 rounded-2xl p-8 w-full max-w-md text-center shadow-2xl"
      >
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-5">
          <Trash2 className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="text-lg font-bold mb-2">Delete project?</h3>
        <p className="text-sm text-muted-foreground mb-6">
          <span className="text-foreground font-medium">{project?.title}</span> will be permanently removed from your portfolio. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-muted/50 hover:bg-muted transition-colors">Cancel</button>
          <button
            data-testid="button-confirm-delete"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500/90 text-white hover:bg-red-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function Admin() {
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const [section, setSection] = useState<Section>("overview");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [deleteModal, setDeleteModal] = useState<any | null>(null);
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: "success" | "error" }>>([]);
  const toastId = useState(0);

  const { data: stats, isLoading: statsLoading } = useGetProjectStats();
  const { data: projects, isLoading: projectsLoading } = useGetProjects();
  const { data: profile, isLoading: profileLoading } = useGetProfile();

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();
  const updateProfile = useUpdateProfile();

  const [profileForm, setProfileForm] = useState({
    name: "", title: "", bio: "", email: "", location: "",
    website: "", github: "", instagram: "", linkedin: "",
    avatarUrl: "", skills: "",
  });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        name: profile.name ?? "",
        title: profile.title ?? "",
        bio: profile.bio ?? "",
        email: profile.email ?? "",
        location: profile.location ?? "",
        website: profile.website ?? "",
        github: profile.github ?? "",
        instagram: profile.instagram ?? "",
        linkedin: profile.linkedin ?? "",
        avatarUrl: profile.avatarUrl ?? "",
        skills: (profile.skills ?? []).join(", "),
      });
    }
  }, [profile]);

  const addToast = (message: string, type: "success" | "error") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    return id;
  };

  const removeToast = (id: number) => setToasts((t) => t.filter((x) => x.id !== id));

  const handleProjectSubmit = (form: ProjectFormData) => {
    const payload = {
      title: form.title,
      description: form.description,
      longDescription: form.longDescription || null,
      coverImage: form.coverImage,
      images: form.images.split("\n").map((s) => s.trim()).filter(Boolean),
      category: form.category,
      tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
      year: form.year,
      client: form.client || null,
      tools: form.tools.split(",").map((s) => s.trim()).filter(Boolean),
      featured: form.featured,
      projectUrl: form.projectUrl || null,
    };

    if (editingProject) {
      updateProject.mutate({ id: editingProject.id, data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetProjectsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetProjectStatsQueryKey() });
          setModalOpen(false);
          setEditingProject(null);
          addToast("Project updated successfully", "success");
        },
        onError: () => addToast("Failed to update project", "error"),
      });
    } else {
      createProject.mutate({ data: payload }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetProjectsQueryKey() });
          queryClient.invalidateQueries({ queryKey: getGetProjectStatsQueryKey() });
          setModalOpen(false);
          addToast("Project created successfully", "success");
        },
        onError: () => addToast("Failed to create project", "error"),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!deleteModal) return;
    deleteProject.mutate({ id: deleteModal.id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetProjectsQueryKey() });
        queryClient.invalidateQueries({ queryKey: getGetProjectStatsQueryKey() });
        setDeleteModal(null);
        addToast("Project deleted", "success");
      },
      onError: () => addToast("Failed to delete project", "error"),
    });
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({
      data: {
        ...profileForm,
        skills: profileForm.skills.split(",").map((s) => s.trim()).filter(Boolean),
        website: profileForm.website || null,
        github: profileForm.github || null,
        instagram: profileForm.instagram || null,
        linkedin: profileForm.linkedin || null,
      },
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetProfileQueryKey() });
        addToast("Profile saved successfully", "success");
      },
      onError: () => addToast("Failed to save profile", "error"),
    });
  };

  const setP = (k: keyof typeof profileForm, v: string) => setProfileForm((f) => ({ ...f, [k]: v }));

  const navItems = [
    { id: "overview" as Section, label: "Overview", icon: LayoutDashboard },
    { id: "projects" as Section, label: "Projects", icon: FolderOpen },
    { id: "profile" as Section, label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#080808] text-foreground flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border/50 flex flex-col h-screen sticky top-0">
        <div className="p-6 border-b border-border/50">
          <Link href="/" className="flex items-center gap-2.5 group">
            <ArrowLeft className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">View Portfolio</span>
          </Link>
          <div className="mt-6">
            <div className="text-lg font-display font-bold tracking-tight">CMS Dashboard</div>
            <div className="text-xs text-muted-foreground mt-0.5">Manage your portfolio</div>
          </div>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              data-testid={`nav-${id}`}
              onClick={() => setSection(id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full text-left transition-all ${
                section === id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
              {section === id && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border/50">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full text-left text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {theme === "dark" ? "Light mode" : "Dark mode"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto p-8">

          {/* Overview */}
          <AnimatePresence mode="wait">
            {section === "overview" && (
              <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <div className="mb-8">
                  <h1 className="text-3xl font-display font-bold">Overview</h1>
                  <p className="text-muted-foreground mt-1 text-sm">Your portfolio at a glance</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  {statsLoading ? (
                    Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
                  ) : (
                    <>
                      <StatCard label="Total Projects" value={stats?.totalProjects ?? 0} icon={FolderOpen} />
                      <StatCard label="Total Views" value={(stats?.totalViews ?? 0).toLocaleString()} icon={Eye} />
                      <StatCard label="Total Likes" value={(stats?.totalLikes ?? 0).toLocaleString()} icon={Heart} />
                      <StatCard label="Featured" value={stats?.featuredCount ?? 0} icon={Star} sub="shown on homepage" />
                      <StatCard label="Years Active" value={stats?.yearsActive ?? 0} icon={Calendar} />
                      <StatCard label="Categories" value={stats?.categoryCounts?.length ?? 0} icon={BarChart3} />
                    </>
                  )}
                </div>

                {!statsLoading && stats?.categoryCounts && stats.categoryCounts.length > 0 && (
                  <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-5">Projects by Category</h2>
                    <div className="flex flex-col gap-3">
                      {stats.categoryCounts
                        .sort((a, b) => b.count - a.count)
                        .map(({ category, count }) => {
                          const max = Math.max(...stats.categoryCounts.map((c) => c.count));
                          const pct = Math.round((count / max) * 100);
                          const cat = CATEGORIES.find((c) => c.value === category);
                          return (
                            <div key={category} className="flex items-center gap-4">
                              <div className="w-28 shrink-0 text-sm font-medium text-muted-foreground">{cat?.label ?? category}</div>
                              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${pct}%` }}
                                  transition={{ duration: 0.6, ease: "easeOut" }}
                                  className="h-full bg-primary rounded-full"
                                />
                              </div>
                              <div className="text-sm font-semibold w-6 text-right">{count}</div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {/* Recent projects preview */}
                {!projectsLoading && projects && projects.length > 0 && (
                  <div className="mt-6 bg-card border border-border rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Recent Projects</h2>
                      <button onClick={() => setSection("projects")} className="text-xs text-primary hover:underline">View all</button>
                    </div>
                    <div className="flex flex-col gap-3">
                      {projects.slice(0, 5).map((p) => (
                        <div key={p.id} className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-muted">
                            <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{p.title}</div>
                            <div className="text-xs text-muted-foreground">{CATEGORIES.find(c => c.value === p.category)?.label ?? p.category} · {p.year}</div>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{p.views}</span>
                            <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{p.likes}</span>
                            {p.featured && <span className="flex items-center gap-1 text-primary"><Star className="w-3 h-3" /></span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Projects */}
            {section === "projects" && (
              <motion.div key="projects" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-display font-bold">Projects</h1>
                    <p className="text-muted-foreground mt-1 text-sm">{projects?.length ?? 0} projects in your portfolio</p>
                  </div>
                  <button
                    data-testid="button-new-project"
                    onClick={() => { setEditingProject(null); setModalOpen(true); }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    New Project
                  </button>
                </div>

                {projectsLoading ? (
                  <div className="flex flex-col gap-3">
                    {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-2xl" />)}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {projects?.map((p) => (
                      <motion.div
                        key={p.id}
                        data-testid={`card-project-${p.id}`}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 hover:border-border/80 transition-colors group"
                      >
                        <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 bg-muted">
                          <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-semibold truncate">{p.title}</span>
                            {p.featured && (
                              <span className="shrink-0 flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                <Star className="w-2.5 h-2.5" /> Featured
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-3">
                            <span>{CATEGORIES.find(c => c.value === p.category)?.label ?? p.category}</span>
                            <span>·</span>
                            <span>{p.year}</span>
                            {p.client && <><span>·</span><span>{p.client}</span></>}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground shrink-0">
                          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{p.views.toLocaleString()}</span>
                          <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" />{p.likes.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          {p.projectUrl && (
                            <a href={p.projectUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            data-testid={`button-edit-project-${p.id}`}
                            onClick={() => { setEditingProject(p); setModalOpen(true); }}
                            className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            data-testid={`button-delete-project-${p.id}`}
                            onClick={() => setDeleteModal(p)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Profile */}
            {section === "profile" && (
              <motion.div key="profile" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <div className="mb-8">
                  <h1 className="text-3xl font-display font-bold">Profile</h1>
                  <p className="text-muted-foreground mt-1 text-sm">Your public portfolio information</p>
                </div>

                {profileLoading ? (
                  <Skeleton className="h-96 rounded-2xl" />
                ) : (
                  <form onSubmit={handleProfileSave} className="flex flex-col gap-6">
                    {/* Avatar preview */}
                    <div className="bg-card border border-border rounded-2xl p-6 flex items-center gap-6">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-muted">
                        {profileForm.avatarUrl ? (
                          <img src={profileForm.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <User className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-semibold mb-1">Avatar URL</div>
                        <input
                          data-testid="input-avatar-url"
                          value={profileForm.avatarUrl}
                          onChange={(e) => setP("avatarUrl", e.target.value)}
                          placeholder="https://..."
                          className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                        />
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5">
                      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Basic Info</h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-2">Full Name</label>
                          <input data-testid="input-profile-name" value={profileForm.name} onChange={(e) => setP("name", e.target.value)} className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-2">Professional Title</label>
                          <input value={profileForm.title} onChange={(e) => setP("title", e.target.value)} className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5"><Mail className="w-3 h-3" />Email</label>
                          <input type="email" value={profileForm.email} onChange={(e) => setP("email", e.target.value)} className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5"><MapPin className="w-3 h-3" />Location</label>
                          <input value={profileForm.location} onChange={(e) => setP("location", e.target.value)} className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-2">Bio</label>
                        <textarea
                          value={profileForm.bio}
                          onChange={(e) => setP("bio", e.target.value)}
                          rows={4}
                          className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 resize-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-2">Skills (comma separated)</label>
                        <input
                          value={profileForm.skills}
                          onChange={(e) => setP("skills", e.target.value)}
                          placeholder="UI Design, React, Figma, Brand Identity"
                          className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                        />
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5">
                      <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Social Links</h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5"><Globe className="w-3 h-3" />Website</label>
                          <input value={profileForm.website} onChange={(e) => setP("website", e.target.value)} placeholder="https://..." className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5"><Github className="w-3 h-3" />GitHub</label>
                          <input value={profileForm.github} onChange={(e) => setP("github", e.target.value)} placeholder="username" className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5"><Instagram className="w-3 h-3" />Instagram</label>
                          <input value={profileForm.instagram} onChange={(e) => setP("instagram", e.target.value)} placeholder="username" className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1.5"><Linkedin className="w-3 h-3" />LinkedIn</label>
                          <input value={profileForm.linkedin} onChange={(e) => setP("linkedin", e.target.value)} placeholder="username" className="w-full bg-[#111] border border-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary/50 transition-all placeholder:text-muted-foreground/50" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        data-testid="button-save-profile"
                        type="submit"
                        disabled={updateProfile.isPending}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                      >
                        {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {updateProfile.isPending ? "Saving..." : "Save Profile"}
                      </button>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {modalOpen && (
          <ProjectModal
            open={modalOpen}
            onClose={() => { setModalOpen(false); setEditingProject(null); }}
            editingProject={editingProject}
            onSubmit={handleProjectSubmit}
            isPending={createProject.isPending || updateProject.isPending}
          />
        )}
        {deleteModal && (
          <DeleteConfirmModal
            open={!!deleteModal}
            project={deleteModal}
            onConfirm={handleDeleteConfirm}
            onClose={() => setDeleteModal(null)}
            isPending={deleteProject.isPending}
          />
        )}
      </AnimatePresence>

      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
        <AnimatePresence>
          {toasts.map((t) => (
            <Toast key={t.id} message={t.message} type={t.type} onClose={() => removeToast(t.id)} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
