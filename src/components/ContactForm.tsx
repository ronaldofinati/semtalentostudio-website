"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

type ContactFormProps = {
  emailEnabled: boolean;
};

type FormStatus = "idle" | "submitting" | "success" | "error";

export function ContactForm({ emailEnabled }: ContactFormProps) {
  const t = useTranslations("contact.form");
  const searchParams = useSearchParams();
  const defaultSubject = useMemo(() => {
    const raw =
      searchParams.get("assunto") ??
      searchParams.get("subject") ??
      "";
    return raw.slice(0, 200);
  }, [searchParams]);
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!emailEnabled) {
      setStatus("success");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center">
        <p className="text-emerald-400">
          {emailEnabled ? t("success") : t("successDemo")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!emailEnabled && (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200/90">
          {t("demoNote")}
        </p>
      )}

      {status === "error" && (
        <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {t("error")}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm text-text-muted">
            {t("name")}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            disabled={status === "submitting"}
            placeholder={t("placeholder.name")}
            className="w-full rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm text-text outline-none transition-colors focus:border-brand/50 disabled:opacity-60"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm text-text-muted">
            {t("email")}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            disabled={status === "submitting"}
            placeholder={t("placeholder.email")}
            className="w-full rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm text-text outline-none transition-colors focus:border-brand/50 disabled:opacity-60"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-1.5 block text-sm text-text-muted">
          {t("subject")}
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          required
          defaultValue={defaultSubject}
          key={defaultSubject || "subject"}
          disabled={status === "submitting"}
          placeholder={t("placeholder.subject")}
          className="w-full rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm text-text outline-none transition-colors focus:border-brand/50 disabled:opacity-60"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm text-text-muted">
          {t("message")}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          disabled={status === "submitting"}
          placeholder={t("placeholder.message")}
          className="w-full resize-none rounded-xl border border-border bg-surface-muted px-4 py-3 text-sm text-text outline-none transition-colors focus:border-brand/50 disabled:opacity-60"
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-accent px-8 py-3 text-sm font-medium text-surface transition-colors hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? t("sending") : t("send")}
      </button>
    </form>
  );
}
