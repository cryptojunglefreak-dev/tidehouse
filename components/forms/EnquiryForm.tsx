"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { siteConfig, whatsappLink } from "@/config/site";
import {
  enquiryIntents,
  normalizeEnquiry,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryIntent,
} from "@/lib/enquiry/validation";
import { href } from "@/i18n/config";
import { useLang, useT } from "@/i18n/LangProvider";
import { cn } from "@/lib/cn";
import { isPreview } from "@/lib/preview";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { PREFILL_EVENT, type PrefillDetail } from "./prefill";

interface ProjectOption {
  slug: string;
  name: string;
  area: string;
  /** Developer's project number — added to the enquiry so the team can match it to the brochure. */
  ref?: string;
}

interface EnquiryFormProps {
  projects: ProjectOption[];
  defaultProject?: string;
  defaultIntent?: EnquiryIntent;
  tone?: "light" | "paper";
}

type Status = "idle" | "sending" | "sent" | "error";

const fieldBase =
  "w-full rounded-xl border bg-stone-100/70 px-4 py-3 text-[1rem] text-ink outline-none transition-[border-color,background-color,box-shadow] placeholder:text-stone-400 focus:border-tide focus:bg-white focus:shadow-[0_0_0_4px_rgb(15_95_112/0.12)]";

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  const t = useT();
  return (
    <div className="relative flex flex-col gap-2">
      <label htmlFor={id} className="text-[0.875rem] font-[540] text-ink">
        {label}
        {optional && <span className="font-normal text-muted"> {t.form.optional}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-sm text-[#b42318]">
          <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

export function EnquiryForm({ projects, defaultProject = "", defaultIntent = "info", tone = "light" }: EnquiryFormProps) {
  const lang = useLang();
  const t = useT();
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef<number>(0);
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [touched, setTouched] = useState(false);
  const [intent, setIntent] = useState<EnquiryIntent>(defaultIntent);
  const [project, setProject] = useState(defaultProject);
  const [unit, setUnit] = useState("");
  const [message, setMessage] = useState("");
  const [sentTo, setSentTo] = useState({ name: "", email: "" });

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    const onPrefill = (e: Event) => {
      const d = (e as CustomEvent<PrefillDetail>).detail;
      if (d.intent) setIntent(d.intent);
      if (d.project !== undefined) setProject(d.project);
      setUnit(d.unit ?? "");
      if (d.message) setMessage(d.message);
      if (status === "sent") setStatus("idle");
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, [status]);

  const id = (name: string) => `${uid}-${name}`;
  const selected = projects.find((p) => p.slug === project);
  const projectLabel = selected?.name;

  function collect() {
    const fd = new FormData(formRef.current!);
    const raw = Object.fromEntries(fd.entries()) as Record<string, unknown>;
    return normalizeEnquiry({
      ...raw,
      consent: fd.get("consent") === "on",
      project: selected ? `${selected.name}${selected.ref ? ` (ref. ${selected.ref})` : ""}` : t.form.general,
      unit,
      startedAt: startedAt.current,
      page: window.location.pathname,
      lang,
    });
  }

  function revalidate() {
    if (!touched) return;
    setErrors(validateEnquiry(collect()));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    const data = collect();
    const errs = validateEnquiry(data);
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = Object.keys(errs)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    if (isPreview) {
      setServerMessage(t.form.previewNote);
      setStatus("error");
      return;
    }

    setStatus("sending");
    setServerMessage("");
    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; message?: string; errors?: EnquiryErrors };
      if (res.ok && json.ok) {
        setSentTo({ name: data.name.split(" ")[0], email: data.email });
        setStatus("sent");
        formRef.current?.reset();
        setMessage("");
        setUnit("");
        setTouched(false);
        return;
      }
      if (json.errors) setErrors(json.errors);
      setServerMessage(json.message ?? t.form.failed);
      setStatus("error");
    } catch {
      setServerMessage(t.form.offline);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className={cn("flex flex-col items-start gap-5 rounded-[var(--radius-tile)] p-8 sm:p-10", tone === "paper" ? "bg-paper" : "bg-palm-100/60")}>
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-palm text-paper">
          <Icon name="check" size={22} />
        </span>
        <h3 className="type-heading text-2xl">{t.form.sentTitle}</h3>
        <p className="type-body max-w-md text-muted">
          {t.form.sentText(sentTo.name, sentTo.email)}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => setStatus("idle")}>
            {t.form.sendAnother}
          </Button>
          <a
            href={whatsappLink(t.form.sentWhatsapp(projectLabel ?? ""))}
            target="_blank"
            rel="noopener noreferrer"
            className="type-label inline-flex h-12 items-center gap-2 px-2 text-palm underline decoration-palm/30 underline-offset-4"
          >
            <Icon name="chat" size={18} /> WhatsApp
          </a>
        </div>
      </div>
    );
  }

  const describedBy = (name: keyof EnquiryErrors) => (errors[name] ? `${id(name)}-error` : undefined);
  const borderFor = (name: keyof EnquiryErrors) => (errors[name] ? "border-[#b42318] bg-[#b42318]/[0.04]" : "border-transparent");

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      onChange={revalidate}
      className={cn("relative grid gap-x-5 gap-y-6 rounded-[var(--radius-tile)] p-6 sm:grid-cols-2 sm:p-10", tone === "paper" ? "bg-paper shadow-[0_30px_80px_-40px_rgba(15,42,51,0.35)]" : "bg-paper/70")}
      aria-describedby={serverMessage ? id("server") : undefined}
    >
      <fieldset className="sm:col-span-2">
        <legend className="mb-3 text-[0.875rem] font-[540] text-ink">{t.form.intentLegend}</legend>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(enquiryIntents) as EnquiryIntent[]).map((key) => (
            <label key={key} className="cursor-pointer">
              <input
                type="radio"
                name="intent"
                value={key}
                checked={intent === key}
                onChange={() => setIntent(key)}
                className="peer sr-only"
              />
              <span className="inline-flex h-10 items-center rounded-full bg-stone-100 px-4 text-[0.875rem] font-[520] text-ink/75 transition-colors peer-checked:bg-tide peer-checked:text-white peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-tide-bright hover:text-ink peer-checked:hover:text-white">
                {t.form.intents[key]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field id={id("name")} label={t.form.name} error={errors.name}>
        <input
          id={id("name")}
          name="name"
          autoComplete="name"
          required
          placeholder={t.form.namePlaceholder}
          aria-invalid={!!errors.name}
          aria-describedby={describedBy("name")}
          className={cn(fieldBase, borderFor("name"))}
        />
      </Field>

      <Field id={id("email")} label={t.form.email} error={errors.email}>
        <input
          id={id("email")}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder={t.form.emailPlaceholder}
          aria-invalid={!!errors.email}
          aria-describedby={describedBy("email")}
          className={cn(fieldBase, borderFor("email"))}
        />
      </Field>

      <Field id={id("phone")} label={t.form.phone} optional={intent !== "viewing"} error={errors.phone}>
        <input
          id={id("phone")}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder={t.form.phonePlaceholder}
          aria-invalid={!!errors.phone}
          aria-describedby={describedBy("phone")}
          className={cn(fieldBase, borderFor("phone"))}
        />
      </Field>

      <Field id={id("project")} label={t.form.project}>
        <select
          id={id("project")}
          name="projectSlug"
          value={project}
          onChange={(e) => {
            setProject(e.target.value);
            setUnit("");
          }}
          className={cn(fieldBase, "cursor-pointer appearance-none border-transparent pr-10")}
        >
          <option value="">{t.form.projectUnsure}</option>
          {projects.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}, {p.area}
            </option>
          ))}
        </select>
        <Icon name="arrowRight" size={16} className="pointer-events-none absolute right-4 bottom-4 rotate-90 text-muted" />
      </Field>

      {unit && (
        <div className="flex items-center justify-between gap-4 rounded-xl bg-sky px-4 py-3 sm:col-span-2">
          <p className="text-[0.9375rem]">
            {t.form.unitAsk} <strong className="font-semibold">{unit}</strong>
            {projectLabel ? ` (${projectLabel})` : ""}.
          </p>
          <button type="button" onClick={() => setUnit("")} className="type-label text-muted underline underline-offset-4 hover:text-graphite">
            {t.form.remove}
          </button>
        </div>
      )}

      {intent === "viewing" && (
        <Field id={id("date")} label={t.form.date} optional>
          <input
            id={id("date")}
            name="preferredDate"
            placeholder={t.form.datePlaceholder}
            className={cn(fieldBase, "border-transparent")}
            aria-describedby={id("date-hint")}
          />
          <p id={id("date-hint")} className="mt-2 text-sm text-muted">
            {t.form.dateHint}
          </p>
        </Field>
      )}

      <div className="sm:col-span-2">
        <Field id={id("message")} label={t.form.message} optional error={errors.message}>
          <textarea
            id={id("message")}
            name="message"
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.form.messagePlaceholder}
            aria-invalid={!!errors.message}
            aria-describedby={describedBy("message")}
            className={cn(fieldBase, borderFor("message"), "resize-y")}
          />
        </Field>
      </div>

      {/* Honeypot — hidden from people, filled by bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("website")}>Strona www</label>
        <input id={id("website")} name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted">
          <input
            type="checkbox"
            name="consent"
            aria-invalid={!!errors.consent}
            aria-describedby={describedBy("consent")}
            className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-[#0f5f70]"
          />
          <span>
            {t.form.consentBefore}{" "}
            <Link href={href(lang, "privacy")} className="text-graphite underline underline-offset-2">
              {t.form.consentLink}
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <p id={`${id("consent")}-error`} className="mt-2 flex items-start gap-1.5 text-sm text-[#b42318]">
            <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
            {errors.consent}
          </p>
        )}
      </div>

      {status === "error" && serverMessage && (
        <div id={id("server")} role="alert" className="flex items-start gap-3 border border-[#b42318]/25 bg-[#b42318]/[0.05] rounded-xl p-4 text-[0.9375rem] sm:col-span-2">
          <Icon name="alert" size={20} className="mt-0.5 shrink-0 text-[#b42318]" />
          <div>
            <p>{serverMessage}</p>
            <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="font-medium text-palm underline underline-offset-4">
                WhatsApp {siteConfig.contact.phoneDisplay}
              </a>
              <a href={`mailto:${siteConfig.contact.email}`} className="font-medium text-palm underline underline-offset-4">
                {siteConfig.contact.email}
              </a>
            </p>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <Button type="submit" size="lg" disabled={status === "sending"} className="w-full sm:w-auto" icon={status === "sending" ? undefined : "arrowRight"} iconPosition="end">
          {status === "sending" ? t.cta.sending : intent === "viewing" ? t.cta.bookViewing : intent === "plans" ? t.cta.plansAndPrices : t.cta.send}
        </Button>
        <p className="text-sm text-muted">{t.form.replyNote}</p>
      </div>
    </form>
  );
}
