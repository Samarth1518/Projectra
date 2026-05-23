import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRightIcon,
  CheckIcon,
  LightningBoltIcon,
  LayersIcon,
  MagicWandIcon,
  ChatBubbleIcon,
  CodeIcon,
  ReaderIcon,
  StarFilledIcon,
  GitHubLogoIcon,
  TwitterLogoIcon,
  LinkedInLogoIcon,
  ArrowTopRightIcon,
} from "@radix-ui/react-icons";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import { ThemeToggle } from "../components/theme/ThemeToggle";
import { cn } from "../lib/utils";

/* ---------- motion presets (subtle, not bouncy) ---------- */

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const easing = { duration: 0.5, ease: [0.22, 1, 0.36, 1] };

/* ---------- content ---------- */

const FEATURES = [
  {
    icon: MagicWandIcon,
    title: "Build Mode",
    desc: "Describe a project. Get a complete runnable repo with files streaming in real time.",
  },
  {
    icon: ChatBubbleIcon,
    title: "AI Roadmaps",
    desc: "Detailed development plans tailored to your idea, stack, and timeline.",
  },
  {
    icon: LightningBoltIcon,
    title: "Hackathon Mode",
    desc: "MVP-focused guidance for time-boxed sprints. Skip lists, time breakdowns, fastest stacks.",
  },
  {
    icon: LayersIcon,
    title: "Stack Advisor",
    desc: "Opinionated recommendations with pros, cons, and clear final picks.",
  },
  {
    icon: ReaderIcon,
    title: "Beginner Mode",
    desc: "Friendly explanations, numbered steps, beginner-safe tooling defaults.",
  },
  {
    icon: CodeIcon,
    title: "AI Critique",
    desc: "A second AI judges your generated repo and suggests concrete improvements.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Describe",
    desc: "Type a sentence or speak it into the mic. Pick a stack or let the AI choose.",
  },
  {
    n: "02",
    title: "Generate",
    desc: "Watch the architecture, file tree, and source code stream into the workspace.",
  },
  {
    n: "03",
    title: "Ship",
    desc: "Download a ZIP, open the project in StackBlitz, or have the AI critique your build.",
  },
];

const PRICING_PLANS = {
  monthly: [
    {
      name: "Free",
      price: "$0",
      cadence: "/month",
      pitch: "For students and hackathon teams getting started.",
      cta: "Start free",
      features: [
        "Unlimited chat",
        "5 builds per day",
        "Download ZIP",
        "Community support",
      ],
    },
    {
      name: "Pro",
      price: "$12",
      cadence: "/month",
      pitch: "For builders who ship multiple projects a week.",
      cta: "Go Pro",
      featured: true,
      features: [
        "Unlimited builds",
        "Priority Gemini queue",
        "StackBlitz handoff",
        "AI critique unlimited",
        "Voice input",
        "Email support",
      ],
    },
    {
      name: "Team",
      price: "$39",
      cadence: "/month",
      pitch: "For small teams collaborating on multiple projects.",
      cta: "Talk to us",
      features: [
        "Everything in Pro",
        "5 seats included",
        "Shared project library",
        "SSO",
        "Dedicated support",
      ],
    },
  ],
  yearly: [
    {
      name: "Free",
      price: "$0",
      cadence: "/year",
      pitch: "For students and hackathon teams getting started.",
      cta: "Start free",
      features: [
        "Unlimited chat",
        "5 builds per day",
        "Download ZIP",
        "Community support",
      ],
    },
    {
      name: "Pro",
      price: "$108",
      cadence: "/year",
      pitch: "For builders who ship multiple projects a week.",
      cta: "Go Pro",
      featured: true,
      features: [
        "Unlimited builds",
        "Priority Gemini queue",
        "StackBlitz handoff",
        "AI critique unlimited",
        "Voice input",
        "Email support",
      ],
    },
    {
      name: "Team",
      price: "$348",
      cadence: "/year",
      pitch: "For small teams collaborating on multiple projects.",
      cta: "Talk to us",
      features: [
        "Everything in Pro",
        "5 seats included",
        "Shared project library",
        "SSO",
        "Dedicated support",
      ],
    },
  ],
};

