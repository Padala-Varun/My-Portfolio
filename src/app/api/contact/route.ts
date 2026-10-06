import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { profile } from "@/data/profile";

const oneLine = (max: number) =>
  z
    .string()
    .transform((value) => value.replace(/\s+/g, " ").trim())
    .pipe(z.string().max(max, `Keep this under ${max} characters`));

const contactSchema = z.object({
  name: oneLine(80).pipe(z.string().min(2, "Please tell me your name")),
  email: z.string().trim().pipe(z.email("Please enter a valid email").max(160)),
  company: oneLine(120).optional().default(""),
  message: z.string().trim().min(10, "A little more detail, please (10+ characters)").max(5000, "Keep it under 5000 characters"),
  // Bot traps: a hidden field humans never fill, and time spent on the form.
  website: z.string().optional().default(""),
  elapsedMs: z.number().nonnegative(),
});

// Best-effort per-instance limit: 5 messages per IP every 10 minutes.
const WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please fix the highlighted fields.", fields: z.flattenError(parsed.error).fieldErrors },
      { status: 400 },
    );
  }

  const { name, email, company, message, website, elapsedMs } = parsed.data;

  // Looks like a bot: pretend it worked so it doesn't retry.
  if (website || elapsedMs < 3000) return NextResponse.json({ ok: true });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many messages — please try again in a few minutes." }, { status: 429 });
  }

  const to = process.env.CONTACT_TO_EMAIL || profile.email;
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] RESEND_API_KEY not set — logging instead of emailing:", { to, name, email, company, message });
      return NextResponse.json({ ok: true, dev: true });
    }
    console.error("[contact] RESEND_API_KEY is not configured");
    return NextResponse.json({ ok: false, error: "The contact form isn't configured yet. Please email me directly." }, { status: 500 });
  }

  const subject = `New portfolio message from ${name}${company ? ` (${company})` : ""}`;
  const details = [`Name: ${name}`, `Email: ${email}`, ...(company ? [`Company: ${company}`] : [])];
  const text = `${details.join("\n")}\n\n${message}`;
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:auto;color:#111">
      <h2 style="margin:0 0 16px">New message from your portfolio</h2>
      <table style="border-collapse:collapse;margin-bottom:16px">
        <tr><td style="padding:4px 12px 4px 0;color:#666">Name</td><td><strong>${escapeHtml(name)}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        ${company ? `<tr><td style="padding:4px 12px 4px 0;color:#666">Company</td><td>${escapeHtml(company)}</td></tr>` : ""}
      </table>
      <div style="white-space:pre-wrap;line-height:1.6;padding:16px;background:#f5f5f7;border-radius:8px">${escapeHtml(message)}</div>
      <p style="color:#888;font-size:12px;margin-top:16px">Hit reply to answer ${escapeHtml(name)} directly.</p>
    </div>`;

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>",
      to: [to],
      replyTo: email,
      subject,
      text,
      html,
    });
    if (error) throw new Error(`${error.name}: ${error.message}`);
  } catch (error) {
    console.error("[contact] send failed:", (error as Error).message);
    return NextResponse.json({ ok: false, error: "Couldn't send right now. Please email me directly." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
