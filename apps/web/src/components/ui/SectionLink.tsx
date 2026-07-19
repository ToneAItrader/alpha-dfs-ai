import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

type SectionLinkProps = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
};

export function SectionLink({
  href,
  title,
  description,
  icon: Icon,
  className,
}: SectionLinkProps) {
  return (
    <Link href={href} className={cn("group block focus-visible:outline-none", className)}>
      <Card className="h-full transition hover:border-accent/30 hover:bg-surface-hover">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground group-hover:text-accent">
                {title}
              </h3>
              <p className="text-xs text-muted">{description}</p>
            </div>
          </div>
          <ArrowRight
            className="h-4 w-4 shrink-0 text-muted transition group-hover:translate-x-0.5 group-hover:text-accent"
            aria-hidden="true"
          />
        </div>
      </Card>
    </Link>
  );
}
