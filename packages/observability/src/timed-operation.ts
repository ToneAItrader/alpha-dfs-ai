import { getOperationalConfig } from "./operational-config";

export class OperationTimeoutError extends Error {
  constructor(label: string, timeoutMs: number) {
    super(`${label} timed out after ${timeoutMs}ms`);
    this.name = "OperationTimeoutError";
  }
}

export async function withTimeout<T>(
  label: string,
  timeoutMs: number | undefined,
  fn: () => Promise<T>,
): Promise<T> {
  const resolvedTimeout = timeoutMs ?? getOperationalConfig().connectorTimeoutMs;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new OperationTimeoutError(label, resolvedTimeout)), resolvedTimeout);
  });

  try {
    return await Promise.race([fn(), timeoutPromise]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}
