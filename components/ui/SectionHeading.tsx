import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

interface Props {
  title: ReactNode;
  intro?: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
  tone?: "dark" | "light";
  size?: "md" | "lg";
  align?: "left" | "center";
  action?: ReactNode;
  id?: string;
}

export function SectionHeading({ title, intro, as: Tag = "h2", className, tone = "dark", size = "md", align = "left", action, id }: Props) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-3xl", centered && "mx-auto")}>
        <Tag
          id={id}
          className={cn(
            "type-display",
            size === "md" && "text-[clamp(2.1rem,1.4rem+2.4vw,3.5rem)]",
            size === "lg" && "text-[clamp(2.6rem,1.5rem+4vw,5rem)]",
          )}
        >
          {title}
        </Tag>
        {intro && (
          <div className={cn("type-lead mt-5 max-w-[42rem]", centered && "mx-auto", tone === "dark" ? "text-muted" : "text-white/75")}>{intro}</div>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
