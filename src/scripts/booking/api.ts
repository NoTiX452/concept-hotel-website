// Calls this site's /api/*, which the Worker (worker/index.ts) passes to the
// concept booking app. Every answer is JSON with ok: true, or ok: false with
// an error message and, for invalid input, an error per field.
export type FieldErrors = Record<string, string>;
export type ApiResult<T> =
  | ({ ok: true; status: number } & T)
  | { ok: false; status: number; error: string; fields?: FieldErrors };

const NETWORK = "The booking app could not be reached. Check the connection and try again.";

export async function api<T = Record<string, unknown>>(method: "GET" | "POST", path: string, body?: unknown): Promise<ApiResult<T>> {
  let response: Response;
  try {
    response = await fetch(path, {
      method,
      headers: body === undefined ? {} : { "content-type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    return { ok: false, status: 0, error: NETWORK };
  }
  const data = (await response.json().catch(() => null)) as Record<string, unknown> | null;
  if (!data) return { ok: false, status: response.status, error: NETWORK };
  if (data.ok === true) return { ...(data as T), ok: true, status: response.status };
  return {
    ok: false,
    status: response.status,
    error: typeof data.error === "string" ? data.error : "Something went wrong. Please try again.",
    fields: (data.fields as FieldErrors | undefined) ?? undefined,
  };
}
