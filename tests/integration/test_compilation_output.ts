import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

describe("Compilation Output Validation", () => {
  const srcDir = path.join(__dirname, "../../src");
  const distDir = path.join(__dirname, "../../dist");
  const testFile = path.join(srcDir, "test-compilation.ts");

  beforeAll(() => {
    // Create a test TypeScript file
    const testContent = `
export function testFunction(param: string): string {
  return \`Hello, \${param}!\`;
}

// This should trigger unused parameter warning
function unusedFunction(unused: number): void {
  console.log('This function has unused parameter');
}
`;
    fs.writeFileSync(testFile, testContent);
  });

  afterAll(() => {
    // Clean up test file
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
    // Clean up dist directory
    if (fs.existsSync(distDir)) {
      fs.rmSync(distDir, { recursive: true, force: true });
    }
  });

  it("should compile TypeScript files to ES2022+ output", () => {
    // This test should fail until tsconfig.json is created
    const tsconfigPath = path.join(__dirname, "../../tsconfig.json");
    expect(fs.existsSync(tsconfigPath)).toBe(true);

    // Attempt compilation
    execSync("npx tsc", { cwd: path.join(__dirname, "../..") });

    // Check output exists
    const outputFile = path.join(distDir, "test-compilation.js");
    expect(fs.existsSync(outputFile)).toBe(true);

    // Check output contains ES2022+ features (should work with ES2022 target)
    const output = fs.readFileSync(outputFile, "utf8");
    expect(output).toContain("testFunction");
    expect(output).toContain("Hello, ${param}"); // Template literal should be preserved
  });

  it("should generate source map files", () => {
    // This test should fail until tsconfig.json is created
    const tsconfigPath = path.join(__dirname, "../../tsconfig.json");
    expect(fs.existsSync(tsconfigPath)).toBe(true);

    // Attempt compilation
    execSync("npx tsc", { cwd: path.join(__dirname, "../..") });

    // Check source map exists
    const sourceMapFile = path.join(distDir, "test-compilation.js.map");
    expect(fs.existsSync(sourceMapFile)).toBe(true);

    // Validate source map content
    const sourceMap = JSON.parse(fs.readFileSync(sourceMapFile, "utf8"));
    expect(sourceMap.version).toBe(3);
    expect(sourceMap.sources).toContain("src/test-compilation.ts");
    expect(sourceMap.mappings).toBeDefined();
  });

  it("should enforce strict type checking", () => {
    // This test should fail until tsconfig.json is created
    const tsconfigPath = path.join(__dirname, "../../tsconfig.json");
    expect(fs.existsSync(tsconfigPath)).toBe(true);

    // Create a file with type errors
    const errorFile = path.join(srcDir, "test-errors.ts");
    const errorContent = `
// This should cause type errors
function badFunction(param: any): string {
  return param + 1; // Type error: any + number
}
`;
    fs.writeFileSync(errorFile, errorContent);

    try {
      // This should fail with type errors
      execSync("npx tsc --noEmit", { cwd: path.join(__dirname, "../..") });
      fail("Expected TypeScript compilation to fail with type errors");
    } catch (error: any) {
      expect(error.status).not.toBe(0); // Should exit with error code
      expect(error.stdout.toString()).toMatch(/error|Error/);
    } finally {
      // Clean up
      if (fs.existsSync(errorFile)) {
        fs.unlinkSync(errorFile);
      }
    }
  });
});
