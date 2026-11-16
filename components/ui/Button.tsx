import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "./Icon";

/**
 * Pill buttons. `theme` / `theme-outline` take the project colour from the CSS variable --p-deep
 * set by a parent (see themeStyle in lib/theme.ts).
 */
type Variant = "primary" | "secondary" | "light" | "outline-light" | "text" | "theme" | "theme-outline";
type Size = "md" | "lg" | "sm";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-[520] tracking-[-0.01em] whitespace-nowrap transition-[background-color,color,border-color,box-shadow,transform] duration-300 ease-out active:scale-[0.98] disabled:opacity-60 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  primary: "bg-tide text-white hover:bg-palm-600",
  secondary: "border border-ink/20 text-ink hover:border-ink/60 bg-white/40",
  light: "bg-white text-ink hover:bg-white/90",
  "outline-light": "border border-white/45 text-white hover:border-white hover:bg-white/10",
  text: "rounded-none px-0! text-tide hover:underline underline-offset-4",
  theme: "bg-[var(--p-deep)] text-white hover:brightness-110",
  "theme-outline": "border border-[var(--p-deep)]/40 text-[var(--p-deep)] hover:border-[var(--p-deep)] bg-white/30",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-[0.875rem]",
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-12 px-6 text-[1rem]",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  iconPosition?: "start" | "end";
  children: ReactNode;
  className?: string;
}

function Inner({ icon, iconPosition = "start", children }: Pick<CommonProps, "icon" | "iconPosition" | "children">) {
  return (
    <>
      {icon && iconPosition === "start" && <Icon name={icon} size={18} />}
      <span>{children}</span>
      {icon && iconPosition === "end" && (
        <Icon name={icon} size={17} className="transition-transform duration-300 group-hover:translate-x-0.5" />
      )}
    </>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  icon,
  iconPosition,
  className,
  children,
  external,
  ...rest
}: CommonProps & { href: string; external?: boolean } & Omit<ComponentProps<"a">, "href" | "children">) {
  const cls = cn(base, variants[variant], variant !== "text" && sizes[size], className);
  if (external || /^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        <Inner icon={icon} iconPosition={iconPosition}>
          {children}
        </Inner>
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      <Inner icon={icon} iconPosition={iconPosition}>
        {children}
      </Inner>
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconPosition,
  className,
  children,
  type = "button",
  ...rest
}: CommonProps & Omit<ComponentProps<"button">, "children">) {
  return (
    <button type={type} className={cn(base, variants[variant], variant !== "text" && sizes[size], className)} {...rest}>
      <Inner icon={icon} iconPosition={iconPosition}>
        {children}
      </Inner>
    </button>
  );
}
