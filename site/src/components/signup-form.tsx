import { useState, type FormEvent } from "react";

export type SignupField = {
  name: string;
  label: string;
  hint?: string;
  kind: "text" | "email" | "textarea";
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
  maxLength?: number;
};

type Props = {
  /** Sent to the API as "type" and used to build the field ids. */
  kind: "professional" | "company";
  fields: SignupField[];
  submitLabel: string;
};

const CONTROL_CLASS =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-slate-900 " +
  "placeholder:text-slate-400 focus:border-slate-900 focus:outline-none";

export function SignupForm({ kind, fields, submitLabel }: Props) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    const formData = new FormData(event.currentTarget);
    const payload: Record<string, string> = { type: kind };
    for (const field of fields) {
      payload[field.name] = String(formData.get(field.name) ?? "").trim();
    }

    setState("sending");
    setError(null);

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body: unknown = await response.json().catch(() => null);
      const ok = body !== null && typeof body === "object" && (body as { ok?: unknown }).ok === true;
      const message =
        body !== null && typeof body === "object" && typeof (body as { error?: unknown }).error === "string"
          ? (body as { error: string }).error
          : null;

      if (response.status === 200 && ok) {
        setState("done");
        return;
      }

      setError(message ?? `We couldn't save your signup (error ${String(response.status)}). Please try again.`);
      setState("idle");
    } catch {
      setError("We couldn't reach the server. Check your connection and try again.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <p
        role="status"
        className="rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-6 text-base font-medium text-emerald-900"
      >
        You're on the list — we'll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {fields.map((field) => {
        const id = `${kind}-${field.name}`;
        const hintId = field.hint ? `${id}-hint` : undefined;
        return (
          <div key={field.name} className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-medium text-slate-900">
              {field.label}
              {field.required ? <span className="text-slate-500"> (required)</span> : null}
            </label>
            {field.hint ? (
              <p id={hintId} className="text-sm text-slate-600">
                {field.hint}
              </p>
            ) : null}
            {field.kind === "textarea" ? (
              <textarea
                id={id}
                name={field.name}
                rows={4}
                required={field.required}
                maxLength={field.maxLength}
                placeholder={field.placeholder}
                aria-describedby={hintId}
                className={CONTROL_CLASS}
              />
            ) : (
              <input
                id={id}
                name={field.name}
                type={field.kind}
                required={field.required}
                maxLength={field.maxLength}
                placeholder={field.placeholder}
                autoComplete={field.autoComplete}
                aria-describedby={hintId}
                className={CONTROL_CLASS}
              />
            )}
          </div>
        );
      })}

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-5 py-3 text-base font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : submitLabel}
      </button>

      <p className="text-sm text-slate-600">
        We use this only to contact you about ProcessProof. No lists, no sharing.
      </p>
    </form>
  );
}
