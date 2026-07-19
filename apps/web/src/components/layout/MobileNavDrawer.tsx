"use client";

import { useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { useMobileNav } from "@/components/layout/MobileNavContext";

/** Full-viewport mobile drawer — mounted at AppShell root, not inside sticky header. */
export function MobileNavDrawer() {
  const { open, setOpen } = useMobileNav();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] lg:hidden" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-black/75"
        aria-label="Dismiss navigation menu"
        onClick={() => setOpen(false)}
      />
      <div
        id="mobile-sidebar"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className="absolute inset-y-0 left-0 z-10 w-[min(100%,16rem)] shadow-2xl"
      >
        <Sidebar onNavigate={() => setOpen(false)} className="h-full" />
      </div>
    </div>
  );
}
