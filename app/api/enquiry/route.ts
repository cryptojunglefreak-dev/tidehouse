import { NextResponse } from "next/server";
import { deliverEnquiry } from "@/lib/enquiry/deliver";
import { normalizeEnquiry, validateEnquiry } from "@/lib/enquiry/validation";

/** Simple in-memory rate limit per IP (per server instance). */
const messages = {
  pl: {
    json: "Nieprawidłowe dane formularza.",
    rate: "Wysłano kilka zapytań w krótkim czasie. Spróbuj ponownie za kilka minut lub napisz na WhatsApp.",
    fix: "Popraw zaznaczone pola.",
    failed: "Nie udało się wysłać formularza. Napisz do nas na WhatsApp lub e-mailem — dane kontaktowe są obok formularza.",
  },
  en: {
    json: "Invalid form data.",
    rate: "Several enquiries were sent in a short time. Please try again in a few minutes or message us on WhatsApp.",
    fix: "Please correct the highlighted fields.",
    failed: "The form could not be sent. Please message us on WhatsApp or by e-mail — the details are next to the form.",
  },
  de: {
    json: "Ungültige Formulardaten.",
    rate: "Es wurden mehrere Anfragen in kurzer Zeit gesendet. Bitte versuchen Sie es in einigen Minuten erneut oder schreiben Sie uns auf WhatsApp.",
    fix: "Bitte korrigieren Sie die markierten Felder.",
    failed: "Das Formular konnte nicht gesendet werden. Bitte schreiben Sie uns auf WhatsApp oder per E-Mail — die Kontaktdaten stehen neben dem Formular.",
  },
};

const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  let raw: Record<string, unknown>;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json", message: messages.pl.json }, { status: 400 });
  }

  const input = normalizeEnquiry(raw);
  const m = messages[input.lang];

  // Bots: honeypot filled or submitted faster than a person can type. Pretend success, deliver nothing.
  if (input.website || (input.startedAt && Date.now() - input.startedAt < 2500)) {
    return NextResponse.json({ ok: true });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "rate_limited", message: m.rate },
      { status: 429 },
    );
  }

  const errors = validateEnquiry(input);
  if (Object.keys(errors).length) {
    return NextResponse.json({ ok: false, error: "validation", errors, message: m.fix }, { status: 422 });
  }

  const result = await deliverEnquiry(input);
  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: result.error,
        message: m.failed,
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
