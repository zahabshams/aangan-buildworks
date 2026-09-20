import { ApiError } from "@/lib/api-error";
import { scoreLead } from "@/lib/lead-engine";
import type { AdminLoginRequest, Lead, LeadCreate, LeadStageUpdate } from "@/lib/types";

const LEADS_KEY = "aangan.buildworks.leads";
const SESSION_KEY = "aangan.buildworks.session";
const ADMIN_EMAIL = "admin@aanganbuildworks.example";
const ADMIN_PASSWORD = "admin123";

type JsonBody = unknown;

function readLeads(): Lead[] {
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    return raw ? (JSON.parse(raw) as Lead[]) : [];
  } catch {
    return [];
  }
}

function writeLeads(leads: Lead[]): void {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
}

function hasSession(): boolean {
  return Boolean(localStorage.getItem(SESSION_KEY));
}

export async function browserRequest<T>(method: string, path: string, body?: JsonBody): Promise<T> {
  if (method === "POST" && path === "/leads") {
    const payload = body as LeadCreate;
    const { score, tags } = scoreLead(payload);
    const lead: Lead = {
      ...payload,
      id: crypto.randomUUID(),
      lead_status: score >= 70 ? "High Intent" : "New Lead",
      lead_score: score,
      tags,
      created_at: new Date().toISOString(),
    };
    writeLeads([lead, ...readLeads()]);
    return lead as T;
  }

  if (method === "GET" && path === "/leads") {
    if (!hasSession()) throw new ApiError(401, { detail: "Sign in required" });
    return readLeads() as T;
  }

  const patch = /^\/leads\/([^/]+)$/.exec(path);
  if (method === "PATCH" && patch) {
    if (!hasSession()) throw new ApiError(401, { detail: "Sign in required" });
    const update = body as LeadStageUpdate;
    const leads = readLeads();
    const index = leads.findIndex((item) => item.id === patch[1]);
    if (index < 0) throw new ApiError(404, { detail: "Lead not found" });
    leads[index] = { ...leads[index], lead_status: update.lead_status };
    writeLeads(leads);
    return leads[index] as T;
  }

  if (method === "POST" && path === "/auth/login") {
    const credentials = body as AdminLoginRequest;
    const valid =
      credentials.email.toLowerCase() === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD;
    if (!valid) throw new ApiError(401, { detail: "Invalid credentials" });
    localStorage.setItem(SESSION_KEY, crypto.randomUUID());
    return { ok: true } as T;
  }

  if (method === "POST" && path === "/auth/logout") {
    localStorage.removeItem(SESSION_KEY);
    return undefined as T;
  }

  throw new ApiError(404, { detail: "Not found" });
}
