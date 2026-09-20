import { copyFileSync } from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import type { Lead, LeadCreate, LeadStage } from "./src/lib/types.ts";

function scoreLead(payload: LeadCreate): { score: number; tags: string[] } {
  let score = 42;
  const tags: string[] = [];
  if (payload.land_ownership === "yes") {
    score += 18;
    tags.push("Owns land");
  } else if (payload.land_ownership === "buying") {
    score += 8;
    tags.push("Buying land");
  } else {
    tags.push("Planning");
  }
  if (payload.timeline === "0-3") {
    score += 22;
    tags.push("Near-term");
  } else if (payload.timeline === "3-6") {
    score += 14;
    tags.push("This year");
  }
  if (payload.interiors_required) {
    score += 8;
    tags.push("Interiors");
  }
  if (payload.next_step === "consultation" || payload.next_step === "site-visit") {
    score += 12;
    tags.push("Ready to talk");
  }
  return { score: Math.min(score, 99), tags };
}

function mockApi(): Plugin {
  const leads: Lead[] = [];
  const sessions = new Set<string>();

  return {
    name: "aangan-mock-api",
    configureServer(server) {
      server.middlewares.use("/api", async (req, res, next) => {
        if (!req.url) return next();
        const url = new URL(req.url, "http://localhost");
        const method = req.method ?? "GET";
        const cookie = String(req.headers.cookie ?? "");
        const session = /aangan_session=([^;]+)/.exec(cookie)?.[1];
        const authed = Boolean(session && sessions.has(session));

        const send = (status: number, body?: unknown, extraHeaders?: Record<string, string>) => {
          res.statusCode = status;
          Object.entries({ "Content-Type": "application/json", ...extraHeaders }).forEach(([k, v]) =>
            res.setHeader(k, v),
          );
          res.end(body === undefined ? "" : JSON.stringify(body));
        };

        const readJson = async () => {
          const chunks: Buffer[] = [];
          for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
          const raw = Buffer.concat(chunks).toString("utf8");
          return raw ? JSON.parse(raw) : {};
        };

        try {
          if (method === "POST" && url.pathname === "/leads") {
            const payload = (await readJson()) as LeadCreate;
            const { score, tags } = scoreLead(payload);
            const lead: Lead = {
              ...payload,
              id: crypto.randomUUID(),
              lead_status: score >= 70 ? "High Intent" : "New Lead",
              lead_score: score,
              tags,
              created_at: new Date().toISOString(),
            };
            leads.unshift(lead);
            return send(200, lead);
          }

          if (method === "GET" && url.pathname === "/leads") {
            if (!authed) return send(401, { detail: "Sign in required" });
            return send(200, leads);
          }

          const patch = /^\/leads\/([^/]+)$/.exec(url.pathname);
          if (method === "PATCH" && patch) {
            if (!authed) return send(401, { detail: "Sign in required" });
            const body = (await readJson()) as { lead_status: LeadStage };
            const lead = leads.find((item) => item.id === patch[1]);
            if (!lead) return send(404, { detail: "Lead not found" });
            lead.lead_status = body.lead_status;
            return send(200, lead);
          }

          if (method === "POST" && url.pathname === "/auth/login") {
            const body = (await readJson()) as { email: string; password: string };
            const valid =
              body.email.toLowerCase() === "admin@aanganbuildworks.example" && body.password === "admin123";
            if (!valid) return send(401, { detail: "Invalid credentials" });
            const token = crypto.randomUUID();
            sessions.add(token);
            return send(200, { ok: true }, { "Set-Cookie": `aangan_session=${token}; Path=/; HttpOnly; SameSite=Lax` });
          }

          if (method === "POST" && url.pathname === "/auth/logout") {
            if (session) sessions.delete(session);
            return send(204, undefined, { "Set-Cookie": "aangan_session=; Path=/; Max-Age=0" });
          }

          return send(404, { detail: "Not found" });
        } catch (error) {
          return send(500, { detail: error instanceof Error ? error.message : "Server error" });
        }
      });
    },
  };
}

function spaFallback(): Plugin {
  return {
    name: "spa-github-pages-fallback",
    closeBundle() {
      copyFileSync(path.resolve("dist/index.html"), path.resolve("dist/404.html"));
    },
  };
}

export default defineConfig({
  base: process.env.GITHUB_PAGES === "true" ? "/aangan-buildworks/" : "/",
  plugins: [react(), tailwindcss(), mockApi(), spaFallback()],
  resolve: {
    alias: [
      { find: "@", replacement: path.resolve(__dirname, "./src") },
      { find: /^lucide-react$/, replacement: path.resolve(__dirname, "./src/lib/lucide-react.tsx") },
      { find: "lucide-react-upstream", replacement: path.resolve(__dirname, "./node_modules/lucide-react") },
      { find: /^recharts$/, replacement: path.resolve(__dirname, "./src/lib/recharts.tsx") },
      { find: "recharts-upstream", replacement: path.resolve(__dirname, "./node_modules/recharts") },
    ],
  },
  server: {
    host: true,
    port: 5173,
  },
});
