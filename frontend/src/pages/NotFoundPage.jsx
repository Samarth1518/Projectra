import { Link, useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowLeftIcon, MagicWandIcon, ChatBubbleIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { AnimatedThemeToggler } from "../components/ui/animated-theme-toggler";

const REPO_URL = "https://github.com/Samarth1518/Projectra";

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="px-4 sm:px-6 py-4 border-b border-border/60 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">P</span>
          </div>
          <span className="font-semibold text-sm tracking-tight">Projectra</span>
        </Link>
        <div className="flex items-center gap-2">
          <AnimatedThemeToggler />
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border bg-background text-xs font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <GitHubLogoIcon className="h-3.5 w-3.5" />
            GitHub
          </a>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-16 text-center relative overflow-hidden">
        <FloatingShapes />

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <Badge variant="muted" className="mb-5">Page not found</Badge>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="text-7xl sm:text-8xl md:text-9xl font-semibold tracking-tighter"
          >
            <span className="text-primary">4</span>
            <span className="text-foreground">0</span>
            <span className="text-primary">4</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mt-4 text-base sm:text-lg text-muted-foreground max-w-md mx-auto"
          >
            This page got lost in generation. Let us point you somewhere useful.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Button size="lg" onClick={() => navigate("/")} className="w-full sm:w-auto">
              <ArrowLeftIcon className="h-4 w-4" />
              Back home
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/build")} className="w-full sm:w-auto">
              <MagicWandIcon className="h-4 w-4" />
              Try Build Mode
            </Button>
            <Button size="lg" variant="ghost" onClick={() => navigate("/chat")} className="w-full sm:w-auto">
              <ChatBubbleIcon className="h-4 w-4" />
              Open Chat
            </Button>
          </motion.div>
        </motion.div>
      </main>

      <footer className="px-4 sm:px-6 py-6 border-t border-border/60 text-xs text-muted-foreground text-center">
        Projectra is open source.{" "}
        <a href={REPO_URL} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-foreground">
          Star us on GitHub.
        </a>
      </footer>
    </div>
  );
}

function FloatingShapes() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false });
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 -z-10 opacity-70">
      <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid slice" fill="none">
        <motion.circle
          cx="160" cy="180" r="80"
          fill="hsl(var(--primary)/0.12)"
          animate={inView ? { y: [0, -10, 0], x: [0, 6, 0] } : {}}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="640" cy="200" r="50"
          fill="hsl(var(--primary)/0.08)"
          animate={inView ? { y: [0, 12, 0], x: [0, -8, 0] } : {}}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.rect
          x="120" y="430" width="80" height="80" rx="16"
          fill="hsl(var(--accent))"
          opacity="0.5"
          animate={inView ? { rotate: [0, 8, 0] } : {}}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "160px 470px" }}
        />
        <motion.rect
          x="600" y="410" width="60" height="60" rx="14"
          fill="hsl(var(--accent))"
          opacity="0.4"
          animate={inView ? { rotate: [0, -6, 0] } : {}}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "630px 440px" }}
        />
      </svg>
    </div>
  );
}
