import { copyFileSync } from "node:fs";
import path from "node:path";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import type { Connect } from "vite";
import type { ServerResponse } from "node:http";
import { handleLeadApi } from "./server/lead-store.ts";

function attachApi(middlewares: Connect.Server) {
  middlewares.use("/api", async (req, res, next) => {
    if (!req.url) return next();
    const url = new URL(req.url, "http://localhost");
    const method = req.method ?? "GET";
    const cookie = String(req.headers.cookie ?? "");
    const session = /aangan_session=([^;]+)/.exec(cookie)?.[1];

    const send = (status: number, body?: unknown, setCookie?: string) => {
      const response = res as ServerResponse;
      response.statusCode = status;
      response.setHeader("Content-Type", "application/json");
      if (setCookie) response.setHeader("Set-Cookie", setCookie);
      response.end(body === undefined ? "" : JSON.stringify(body));
    };

    try {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      const raw = Buffer.concat(chunks).toString("utf8");
      const body = raw ? JSON.parse(raw) : {};
      const result = handleLeadApi({
        method,
        pathname: url.pathname,
        body,
        session,
        ip: req.socket?.remoteAddress ?? "local",
      });
      return send(result.status, result.body, result.cookie);
    } catch (error) {
      return send(500, { detail: error instanceof Error ? error.message : "Server error" });
    }
  });
}

function leadApi(): Plugin {
  return {
    name: "aangan-lead-api",
    configureServer(server) {
      attachApi(server.middlewares);
    },
    configurePreviewServer(server) {
      attachApi(server.middlewares);
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
  plugins: [react(), tailwindcss(), leadApi(), spaFallback()],
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
