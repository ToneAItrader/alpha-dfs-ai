import { cn } from "@/lib/cn";

type LoadingSpinnerProps = {
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
};

export function LoadingSpinner({
  label = "Loading",
  className,
  size = "md",
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-3", className)}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={label}
    >
      <div
        className={cn(
          "animate-spin rounded-full border-surface-border border-t-accent",
          sizeClasses[size],
        )}
        aria-hidden="true"
      />
      <span className="text-sm text-muted">{label}</span>
    </div>
  );
}
