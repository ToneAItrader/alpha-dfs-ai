"use client";

import { Menu, X } from "lucide-react";
import { useMobileNav } from "@/components/layout/MobileNavContext";

/** Hamburger toggle — drawer renders at AppShell root to avoid header stacking issues. */
export function MobileNavToggle() {
  const { open, setOpen } = useMobileNav();

  return (
    <button
      type="button"
      className="inline-flex items-center justify-center rounded-lg p-2 text-muted ring-1 ring-surface-border transition hover:bg-surface-hover hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
      aria-expanded={open}
      aria-controls="mobile-sidebar"
      aria-label={open ? "Close navigation menu" : "Open navigation menu"}
      onClick={() => setOpen(!open)}
    >
      {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );
}
