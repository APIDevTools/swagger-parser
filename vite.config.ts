import { defineConfig } from "vitest/config";

const isBrowser = process.env.BROWSER === "true";
export default defineConfig({
  test: {
    environment: isBrowser ? "jsdom" : "node",
    dir: "test",
    exclude: ["**/__IGNORED__/**"],
    watch: false,
    globalSetup: isBrowser ? ["./test/fixtures/server.ts"] : undefined,
    testTimeout: 5000,
    globals: true,
    passWithNoTests: true,
    reporters: ["verbose"],
    coverage: { reporter: ["lcov", "html", "text"] },
  },
});
