import { useRoute, Link } from "wouter";
import { useGetProject, getGetProjectQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, ExternalLink, Tag } from "lucide-react";
import { useRef, useState } from "react";
import { Lightbox } from "@/components/lightbox";

export default function ProjectDetail() {
  const [, params] = useRoute("/projects/:id");
  const projectId = params?.id ? parseInt(params.id, 10) : 0;

  const { data: project, isLoading, error } = useGetProject(projectId, {
    query: {
      enabled: !!projectId,
      queryKey: getGetProjectQueryKey(projectId)
    }
  });

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 px-4 md:px-6 container mx-auto">
        <Skeleton className="w-24 h-6 mb-12" />
        <Skeleton className="w-3/4 h-24 mb-6" />
        <Skeleton className="w-full aspect-[21/9] rounded-2xl" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-display font-bold mb-4">Project not found</h1>
        <p className="text-muted-foreground mb-8">The project you're looking for doesn't exist or has been removed.</p>
        <Link href="/projects" className="bg-foreground text-background px-6 py-3 rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-colors">
          Back to Projects
        </Link>
      </div>
    );
  }

  const allImages = [project.coverImage, ...(project.images || [])].filter(Boolean);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="bg-background w-full">
      {/* Project Hero */}
      <div className="container mx-auto px-4 md:px-6 pt-24 md:pt-32 pb-12">
        <Link href="/projects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium uppercase tracking-widest text-sm transition-colors mb-12 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to projects
        </Link>
        
        <div className="max-w-5xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 text-balance">
              {project.title}
            </h1>
            <p className="text-xl md:text-3xl text-muted-foreground font-light leading-relaxed max-w-3xl">
              {project.description}
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-border/50">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Client</span>
            <span className="font-medium text-lg">{project.client || "Personal Project"}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Year</span>
            <span className="font-medium text-lg">{project.year}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Role</span>
            <span className="font-medium text-lg capitalize">{project.category}</span>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground md:text-right">Live Link</span>
            {project.projectUrl ? (
              <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-medium text-lg hover:text-primary transition-colors">
                Visit Site <ExternalLink className="w-4 h-4" />
              </a>
            ) : (
              <span className="font-medium text-lg text-muted-foreground">Offline</span>
            )}
          </div>
        </div>
      </div>

      {/* Full bleed cover image */}
      <div ref={containerRef} className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden bg-muted">
        <motion.div style={{ y, opacity }} className="absolute inset-0 w-full h-full origin-top">
          <img 
            src={project.coverImage || '/images/project-placeholder-1.png'} 
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </div>

      {/* Project Content */}
      <div className="container mx-auto px-4 md:px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
          <div className="lg:col-span-4 lg:col-start-1 flex flex-col gap-12">
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Tag className="w-4 h-4" /> Tools & Tech
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tools?.map((tool) => (
                  <span key={tool} className="px-3 py-1.5 rounded-full bg-muted text-sm font-medium text-foreground">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Categories</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags?.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 rounded border border-border text-sm text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-loose">
              {project.longDescription ? (
                <p className="text-xl md:text-2xl font-light text-foreground mb-8">
                  {project.longDescription}
                </p>
              ) : (
                <p className="text-xl md:text-2xl font-light text-foreground mb-8">
                  No comprehensive case study is available for this project at the moment. The visuals below showcase the final deliverables and design explorations.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Grid */}
      {project.images && project.images.length > 0 && (
        <div className="container mx-auto px-4 md:px-6 pb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
            {project.images.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`relative overflow-hidden bg-muted group cursor-zoom-in rounded-xl ${
                  idx % 3 === 0 ? 'md:col-span-2 aspect-[21/9]' : 'aspect-square md:aspect-[4/3]'
                }`}
                onClick={() => openLightbox(idx + 1)} // +1 because coverImage is at index 0
              >
                <img 
                  src={img} 
                  alt={`${project.title} detail ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Next/Prev Navigation could go here later */}

      <Lightbox 
        images={allImages}
        isOpen={lightboxOpen}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
}
