import {
  BarChart3,
  FileSearch,
  Sparkles,
  Trophy,
} from "lucide-react";
import { SectionLink } from "@/components/ui/SectionLink";

const overviewSections = [
  {
    href: "/slate-intelligence",
    title: "Slate Intelligence",
    description: "Slate grade, volatility, strategy, and key games.",
    icon: Sparkles,
  },
  {
    href: "/recommended-portfolio",
    title: "Recommended Portfolio",
    description: "Primary and Hail Mary lineups from PIE.",
    icon: Trophy,
  },
  {
    href: "/player-evidence",
    title: "Player Evidence",
    description: "Explainability for every recommended player.",
    icon: FileSearch,
  },
  {
    href: "/portfolio-health",
    title: "Portfolio Health",
    description: "Portfolio grade, exposure, and stack diversity.",
    icon: BarChart3,
  },
] as const;

export function AnalysisOverview() {
  return (
    <section aria-label="Analysis overview">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
        Analysis Overview
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {overviewSections.map((section) => (
          <SectionLink key={section.href} {...section} />
        ))}
      </div>
    </section>
  );
}
