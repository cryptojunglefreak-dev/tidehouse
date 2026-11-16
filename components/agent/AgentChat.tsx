"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { LogoMark } from "@/components/layout/Logo";
import { prefillEnquiry } from "@/components/forms/prefill";
import { Icon } from "@/components/ui/Icon";
import { projectHref } from "@/i18n/config";
import { useLang, useT } from "@/i18n/LangProvider";
import { cn } from "@/lib/cn";
import { isPreview } from "@/lib/preview";
import {
  bedroomOptions,
  budgetOptions,
  mergeFilters,
  parseQuery,
  type AgentFilters,
} from "@/lib/agent/filters";
import type { AgentCardWithImage, AgentEvent, AgentRequest, ChatMessage } from "@/lib/agent/protocol";

interface Bubble {
  id: number;
  role: "user" | "assistant";
  content: string;
  cards?: AgentCardWithImage[];
  exact?: boolean;
  pending?: boolean;
}

type Panel = "budget" | "area" | "bedrooms" | null;


let nextId = 1;

/* ------------------------------------------------------------------ */
/* Tiny formatter: paragraphs, bullet lists and **bold**               */
/* ------------------------------------------------------------------ */

function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-[600] text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

function RichText({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) {
      blocks.push(
        <ul key={`l${blocks.length}`} className="my-1.5 space-y-1">
          {list.map((li, i) => (
            <li key={i} className="relative pl-4 before:absolute before:top-[0.6em] before:left-0 before:h-1.5 before:w-1.5 before:rounded-full before:bg-sun/80">
              {inline(li)}
            </li>
          ))}
        </ul>,
      );
      list = [];
    }
  };
  for (const raw of text.replace(/\r/g, "").split("\n")) {
    const line = raw.trim();
    const m = line.match(/^(?:[-•*]|\d+[.)])\s+(.*)$/);
    if (m) list.push(m[1]);
    else {
      flush();
      if (line) blocks.push(<p key={`p${blocks.length}`}>{inline(line.replace(/^#+\s*/, ""))}</p>);
    }
  }
  flush();
  return <div className="space-y-1.5">{blocks}</div>;
}

/* ------------------------------------------------------------------ */
/* Offer card                                                          */
/* ------------------------------------------------------------------ */

function OfferCard({ card, exact }: { card: AgentCardWithImage; exact?: boolean }) {
  const lang = useLang();
  const t = useT().agent;
  const href = projectHref(lang, card.slug);
  return (
    <article
      className="flex w-[15.5rem] shrink-0 snap-start flex-col overflow-hidden rounded-[1.25rem] text-left sm:w-auto sm:shrink"
      style={{ background: card.bg, color: card.deep }}
    >
      <Link href={href} className="group relative block aspect-[16/10] overflow-hidden">
        <Image
          src={card.image.src}
          alt={card.name}
          fill
          sizes="(min-width: 640px) 240px, 248px"
          placeholder="blur"
          blurDataURL={card.image.blurDataURL}
          quality={60}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      </Link>
      <div className="flex flex-1 flex-col p-3.5">
        <p className="text-[0.75rem] font-[520] opacity-70">{card.place}</p>
        <h3 className="mt-0.5 text-[1rem] leading-tight font-[620] tracking-[-0.02em]">{card.name}</h3>
        <p className="mt-1.5 text-[0.9375rem] font-[600] tracking-[-0.01em]">
          {card.priceFrom}
          {card.pricePln && <span className="ml-1.5 text-[0.75rem] font-[460] opacity-70">{card.pricePln}</span>}
        </p>
        {!exact && card.missing.length > 0 ? (
          <p className="mt-1 text-[0.75rem] leading-snug opacity-80">
            {t.notMet}: {card.missing.join(", ")}
          </p>
        ) : (
          card.reasons.length > 0 && <p className="mt-1 text-[0.75rem] leading-snug opacity-80">{card.reasons.join(" · ")}</p>
        )}
        <div className="mt-auto flex gap-2 pt-3">
          <Link
            href={href}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-full text-[0.8125rem] font-[560] text-white transition-opacity hover:opacity-90"
            style={{ background: card.deep }}
          >
            {t.see}
          </Link>
          <button
            type="button"
            onClick={() =>
              prefillEnquiry({
                intent: "info",
                project: card.slug,
                message: t.askMessage(card.name),
              })
            }
            className="inline-flex h-9 flex-1 items-center justify-center rounded-full border text-[0.8125rem] font-[560] transition-colors hover:bg-white/50"
            style={{ borderColor: `${card.deep}40` }}
          >
            {t.ask}
          </button>
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Chips                                                               */
/* ------------------------------------------------------------------ */

function Chip({
  active,
  onClick,
  children,
  expanded,
  controls,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  expanded?: boolean;
  controls?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={expanded === undefined ? active : undefined}
      aria-expanded={expanded}
      aria-controls={controls}
      className={cn(
        "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-[0.8125rem] font-[540] whitespace-nowrap transition-colors sm:text-[0.875rem]",
        active ? "bg-white text-ink" : "bg-white/10 text-white/90 ring-1 ring-white/15 ring-inset hover:bg-white/[0.16]",
      )}
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Chat                                                                */
/* ------------------------------------------------------------------ */

async function* readEvents(res: Response): AsyncGenerator<AgentEvent> {
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const l of lines) if (l.trim()) yield JSON.parse(l) as AgentEvent;
  }
  if (buffer.trim()) yield JSON.parse(buffer) as AgentEvent;
}

async function* localEvents(req: AgentRequest): AsyncGenerator<AgentEvent> {
  const { localAnswer } = await import("@/lib/agent/protocol");
  for (const e of localAnswer(req)) {
    if (e.type === "delta") {
      // reveal the text in small steps so it reads like the live agent
      const words = e.text.split(/(?<=\s)/);
      for (let i = 0; i < words.length; i += 3) {
        yield { type: "delta", text: words.slice(i, i + 3).join("") };
        await new Promise((r) => setTimeout(r, 18));
      }
    } else yield e;
  }
}

export function AgentChat({ areas }: { areas: string[] }) {
  const lang = useLang();
  const t = useT().agent;
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [filters, setFilters] = useState<AgentFilters>({});
  const [panel, setPanel] = useState<Panel>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"ai" | "basic" | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelId = useId();
  const preview = isPreview;

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [bubbles]);

  const update = (id: number, fn: (b: Bubble) => Bubble) => setBubbles((list) => list.map((b) => (b.id === id ? fn(b) : b)));

  const ask = useCallback(
    async (text: string, nextFilters: AgentFilters) => {
      if (busy) return;
      const history: ChatMessage[] = bubbles
        .filter((b) => !b.pending && b.content)
        .map((b) => ({ role: b.role, content: b.content }));
      const userBubble: Bubble = { id: nextId++, role: "user", content: text };
      const reply: Bubble = { id: nextId++, role: "assistant", content: "", pending: true };
      setBubbles((list) => [...list, userBubble, reply]);
      setBusy(true);

      const messages: ChatMessage[] = [...history, { role: "user", content: text }];
      const req: AgentRequest = { messages: messages.slice(-10), filters: nextFilters, lang };
      try {
        let events: AsyncGenerator<AgentEvent>;
        if (preview) events = localEvents(req);
        else {
          let res: Response | null = null;
          try {
            res = await fetch("/api/agent", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(req),
            });
          } catch {
            res = null;
          }
          if (res && res.status === 429) {
            const data = await res.json().catch(() => ({}));
            update(reply.id, (b) => ({ ...b, pending: false, content: data.message ?? t.retryLater }));
            return;
          }
          events = res && res.ok && res.body ? readEvents(res) : localEvents(req);
        }
        for await (const e of events) {
          if (e.type === "match") update(reply.id, (b) => ({ ...b, cards: e.cards, exact: e.exact }));
          else if (e.type === "delta") update(reply.id, (b) => ({ ...b, pending: false, content: b.content + e.text }));
          else if (e.type === "done") setMode(e.mode);
          else if (e.type === "error") update(reply.id, (b) => ({ ...b, content: e.message }));
        }
        update(reply.id, (b) => ({ ...b, pending: false }));
      } catch {
        update(reply.id, (b) => ({
          ...b,
          pending: false,
          content: b.content || t.connectionError,
        }));
      } finally {
        setBusy(false);
      }
    },
    [bubbles, busy, preview, lang, t],
  );

  const applyChip = (patch: AgentFilters, clear: (keyof AgentFilters)[], text: string) => {
    if (busy) return;
    const next: AgentFilters = { ...filters, ...patch };
    for (const k of clear) delete next[k];
    setFilters(next);
    setPanel(null);
    void ask(text, next);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    const next = mergeFilters(filters, parseQuery(text, areas, lang));
    setFilters(next);
    setInput("");
    void ask(text, next);
  };

  const reset = () => {
    setBubbles([]);
    setFilters({});
    setPanel(null);
    setMode(null);
    inputRef.current?.focus();
  };

  const budgetActive = budgetOptions.find((o) => o.max === filters.budgetMax && o.min === filters.budgetMin);
  const budgetText = (id: string) => t.budgetOptions.find((o) => o.id === id) ?? { label: id, hint: "" };
  const bedText = (value: number) => t.bedroomOptions[bedroomOptions.findIndex((o) => o.value === value)] ?? t.bedrooms;
  const budgetLabel = budgetActive ? budgetText(budgetActive.id).label : filters.budgetMax || filters.budgetMin ? t.yourBudget : t.budget;
  const areaLabel = filters.areas?.length ? filters.areas.join(", ") : t.location;
  const bedLabel = filters.bedroomsMin ? bedText(filters.bedroomsMin) : t.bedrooms;
  const started = bubbles.length > 0;

  return (
    <div className="mx-auto w-full max-w-3xl text-left">
      <div className="overflow-hidden rounded-[1.75rem] bg-white/[0.08] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.55)] ring-1 ring-white/15 backdrop-blur-xl ring-inset">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-4 sm:px-5">
          <LogoMark size={34} idSuffix="agent" />
          <div className="min-w-0 flex-1">
            <p className="text-[0.9375rem] font-[600] tracking-[-0.015em]">{t.name}</p>
            <p className="flex items-center gap-1.5 text-[0.75rem] text-white/65">
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#7ee0b0]" />
              {t.status}
            </p>
          </div>
          {started && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[0.8125rem] text-white/75 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Icon name="refresh" size={16} />
              <span className="hidden sm:inline">{t.restart}</span>
              <span className="sr-only sm:hidden">{t.restartLong}</span>
            </button>
          )}
        </div>

        {/* Messages */}
        <div
          ref={scroller}
          role="log"
          aria-live="polite"
          aria-busy={busy}
          className={cn("space-y-3 overflow-y-auto overscroll-contain px-4 pt-4 sm:px-5", started ? "max-h-[min(30rem,60vh)]" : "")}
        >
          <AssistantRow>
            <p>{t.greeting}</p>
          </AssistantRow>
          {bubbles.map((b) =>
            b.role === "user" ? (
              <div key={b.id} className="flex justify-end">
                <p className="max-w-[85%] rounded-[1.25rem] rounded-br-md bg-white px-4 py-2.5 text-[0.9375rem] leading-snug text-ink">{b.content}</p>
              </div>
            ) : (
              <div key={b.id} className="space-y-3">
                <AssistantRow>
                  {b.pending && !b.content ? (
                    <span className="inline-flex gap-1 py-1.5" aria-label={t.typing}>
                      {[0, 1, 2].map((i) => (
                        <span key={i} className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/70" style={{ animationDelay: `${i * 160}ms` }} />
                      ))}
                    </span>
                  ) : (
                    <RichText text={b.content} />
                  )}
                </AssistantRow>
                {b.cards && b.cards.length > 0 && (
                  <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
                    {b.cards.map((c) => (
                      <OfferCard key={c.slug} card={c} exact={b.exact} />
                    ))}
                  </div>
                )}
              </div>
            ),
          )}
        </div>

        {/* Chips */}
        <div className="mt-4 px-4 sm:px-5">
          <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="group" aria-label={t.chips}>
            <Chip active={Boolean(filters.budgetMax || filters.budgetMin)} expanded={panel === "budget"} controls={panelId} onClick={() => setPanel(panel === "budget" ? null : "budget")}>
              {budgetLabel}
              <Icon name="chevronDown" size={14} className={cn("transition-transform", panel === "budget" && "rotate-180")} />
            </Chip>
            <Chip active={Boolean(filters.areas?.length)} expanded={panel === "area"} controls={panelId} onClick={() => setPanel(panel === "area" ? null : "area")}>
              {areaLabel}
              <Icon name="chevronDown" size={14} className={cn("transition-transform", panel === "area" && "rotate-180")} />
            </Chip>
            <Chip
              active={filters.view === "sea"}
              onClick={() =>
                filters.view === "sea"
                  ? applyChip({}, ["view"], t.msgSeaOff)
                  : applyChip({ view: "sea" }, [], t.msgSeaOn)
              }
            >
              {t.sea}
            </Chip>
            <Chip
              active={filters.view === "pool"}
              onClick={() =>
                filters.view === "pool"
                  ? applyChip({}, ["view"], t.msgPoolOff)
                  : applyChip({ view: "pool" }, [], t.msgPoolOn)
              }
            >
              {t.pool}
            </Chip>
            <Chip active={Boolean(filters.bedroomsMin)} expanded={panel === "bedrooms"} controls={panelId} onClick={() => setPanel(panel === "bedrooms" ? null : "bedrooms")}>
              {bedLabel}
              <Icon name="chevronDown" size={14} className={cn("transition-transform", panel === "bedrooms" && "rotate-180")} />
            </Chip>
            <Chip
              active={Boolean(filters.freehold)}
              onClick={() =>
                filters.freehold
                  ? applyChip({}, ["freehold"], t.msgFreeholdOff)
                  : applyChip({ freehold: true }, [], t.msgFreeholdOn)
              }
            >
              {t.freehold}
            </Chip>
          </div>

          {panel && (
            <div id={panelId} className="mt-2 flex animate-[menu-in_0.25s_var(--ease-out-soft)_both] flex-wrap gap-2 rounded-2xl bg-black/15 p-2">
              {panel === "budget" &&
                budgetOptions.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    disabled={busy}
                    onClick={() =>
                      applyChip({ budgetMin: o.min, budgetMax: o.max }, o.min ? (o.max ? [] : ["budgetMax"]) : ["budgetMin"], t.msgBudget(budgetText(o.id).label, budgetText(o.id).hint))
                    }
                    className={cn(
                      "rounded-xl px-3 py-2 text-left transition-colors",
                      budgetActive?.id === o.id ? "bg-white text-ink" : "bg-white/[0.08] hover:bg-white/15",
                    )}
                  >
                    <span className="block text-[0.875rem] font-[560]">{budgetText(o.id).label}</span>
                    {budgetText(o.id).hint && <span className="block text-[0.75rem] opacity-70">{budgetText(o.id).hint}</span>}
                  </button>
                ))}
              {panel === "area" && (
                <>
                  {areas.map((a) => {
                    const on = filters.areas?.length === 1 && filters.areas[0] === a;
                    return (
                      <button
                        key={a}
                        type="button"
                        disabled={busy}
                        onClick={() => applyChip({ areas: [a] }, [], t.msgArea(a))}
                        className={cn("h-9 rounded-xl px-3.5 text-[0.875rem] font-[540] transition-colors", on ? "bg-white text-ink" : "bg-white/[0.08] hover:bg-white/15")}
                      >
                        {a}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => applyChip({}, ["areas"], t.msgAnyArea)}
                    className={cn("h-9 rounded-xl px-3.5 text-[0.875rem] font-[540] transition-colors", !filters.areas?.length ? "bg-white text-ink" : "bg-white/[0.08] hover:bg-white/15")}
                  >
                    {t.anyArea}
                  </button>
                </>
              )}
              {panel === "bedrooms" &&
                bedroomOptions.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    disabled={busy}
                    onClick={() => applyChip({ bedroomsMin: o.value }, [], t.msgBedrooms(o.value))}
                    className={cn(
                      "h-9 rounded-xl px-3.5 text-[0.875rem] font-[540] transition-colors",
                      filters.bedroomsMin === o.value ? "bg-white text-ink" : "bg-white/[0.08] hover:bg-white/15",
                    )}
                  >
                    {bedText(o.value)}
                  </button>
                ))}
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={onSubmit} className="p-3 sm:p-4">
          <div className="flex items-center gap-2 rounded-full bg-white p-1.5 pl-5 text-ink shadow-[0_10px_30px_-12px_rgba(0,0,0,0.4)] focus-within:ring-4 focus-within:ring-white/25">
            <label htmlFor="agent-input" className="sr-only">
              {t.inputLabel}
            </label>
            <input
              ref={inputRef}
              id="agent-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={600}
              autoComplete="off"
              enterKeyHint="send"
              placeholder={t.placeholder}
              className="h-10 min-w-0 flex-1 bg-transparent text-[1rem] outline-none placeholder:text-muted"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label={t.send}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ocean text-white transition-[opacity,transform] hover:scale-[1.04] disabled:opacity-35 disabled:hover:scale-100"
            >
              <Icon name="arrowUp" size={18} />
            </button>
          </div>
        </form>
      </div>
      <p className="mt-3 px-2 text-center text-[0.75rem] leading-snug text-white/55">
        {preview || mode === "basic"
          ? t.footBasic
          : t.footAi}
      </p>
    </div>
  );
}

function AssistantRow({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[92%] text-[0.9375rem] leading-relaxed text-white/90">{children}</div>
  );
}
