"use client";

import { ArrowUpRight, Loader2, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Magnetic } from "@/components/motion/Magnetic";

type Field = "name" | "email" | "company" | "message";
type Status = "idle" | "sending" | "sent" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Record<Field, string>) {
  const errors: Partial<Record<Field, string>> = {};
  if (values.name.trim().length < 2) errors.name = "Please tell me your name";
  if (!EMAIL_RE.test(values.email.trim())) errors.email = "Please enter a valid email";
  if (values.message.trim().length < 10) errors.message = "A little more detail, please (10+ characters)";
  return errors;
}

export function ContactForm({ fallbackEmail }: { fallbackEmail: string }) {
  const [values, setValues] = useState<Record<Field, string>>({ name: "", email: "", company: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [sentTo, setSentTo] = useState("");
  const mountedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const update = (field: Field) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (errors[field]) setErrors((err) => ({ ...err, [field]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot.current?.value ?? "", elapsedMs: Date.now() - mountedAt.current }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; fields?: Partial<Record<Field, string[]>> };
      if (!res.ok || !data.ok) {
        if (data.fields) {
          setErrors(Object.fromEntries(Object.entries(data.fields).map(([k, v]) => [k, v?.[0]])) as Partial<Record<Field, string>>);
        }
        throw new Error(data.error || "Something went wrong.");
      }
      setSentTo(values.name.trim().split(" ")[0]);
      setStatus("sent");
      setValues({ name: "", email: "", company: "", message: "" });
    } catch (err) {
      setServerError((err as Error).message);
      setStatus("error");
    }
  };

  return (
    <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-10">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="flex min-h-[460px] flex-col items-center justify-center text-center"
            role="status"
          >
            <svg viewBox="0 0 52 52" className="h-20 w-20" aria-hidden="true">
              <motion.circle cx="26" cy="26" r="24" fill="none" stroke="url(#ok)" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, ease: "easeOut" }} />
              <motion.path d="M15 27 l7 7 l15 -15" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.45, ease: "easeOut" }} />
              <defs>
                <linearGradient id="ok" x1="0" x2="1">
                  <stop offset="0" stopColor="#8b5cf6" />
                  <stop offset="1" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
            </svg>
            <h3 className="mt-8 font-display text-3xl font-bold">Message sent!</h3>
            <p className="mt-3 max-w-sm text-muted">Thanks{sentTo ? `, ${sentTo}` : ""} — your message is in my inbox. I&apos;ll get back to you soon.</p>
            <button type="button" onClick={() => setStatus("idle")} className="mt-8 text-sm text-cyan underline-offset-4 hover:underline">
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
            <div className="grid gap-8 sm:grid-cols-2">
              <FloatingField id="name" label="Your name" value={values.name} onChange={update("name")} error={errors.name} autoComplete="name" required />
              <FloatingField id="email" type="email" label="Email" value={values.email} onChange={update("email")} error={errors.email} autoComplete="email" required />
            </div>
            <FloatingField id="company" label="Company / role (optional)" value={values.company} onChange={update("company")} error={errors.company} autoComplete="organization" />
            <FloatingField id="message" label="What would you like to build or discuss?" value={values.message} onChange={update("message")} error={errors.message} multiline required />

            {/* Bot trap — hidden from people and assistive tech */}
            <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
              <label>
                Website
                <input ref={honeypot} type="text" name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <div className="flex flex-col-reverse gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-h-6 text-sm" aria-live="polite">
                {status === "error" && (
                  <p className="text-rose-400">
                    {serverError}{" "}
                    <a href={`mailto:${fallbackEmail}`} className="inline-flex items-center gap-0.5 text-fg underline underline-offset-4">
                      Email instead <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </p>
                )}
              </div>
              <Magnetic className="inline-block shrink-0 self-start sm:self-auto">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full whitespace-nowrap bg-fg px-8 py-4 font-medium text-ink transition-opacity disabled:opacity-70"
                >
                  <span className="absolute inset-0 origin-left scale-x-0 bg-gradient-to-r from-violet to-cyan transition-transform duration-500 ease-out group-hover:scale-x-100" />
                  <span className="relative transition-colors group-hover:text-white">{status === "sending" ? "Sending…" : "Send message"}</span>
                  {status === "sending" ? (
                    <Loader2 className="relative h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="relative h-4 w-4 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-white" />
                  )}
                </button>
              </Magnetic>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

type FieldProps = {
  id: Field;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  error?: string;
  type?: string;
  multiline?: boolean;
  required?: boolean;
  autoComplete?: string;
};

function FloatingField({ id, label, value, onChange, error, type = "text", multiline, required, autoComplete }: FieldProps) {
  const shared = {
    id,
    name: id,
    value,
    onChange,
    required,
    autoComplete,
    placeholder: " ",
    "aria-invalid": Boolean(error),
    "aria-describedby": error ? `${id}-error` : undefined,
    className:
      "peer block w-full resize-none border-0 border-b border-line-strong bg-transparent pt-6 pb-3 text-lg text-fg outline-none transition-colors placeholder:text-transparent focus:border-transparent focus-visible:outline-none aria-[invalid=true]:border-rose-400/70",
  };

  return (
    <div>
      <div className="relative">
      {multiline ? <textarea rows={5} {...shared} /> : <input type={type} {...shared} />}
      <label
        htmlFor={id}
        className="pointer-events-none absolute top-6 left-0 origin-left text-lg text-muted transition-all duration-300 peer-focus:top-0 peer-focus:text-xs peer-focus:tracking-wider peer-focus:text-cyan peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:tracking-wider"
      >
        {label}
        {required && <span className="text-cyan"> *</span>}
      </label>
      <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-violet to-cyan transition-transform duration-500 peer-focus:scale-x-100" />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
}
