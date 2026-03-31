export type AdConsoleDataErrorCode =
  | "unauthorized"
  | "tenant_missing"
  | "upstream_error";

export class AdConsoleDataError extends Error {
  code: AdConsoleDataErrorCode;

  constructor(code: AdConsoleDataErrorCode, message: string) {
    super(message);
    this.name = "AdConsoleDataError";
    this.code = code;
  }
}

export function isAdConsoleDataError(
  error: unknown,
): error is AdConsoleDataError {
  return error instanceof AdConsoleDataError;
}

export type AdConsoleErrorState =
  | "unauthorized"
  | "tenantMissing"
  | "upstreamError";

export function getAdConsoleErrorState(
  error: unknown,
): AdConsoleErrorState | null {
  if (!isAdConsoleDataError(error)) {
    return null;
  }

  if (error.code === "unauthorized") {
    return "unauthorized";
  }

  if (error.code === "tenant_missing") {
    return "tenantMissing";
  }

  return "upstreamError";
}
