import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { scoreLead } from "../src/lib/lead-engine.ts";
import { isIndianMobile } from "../src/lib/phone.ts";
import type { Lead, LeadCreate, LeadStage } from "../src/lib/types.ts";

const file = path.resolve("data/leads.json");
const sessions = new Set<string>();
const loginAttempts = new Map<string, { count: number; reset: number }>();

function readLeads(): Lead[] {
  try {
    const parsed = JSON.parse(readFileSync(file, "utf8")) as Lead[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLeads(leads: Lead[]) {
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(leads, null, 2));
}

function passwordsMatch(input: string, expected: string) {
  const salt = "aangan-buildworks-v1";
  const actual = scryptSync(input, salt, 32);
  const stored = scryptSync(expected, salt, 32);
  return timingSafeEqual(actual, stored);
}

function loginBlocked(ip: string) {
  const current = loginAttempts.get(ip);
  return Boolean(current && current.reset > Date.now() && current.count >= 8);
}

function recordFailedLogin(ip: string) {
  const now = Date.now();
  const current = loginAttempts.get(ip);
  if (!current || current.reset < now) {
    loginAttempts.set(ip, { count: 1, reset: now + 10 * 60 * 1000 });
    return;
  }
  current.count += 1;
}

export type ApiResult = { status: number; body?: unknown; cookie?: string };

export function handleLeadApi(input: {
  method: string;
  pathname: string;
  body: unknown;
  session: string | undefined;
  ip: string;
}): ApiResult {
  const authed = Boolean(input.session && sessions.has(input.session));

  if (input.method === "POST" && input.pathname === "/leads") {
    const payload = input.body as LeadCreate;
    if (!payload?.name?.trim() || !payload.city?.trim()) {
      return { status: 400, body: { detail: "Name and city are required" } };
    }
    if (!isIndianMobile(payload.phone ?? "")) {
      return { status: 400, body: { detail: "Enter a valid Indian mobile number" } };
    }
    const { score, tags } = scoreLead(payload);
    const lead: Lead = {
      ...payload,
      id: randomUUID(),
      lead_status: score >= 70 ? "High Intent" : "New Lead",
      lead_score: score,
      tags,
      created_at: new Date().toISOString(),
    };
    const leads = readLeads();
    leads.unshift(lead);
    writeLeads(leads);
    void notifyConsultant(lead);
    return { status: 200, body: lead };
  }

  if (input.method === "GET" && input.pathname === "/leads") {
    if (!authed) return { status: 401, body: { detail: "Sign in required" } };
    return { status: 200, body: readLeads() };
  }

  const patch = /^\/leads\/([^/]+)$/.exec(input.pathname);
  if (input.method === "PATCH" && patch) {
    if (!authed) return { status: 401, body: { detail: "Sign in required" } };
    const leads = readLeads();
    const lead = leads.find((item) => item.id === patch[1]);
    if (!lead) return { status: 404, body: { detail: "Lead not found" } };
    lead.lead_status = (input.body as { lead_status: LeadStage }).lead_status;
    writeLeads(leads);
    return { status: 200, body: lead };
  }

  if (input.method === "POST" && input.pathname === "/auth/login") {
    if (loginBlocked(input.ip)) {
      return { status: 429, body: { detail: "Too many sign-in attempts. Wait a few minutes." } };
    }
    const body = input.body as { email?: string; password?: string };
    const email = (process.env.ADMIN_EMAIL ?? "admin@aanganbuildworks.example").toLowerCase();
    const password = process.env.ADMIN_PASSWORD ?? "admin123";
    const valid =
      (body.email ?? "").toLowerCase() === email && passwordsMatch(body.password ?? "", password);
    if (!valid) {
      recordFailedLogin(input.ip);
      return { status: 401, body: { detail: "Invalid credentials" } };
    }
    const token = randomUUID();
    sessions.add(token);
    return {
      status: 200,
      body: { ok: true },
      cookie: `aangan_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`,
    };
  }

  if (input.method === "POST" && input.pathname === "/auth/logout") {
    if (input.session) sessions.delete(input.session);
    return { status: 204, cookie: "aangan_session=; Path=/; Max-Age=0" };
  }

  return { status: 404, body: { detail: "Not found" } };
}

async function notifyConsultant(lead: Lead) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!key || !to) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.NOTIFY_FROM ?? "Aangan Buildworks <onboarding@resend.dev>",
      to: [to],
      subject: `New home brief from ${lead.name}`,
      text: `${lead.name} · ${lead.phone} · ${lead.city}\nPlot ${lead.plot_size} · ${lead.timeline}\nScore ${lead.lead_score}`,
    }),
  }).catch(() => undefined);
}
