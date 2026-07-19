"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  APP_NAME,
  APP_SCOPE,
  primaryNav,
  secondaryNav,
  type NavItem,
} from "@/config/navigation";

type SidebarProps = {
  onNavigate?: () => void;
  className?: string;
};

function NavLink({ item, active, onNavigate }: { item: NavItem; active: boolean; onNavigate?: () => void }) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        active
          ? "bg-accent/10 text-accent"
          : "text-muted hover:bg-surface-hover hover:text-foreground",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          active ? "text-accent" : "text-muted group-hover:text-foreground",
        )}
        aria-hidden="true"
      />
      <span className="font-medium">{item.label}</span>
    </Link>
  );
}

export function Sidebar({ onNavigate, className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex h-full w-64 shrink-0 flex-col border-r border-surface-border bg-surface",
        className,
      )}
    >
      <div className="border-b border-surface-border px-5 py-5">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <span className="block text-base font-semibold text-foreground">
            {APP_NAME}
          </span>
          <span className="mt-1 block text-xs text-muted">{APP_SCOPE}</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Analysis
          </p>
          <ul className="space-y-1">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <NavLink
                  item={item}
                  active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
                  onNavigate={onNavigate}
                />
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">
            Configuration
          </p>
          <ul className="space-y-1">
            {secondaryNav.map((item) => (
              <li key={item.href}>
                <NavLink
                  item={item}
                  active={pathname === item.href}
                  onNavigate={onNavigate}
                />
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="border-t border-surface-border px-5 py-4">
        <p className="text-xs text-muted">Manual-run analysis only</p>
        <p className="mt-1 text-xs text-muted">IDLE → ANALYZING → COMPLETE</p>
      </div>
    </aside>
  );
}
