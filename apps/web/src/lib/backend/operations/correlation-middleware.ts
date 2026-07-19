import {
  generateCorrelationId,
  runWithCorrelationContextAsync,
} from "@alpha-dfs/observability";

export async function withCorrelationFromRequest<T>(
  request: Request,
  fn: () => Promise<T>,
): Promise<T> {
  const correlationId =
    request.headers.get("X-Correlation-ID")?.trim() || generateCorrelationId();
  return runWithCorrelationContextAsync({ correlationId }, fn);
}
