import { Link } from "wouter";
import { motion } from "framer-motion";
import { Project } from "@workspace/api-client-react";
import { useState } from "react";

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const [imgSrc, setImgSrc] = useState(project.coverImage || '/images/project-placeholder-1.png');
  const fallbacks = [
    '/images/project-placeholder-1.png',
    '/images/project-placeholder-2.png',
    '/images/project-placeholder-3.png',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: (index % 2) * 0.1, duration: 0.7, ease: "easeOut" }}
      className="group relative block w-full"
    >
      <Link href={`/projects/${project.id}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
          <img
            src={imgSrc}
            onError={() => setImgSrc(fallbacks[project.id % fallbacks.length])}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-overlay" />
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl md:text-2xl font-display font-bold text-foreground group-hover:text-primary transition-colors">{project.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground uppercase tracking-widest">{project.category}</p>
          </div>
          <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{project.year}</span>
        </div>
      </Link>
    </motion.div>
  );
}
