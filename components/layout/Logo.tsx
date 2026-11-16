import Link from "next/link";
import { cn } from "@/lib/cn";

/** Tidehouse mark: roof over the tide, sun in the corner. Same drawing as public/brand/tidehouse-mark.svg. */
export function LogoMark({ size = 28, className, idSuffix = "a" }: { size?: number; className?: string; idSuffix?: string }) {
  const gid = `th-grad-${idSuffix}`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <linearGradient id={gid} x1="10" y1="4" x2="54" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#2aa6b4" />
          <stop offset="0.55" stopColor="#127083" />
          <stop offset="1" stopColor="#0a3a48" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="15" fill={`url(#${gid})`} />
      <circle cx="45" cy="16" r="4.25" fill="#f6d7a4" />
      <path d="M16.5 30 32 17.5 47.5 30" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 39.5c3 -2.6 6 -2.6 9 0s6 2.6 9 0 6 -2.6 9 0 6 2.6 9 0" fill="none" stroke="#fff" strokeWidth="3.6" strokeLinecap="round" />
      <path d="M18.5 48c2.5 -2.1 5 -2.1 7.5 0s5 2.1 7.5 0 5 -2.1 7.5 0" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({
  tone = "dark",
  className,
  size = "md",
  id = "header",
  href = "/",
  homeLabel = "strona główna",
}: {
  tone?: "dark" | "light";
  className?: string;
  size?: "md" | "lg";
  id?: string;
  href?: string;
  homeLabel?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-2.5 whitespace-nowrap", tone === "dark" ? "text-ink" : "text-white", className)}
    >
      <LogoMark size={size === "lg" ? 40 : 30} idSuffix={id} />
      <span className={cn("font-[600] tracking-[-0.035em]", size === "lg" ? "text-[1.75rem]" : "text-[1.3125rem]")}>Tidehouse</span>
      <span className="sr-only">— {homeLabel}</span>
    </Link>
  );
}
