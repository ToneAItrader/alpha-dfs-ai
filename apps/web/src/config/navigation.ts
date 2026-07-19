import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BarChart3,
  FileSearch,
  Gauge,
  LayoutDashboard,
  LineChart,
  Settings,
  Sparkles,
  Trophy,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  taskId?: string;
};

export const APP_NAME = "Alpha DFS AI";
export const APP_SCOPE = "DraftKings · NFL · Classic";

export const primaryNav: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    description: "Analyze Slate and analysis overview",
    icon: LayoutDashboard,
    taskId: "10.2",
  },
  {
    href: "/slate-intelligence",
    label: "Slate Intelligence",
    description: "Slate-wide strategy and context",
    icon: Sparkles,
    taskId: "10.3",
  },
  {
    href: "/portfolio-readiness",
    label: "Portfolio Readiness",
    description: "Prediction confidence and data quality",
    icon: Activity,
    taskId: "10.4",
  },
  {
    href: "/recommended-portfolio",
    label: "Recommended Portfolio",
    description: "Primary and Hail Mary lineups",
    icon: Trophy,
    taskId: "10.5",
  },
  {
    href: "/player-evidence",
    label: "Player Evidence",
    description: "Explainability for recommended players",
    icon: FileSearch,
    taskId: "10.6",
  },
  {
    href: "/portfolio-health",
    label: "Portfolio Health",
    description: "Portfolio quality and exposure metrics",
    icon: BarChart3,
    taskId: "10.7",
  },
  {
    href: "/simulation",
    label: "Simulation Results",
    description: "Monte Carlo outcome evaluation",
    icon: LineChart,
    taskId: "10.8",
  },
];

export const secondaryNav: NavItem[] = [
  {
    href: "/confidence",
    label: "Confidence",
    description: "PCE shared components showcase",
    icon: Gauge,
    taskId: "10.9",
  },
  {
    href: "/settings",
    label: "Settings",
    description: "Data sources and preferences",
    icon: Settings,
  },
];

export const allNavItems = [...primaryNav, ...secondaryNav];
