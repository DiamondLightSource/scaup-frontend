import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

/** @type {import('jest').Config} */
const config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  coverageProvider: "v8",
  coverageReporters: ["json", "text", "cobertura"],
  roots: ["<rootDir>/src"],
  collectCoverageFrom: ["src/**/*.{js,jsx,ts,tsx}", "!src/**/*.d.ts"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coveragePathIgnorePatterns: [
    "/node_modules/",
    // Test mocks
    "src/mocks",
    // NextAuth
    "src/app/nextauth",
    // Auth options, part of NextAuth's configuration
    "src/mappings/authOptions.ts",
    "src/styles",
    // "Static" navigation objects, or objects otherwise imported from external libraries
    "src/components/navigation",
    "src/index.ts",
    // Interfaces, contains no runtime code
    "src/utils/interfaces.tsx",
  ],
};

export default createJestConfig(config);
