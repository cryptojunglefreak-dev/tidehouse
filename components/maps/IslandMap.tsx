import Link from "next/link";
import { islandMap, project } from "@/content/geo/islands";
import { areas } from "@/content/pl/areas";
import { cn } from "@/lib/cn";

type Side = "left" | "right" | "above" | "below";
/** Where each area's label goes, so close pins don't collide. */
const labelSide: Record<string, Side> = {
  Maenam: "left",
  Bangrak: "above",
  "Plai Laem": "right",
  Bophut: "below",
  Chaweng: "right",
  Lamai: "right",
  "Thong Krut": "left",
};

export interface MapPin {
  name: string;
  href?: string;
  count?: number;
}

/**
 * Koh Samui drawn by the site itself — works everywhere (no Google request, no cookies).
 * Pins mark the centre of each area, not exact plots.
 */
export function IslandMap({
  pins,
  active,
  accent = "#0f5f70",
  className,
  fit = "slice",
  focus = false,
  label = "Mapa Koh Samui z okolicami naszych inwestycji",
  credit = "Kontur wysp © OpenStreetMap",
}: {
  pins: MapPin[];
  active?: string;
  accent?: string;
  className?: string;
  fit?: "slice" | "meet";
  /** Zoom to the active area instead of showing the whole island. */
  focus?: boolean;
  label?: string;
  credit?: string;
}) {
  const placed = pins
    .map((p) => {
      const a = areas.find((x) => x.name === p.name);
      return a?.coords ? { ...p, ...project(a.coords[0], a.coords[1]) } : null;
    })
    .filter(Boolean) as (MapPin & { x: number; y: number })[];
  // the active pin is drawn last so it sits on top
  placed.sort((a, b) => Number(a.name === active) - Number(b.name === active));

  const { width, height, islands } = islandMap;
  const centre = project(9.505, 100.0);
  const target = placed.find((p) => p.name === active);
  // focus: the whole width of the island, a band of it around the area
  const band = 620;
  const vb = focus && target ? `0 ${Math.max(0, Math.min(height - band, target.y - band / 2))} ${width} ${band}` : `0 0 ${width} ${height}`;

  return (
    <svg
      viewBox={vb}
      role="img"
      aria-label={label}
      className={cn("block h-full w-full", className)}
      preserveAspectRatio={`xMidYMid ${fit}`}
    >
      <rect width={width} height={height} fill="#c7e3e9" />
      {Array.from({ length: 10 }).map((_, i) => (
        <path
          key={i}
          d={`M-20 ${100 + i * 160} C 250 ${70 + i * 160}, 520 ${135 + i * 160}, 1020 ${95 + i * 160}`}
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.4"
          strokeWidth="2"
        />
      ))}
      {islands.map((isl, i) => (
        <path
          key={i}
          d={isl.d}
          fill={isl.name === "Koh Samui" ? "#f6f5f1" : "#e9e7df"}
          stroke="#0f5f70"
          strokeOpacity="0.28"
          strokeWidth="3"
        />
      ))}
      <text x={centre.x} y={centre.y} textAnchor="middle" fontSize="46" fontWeight="600" fill="#0f2a33" fillOpacity="0.16" letterSpacing="3">
        KOH SAMUI
      </text>
      <text x="700" y="80" textAnchor="middle" fontSize="30" fontWeight="500" fill="#0f2a33" fillOpacity="0.4">
        Koh Phangan
      </text>

      {placed.map((p) => {
        const on = p.name === active;
        const r = on ? 26 : 17;
        const side: Side = labelSide[p.name] ?? (p.x > 620 ? "left" : "right");
        const gap = r + 14;
        const lx = side === "left" ? p.x - gap : side === "right" ? p.x + gap : p.x;
        const ly = side === "above" ? p.y - gap - 4 : side === "below" ? p.y + gap + 30 : p.y + 11;
        const anchor = side === "left" ? "end" : side === "right" ? "start" : "middle";
        const body = (
          <g>
            {on && <circle cx={p.x} cy={p.y} r={r + 20} fill={accent} fillOpacity="0.2" />}
            <circle cx={p.x} cy={p.y} r={r} fill={on ? accent : "#0b3240"} stroke="#fff" strokeWidth={on ? 6 : 5} />
            {p.count !== undefined && (
              <text x={p.x} y={p.y + (on ? 9 : 6.5)} textAnchor="middle" fontSize={on ? 26 : 19} fontWeight="700" fill="#fff">
                {p.count}
              </text>
            )}
            <text
              x={lx}
              y={ly}
              textAnchor={anchor}
              fontSize={on ? 42 : 32}
              fontWeight={on ? 700 : 600}
              fill="#0f2a33"
              stroke="#f6f5f1"
              strokeWidth="10"
              strokeLinejoin="round"
              paintOrder="stroke"
            >
              {p.name}
            </text>
          </g>
        );
        return p.href ? (
          <Link key={p.name} href={p.href} aria-label={`${p.name}${p.count ? `: ${p.count}` : ""}`}>
            {body}
          </Link>
        ) : (
          <g key={p.name}>{body}</g>
        );
      })}

      <text x={width - 18} y={height - 18} textAnchor="end" fontSize="20" fill="#0f2a33" fillOpacity="0.5">
        {credit}
      </text>
    </svg>
  );
}
