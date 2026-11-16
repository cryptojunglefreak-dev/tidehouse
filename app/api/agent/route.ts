import { buildSystemPrompt } from "@/lib/agent/prompt";
import { localAnswer, matchEvent, sanitizeRequest, type AgentEvent } from "@/lib/agent/protocol";
import { basicReply } from "@/lib/agent/match";

/**
 * Tidehouse Agent.
 * Works with any OpenAI-compatible chat API. Default: Groq free tier (no card needed).
 *   AGENT_API_KEY   — required to use the model (without it the agent answers from the matcher only)
 *   AGENT_API_BASE  — default https://api.groq.com/openai/v1
 *   AGENT_MODEL     — default openai/gpt-oss-120b
 */
const API_BASE = (process.env.AGENT_API_BASE || "https://api.groq.com/openai/v1").replace(/\/$/, "");
const MODEL = process.env.AGENT_MODEL || "openai/gpt-oss-120b";
const API_KEY = process.env.AGENT_API_KEY || process.env.GROQ_API_KEY || "";

const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 30;

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const encoder = new TextEncoder();
const line = (e: AgentEvent) => encoder.encode(`${JSON.stringify(e)}\n`);

const headers = {
  "Content-Type": "application/x-ndjson; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

export async function POST(request: Request) {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Nieprawidłowe zapytanie." }, { status: 400 });
  }
  const req = sanitizeRequest(raw);
  if (!req) return Response.json({ ok: false, message: "Napisz pytanie." }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json(
      {
        ok: false,
        message: {
          pl: "Dużo pytań w krótkim czasie. Spróbuj za kilka minut albo napisz do nas na WhatsApp.",
          en: "Too many questions in a short time. Please try again in a few minutes or message us on WhatsApp.",
          de: "Zu viele Fragen in kurzer Zeit. Bitte versuchen Sie es in einigen Minuten erneut oder schreiben Sie uns auf WhatsApp.",
        }[req.lang ?? "pl"],
      },
      { status: 429 },
    );
  }

  if (!API_KEY) {
    const body = localAnswer(req).map(line);
    return new Response(new Blob(body), { headers });
  }

  const { outcome, event } = matchEvent(req);
  const last = req.messages[req.messages.length - 1].content;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      controller.enqueue(line(event));
      let wrote = false;
      try {
        const res = await fetch(`${API_BASE}/chat/completions`, {
          method: "POST",
          headers: { Authorization: `Bearer ${API_KEY}`, "Content-Type": "application/json" },
          signal: AbortSignal.timeout(25_000),
          body: JSON.stringify({
            model: MODEL,
            stream: true,
            temperature: 0.4,
            max_tokens: 700,
            ...(MODEL.includes("gpt-oss") ? { reasoning_effort: "low" } : {}),
            messages: [{ role: "system", content: buildSystemPrompt(outcome) }, ...req.messages],
          }),
        });
        if (!res.ok || !res.body) throw new Error(`model_http_${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n");
          buffer = parts.pop() ?? "";
          for (const p of parts) {
            const s = p.trim();
            if (!s.startsWith("data:")) continue;
            const data = s.slice(5).trim();
            if (data === "[DONE]") continue;
            try {
              const text = JSON.parse(data)?.choices?.[0]?.delta?.content;
              if (typeof text === "string" && text) {
                wrote = true;
                controller.enqueue(line({ type: "delta", text }));
              }
            } catch {
              /* partial or keep-alive line */
            }
          }
        }
        if (!wrote) throw new Error("model_empty");
        controller.enqueue(line({ type: "done", mode: "ai" }));
      } catch (err) {
        console.error("[agent]", err instanceof Error ? err.message : err);
        if (!wrote) controller.enqueue(line({ type: "delta", text: basicReply(outcome, last) }));
        controller.enqueue(line({ type: "done", mode: wrote ? "ai" : "basic" }));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers });
}
