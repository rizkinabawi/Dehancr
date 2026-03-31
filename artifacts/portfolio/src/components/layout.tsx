import { Link, useLocation } from "wouter";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-primary selection:text-primary-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-2xl tracking-tight relative z-50">
            ALEX RIVERA
          </Link>
          
          <nav className="hidden md:flex gap-8 items-center">
            <Link href="/projects" className={`text-sm font-medium uppercase tracking-widest transition-colors hover:text-primary ${location.startsWith('/projects') ? 'text-primary' : 'text-muted-foreground'}`}>Work</Link>
            <Link href="/about" className={`text-sm font-medium uppercase tracking-widest transition-colors hover:text-primary ${location === '/about' ? 'text-primary' : 'text-muted-foreground'}`}>About</Link>
            <div className="h-4 w-px bg-border mx-2"></div>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </nav>

          <div className="flex md:hidden items-center gap-4 relative z-50">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 text-muted-foreground">
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-foreground">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background pt-24 px-4 flex flex-col gap-8 md:hidden"
          >
            <Link href="/projects" className="text-4xl font-display font-bold">Work</Link>
            <Link href="/about" className="text-4xl font-display font-bold">About</Link>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="border-t border-border py-12 md:py-20 mt-auto bg-muted/20">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="max-w-xs">
            <Link href="/" className="font-display font-bold text-2xl tracking-tight mb-4 block">ALEX RIVERA</Link>
            <p className="text-muted-foreground text-sm leading-relaxed">Designing the space between logic and emotion. Available for freelance opportunities.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
            <div className="flex flex-col gap-3">
              <h4 className="font-medium uppercase tracking-widest text-xs text-muted-foreground mb-1">Socials</h4>
              <a href="#" className="hover:text-primary transition-colors text-sm font-medium">Twitter</a>
              <a href="#" className="hover:text-primary transition-colors text-sm font-medium">LinkedIn</a>
              <a href="#" className="hover:text-primary transition-colors text-sm font-medium">Instagram</a>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-medium uppercase tracking-widest text-xs text-muted-foreground mb-1">Contact</h4>
              <a href="mailto:hello@alexrivera.design" className="hover:text-primary transition-colors text-sm font-medium">hello@alexrivera.design</a>
              <span className="text-sm text-muted-foreground">San Francisco, CA</span>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-6 mt-16 pt-8 border-t border-border/50 text-xs text-muted-foreground flex justify-between">
          <span>&copy; {new Date().getFullYear()} Alex Rivera. All rights reserved.</span>
          <span>Crafted with intention.</span>
        </div>
      </footer>
    </div>
  );
}