const TESTIMONIALS = [
  {
    quote:
      "I gave Projectra one sentence and it shipped my hackathon prototype in 40 seconds. Judges thought we worked on it for a week.",
    name: "Aarav S.",
    role: "CS Junior, BITS Pilani",
  },
  {
    quote:
      "The Critique mode caught three real issues in our build before the judges could. Felt like having a senior dev review for free.",
    name: "Mei T.",
    role: "Hackathon team lead",
  },
  {
    quote:
      "Streaming the actual code into a file tree is the only AI demo that has made my engineering manager say 'wait, again?'.",
    name: "Daniel R.",
    role: "Junior PM, Bangalore",
  },
];

const FOOTER_LINKS = [
  {
    title: "Product",
    items: [
      { label: "Build Mode", to: "/build" },
      { label: "Chat", to: "/chat" },
      { label: "Pricing", to: "#pricing" },
      { label: "Roadmap", to: "#" },
    ],
  },
  {
    title: "Resources",
    items: [
      { label: "Documentation", to: "#" },
      { label: "Changelog", to: "#" },
      { label: "Status", to: "#" },
      { label: "GitHub", to: "https://github.com/Samarth1518/Projectra", external: true },
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
  const [billing, setBilling] = useState("monthly");
  const [email, setEmail] = useState("");
  const plans = PRICING_PLANS[billing];

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Navbar onLaunch={() => navigate("/chat")} onBuild={() => navigate("/build")} />

      <Hero onBuild={() => navigate("/build")} onChat={() => navigate("/chat")} />

      <BentoSection />

      <FeaturesSection />

      <HowItWorksSection />

      <PricingSection plans={plans} billing={billing} onBillingChange={setBilling} onPickPlan={() => navigate("/chat")} />

      <TestimonialsSection />

      <CtaSection
        email={email}
        onEmail={setEmail}
        onSubmit={(e) => { e.preventDefault(); navigate("/chat"); }}
      />

      <FooterSection />
    </div>
  );
}

/* ---------- sections ---------- */

function Navbar({ onLaunch, onBuild }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">P</span>
          </div>
          <span className="font-semibold text-sm tracking-tight">Projectra</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
          <a href="#testimonials" className="hover:text-foreground transition-colors">Reviews</a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={onLaunch}>
            Open Chat
          </Button>
          <Button size="sm" onClick={onBuild}>
            Build Mode
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero({ onBuild, onChat }) {
  return (
    <section className="relative pt-32 pb-24 px-6 overflow-hidden">
      {/* Background image with very heavy fade so headline sits comfortably on it. */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <img
          src="/hero.jpg"
          alt=""
          className="w-full h-full object-cover opacity-25 dark:opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/85 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background))_75%)]" />
      </div>

      <motion.div
        initial="hidden" animate="visible" variants={stagger}
        className="mx-auto max-w-4xl text-center"
      >
        <motion.div variants={fadeUp} transition={easing}>
          <Badge variant="outline" className="mb-6 px-3 py-1 text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Gemini-powered. Built for hackathons.
          </Badge>
        </motion.div>

        <motion.h1
          variants={fadeUp} transition={easing}
          className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]"
        >
          From idea to a running repo,
          <br />
          <span className="text-primary">in under a minute.</span>
        </motion.h1>

        <motion.p
          variants={fadeUp} transition={easing}
          className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Projectra is the AI dev companion that turns a single sentence
          into a complete project. Streamed file by file, ready to download
          or run in StackBlitz.
        </motion.p>

        <motion.div
          variants={fadeUp} transition={easing}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Button size="lg" onClick={onBuild} className="shadow-sm">
            Try Build Mode
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" onClick={onChat}>
            Open Chat
          </Button>
        </motion.div>

        <motion.div
          variants={fadeUp} transition={easing}
          className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground"
        >
          <span className="flex items-center gap-1.5"><CheckIcon className="h-3.5 w-3.5 text-primary" /> No signup</span>
          <span className="flex items-center gap-1.5"><CheckIcon className="h-3.5 w-3.5 text-primary" /> Free tier</span>
          <span className="flex items-center gap-1.5"><CheckIcon className="h-3.5 w-3.5 text-primary" /> Open source</span>
        </motion.div>
      </motion.div>
    </section>
  );
}

function BentoSection() {
  return (
    <section className="px-6 pb-24">
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[180px]"
      >
        <BentoCard className="md:col-span-2 md:row-span-2" variants={fadeUp} transition={easing}>
          <div className="flex flex-col h-full justify-between p-7">
            <div>
              <Badge variant="muted" className="mb-3">Live streaming</Badge>
              <h3 className="text-2xl font-semibold tracking-tight">Watch your project assemble itself.</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Architecture diagram, file tree, and per-file code arrive in
                real time. Click any file to see it stream.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-muted/40 shadow-[inset_0_1px_0_hsl(var(--background))] p-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
              <div className="text-primary">{"$ projectra build"}</div>
              <div>plan: complete</div>
              <div>diagram: rendered</div>
              <div>files: 5 queued</div>
              <div className="text-foreground">writing src/App.jsx<span className="inline-block w-1.5 h-3 ml-1 bg-foreground align-middle animate-pulse" /></div>
            </div>
          </div>
        </BentoCard>

        <BentoCard variants={fadeUp} transition={easing}>
          <Stat label="Files / build" value="6" sub="avg minimal stack" />
        </BentoCard>

        <BentoCard variants={fadeUp} transition={easing}>
          <Stat label="Time to first token" value="~3s" sub="cold key, p50" />
        </BentoCard>

        <BentoCard className="md:col-span-2" variants={fadeUp} transition={easing}>
          <div className="p-6 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <MagicWandIcon className="h-5 w-5 text-accent-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Open in StackBlitz, ZIP, or push to GitHub.</p>
              <p className="text-xs text-muted-foreground mt-0.5">One click handoff. No lock-in.</p>
            </div>
          </div>
        </BentoCard>
      </motion.div>
    </section>
  );
}

function BentoCard({ className, children, variants, transition }) {
  return (
    <motion.div variants={variants} transition={transition}>
      <Card className={cn("h-full overflow-hidden shadow-[inset_0_1px_0_hsl(var(--card-foreground)/0.04)]", className)}>
        {children}
      </Card>
    </motion.div>
  );
}

function Stat({ label, value, sub }) {
  return (
    <div className="h-full p-6 flex flex-col justify-center">
      <p className="text-xs uppercase tracking-widest text-muted-foreground font-medium">{label}</p>
      <p className="mt-1.5 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{sub}</p>
    </div>
  );
}

function FeaturesSection() {
  return (
    <section id="features" className="px-6 py-24 border-t border-border/60">
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="mx-auto max-w-6xl"
      >
        <motion.div variants={fadeUp} transition={easing} className="max-w-2xl mb-12">
          <Badge variant="muted" className="mb-3">Features</Badge>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Six modes, one chat box.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Each mode is a different lens on the same conversation. Switch
            anytime without losing context.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title} variants={fadeUp} transition={easing}>
                <Card className="h-full p-6 shadow-[inset_0_1px_0_hsl(var(--card-foreground)/0.04)]">
                  <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center mb-4">
                    <Icon className="h-4.5 w-4.5 text-accent-foreground" />
                  </div>
                  <h3 className="font-semibold text-base">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}

function HowItWorksSection() {
  return (
    <section id="how" className="px-6 py-24 border-t border-border/60 bg-muted/30">
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="mx-auto max-w-5xl text-center"
      >
        <motion.div variants={fadeUp} transition={easing}>
          <Badge variant="muted" className="mb-3">How it works</Badge>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Three steps, no setup.
          </h2>
        </motion.div>

        <div className="relative mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="hidden md:block absolute left-[16%] right-[16%] top-[28px] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          {STEPS.map((s) => (
            <motion.div key={s.n} variants={fadeUp} transition={easing} className="flex flex-col items-center text-center">
              <div className="relative h-14 w-14 rounded-full bg-background border border-border flex items-center justify-center font-mono text-sm font-semibold text-primary shadow-sm">
                {s.n}
              </div>
              <h3 className="mt-5 font-semibold text-base">{s.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground max-w-xs">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function PricingSection({ plans, billing, onBillingChange, onPickPlan }) {
  return (
    <section id="pricing" className="px-6 py-24 border-t border-border/60">
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="mx-auto max-w-6xl"
      >
        <motion.div variants={fadeUp} transition={easing} className="text-center max-w-2xl mx-auto">
          <Badge variant="muted" className="mb-3">Pricing</Badge>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Free while you learn. Affordable when you ship.
          </h2>

          <div className="mt-8 inline-flex items-center rounded-full border border-border bg-background p-1 text-sm">
            <BillingPill active={billing === "monthly"} onClick={() => onBillingChange("monthly")}>Monthly</BillingPill>
            <BillingPill active={billing === "yearly"} onClick={() => onBillingChange("yearly")}>
              Yearly
              <span className="ml-2 text-[10px] font-medium text-primary">Save 25%</span>
            </BillingPill>
          </div>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
          {plans.map((plan) => (
            <motion.div key={plan.name} variants={fadeUp} transition={easing}>
              <Card
                className={cn(
                  "h-full p-8 flex flex-col",
                  plan.featured && "border-primary shadow-md ring-1 ring-primary/30"
                )}
              >
                {plan.featured && (
                  <Badge className="self-start mb-3">Most popular</Badge>
                )}
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.pitch}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.cadence}</span>
                </div>

                <ul className="mt-6 space-y-2.5 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm">
                      <CheckIcon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span className="text-foreground/90">{feat}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.featured ? "default" : "outline"}
                  className="mt-8 w-full"
                  onClick={onPickPlan}
                >
                  {plan.cta}
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function BillingPill({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative inline-flex items-center px-4 py-1.5 rounded-full transition-colors",
        active ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

function TestimonialsSection() {
  return (
    <section id="testimonials" className="px-6 py-24 border-t border-border/60 bg-muted/30">
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
        className="mx-auto max-w-6xl"
      >
        <motion.div variants={fadeUp} transition={easing} className="text-center max-w-2xl mx-auto mb-12">
          <Badge variant="muted" className="mb-3">Reviews</Badge>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
            Students and hackathon teams ship faster.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <motion.div key={t.name} variants={fadeUp} transition={easing}>
              <Card className="h-full p-6 flex flex-col">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarFilledIcon key={i} className="h-3.5 w-3.5 text-primary" />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed flex-1">
                  {t.quote}
                </p>
                <div className="mt-6 pt-4 border-t border-border/60">
                  <p className="text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function CtaSection({ email, onEmail, onSubmit }) {
  return (
    <section className="px-6 py-24 border-t border-border/60">
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
        variants={stagger}
        className="mx-auto max-w-3xl text-center"
      >
        <motion.h2 variants={fadeUp} transition={easing} className="text-3xl md:text-4xl font-semibold tracking-tight">
          Ready to ship your next project?
        </motion.h2>
        <motion.p variants={fadeUp} transition={easing} className="mt-3 text-muted-foreground">
          Drop your email and we will save your spot. No credit card required.
        </motion.p>

        <motion.form
          variants={fadeUp} transition={easing}
          onSubmit={onSubmit}
          className="mt-8 flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
        >
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => onEmail(e.target.value)}
            required
          />
          <Button type="submit" className="sm:w-auto">
            Get started
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </Button>
        </motion.form>

        <motion.p variants={fadeUp} transition={easing} className="mt-4 text-xs text-muted-foreground">
          Free forever for the first 5 builds per day. Upgrade anytime.
        </motion.p>
      </motion.div>
    </section>
  );
}

function FooterSection() {
  return (
    <footer className="px-6 py-16 border-t border-border/60 bg-muted/20">
      <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary/15 border border-primary/30 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-sm tracking-tight">Projectra</span>
          </Link>
          <p className="mt-3 text-sm text-muted-foreground max-w-xs leading-relaxed">
            The AI companion that turns a sentence into a running repo.
            Built for the GDG PESCE Mandya hackathon.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <FooterIcon href="https://github.com/Samarth1518/Projectra" icon={GitHubLogoIcon} label="GitHub" />
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

      <div className="mx-auto max-w-6xl mt-12 pt-6 border-t border-border/60 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <p>(c) {new Date().getFullYear()} Projectra. MIT licensed.</p>
        <div className="flex items-center gap-5">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Security</a>
        </div>
      </div>
    </footer>
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
