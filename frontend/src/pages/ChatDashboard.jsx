import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  HamburgerMenuIcon,
  Cross1Icon,
  ArrowLeftIcon,
  PaperPlaneIcon,
  ChatBubbleIcon,
  LightningBoltIcon,
  ReaderIcon,
  LayersIcon,
  PlusIcon,
  MagicWandIcon,
} from "@radix-ui/react-icons";
import { useChat } from "../hooks/useChat";
import MessageBubble from "../components/MessageBubble";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { AnimatedThemeToggler } from "../components/ui/animated-theme-toggler";
import { cn } from "../lib/utils";

const MODES = [
  { id: "normal",    title: "Normal",         subtitle: "Standard AI assistant", icon: ChatBubbleIcon },
  { id: "hackathon", title: "Hackathon",      subtitle: "Fast MVP guidance",     icon: LightningBoltIcon },
  { id: "beginner",  title: "Beginner",       subtitle: "Step-by-step help",     icon: ReaderIcon },
  { id: "stack",     title: "Stack Advisor",  subtitle: "Tech stack choices",    icon: LayersIcon },
];

const SUGGESTIONS = [
  "Build me a Netflix clone",
  "Best stack for a portfolio?",
  "I have 12 hours. MVP ideas?",
  "Explain React hooks to a beginner",
];

export default function ChatDashboard() {
  const navigate = useNavigate();
  const { messages, mode, isLoading, sendMessage, clearChat, setMode } = useChat();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;
    sendMessage(inputText);
    setInputText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setInputText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 150) + "px";
  };

  const activeMode = MODES.find((m) => m.id === mode) || MODES[0];
  const ActiveIcon = activeMode.icon;

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden">
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <Sidebar
        navigate={navigate}
        mode={mode}
        setMode={setMode}
        clearChat={clearChat}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 flex flex-col h-full bg-background relative">
        <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-border bg-background/80 backdrop-blur-xl z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-muted-foreground hover:text-foreground p-2 -ml-2"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <HamburgerMenuIcon className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <ActiveIcon className="h-4 w-4 text-primary" />
              <span className="font-medium text-sm">{activeMode.title}</span>
              <Badge variant="muted" className="text-[10px]">Active</Badge>
            </div>
          </div>
          <div className="hidden lg:flex items-center gap-2">
            <AnimatedThemeToggler />
            <Button variant="default" size="sm" onClick={() => navigate("/build")}>
              <MagicWandIcon className="h-3.5 w-3.5" />
              Build Mode
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeftIcon className="h-3.5 w-3.5" /> Home
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            {messages.length === 0 ? (
              <EmptyState onPick={setInputText} />
            ) : (
              messages.map((msg, i) => (
                <div key={msg.id || i}>
                  <MessageBubble message={msg} />
                </div>
              ))
            )}

            {isLoading && messages.length === 0 && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
                <ThinkingDots />
                <span>Projectra is thinking</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="px-4 lg:px-6 pb-5 pt-3 bg-gradient-to-t from-background via-background to-transparent">
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={handleSend}
              className={cn(
                "rounded-2xl border border-input bg-card p-1.5 flex items-end gap-2",
                "shadow-[inset_0_1px_0_hsl(var(--border)/0.5)]",
                "transition-colors focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30"
              )}
            >
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything about your project..."
                className="w-full max-h-[150px] bg-transparent text-foreground placeholder:text-muted-foreground px-3 py-2.5 outline-none resize-none overflow-y-auto text-sm"
                rows="1"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!inputText.trim() || isLoading}
                aria-label="Send"
              >
                <PaperPlaneIcon className="h-4 w-4" />
              </Button>
            </form>
            <p className="text-center mt-2 text-[10px] text-muted-foreground">
              AI can make mistakes. Verify important details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Sidebar({ navigate, mode, setMode, clearChat, mobileOpen, setMobileOpen }) {
  return (
    <aside
      className={cn(
        "fixed lg:static top-0 left-0 h-full w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border z-50 flex flex-col",
        "transition-transform duration-300",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="px-5 py-4 flex items-center justify-between border-b border-sidebar-border">
        <button
          className="flex items-center gap-2 group"
          onClick={() => navigate("/")}
        >
          <div className="h-7 w-7 rounded-md bg-sidebar-primary/15 border border-sidebar-primary/30 flex items-center justify-center">
            <span className="text-sidebar-primary font-bold text-sm">P</span>
          </div>
          <span className="font-semibold text-sm tracking-tight">Projectra</span>
        </button>
        <button
          className="lg:hidden text-muted-foreground hover:text-foreground"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <Cross1Icon className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2 pt-2 pb-2">
          Modes
        </p>
        {MODES.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => { setMode(m.id); setMobileOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-2.5 py-2.5 rounded-md text-left transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <div
                className={cn(
                  "h-7 w-7 rounded-md flex items-center justify-center shrink-0",
                  isActive ? "bg-sidebar-primary/20" : "bg-sidebar-accent/40"
                )}
              >
                <Icon className={cn("h-3.5 w-3.5", isActive ? "text-sidebar-primary" : "text-muted-foreground")} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn("text-sm font-medium truncate", isActive ? "text-sidebar-accent-foreground" : "")}>
                  {m.title}
                </p>
                <p className="text-[11px] text-muted-foreground truncate">{m.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-3 border-t border-sidebar-border space-y-2">
        <Button
          className="w-full"
          variant="default"
          size="sm"
          onClick={() => navigate("/build")}
        >
          <MagicWandIcon className="h-3.5 w-3.5" />
          Build Mode
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => { clearChat(); setMobileOpen(false); }}
        >
          <PlusIcon className="h-3.5 w-3.5" />
          New Chat
        </Button>
      </div>
    </aside>
  );
}

function EmptyState({ onPick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center text-center mt-16 lg:mt-24"
    >
      <div className="h-14 w-14 rounded-2xl bg-accent border border-border flex items-center justify-center mb-6">
        <ChatBubbleIcon className="h-6 w-6 text-accent-foreground" />
      </div>
      <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2">
        Ask anything about your project
      </h2>
      <p className="text-muted-foreground mb-10 max-w-md text-sm leading-relaxed">
        I can help you build roadmaps, choose your tech stack, or
        plan a hackathon MVP.
      </p>
      <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="px-3.5 py-2 rounded-full border border-border bg-card text-sm text-foreground/80 hover:text-foreground hover:bg-accent hover:border-accent-foreground/20 transition-colors shadow-[inset_0_1px_0_hsl(var(--border)/0.4)]"
          >
            {s}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function ThinkingDots() {
  return (
    <div className="flex gap-1 items-center">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-1.5 h-1.5 rounded-full bg-primary"
          style={{ animation: "bounce 1s infinite", animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}
