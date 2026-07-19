/** Backend domain error — independent of frontend presentation. */
export type BackendError = {
  code: string;
  message: string;
  engineId?: string;
  cause?: string;
};

export type EngineResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: BackendError };

export function engineSuccess<T>(data: T): EngineResult<T> {
  return { ok: true, data };
}

export function engineFailure<T>(
  code: string,
  message: string,
  engineId?: string,
): EngineResult<T> {
  return { ok: false, error: { code, message, engineId } };
}
