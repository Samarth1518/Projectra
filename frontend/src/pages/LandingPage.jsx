import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import {
  ArrowRightIcon,
  CheckIcon,
  LightningBoltIcon,
  LayersIcon,
  MagicWandIcon,
  ChatBubbleIcon,
  CodeIcon,
  ReaderIcon,
  GitHubLogoIcon,
  TwitterLogoIcon,
  LinkedInLogoIcon,
  ArrowTopRightIcon,
  StarIcon,
  RocketIcon,
  CubeIcon,
} from "@radix-ui/react-icons";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { AnimatedThemeToggler } from "../components/ui/animated-theme-toggler";
import { cn } from "../lib/utils";

const REPO_URL = "https://github.com/Samarth1518/Projectra";

/* ---------- motion presets ---------- */

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const easing = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };

/* ---------- content ---------- */

const FEATURES = [
  { Illustration: BuildModeIllustration,  icon: MagicWandIcon,     title: "Build Mode",      desc: "Describe a project. Get a runnable repo with files streaming in real time." },
  { Illustration: RoadmapsIllustration,   icon: ChatBubbleIcon,    title: "AI Roadmaps",     desc: "Detailed development plans tailored to your idea, stack, and timeline." },
  { Illustration: HackathonIllustration,  icon: LightningBoltIcon, title: "Hackathon Mode",  desc: "MVP-focused guidance for sprints. Skip lists, time breakdowns, fastest stacks." },
  { Illustration: StackIllustration,      icon: LayersIcon,        title: "Stack Advisor",   desc: "Opinionated recommendations with pros, cons, and clear final picks." },
  { Illustration: BeginnerIllustration,   icon: ReaderIcon,        title: "Beginner Mode",   desc: "Friendly explanations, numbered steps, beginner-safe tooling defaults." },
  { Illustration: CritiqueIllustration,   icon: CodeIcon,          title: "AI Critique",     desc: "A second AI judges your generated repo and suggests concrete improvements." },
];

const STEPS = [
  { n: "01", title: "Describe", desc: "Type a sentence or speak it into the mic. Pick a stack or let the AI choose." },
  { n: "02", title: "Generate", desc: "Watch the architecture, file tree, and source code stream into the workspace." },
  { n: "03", title: "Ship",     desc: "Download a ZIP, open in StackBlitz, or have the AI critique your build." },
];

const FOOTER_LINKS = [
  {
    title: "Product",
    items: [
      { label: "Build Mode", to: "/build" },
      { label: "Chat", to: "/chat" },
      { label: "Features", to: "#features" },
      { label: "How it works", to: "#how" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Documentation", to: "#" },
      { label: "Changelog", to: "#" },
      { label: "Status", to: "#" },
      { label: "GitHub", to: REPO_URL, external: true },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", to: "#" },
      { label: "Blog", to: "#" },
      { label: "Contact", to: "#" },
      { label: "Press kit", to: "#" },
    ],
  },
];

/* ---------- page ---------- */

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Navbar onLaunch={() => navigate("/chat")} onBuild={() => navigate("/build")} />
      <Hero onBuild={() => navigate("/build")} onChat={() => navigate("/chat")} />
      <BentoSection onBuild={() => navigate("/build")} />
      <FeaturesSection />
      <HowItWorksSection />
      <WorkflowSection />
      <FooterSection />
    </div>
  );
}

/* ---------- gemini logo (inline svg, Google brand gradient) ---------- */

function GeminiLogo({ className = "h-3.5 w-3.5" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      aria-label="Gemini"
    >
      <defs>
        <linearGradient id="gemini-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#4285F4" />
          <stop offset="50%" stopColor="#9168C0" />
          <stop offset="100%" stopColor="#D96570" />
        </linearGradient>
      </defs>
      <path
        d="M12 1.5 C 12.6 6 14.2 8.8 18.6 9.4 C 22.5 9.95 22.5 14.05 18.6 14.6 C 14.2 15.2 12.6 18 12 22.5 C 11.4 18 9.8 15.2 5.4 14.6 C 1.5 14.05 1.5 9.95 5.4 9.4 C 9.8 8.8 11.4 6 12 1.5 Z"
        fill="url(#gemini-grad)"
      />
    </svg>
  );
}

/* ---------- other brand logos used in the floating row ---------- */

function GoogleLogo({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-label="Google">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3c-1.7 4.7-6.2 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.5-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.1 0-9.5-3.3-11.3-7.9l-6.6 5.1C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4 5.6l6.2 5.2C42.1 35 44 30 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  );
}

function GDGLogo({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 48 24" className={className} aria-label="GDG">
      <text x="2"  y="19" fontSize="18" fontWeight="700" fontFamily="Inter, sans-serif" fill="#4285F4">G</text>
      <text x="17" y="19" fontSize="18" fontWeight="700" fontFamily="Inter, sans-serif" fill="#EA4335">D</text>
      <text x="33" y="19" fontSize="18" fontWeight="700" fontFamily="Inter, sans-serif" fill="#34A853">G</text>
    </svg>
  );
}

function GithubBrand({ className = "h-6 w-6" }) {
  return <GitHubLogoIcon className={className} />;
}

