import * as fs from "fs";
import * as path from "path";

describe("Configuration Validation Unit Tests", () => {
  const originalTsconfigPath = path.join(__dirname, "../../tsconfig.json");
  const backupTsconfigPath = path.join(__dirname, "../../tsconfig.json.backup");

  beforeAll(() => {
    // Backup original tsconfig.json
    if (fs.existsSync(originalTsconfigPath)) {
      fs.copyFileSync(originalTsconfigPath, backupTsconfigPath);
    }
  });

  afterAll(() => {
    // Restore original tsconfig.json
    if (fs.existsSync(backupTsconfigPath)) {
      fs.copyFileSync(backupTsconfigPath, originalTsconfigPath);
      fs.unlinkSync(backupTsconfigPath);
    }
  });

  it("should validate correct tsconfig.json structure", () => {
    const tsconfig = {
      compilerOptions: {
        strict: true,
        target: "ES2022",
        sourceMap: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noImplicitReturns: true,
        skipLibCheck: true,
        outDir: "./dist",
        rootDir: "./src",
      },
      include: ["src/**/*"],
      exclude: ["node_modules", "dist"],
    };

    fs.writeFileSync(originalTsconfigPath, JSON.stringify(tsconfig, null, 2));

    // Import and test the validation function
    const { validateTsConfig } = require("../../scripts/validate-tsconfig.js");

    // Mock console methods to capture output
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const logs: string[] = [];
    const errors: string[] = [];

    console.log = (...args) => logs.push(args.join(" "));
    console.error = (...args) => errors.push(args.join(" "));

    try {
      // This should not throw
      validateTsConfig();

      expect(errors.length).toBe(0);
      expect(logs.some((log) => log.includes("✅"))).toBe(true);
      expect(logs.some((log) => log.includes("compliant"))).toBe(true);
    } finally {
      console.log = originalConsoleLog;
      console.error = originalConsoleError;
    }
  });

  it("should reject tsconfig.json with missing required options", () => {
    const invalidTsconfig = {
      compilerOptions: {
        // Missing required options
        target: "ES2022",
      },
    };

    fs.writeFileSync(
      originalTsconfigPath,
      JSON.stringify(invalidTsconfig, null, 2)
    );

    const { validateTsConfig } = require("../../scripts/validate-tsconfig.js");

    const originalConsoleError = console.error;
    const originalExit = process.exit;
    const errors: string[] = [];
    let exitCalled = false;

    console.error = (...args) => errors.push(args.join(" "));
    process.exit = (() => {
      exitCalled = true;
      throw new Error("exit");
    }) as any;

    try {
      expect(() => validateTsConfig()).toThrow("exit");
      expect(exitCalled).toBe(true);
      expect(errors.length).toBeGreaterThan(0);
      expect(
        errors.some((error) =>
          error.includes("Missing required compiler option")
        )
      ).toBe(true);
    } finally {
      console.error = originalConsoleError;
      process.exit = originalExit;
    }
  });

  it("should reject tsconfig.json with invalid option values", () => {
    const invalidTsconfig = {
      compilerOptions: {
        strict: false, // Should be true
        target: "ES5", // Should be ES2022+
        sourceMap: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noImplicitReturns: true,
        skipLibCheck: true,
      },
      include: ["src/**/*"],
    };

    fs.writeFileSync(
      originalTsconfigPath,
      JSON.stringify(invalidTsconfig, null, 2)
    );

    const { validateTsConfig } = require("../../scripts/validate-tsconfig.js");

    const originalConsoleError = console.error;
    const originalExit = process.exit;
    const errors: string[] = [];
    let exitCalled = false;

    console.error = (...args) => errors.push(args.join(" "));
    process.exit = (() => {
      exitCalled = true;
      throw new Error("exit");
    }) as any;

    try {
      expect(() => validateTsConfig()).toThrow("exit");
      expect(exitCalled).toBe(true);
      expect(errors.some((error) => error.includes("Invalid strict"))).toBe(
        true
      );
      expect(errors.some((error) => error.includes("Invalid target"))).toBe(
        true
      );
    } finally {
      console.error = originalConsoleError;
      process.exit = originalExit;
    }
  });

  it("should provide warnings for non-critical configuration issues", () => {
    const tsconfigWithWarnings = {
      compilerOptions: {
        strict: true,
        target: "ES2022",
        sourceMap: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noImplicitReturns: true,
        skipLibCheck: true,
        outDir: "./build", // Non-standard
        rootDir: "./lib", // Non-standard
      },
      include: ["src/**/*"],
      // Missing exclude
    };

    fs.writeFileSync(
      originalTsconfigPath,
      JSON.stringify(tsconfigWithWarnings, null, 2)
    );

    const { validateTsConfig } = require("../../scripts/validate-tsconfig.js");

    const originalConsoleLog = console.log;
    const logs: string[] = [];

    console.log = (...args) => logs.push(args.join(" "));

    try {
      validateTsConfig();

      expect(logs.some((log) => log.includes("⚠️"))).toBe(true);
      expect(logs.some((log) => log.includes("Consider excluding"))).toBe(true);
    } finally {
      console.log = originalConsoleLog;
    }
  });
});
