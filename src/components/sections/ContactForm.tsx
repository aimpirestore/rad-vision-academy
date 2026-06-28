"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Loader2 } from "lucide-react";

type Status = "idle" | "submitting" | "success" | "error";

const topics = ["General enquiry", "Course question", "Mentorship", "Institutional training", "Partnership", "Other"];

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      // Works with Netlify Forms out of the box (form has data-netlify attribute).
      // Also degrades gracefully with a Formspree endpoint if set in env.
      const formspree = process.env.NEXT_PUBLIC_FORMSPREE_ID;
      const res = formspree
        ? await fetch(`https://formspree.io/f/${formspree}`, {
            method: "POST",
            body: data,
            headers: { Accept: "application/json" },
          })
        : await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(data as any).toString(),
          });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError("Something went wrong. Please email us directly.");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="surface-elevated flex flex-col items-center gap-4 p-12 text-center"
      >
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h3 className="text-2xl font-bold text-brand-black">Message sent</h3>
        <p className="max-w-sm text-sm text-brand-dark-grey">
          Thank you for reaching out. Our team typically replies within one business day.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-2 inline-flex items-center gap-2 rounded-full border border-brand-black/10 px-5 py-2.5 text-sm font-semibold text-brand-black transition-colors hover:bg-brand-light-grey"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      name="contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      className="surface-elevated p-8 sm:p-10"
    >
      {/* Netlify hidden fields */}
      <input type="hidden" name="form-name" value="contact" />
      <p className="hidden">
        <label>Don&rsquo;t fill this out: <input name="bot-field" /></label>
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name" name="firstName" required />
        <Field label="Last name" name="lastName" required />
        <Field label="Email" name="email" type="email" required />
        <Field label="Country / region" name="country" />
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-brand-dark-grey">
          Topic
        </label>
        <select
          name="topic"
          required
          defaultValue=""
          className="w-full rounded-2xl border border-brand-black/10 bg-white px-4 py-3 text-sm text-brand-black focus:border-brand-red focus:outline-none"
        >
          <option value="" disabled>Select a topic…</option>
          {topics.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-brand-dark-grey">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={5}
          placeholder="Tell us a little about what you're looking for…"
          className="w-full resize-y rounded-2xl border border-brand-black/10 bg-white px-4 py-3 text-sm text-brand-black placeholder:text-brand-dark-grey/50 focus:border-brand-red focus:outline-none"
        />
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-brand-red/10 px-4 py-3 text-sm font-medium text-brand-red">{error}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-brand-red px-6 py-3.5 text-sm font-semibold text-white shadow-glow transition-all hover:bg-brand-red-deep hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "submitting" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Send message
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-brand-dark-grey">
        {label} {required && <span className="text-brand-red">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-2xl border border-brand-black/10 bg-white px-4 py-3 text-sm text-brand-black placeholder:text-brand-dark-grey/50 focus:border-brand-red focus:outline-none"
      />
    </div>
  );
}
