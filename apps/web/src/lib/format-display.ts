/** Presentational formatters — no business logic, display only. */

export function formatOptionalNumber(value: number | null, suffix = ""): string {
  if (value === null) return "—";
  return `${value}${suffix}`;
}

export function formatOptionalText(value: string | null): string {
  return value ?? "—";
}

export function formatOptionalGrade(value: string | null): string {
  return value ?? "—";
}

export function formatLastAnalysis(value: string | null): string {
  return value ?? "Not yet run";
}

const readinessStatusLabels = {
  idle: "Idle",
  analyzing: "Analyzing",
  ready: "Ready",
  incomplete: "Incomplete",
} as const;

export function formatReadinessStatus(
  status: keyof typeof readinessStatusLabels,
): string {
  return readinessStatusLabels[status];
}

const portfolioStatusLabels = {
  idle: "Idle",
  generating: "Generating",
  complete: "Complete",
  failed: "Failed",
} as const;

export function formatPortfolioStatus(
  status: keyof typeof portfolioStatusLabels,
): string {
  return portfolioStatusLabels[status];
}

const simulationStatusLabels = {
  idle: "Idle",
  running: "Running",
  complete: "Complete",
  failed: "Failed",
} as const;

export function formatSimulationStatus(
  status: keyof typeof simulationStatusLabels,
): string {
  return simulationStatusLabels[status];
}

const varianceLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
} as const;

export function formatVarianceRating(
  rating: keyof typeof varianceLabels | null,
): string {
  if (rating === null) return "—";
  return varianceLabels[rating];
}

const dataSourceStatusLabels = {
  available: "Available",
  partial: "Partial",
  unavailable: "Unavailable",
  pending: "Pending",
} as const;

export function formatDataSourceStatus(
  status: keyof typeof dataSourceStatusLabels,
): string {
  return dataSourceStatusLabels[status];
}

export function formatSalary(value: number | null): string {
  if (value === null) return "—";
  return `$${value.toLocaleString()}`;
}

export function formatTimestamp(value: string | null): string {
  return value ?? "—";
}