function ReactLogo({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="-11.5 -10.23 23 20.46" className={className} aria-label="React">
      <circle r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="0.9" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

function VercelLogo({ className = "h-6 w-6" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-label="Vercel" fill="currentColor">
      <path d="M12 2 L23 21 L1 21 Z" />
    </svg>
  );
}

/* ---------- floating brand logos around the hero (desktop only) ---------- */

function FloatingLogo({ Logo, name, className, delay = 0, duration = 4 }) {
  return (
    <motion.div
      aria-label={name}
      title={name}
      className={cn(
        "absolute h-12 w-12 rounded-xl bg-card border border-border flex items-center justify-center",
        "shadow-sm shadow-foreground/5",
        "ring-1 ring-foreground/[0.02]",
        className
      )}
      animate={{ y: [0, -12, 0], rotate: [0, 1.5, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <Logo className="h-6 w-6" />
    </motion.div>
  );
}

function FloatingBrandLogos() {
  return (
    <div aria-hidden className="hidden lg:block pointer-events-none absolute inset-0 -z-[1]">
      {/* Left column, top to bottom */}
      <FloatingLogo Logo={GoogleLogo}  name="Google" className="top-36 left-[6%]"        delay={0.0} duration={4.2} />
      <FloatingLogo Logo={GithubBrand} name="GitHub" className="top-1/2 left-[3%]"        delay={0.6} duration={4.6} />
      <FloatingLogo Logo={ReactLogo}   name="React"  className="bottom-32 left-[8%]"      delay={1.2} duration={5.0} />
      {/* Right column, top to bottom */}
      <FloatingLogo Logo={GeminiLogo}  name="Gemini" className="top-36 right-[6%]"        delay={0.3} duration={4.4} />
      <FloatingLogo Logo={GDGLogo}     name="GDG"    className="top-1/2 right-[3%]"       delay={0.9} duration={4.8} />
      <FloatingLogo Logo={VercelLogo}  name="Vercel" className="bottom-32 right-[8%] text-foreground" delay={1.5} duration={5.2} />
    </div>
  );
}

/* ---------- hero accent (subtle looping shimmer on the italic words) ---------- */

function HeroAccent({ children, delay = 0 }) {
  return (
    <motion.em
      className={cn(
        "inline-block italic font-medium relative text-primary",
        "font-display",
        "underline decoration-primary/60 decoration-[3px] underline-offset-[0.18em]"
      )}
      animate={{
        textShadow: [
          "0 0 0px hsl(var(--primary) / 0)",
          "0 0 14px hsl(var(--primary) / 0.45)",
          "0 0 0px hsl(var(--primary) / 0)",
        ],
      }}
      transition={{
        duration: 3.2,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.em>
  );
}

/* ---------- nav ---------- */

function Navbar({ onLaunch, onBuild }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 h-14 grid grid-cols-[auto_1fr_auto] md:grid-cols-3 items-center gap-2">
        <Link to="/" className="flex items-center gap-2 shrink-0 justify-self-start group">
          <motion.div
            className="h-7 w-7 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center"
            animate={{
              boxShadow: [
                "0 0 0px hsl(var(--primary) / 0)",
                "0 0 14px hsl(var(--primary) / 0.35)",
                "0 0 0px hsl(var(--primary) / 0)",
              ],
            }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ rotate: 6, scale: 1.05 }}
          >
            <span className="text-primary font-bold text-sm">P</span>
          </motion.div>
          <span className="font-semibold text-sm tracking-tight">Projectra</span>
        </Link>

        <nav className="hidden md:flex items-center justify-self-center gap-6 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href={REPO_URL} target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">GitHub</a>
        </nav>

        <div className="flex items-center justify-self-end gap-1.5 sm:gap-2">
          <GitHubStarPill />
          <AnimatedThemeToggler />
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={onLaunch}>
            Chat
          </Button>
          <Button size="sm" onClick={onBuild}>
            Build
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

function GitHubStarPill() {
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "hidden sm:inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-border bg-background",
        "text-xs font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
      )}
      title="Star us on GitHub"
    >
      <GitHubLogoIcon className="h-3.5 w-3.5" />
      <span>Star</span>
      <span className="inline-flex items-center justify-center h-5 px-1.5 rounded-full bg-primary/15 text-primary text-[10px] font-semibold">
        <StarIcon className="h-2.5 w-2.5 mr-0.5" />
        Repo
      </span>
    </a>
  );
}

/* ---------- hero ---------- */

function Hero({ onBuild, onChat }) {
  return (
    <section className="relative pt-28 sm:pt-32 pb-20 sm:pb-24 px-4 sm:px-6 overflow-hidden">
      {/* Diagonal cross grid pattern, masked to a top-centered ellipse so it
          fades out gracefully toward the rest of the page. Lines pick up
          the theme `--border` colour so the pattern reads right in both
          light and dark mode. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 49%, hsl(var(--border)) 49%, hsl(var(--border)) 51%, transparent 51%),
            linear-gradient(-45deg, transparent 49%, hsl(var(--border)) 49%, hsl(var(--border)) 51%, transparent 51%)
          `,
          backgroundSize: "40px 40px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />
      {/* Soft primary tint behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_45%_at_50%_30%,hsl(var(--primary)/0.07),transparent_70%)]"
      />

      {/* Floating brand logos (Google, Gemini, GitHub, GDG, React, Vercel) */}
      <FloatingBrandLogos />

      <motion.div
        initial="hidden" animate="visible" variants={stagger}
        className="mx-auto max-w-4xl text-center relative"
      >
        <motion.div variants={fadeUp} transition={easing}>
          <Badge variant="outline" className="mb-6 px-3 py-1 text-xs bg-background/80 backdrop-blur gap-1.5">
            <GeminiLogo className="h-3 w-3" />
            <span>Powered by Gemini. Built for hackathons.</span>
          </Badge>
        </motion.div>

        <motion.h1
          variants={fadeUp} transition={easing}
          className={cn(
            "font-semibold tracking-tight leading-[0.95]",
            "text-4xl sm:text-6xl md:text-7xl lg:text-8xl"
          )}
        >
          From an <HeroAccent>idea</HeroAccent>
          <br className="hidden sm:block" />{" "}
          to a <HeroAccent delay={0.4}>running repo</HeroAccent>,
          <span className="block mt-1 sm:mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-muted-foreground font-normal">
            in under a minute.
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp} transition={easing}
          className={cn(
            "mt-6 sm:mt-7 text-base sm:text-lg md:text-xl",
            "text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2"
          )}
        >
          The AI dev companion that turns a single sentence into a complete
          project. Streamed file by file, ready to download or run in StackBlitz.
        </motion.p>

        <motion.div
          variants={fadeUp} transition={easing}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="relative w-full sm:w-auto group/cta"
          >
            {/* expanding chartreuse halo */}
            <span
              aria-hidden
              className={cn(
                "pointer-events-none absolute -inset-1 rounded-xl blur-xl opacity-0 group-hover/cta:opacity-100",
                "bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.55),transparent_70%)]",
                "transition-opacity duration-300"
              )}
            />
            <Button
              size="lg"
              onClick={onBuild}
              className={cn(
                "relative w-full sm:w-auto overflow-hidden",
                "hover:shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.55)]"
              )}
            >
              {/* shimmer sweep */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-primary-foreground/30 to-transparent group-hover/cta:translate-x-full transition-transform duration-700 ease-out"
              />
              <span className="relative inline-flex items-center gap-2">
                Try Build Mode
                <ArrowRightIcon className="h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
              </span>
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              variant="outline"
              onClick={onChat}
              className="w-full sm:w-auto bg-background/80 backdrop-blur"
            >
              Open Chat
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeUp} transition={easing}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
        >
          <span className="flex items-center gap-1.5"><CheckIcon className="h-3.5 w-3.5 text-primary" /> No signup</span>
          <span className="flex items-center gap-1.5"><CheckIcon className="h-3.5 w-3.5 text-primary" /> Free tier</span>
          <span className="flex items-center gap-1.5"><CheckIcon className="h-3.5 w-3.5 text-primary" /> Open source</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ---------- bento (proper asymmetric grid) ---------- */

function BentoSection({ onBuild }) {
  return (
    <section className="px-4 sm:px-6 pb-16 sm:pb-20">
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
        variants={stagger}
        className={cn(
          "mx-auto max-w-5xl grid gap-3",
          "grid-cols-1 sm:grid-cols-2",
          "md:grid-cols-6 md:auto-rows-[150px]"
        )}
      >
        {/* Big hero card: terminal preview - 4 cols x 2 rows */}
        <BentoCard className="md:col-span-4 md:row-span-2">
          <TerminalPreview />
        </BentoCard>

        {/* Counter stat: 2 cols x 1 row, top-right */}
        <BentoCard className="md:col-span-2 md:row-span-1">
          <CounterStat target={6} label="Files / build" sub="avg minimal stack" />
        </BentoCard>

        {/* Time stat: 2 cols x 1 row, right under counter */}
        <BentoCard className="md:col-span-2 md:row-span-1">
          <Stat value="~3s" label="Time to first token" sub="cold key, p50" />
        </BentoCard>

        {/* Architecture illustration: 3 cols x 2 rows, bottom-left */}
        <BentoCard className="md:col-span-3 md:row-span-2">
          <ArchitectureIllustration />
        </BentoCard>

        {/* GitHub star: 3 cols x 1 row */}
        <BentoCard className="md:col-span-3 md:row-span-1">
          <GitHubStarCard />
        </BentoCard>

        {/* Handoff CTA: 3 cols x 1 row */}
        <BentoCard className="md:col-span-3 md:row-span-1">
          <HandoffCard onBuild={onBuild} />
        </BentoCard>
      </motion.div>
    </section>
  );
}

function BentoCard({ className, children }) {
  // className must land on the motion.div (the grid child) so col-span /
  // row-span classes actually apply. Putting them on the inner <Card>
  // collapsed every cell to 1x1 in a flat row.
  return (
    <motion.div
      variants={fadeUp}
      transition={easing}
      whileHover={{ y: -3 }}
      className={cn("h-full min-h-[150px]", className)}
    >
      <Card
        className={cn(
          "h-full overflow-hidden relative group/bento",
          "shadow-[inset_0_1px_0_hsl(var(--card-foreground)/0.04)]",
          "transition-all duration-300 hover:shadow-md hover:border-primary/30"
        )}
      >
        {/* Soft primary glow on hover */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover/bento:opacity-100 transition-opacity duration-300 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.06),transparent_70%)]" />
        <div className="relative h-full">{children}</div>
      </Card>
    </motion.div>
  );
}

function HandoffCard({ onBuild }) {
  return (
    <div className="p-5 sm:p-6 flex flex-col gap-3 h-full justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
          <MagicWandIcon className="h-5 w-5 text-accent-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium">ZIP, StackBlitz, or GitHub.</p>
          <p className="text-xs text-muted-foreground mt-0.5">One click handoff.</p>
        </div>
      </div>
      <Button size="sm" onClick={onBuild} className="self-start">
        Try it now
        <ArrowRightIcon className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}

/* ---------- bento cell contents ---------- */

function TerminalPreview() {
  const phrases = [
    "writing src/App.jsx",
    "writing src/main.jsx",
    "writing index.html",
    "writing package.json",
  ];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % phrases.length), 1800);
    return () => clearInterval(id);
  }, [phrases.length]);

  return (
    <div className="flex flex-col h-full justify-between p-4 sm:p-5">
      <div>
        <Badge variant="muted" className="mb-2">Live streaming</Badge>
        <h3 className="text-base sm:text-lg font-semibold tracking-tight">
          Watch your project assemble itself.
        </h3>
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
          Architecture, file tree, and per-file code in real time.
        </p>
      </div>

      <div className="mt-3 rounded-lg border border-border bg-muted/40 shadow-[inset_0_1px_0_hsl(var(--background))] p-3 font-mono text-[10px] leading-relaxed text-muted-foreground">
        <div className="text-primary">{"$ projectra build \"a todo app\""}</div>
        <div>plan: complete</div>
        <div>files: 5 queued</div>
        <div className="text-foreground flex items-center min-h-[14px]">
          <motion.span
            key={active}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {phrases[active]}
          </motion.span>
          <span className="inline-block w-1 h-2.5 ml-1 bg-foreground align-middle animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function ArchitectureIllustration() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });

  return (
    <div ref={ref} className="h-full w-full flex flex-col p-5 sm:p-7">
      <Badge variant="muted" className="mb-3 self-start">Architecture</Badge>
      <h3 className="text-lg sm:text-xl font-semibold tracking-tight">
        Diagrams generated with the code.
      </h3>
      <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
        Mermaid renders inline so you see the system before any line of code lands.
      </p>

      <div className="flex-1 mt-3 grid place-items-center min-h-[120px]">
        <svg
          viewBox="0 0 320 140"
          className="w-full max-w-[320px] h-auto"
          fill="none"
          stroke="currentColor"
        >
          {/* edges with continuously animated dash flow */}
          <motion.path
            d="M 60 70 L 145 70"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            animate={inView ? { strokeDashoffset: [0, -16] } : {}}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M 175 70 L 260 70"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            animate={inView ? { strokeDashoffset: [0, -16] } : {}}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: 0.3 }}
          />

          {/* nodes */}
          <NodeBlock x={20}  y={50} w={40} label="Idea"  inView={inView} delay={0.0} />
          <NodeBlock x={145} y={50} w={30} label="AI"    inView={inView} delay={0.3} primary pulse />
          <NodeBlock x={260} y={50} w={42} label="Repo"  inView={inView} delay={0.6} />

          {/* travelling pulse */}
          {inView && (
            <motion.circle
              r="3.5"
              fill="hsl(var(--primary))"
              animate={{
                cx: [60, 145, 260, 60],
                cy: [70, 70, 70, 70],
                opacity: [0, 1, 1, 0],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ filter: "drop-shadow(0 0 6px hsl(var(--primary)))" }}
            />
          )}
        </svg>
      </div>
    </div>
  );
}

function NodeBlock({ x, y, w, label, inView, delay, primary, pulse }) {
  return (
    <motion.g
      initial={{ opacity: 0, y: 6 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.rect
        x={x}
        y={y}
        width={w}
        height={40}
        rx="8"
        ry="8"
        fill={primary ? "hsl(var(--primary) / 0.15)" : "hsl(var(--card))"}
        stroke={primary ? "hsl(var(--primary))" : "hsl(var(--border))"}
        strokeWidth="1.2"
        animate={pulse && inView ? { opacity: [0.7, 1, 0.7] } : {}}
        transition={pulse ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
      />
      <text
        x={x + w / 2}
        y={y + 26}
        textAnchor="middle"
        fontSize="11"
        fontFamily="Inter, system-ui, sans-serif"
        fill={primary ? "hsl(var(--primary))" : "hsl(var(--foreground))"}
        fontWeight="500"
      >
        {label}
      </text>
    </motion.g>
  );
}

function CounterStat({ target, suffix = "", label, sub }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    const dur = 900;
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(eased * target));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <div ref={ref} className="h-full p-5 sm:p-6 flex flex-col justify-center">
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">{label}</p>
      <p className="mt-1.5 text-3xl sm:text-4xl font-semibold tracking-tight tabular-nums">
        {val}
        {suffix}
      </p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

function Stat({ value, label, sub }) {
  return (
    <div className="h-full p-5 sm:p-6 flex flex-col justify-center">
      <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">{label}</p>
      <p className="mt-1.5 text-3xl sm:text-4xl font-semibold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

function GitHubStarCard() {
  return (
    <a
      href={REPO_URL}
      target="_blank"
      rel="noreferrer"
      className="block h-full p-5 sm:p-6 group"
    >
      <div className="flex items-start gap-4 h-full">
        <div className="h-11 w-11 rounded-lg bg-foreground text-background flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
          <GitHubLogoIcon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold truncate">Like Projectra?</p>
            <StarIcon className="h-3.5 w-3.5 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Star the repo on GitHub. It helps more hackathon teams find it.
          </p>
          <span className="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-primary group-hover:gap-2.5 transition-all">
            Open repo
            <ArrowTopRightIcon className="h-3 w-3" />
          </span>
        </div>
      </div>
    </a>
  );
}

/* ---------- features ---------- */

function FeaturesSection() {
  return (
    <section id="features" className="px-4 sm:px-6 py-20 sm:py-24 border-t border-border/60">
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
        variants={stagger}
        className="mx-auto max-w-6xl"
      >
        <motion.div variants={fadeUp} transition={easing} className="max-w-2xl mb-10 sm:mb-12">
          <Badge variant="muted" className="mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Features
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
            Six modes, one chat box.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Each mode is a different lens on the same conversation. Switch anytime without losing context.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            const Illustration = f.Illustration;
            return (
              <motion.div
                key={f.title}
                variants={fadeUp}
                transition={easing}
                whileHover={{ y: -3 }}
                className="h-full"
              >
                <Card
                  className={cn(
                    "h-full p-5 sm:p-6 flex flex-col overflow-hidden",
                    "shadow-[inset_0_1px_0_hsl(var(--card-foreground)/0.04)]",
                    "transition-all duration-300 hover:shadow-md hover:border-primary/30"
                  )}
                >
                  <div className="h-28 sm:h-32 -mx-1 mb-4 rounded-md bg-muted/40 border border-border overflow-hidden flex items-center justify-center">
                    {Illustration ? <Illustration /> : null}
                  </div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    <h3 className="font-semibold text-base">{f.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

/* ---------- feature illustrations (all loop continuously) ---------- */

function BuildModeIllustration() {
  // Four file rows, each cycles through a typing highlight.
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });
  const rows = [{ y: 18, w: 90 }, { y: 38, w: 130 }, { y: 58, w: 110 }, { y: 78, w: 80 }];
  return (
    <svg ref={ref} viewBox="0 0 240 110" className="w-full h-full" fill="none">
      {rows.map((r, i) => (
        <g key={i}>
          <rect x="22" y={r.y} width="10" height="10" rx="2" fill="hsl(var(--primary)/0.7)" />
          <motion.rect
            x="38" y={r.y + 3} height="4" rx="2" fill="hsl(var(--muted-foreground)/0.4)"
            animate={inView ? { width: [0, r.w, r.w, 0] } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.4, times: [0, 0.3, 0.85, 1] }}
          />
        </g>
      ))}
      {/* cycling cursor */}
      {inView && (
        <motion.rect
          width="2" height="6" fill="hsl(var(--primary))"
          animate={{ y: [19, 39, 59, 79, 19], opacity: [1, 1, 1, 1, 0.6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
          x="170"
        />
      )}
    </svg>
  );
}

function RoadmapsIllustration() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });
  const points = [{ x: 40, label: "v0" }, { x: 100, label: "v1" }, { x: 160, label: "v2" }, { x: 210, label: "v3" }];
  return (
    <svg ref={ref} viewBox="0 0 240 110" className="w-full h-full" fill="none">
      {/* timeline */}
      <motion.line
        x1="30" y1="55" x2="220" y2="55"
        stroke="hsl(var(--border))" strokeWidth="1.2" strokeDasharray="4 4"
        animate={inView ? { strokeDashoffset: [0, -16] } : {}}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
      />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy="55" r="5" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.2" />
          <text x={p.x} y="78" textAnchor="middle" fontSize="9" fill="hsl(var(--muted-foreground))" fontFamily="Inter">
            {p.label}
          </text>
        </g>
      ))}
      {/* travelling dot */}
      {inView && (
        <motion.circle
          r="4" cy="55"
          fill="hsl(var(--primary))"
          animate={{ cx: [40, 100, 160, 210, 40] }}
          transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ filter: "drop-shadow(0 0 5px hsl(var(--primary)))" }}
        />
      )}
    </svg>
  );
}

function HackathonIllustration() {
  // A circular timer that fills then resets.
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });
  const R = 32;
  const C = 2 * Math.PI * R;
  return (
    <svg ref={ref} viewBox="0 0 240 110" className="w-full h-full" fill="none">
      <g transform="translate(120 55)">
        <circle r={R} stroke="hsl(var(--border))" strokeWidth="2.5" fill="none" />
        {inView && (
          <motion.circle
            r={R}
            stroke="hsl(var(--primary))"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={C}
            transform="rotate(-90)"
            animate={{ strokeDashoffset: [C, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ filter: "drop-shadow(0 0 4px hsl(var(--primary) / 0.5))" }}
          />
        )}
        <text textAnchor="middle" dy="-2" fontSize="14" fontWeight="600" fill="hsl(var(--foreground))" fontFamily="Inter">12h</text>
        <text textAnchor="middle" dy="12" fontSize="8" fill="hsl(var(--muted-foreground))" fontFamily="Inter">sprint</text>
      </g>
      {/* ticking dot at 12 o'clock */}
      {inView && (
        <motion.circle
          cx="120" r="2"
          fill="hsl(var(--primary))"
          animate={{ cy: [21, 23, 21] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </svg>
  );
}

function StackIllustration() {
  // Stacked layer cards that swap order on a loop.
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });
  // four layers; each cycles its y position to create a "shuffle" effect
  return (
    <svg ref={ref} viewBox="0 0 240 110" className="w-full h-full" fill="none">
      {[
        { fill: "hsl(var(--card))", stroke: "hsl(var(--border))", offset: 0, label: "Frontend" },
        { fill: "hsl(var(--accent))", stroke: "hsl(var(--accent-foreground)/0.3)", offset: 1, label: "Backend" },
        { fill: "hsl(var(--card))", stroke: "hsl(var(--border))", offset: 2, label: "Database" },
        { fill: "hsl(var(--primary)/0.18)", stroke: "hsl(var(--primary))", offset: 3, label: "Deploy" },
      ].map((l, i) => (
        <motion.g
          key={i}
          animate={inView ? { y: [0, -4, 0] } : {}}
          transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
        >
          <rect
            x={50 + l.offset * 7}
            y={22 + l.offset * 14}
            width="140"
            height="20"
            rx="4"
            fill={l.fill}
            stroke={l.stroke}
            strokeWidth="1.2"
          />
          <text
            x={60 + l.offset * 7}
            y={36 + l.offset * 14}
            fontSize="9"
            fontFamily="Inter"
            fontWeight="500"
            fill={i === 3 ? "hsl(var(--primary))" : "hsl(var(--foreground))"}
          >
            {l.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

function BeginnerIllustration() {
  // 1 - 2 - 3 numbered circles connected by a wavy path with a moving dot.
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });
  const stops = [{ cx: 40, n: "1" }, { cx: 120, n: "2" }, { cx: 200, n: "3" }];
  return (
    <svg ref={ref} viewBox="0 0 240 110" className="w-full h-full" fill="none">
      <motion.path
        d="M 40 55 C 70 25, 90 25, 120 55 S 170 85, 200 55"
        stroke="hsl(var(--border))"
        strokeWidth="1.4"
        strokeDasharray="3 3"
        animate={inView ? { strokeDashoffset: [0, -12] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      />
      {stops.map((s, i) => (
        <g key={i}>
          <circle cx={s.cx} cy="55" r="12" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="1.3" />
          <text x={s.cx} y="59" textAnchor="middle" fontSize="11" fontWeight="600" fontFamily="Inter" fill="hsl(var(--primary))">
            {s.n}
          </text>
        </g>
      ))}
      {/* travelling dot along the wavy path */}
      {inView && (
        <motion.circle
          r="3"
          fill="hsl(var(--primary))"
          animate={{
            offsetDistance: ["0%", "100%"],
          }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          style={{
            offsetPath: 'path("M 40 55 C 70 25, 90 25, 120 55 S 170 85, 200 55")',
            offsetRotate: "0deg",
            filter: "drop-shadow(0 0 4px hsl(var(--primary)))",
          }}
        />
      )}
    </svg>
  );
}

function CritiqueIllustration() {
  // Five star outlines that fill one by one, then a "9.2" score appears.
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });
  const starPath = "M 0 -7 L 1.6 -2.3 L 6.7 -2.3 L 2.6 0.8 L 4.1 5.7 L 0 2.8 L -4.1 5.7 L -2.6 0.8 L -6.7 -2.3 L -1.6 -2.3 Z";
  return (
    <svg ref={ref} viewBox="0 0 240 110" className="w-full h-full" fill="none">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.g
          key={i}
          transform={`translate(${44 + i * 38} 40)`}
          animate={inView ? { fill: ["hsl(var(--muted-foreground)/0.3)", "hsl(var(--primary))", "hsl(var(--primary))", "hsl(var(--muted-foreground)/0.3)"] } : {}}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.18,
            times: [0, 0.25, 0.9, 1],
          }}
        >
          <path d={starPath} stroke="hsl(var(--border))" strokeWidth="0.8" />
        </motion.g>
      ))}
      <text x="120" y="84" textAnchor="middle" fontSize="11" fontWeight="600" fill="hsl(var(--foreground))" fontFamily="Inter">
        9.2 / 10
      </text>
      <text x="120" y="98" textAnchor="middle" fontSize="8" fill="hsl(var(--muted-foreground))" fontFamily="Inter">
        novelty score
      </text>
    </svg>
  );
}

/* ---------- how it works (with travelling dot) ---------- */

function HowItWorksSection() {
  const reduce = useReducedMotion();
  return (
    <section id="how" className="px-4 sm:px-6 py-20 sm:py-24 border-t border-border/60 bg-muted/30">
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="mx-auto max-w-5xl text-center"
      >
        <motion.div variants={fadeUp} transition={easing}>
          <Badge variant="muted" className="mb-3">How it works</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
            Three steps, no setup.
          </h2>
        </motion.div>

        <div className="relative mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* horizontal connector + travelling dot, desktop only */}
          <div className="hidden md:block absolute left-[16.5%] right-[16.5%] top-[28px] h-px overflow-visible pointer-events-none">
            <div className="h-full w-full bg-gradient-to-r from-transparent via-border to-transparent" />
            {!reduce && (
              <motion.span
                className="absolute top-1/2 -translate-y-1/2 -ml-1.5 h-3 w-3 rounded-full bg-primary"
                style={{
                  boxShadow: "0 0 14px hsl(var(--primary) / 0.6), 0 0 4px hsl(var(--primary))",
                }}
                initial={{ left: "0%" }}
                animate={{ left: ["0%", "0%", "50%", "50%", "100%", "100%", "0%"] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  times: [0, 0.08, 0.42, 0.5, 0.84, 0.95, 1],
                }}
              />
            )}
          </div>

          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              variants={fadeUp}
              transition={easing}
              className="flex flex-col items-center text-center relative"
            >
              <div className="relative h-14 w-14 rounded-full bg-background border border-border flex items-center justify-center font-mono text-sm font-semibold text-primary shadow-sm">
                {s.n}
              </div>
              <h3 className="mt-5 font-semibold text-base">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground max-w-xs">{s.desc}</p>

              {/* mobile vertical connector between steps */}
              {i < STEPS.length - 1 && (
                <div className="md:hidden h-8 w-px bg-border mt-6" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/* ---------- workflow / illustration showcase (replaces email CTA) ---------- */

function WorkflowSection() {
  return (
    <section className="px-4 sm:px-6 py-20 sm:py-24 border-t border-border/60">
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="mx-auto max-w-6xl"
      >
        <motion.div variants={fadeUp} transition={easing} className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
          <Badge variant="muted" className="mb-3">Under the hood</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
            From a single sentence to a working repo.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Three quiet illustrations of what happens after you press Build.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <IllustrationTile
            badge="Step 1"
            title="Architect plans the project"
            desc="Gemini emits a strict JSON plan with a summary, Mermaid diagram, and a minimal file manifest."
            Illustration={IdeaIllustration}
            Icon={RocketIcon}
          />
          <IllustrationTile
            badge="Step 2"
            title="Coder writes each file"
            desc="One focused per-file prompt at a time. Output streams chunk-by-chunk to the viewer."
            Illustration={FilesIllustration}
            Icon={CubeIcon}
          />
          <IllustrationTile
            badge="Step 3"
            title="Ship the result"
            desc="Download as ZIP, open in StackBlitz, or critique it with a second AI judge."
            Illustration={ShipIllustration}
            Icon={MagicWandIcon}
          />
        </div>
      </motion.div>
    </section>
  );
}

function IllustrationTile({ badge, title, desc, Illustration, Icon }) {
  return (
    <motion.div variants={fadeUp} transition={easing} whileHover={{ y: -3 }} className="h-full">
      <Card className="h-full p-5 sm:p-6 flex flex-col shadow-[inset_0_1px_0_hsl(var(--card-foreground)/0.04)] transition-shadow hover:shadow-md">
        <div className="h-32 sm:h-40 -mx-1 mb-4 rounded-md bg-muted/40 border border-border overflow-hidden flex items-center justify-center">
          <Illustration />
        </div>
        <div className="flex items-center gap-2 mb-1.5">
          <Badge variant="muted" className="text-[10px]">{badge}</Badge>
          <Icon className="h-3 w-3 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-base">{title}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </Card>
    </motion.div>
  );
}

function IdeaIllustration() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });
  return (
    <svg ref={ref} viewBox="0 0 240 120" className="w-full h-full" fill="none">
      {/* speech bubble */}
      <motion.rect
        x="22" y="36" width="120" height="44" rx="14"
        fill="hsl(var(--card))"
        stroke="hsl(var(--border))"
        strokeWidth="1.2"
        animate={inView ? { y: [36, 32, 36] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.path
        d="M 50 80 L 56 90 L 64 80 Z"
        fill="hsl(var(--card))"
        stroke="hsl(var(--border))"
        strokeWidth="1.2"
        animate={inView ? { y: [0, -4, 0] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* cycling text rows */}
      <motion.rect x="34" y="46" width="60" height="6" rx="3" fill="hsl(var(--muted-foreground)/0.45)"
        animate={inView ? { y: [46, 42, 46], width: [60, 80, 60] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
      <motion.rect x="34" y="58" width="96" height="6" rx="3" fill="hsl(var(--muted-foreground)/0.3)"
        animate={inView ? { y: [58, 54, 58], width: [96, 70, 96] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.3 }} />

      {/* pulsing spark */}
      <motion.g
        animate={inView ? { scale: [1, 1.12, 1] } : {}}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "180px 50px" }}
      >
        <circle cx="180" cy="50" r="22" fill="hsl(var(--primary)/0.18)" stroke="hsl(var(--primary))" strokeWidth="1.2" />
        <path d="M 180 38 L 180 62 M 168 50 L 192 50" stroke="hsl(var(--primary))" strokeWidth="2" strokeLinecap="round" />
      </motion.g>

      {/* radiating ring */}
      {inView && (
        <motion.circle
          cx="180" cy="50" r="22"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
          fill="none"
          animate={{ r: [22, 36], opacity: [0.5, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
        />
      )}
    </svg>
  );
}

function FilesIllustration() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });
  const files = [
    { y: 22, w: 110 },
    { y: 44, w: 130 },
    { y: 66, w: 100 },
    { y: 88, w: 120 },
  ];
  return (
    <svg ref={ref} viewBox="0 0 240 120" className="w-full h-full" fill="none">
      {files.map((f, i) => (
        <motion.g key={i}
          animate={inView ? { opacity: [0.4, 1, 1, 0.4], x: [-4, 0, 0, -4] } : {}}
          transition={{
            duration: 4.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
            times: [0, 0.2, 0.8, 1],
          }}
        >
          <rect x="30" y={f.y} width={f.w} height="14" rx="4"
            fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1" />
          <rect x="36" y={f.y + 4} width="8" height="6" rx="2" fill="hsl(var(--primary)/0.7)" />
          <rect x="50" y={f.y + 5} width={f.w - 30} height="4" rx="2" fill="hsl(var(--muted-foreground)/0.35)" />
        </motion.g>
      ))}
      {/* cycling highlight ring travels through each file */}
      {inView && (
        <motion.rect
          x="30" width="100" height="14" rx="4"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="1.4"
          animate={{
            y: [22, 44, 66, 88, 22],
            opacity: [1, 1, 1, 1, 0.6],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.5, 0.75, 1] }}
          style={{ filter: "drop-shadow(0 0 5px hsl(var(--primary) / 0.6))" }}
        />
      )}
    </svg>
  );
}

function ShipIllustration() {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.3 });
  return (
    <svg ref={ref} viewBox="0 0 240 120" className="w-full h-full" fill="none">
      {/* gently floating box */}
      <motion.g
        animate={inView ? { y: [0, -4, 0] } : {}}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <rect x="58" y="42" width="74" height="58" rx="6" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1.2" />
        <path d="M 58 56 L 132 56" stroke="hsl(var(--border))" strokeWidth="1.2" />
        <rect x="86" y="38" width="18" height="6" rx="2" fill="hsl(var(--primary)/0.6)" />
      </motion.g>

      {/* arrow that pulses */}
      <motion.path
        d="M 170 78 L 196 52 M 184 52 L 196 52 L 196 64"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={inView ? { x: [0, 4, 0], y: [0, -4, 0], opacity: [0.7, 1, 0.7] } : {}}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* continuously twinkling sparkles */}
      {[
        { cx: 152, cy: 46, d: 0.0 },
        { cx: 208, cy: 78, d: 0.5 },
        { cx: 140, cy: 96, d: 1.0 },
        { cx: 220, cy: 38, d: 1.5 },
      ].map((p, i) => (
        <motion.circle key={i} cx={p.cx} cy={p.cy} r="2"
          fill="hsl(var(--primary))"
          animate={inView ? { opacity: [0, 1, 0], scale: [0.5, 1.3, 0.5] } : {}}
          transition={{ duration: 1.6, delay: p.d, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

/* ---------- footer ---------- */

function FooterSection() {
  return (
    <footer className="px-4 sm:px-6 pt-14 sm:pt-16 pb-2 border-t border-border/60 bg-muted/20 relative">
      <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8">
        <div className="col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">Projectra</span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs leading-relaxed">
            The AI companion that turns a sentence into a running repo. Built for the GDG PESCE Mandya hackathon.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <FooterIcon href={REPO_URL} icon={GitHubLogoIcon} label="GitHub" />
            <FooterIcon href="#" icon={TwitterLogoIcon} label="Twitter" />
            <FooterIcon href="#" icon={LinkedInLogoIcon} label="LinkedIn" />
          </div>
        </div>

        {FOOTER_LINKS.map((group) => (
          <div key={group.title}>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">{group.title}</p>
            <ul className="space-y-2">
              {group.items.map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a
                      href={item.to}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm text-foreground/80 hover:text-foreground transition-colors inline-flex items-center gap-1"
                    >
                      {item.label}
                      <ArrowTopRightIcon className="h-3 w-3" />
                    </a>
                  ) : item.to.startsWith("#") ? (
                    <a href={item.to} className="text-sm text-foreground/80 hover:text-foreground transition-colors">
                      {item.label}
                    </a>
                  ) : (
                    <Link to={item.to} className="text-sm text-foreground/80 hover:text-foreground transition-colors">
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mx-auto max-w-6xl mt-10 sm:mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground text-center sm:text-left">
        <p>(c) {new Date().getFullYear()} Projectra. MIT licensed.</p>
        <div className="flex items-center gap-5">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Security</a>
        </div>
      </div>

      {/* Huge Projectra wordmark, fading from low opacity at top to primary at the bottom. */}
      <FooterWordmark />
    </footer>
  );
}

function FooterWordmark() {
  return (
    <div className="relative w-full mt-10 sm:mt-12 select-none pointer-events-none overflow-visible">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        aria-hidden
        className="text-center font-semibold tracking-tighter leading-[0.95] pb-2"
        style={{
          fontSize: "clamp(48px, 13vw, 180px)",
          backgroundImage:
            "linear-gradient(to bottom, hsl(var(--foreground) / 0.04) 0%, hsl(var(--foreground) / 0.18) 35%, hsl(var(--primary) / 0.85) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        Projectra
      </motion.div>
    </div>
  );
}

function FooterIcon({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="h-8 w-8 rounded-md border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
    >
      <Icon className="h-3.5 w-3.5" />
    </a>
  );
}
