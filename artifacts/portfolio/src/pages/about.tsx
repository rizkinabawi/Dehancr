import { useGetProfile } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { MapPin, Mail, Globe, Github, Linkedin, Instagram, Send, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

async function submitInquiry(data: { name: string; email: string; subject: string; message: string }) {
  const res = await fetch(`${BASE}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to send");
  return res.json();
}

export default function About() {
  const { data: profile, isLoading } = useGetProfile();
  const [imgSrc, setImgSrc] = useState(profile?.avatarUrl || '/images/profile-placeholder.png');

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) return;
    setSending(true);
    setSendError("");
    try {
      await submitInquiry(form);
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setSendError("Something went wrong. Please try again or email me directly.");
    } finally {
      setSending(false);
    }
  };

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

      {/* Inquiry / Contact Form Section */}
      <section id="contact" className="border-t border-border/50">
        <div className="container mx-auto px-4 md:px-6 py-24 md:py-40">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">

            {/* Left — heading */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-32"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary mb-6">Get in touch</p>
              <h2 className="font-display text-5xl md:text-6xl font-bold tracking-tighter leading-[0.95] mb-8">
                Have a project <br />
                <span className="text-muted-foreground italic font-serif">in mind?</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-10 max-w-md">
                Whether it's a branding challenge, a new digital product, or a collaboration — drop me a message and let's explore what we can build together.
              </p>
              <div className="flex flex-col gap-4">
                <a href={`mailto:${profile.email}`} className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{profile.email}</span>
                </a>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{profile.location}</span>
                </div>
              </div>
            </motion.div>

            {/* Right — form */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              {sent ? (
                <div className="flex flex-col items-center justify-center gap-6 py-20 text-center">
                  <CheckCircle className="w-16 h-16 text-primary" />
                  <h3 className="font-display text-3xl font-bold">Message sent!</h3>
                  <p className="text-muted-foreground max-w-xs">Thanks for reaching out. I'll get back to you as soon as possible.</p>
                  <button
                    onClick={() => setSent(false)}
                    className="text-primary underline underline-offset-4 text-sm hover:text-foreground transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="name" className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Name *</label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="bg-muted/30 border border-border/60 rounded-xl px-4 py-4 text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="email" className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Email *</label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="bg-muted/30 border border-border/60 rounded-xl px-4 py-4 text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="subject" className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Subject *</label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      className="bg-muted/30 border border-border/60 rounded-xl px-4 py-4 text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="message" className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project, timeline, and budget..."
                      className="bg-muted/30 border border-border/60 rounded-xl px-4 py-4 text-foreground placeholder-muted-foreground/50 focus:outline-none focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  {sendError && (
                    <p className="text-red-400 text-sm">{sendError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-5 rounded-full font-bold text-lg hover:opacity-90 disabled:opacity-50 transition-all self-start"
                  >
                    {sending ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Sending…</>
                    ) : (
                      <><Send className="w-5 h-5" /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
