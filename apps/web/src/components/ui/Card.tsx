import { cn } from "@/lib/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
};

export function Card({ children, className, as: Component = "div" }: CardProps) {
  return (
    <Component
      className={cn(
        "rounded-xl border border-surface-border bg-surface-elevated p-5 ring-1 ring-surface-border/50",
        className,
      )}
    >
      {children}
    </Component>
  );
}
