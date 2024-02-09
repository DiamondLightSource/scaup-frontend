import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["vitest.setup.ts"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    coverage: {
      provider: "v8",
      reporter: ["json", "text", "cobertura"],
      include: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
      enabled: true,
      reportsDirectory: "coverage",
      exclude: [
        "node_modules/",
        // Test mocks
        "src/mocks",
        // NextAuth
        "src/app/nextauth",
        // Auth options, part of NextAuth's configuration
        "src/mappings/authOptions.ts",
        // Styling
        "src/styles",
        // Types
        "src/types",
        // "Static" navigation objects, or objects otherwise imported from external libraries
        "src/components/navigation",
        "src/index.ts",
        // Interfaces, contains no runtime code
        "src/utils/interfaces.tsx",
        // Store and middleware files
        "src/*.tsx",
      ],
    },
  },
});
