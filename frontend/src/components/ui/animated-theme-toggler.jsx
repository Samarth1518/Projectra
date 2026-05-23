import { useRef } from "react";
import { flushSync } from "react-dom";
import { SunIcon, MoonIcon } from "@radix-ui/react-icons";
import { useTheme } from "../theme/ThemeProvider";
import { cn } from "../../lib/utils";

/**
 * Magic UI-style animated theme toggler.
 *
 * Uses the View Transitions API to do a circular wipe from the toggle
 * button outward as the theme flips. Falls back to an instant swap on
 * browsers without the API (Firefox, older Safari) and on users with
 * `prefers-reduced-motion: reduce`.
 *
 * Works against the existing ThemeProvider: state stays in localStorage
 * so reloading the page keeps the chosen theme.
 */
export function AnimatedThemeToggler({ className }) {
  const { resolvedTheme, setTheme } = useTheme();
  const buttonRef = useRef(null);
  const isDark = resolvedTheme === "dark";

  const applyImperative = (next) => {
    const root = document.documentElement;
    if (next === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    root.style.colorScheme = next;
  };

  const changeTheme = async () => {
    const next = isDark ? "light" : "dark";
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    // No animation if the browser does not support startViewTransition,
    // if the user prefers reduced motion, or if we somehow have no ref.
    if (
      !document.startViewTransition ||
      reduce ||
      !buttonRef.current
    ) {
      applyImperative(next);
      setTheme(next);
      return;
    }

    await document.startViewTransition(() => {
      flushSync(() => {
        applyImperative(next);
        setTheme(next);
      });
    }).ready;

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const y = top + height / 2;
    const x = left + width / 2;

    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRad = Math.hypot(
      Math.max(left, right),
      Math.max(top, bottom)
    );

    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${maxRad}px at ${x}px ${y}px)`,
        ],
      },
      {
        duration: 600,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)",
      }
    );
  };

  return (
    <button
      ref={buttonRef}
      onClick={changeTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      type="button"
      className={cn(
        "inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background text-foreground",
        "hover:bg-accent hover:text-accent-foreground transition-colors",
        className
      )}
    >
      {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
    </button>
  );
}
