import { useGetProfile } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { MapPin, Mail, Globe, Github, Linkedin, Instagram, ArrowRight } from "lucide-react";
import { useState } from "react";

export default function About() {
  const { data: profile, isLoading } = useGetProfile();
  const [imgSrc, setImgSrc] = useState(profile?.avatarUrl || '/images/profile-placeholder.png');

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 pt-32 pb-24 min-h-screen">
        <Skeleton className="w-1/2 h-20 mb-8" />
        <Skeleton className="w-full max-w-2xl h-8 mb-4" />
        <Skeleton className="w-full max-w-xl h-8 mb-16" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex flex-col gap-6">
            <Skeleton className="w-full h-40 rounded-xl" />
            <Skeleton className="w-full h-40 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-6 pt-32 pb-20 md:pt-48 md:pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-6xl"
        >
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 leading-[0.9]">
            I design <span className="text-primary italic font-serif">digital experiences</span> that blur the line between utility and art.
          </h1>
        </motion.div>
      </section>

      {/* Main Content Grid */}
      <section className="container mx-auto px-4 md:px-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          
          {/* Left Column - Image & Contact Info */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative aspect-[3/4] w-full max-w-md overflow-hidden rounded-2xl bg-muted"
            >
              <img 
                src={imgSrc} 
                onError={() => setImgSrc('/images/profile-placeholder.png')}
                alt={profile.name}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>

            <div className="flex flex-col gap-6 p-8 bg-muted/30 rounded-2xl border border-border/50">
              <h3 className="font-display text-2xl font-bold">Get in touch</h3>
              <div className="flex flex-col gap-4">
                <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                  <Mail className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                  <span className="font-medium text-lg">{profile.email}</span>
                </a>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-5 h-5 text-foreground" />
                  <span className="font-medium text-lg">{profile.location}</span>
                </div>
              </div>
              
              <div className="h-px w-full bg-border/50 my-2" />
              
              <div className="flex gap-4">
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-background rounded-full border border-border hover:border-primary hover:text-primary transition-all">
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-background rounded-full border border-border hover:border-primary hover:text-primary transition-all">
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
                {profile.instagram && (
                  <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="p-3 bg-background rounded-full border border-border hover:border-primary hover:text-primary transition-all">
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" className="p-3 bg-background rounded-full border border-border hover:border-primary hover:text-primary transition-all">
                    <Globe className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Bio, Skills, Experience */}
          <div className="lg:col-span-7 flex flex-col gap-20 pt-4 lg:pt-12">
            
            {/* Bio */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-6 not-prose">About Me</h2>
              <p className="text-2xl md:text-3xl font-light text-foreground leading-relaxed whitespace-pre-line">
                {profile.bio}
              </p>
            </motion.div>

            {/* Capabilities / Skills */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-8"
            >
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Capabilities</h2>
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill) => (
                  <span key={skill} className="px-5 py-3 rounded-full border border-border/50 bg-muted/20 text-foreground font-medium md:text-lg">
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Experience */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-10"
            >
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Experience</h2>
              <div className="flex flex-col relative before:absolute before:inset-y-0 before:left-[7px] before:w-px before:bg-border">
                {profile.experience.map((exp, i) => (
                  <div key={exp.id} className="relative pl-10 pb-12 last:pb-0 group">
                    <div className="absolute left-0 top-2 w-[15px] h-[15px] rounded-full bg-background border-2 border-primary group-hover:bg-primary transition-colors" />
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:justify-between">
                        <h4 className="text-xl md:text-2xl font-display font-bold text-foreground">{exp.role}</h4>
                        <span className="text-sm font-medium tracking-widest uppercase text-muted-foreground bg-muted/50 px-3 py-1 rounded-full self-start md:self-auto">
                          {exp.startYear} — {exp.endYear || "Present"}
                        </span>
                      </div>
                      <span className="text-lg text-primary font-medium">{exp.company}</span>
                      <p className="mt-4 text-muted-foreground leading-relaxed max-w-2xl">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Education */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col gap-10"
            >
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">Education</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="flex flex-col gap-3 p-8 rounded-2xl bg-muted/20 border border-border/50">
                    <span className="text-3xl font-display font-bold text-foreground">{edu.year}</span>
                    <h4 className="text-lg font-bold">{edu.degree}</h4>
                    <span className="text-muted-foreground">{edu.institution}</span>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border/50 bg-foreground text-background">
        <div className="container mx-auto px-4 md:px-6 py-32 md:py-48 text-center flex flex-col items-center justify-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-8 max-w-4xl"
          >
            Have a project in mind? <br />
            <span className="text-muted italic font-serif">Let's create something</span>
          </motion.h2>
          <a href={`mailto:${profile.email}`} className="group inline-flex items-center gap-4 bg-primary text-primary-foreground px-8 py-5 rounded-full font-bold text-xl hover:bg-background hover:text-foreground transition-all duration-300">
            Start a conversation 
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </a>
        </div>
      </section>
    </div>
  );
}
