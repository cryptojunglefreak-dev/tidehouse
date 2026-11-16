import { getProcess } from "@/content";
import type { Locale } from "@/i18n/config";

/** A real sequence, so it is numbered. */
export function ProcessSteps({ lang }: { lang: Locale }) {
  const processSteps = getProcess(lang);
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {processSteps.map((step, i) => (
        <li key={step.title} className="flex flex-col rounded-[var(--radius-card)] bg-paper p-7 shadow-[0_1px_2px_rgba(15,42,51,0.04)]">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full bg-sky text-[1rem] font-[620] text-tide tabular"
            aria-hidden="true"
          >
            {i + 1}
          </span>
          <h3 className="type-heading mt-6 text-[1.25rem]">{step.title}</h3>
          <p className="mt-2.5 text-[0.9875rem] leading-relaxed text-muted">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}
