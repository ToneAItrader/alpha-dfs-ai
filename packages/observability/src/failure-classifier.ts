export type FailureClass =
  | "transient"
  | "configuration"
  | "validation"
  | "upstream"
  | "timeout"
  | "circuit_open"
  | "unknown";

export function classifyFailure(error: unknown): FailureClass {
  const message =
    error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  if (message.includes("circuit open") || message.includes("circuit breaker")) {
    return "circuit_open";
  }
  if (message.includes("timeout") || message.includes("timed out") || message.includes("aborted")) {
    return "timeout";
  }
  if (message.includes("not configured") || message.includes("missing credentials")) {
    return "configuration";
  }
  if (message.includes("validation") || message.includes("insufficient")) {
    return "validation";
  }
  if (message.includes("upstream") || message.includes("missing_upstream")) {
    return "upstream";
  }
  if (
    message.includes("econnrefused") ||
    message.includes("network") ||
    message.includes("temporary")
  ) {
    return "transient";
  }
  return "unknown";
}
