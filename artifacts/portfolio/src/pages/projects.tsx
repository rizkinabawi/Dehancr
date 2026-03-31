import { useState } from "react";
import { useGetProjects, useGetCategories } from "@workspace/api-client-react";
import { ProjectCard } from "@/components/project-card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const { data: categories, isLoading: categoriesLoading } = useGetCategories();
  const { data: projects, isLoading: projectsLoading } = useGetProjects({ 
    category: selectedCategory === "all" ? undefined : selectedCategory 
  });

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 md:px-6 container mx-auto">
      <div className="flex flex-col gap-12 md:gap-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6">
            Selected <span className="text-primary italic font-serif">Work</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed max-w-2xl">
            A curated selection of my latest projects across digital product design, creative development, and brand identity.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-y border-border/50 py-6 sticky top-20 bg-background/95 backdrop-blur-md z-30">
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase transition-all duration-300 ${
                selectedCategory === "all" 
                  ? "bg-foreground text-background" 
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              All Projects
            </button>
            
            {categoriesLoading ? (
              <div className="flex gap-2">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-24 rounded-full" />)}
              </div>
            ) : (
              categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium tracking-widest uppercase transition-all duration-300 ${
                    selectedCategory === cat.slug
                      ? "bg-foreground text-background" 
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {cat.name}
                  <span className="ml-2 opacity-50 text-xs">{cat.projectCount}</span>
                </button>
              ))
            )}
          </div>
          
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest hidden lg:block">
            {projects?.length || 0} {projects?.length === 1 ? 'Project' : 'Projects'}
          </div>
        </div>

        <div className="min-h-[50vh]">
          {projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Skeleton key={i} className="aspect-[4/3] rounded-xl w-full" />
              ))}
            </div>
          ) : projects?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <p className="text-2xl font-display text-muted-foreground">No projects found in this category.</p>
              <button 
                onClick={() => setSelectedCategory("all")}
                className="mt-6 text-primary hover:underline underline-offset-4"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-16 md:gap-y-24"
            >
              <AnimatePresence mode="popLayout">
                {projects?.map((project, index) => (
                  <motion.div
                    layout
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className={index % 2 === 1 ? 'md:mt-24' : ''}
                  >
                    <ProjectCard project={project} index={index} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
