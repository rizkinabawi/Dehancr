import { useGetProjects, useGetProjectStats } from "@workspace/api-client-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjectCard } from "@/components/project-card";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { data: projects, isLoading: projectsLoading } = useGetProjects({ featured: true });
  const { data: stats, isLoading: statsLoading } = useGetProjectStats();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-6 pt-24 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        {/* Abstract background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-screen" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-5xl"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-widest mb-8"
          >
            Available for new projects
          </motion.div>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.9] tracking-tighter mb-8 text-balance">
            Designing the <br />
            space between <br className="hidden md:block"/>
            logic and <span className="text-primary italic font-serif pr-4">emotion.</span>
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground mb-12 max-w-2xl font-light leading-relaxed">
            I am a digital designer & creative developer crafting immersive experiences for forward-thinking brands.
          </p>
          <Link href="/projects" className="group inline-flex items-center gap-3 bg-foreground text-background px-8 py-4 rounded-full font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-lg">
            View selected work 
            <motion.span
              className="inline-block"
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.span>
          </Link>
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/50 bg-background relative z-10">
        <div className="container mx-auto px-4 md:px-6 py-16 md:py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 divide-x divide-border/0 md:divide-border">
            {[
              { label: "Years Active", value: stats?.yearsActive ?? 0 },
              { label: "Projects Completed", value: stats?.totalProjects ?? 0 },
              { label: "Total Views", value: stats?.totalViews?.toLocaleString() ?? 0 },
              { label: "Awards Won", value: 14 }, // Hardcoded for aesthetics
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex flex-col gap-3 md:px-8 first:pl-0 last:pr-0 items-center text-center md:items-start md:text-left"
              >
                {statsLoading ? (
                  <Skeleton className="h-12 w-24" />
                ) : (
                  <span className="text-4xl md:text-6xl font-display font-bold text-foreground">{stat.value}</span>
                )}
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="container mx-auto px-4 md:px-6 py-32 md:py-48">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 md:mb-24 gap-6">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-6xl font-bold tracking-tight"
          >
            Selected <span className="text-primary italic font-serif">Work</span>
          </motion.h2>
          <Link href="/projects" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium uppercase tracking-widest text-sm transition-colors group">
            All projects 
            <span className="w-8 h-px bg-current group-hover:w-12 transition-all duration-300 ml-2" />
          </Link>
        </div>

        {projectsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="aspect-[4/3] rounded-xl w-full" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-x-24 md:gap-y-32">
            {projects?.map((project, index) => (
              <div key={project.id} className={index % 2 === 1 ? 'md:mt-32' : ''}>
                <ProjectCard project={project} index={index} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
