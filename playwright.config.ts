import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  workers: 4,
  reporter: [["html", { open: "never" }], ["list"]],
  timeout: 120000,
  use: {
    baseURL: process.env.BASE_URL || "http://127.0.0.1:3000",
    trace: "on-first-retry",
    actionTimeout: 30000,
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: "npm run dev:e2e",
        url: "http://127.0.0.1:3000",
        reuseExistingServer: true,
        timeout: 180000,
      },
})
