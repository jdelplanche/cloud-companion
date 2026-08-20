import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const payloadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().min(2).max(200),
  message: z.string().trim().min(10).max(5000),
  locale: z.enum(["en", "nl", "fr"]).default("en"),
  // Honeypot: moet leeg blijven — bots vullen dit in.
  company: z.string().max(0).optional().or(z.literal("")),
});

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return false;
}

function esc(value: string) {
  return value.replace(/[<>]/g, "");
}

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const ip =
          request.headers.get("cf-connecting-ip") ??
          request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          "unknown";

        if (rateLimited(ip)) {
          return Response.json({ error: "rate_limited" }, { status: 429 });
        }

        let raw: unknown;
        try {
          raw = await request.json();
        } catch {
          return Response.json({ error: "invalid_json" }, { status: 400 });
        }

        const parsed = payloadSchema.safeParse(raw);
        if (!parsed.success) {
          return Response.json({ error: "invalid_input" }, { status: 400 });
        }

        const data = parsed.data;
        // Honeypot ingevuld → stilzwijgend accepteren, niets doorsturen.
        if (data.company) return Response.json({ ok: true });

        const webhook = process.env["KCHAT_WEBHOOK_URL"];
        if (!webhook) {
          console.error("KCHAT_WEBHOOK_URL is not configured");
          return Response.json({ error: "not_configured" }, { status: 500 });
        }

        const text = [
          `**Nieuw contactbericht — delplanche.cloud (${data.locale.toUpperCase()})**`,
          `**Naam:** ${esc(data.name)}`,
          `**E-mail:** ${esc(data.email)}`,
          `**Onderwerp:** ${esc(data.subject)}`,
          "",
          esc(data.message),
        ].join("\n");

        const res = await fetch(webhook, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });

        if (!res.ok) {
          const body = await res.text();
          console.error(`kChat webhook failed [${res.status}]: ${body}`);
          return Response.json({ error: "delivery_failed" }, { status: 502 });
        }

        return Response.json({ ok: true });
      },
    },
  },
});
