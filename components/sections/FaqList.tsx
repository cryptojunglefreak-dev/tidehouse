import type { FaqItem } from "@/content/pl/faq";
import { Icon } from "../ui/Icon";

/** Native details/summary: works without JavaScript and is keyboard-accessible. */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-stone-200 overflow-hidden rounded-[var(--radius-card)] bg-paper">
      {items.map((item) => (
        <details key={item.question} className="group">
          <summary className="flex cursor-pointer items-center justify-between gap-6 px-6 py-5 text-left transition-colors hover:bg-stone-100/60 sm:px-8 sm:py-6">
            <h3 className="type-heading text-[clamp(1.0625rem,1rem+0.3vw,1.25rem)]">{item.question}</h3>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-ink transition-transform duration-500 group-open:rotate-45">
              <Icon name="plus" size={16} />
            </span>
          </summary>
          <div className="max-w-3xl space-y-3 px-6 pb-7 text-[1rem] leading-relaxed text-muted sm:px-8">
            {item.answer.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
