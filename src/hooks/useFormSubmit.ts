"use client";

import { useCallback, useState } from "react";

export type SubmitState = "idle" | "sending" | "done" | "error";

interface ApiResponse {
  ok: boolean;
  error?: string;
  fields?: Record<string, string>;
}

const TIMEOUT_MS = 12_000;

/** POSTs JSON to one of the intake routes and tracks sending / done / error, with field errors. */
export function useFormSubmit(endpoint: string) {
  const [state, setState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const submit = useCallback(
    async (payload: Record<string, string>) => {
      setState("sending");
      setError(null);
      setFieldErrors({});
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        const body = (await res.json().catch(() => ({ ok: false }))) as ApiResponse;
        if (res.ok && body.ok) {
          setState("done");
          return;
        }
        setFieldErrors(body.fields ?? {});
        setError(body.error ?? "Something went wrong. Please try again.");
        setState("error");
      } catch {
        setError("Network problem. Check your connection and try again.");
        setState("error");
      }
    },
    [endpoint],
  );

  return { state, error, fieldErrors, submit, setFieldErrors };
}
