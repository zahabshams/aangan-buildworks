import { defineConfig, devices } from "@playwright/test";

const port = 4173;
const basePath = "/aangan-buildworks";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://127.0.0.1:${port}${basePath}/`,
    trace: "on-first-retry",
  },
  projects: [
    { name: "desktop-chrome", use: { ...devices["Desktop Chrome"] } },
    { name: "desktop-firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "desktop-safari", use: { ...devices["Desktop Safari"] } },
    { name: "pixel-7", use: { ...devices["Pixel 7"] } },
    { name: "iphone-13", use: { ...devices["iPhone 13"] } },
  ],
  webServer: {
    command: "npm run build && npm run preview -- --host 127.0.0.1 --port 4173 --strictPort",
    url: `http://127.0.0.1:${port}${basePath}/`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      GITHUB_PAGES: "true",
    },
  },
});
