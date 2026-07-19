import { Card } from "@/components/ui/Card";
import type { ReactNode } from "react";

type ConfidenceCardProps = {
  title?: string;
  description?: string;
  children: ReactNode;
};

export function ConfidenceCard({ title, description, children }: ConfidenceCardProps) {
  return (
    <Card>
      {title ? (
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description ? <p className="mt-1 text-xs text-muted">{description}</p> : null}
        </div>
      ) : null}
      {children}
    </Card>
  );
}
