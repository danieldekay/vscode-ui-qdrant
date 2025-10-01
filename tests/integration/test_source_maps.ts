import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

describe("Source Map Generation Validation", () => {
  const srcDir = path.join(__dirname, "../../src");
  const distDir = path.join(__dirname, "../../dist");
  const testFile = path.join(srcDir, "test-source-maps.ts");

  beforeAll(() => {
    // Create a test TypeScript file with source map testable features
    const testContent = `
export class TestClass {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  public greet(): string {
    return \`Hello, \${this.name}!\`;
  }

  public complexMethod(param: number): string {
    const result = param * 2;
    const message = \`Result: \${result}\`;
    return message;
  }
}

export function testFunction(): TestClass {
  const instance = new TestClass('World');
  return instance;
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

  it("should generate source map files alongside JavaScript output", () => {
    // This test should fail until tsconfig.json is created
    const tsconfigPath = path.join(__dirname, "../../tsconfig.json");
    expect(fs.existsSync(tsconfigPath)).toBe(true);

    // Compile with source maps enabled
    execSync("npx tsc", { cwd: path.join(__dirname, "../..") });

    // Check that source map file exists
    const sourceMapFile = path.join(distDir, "test-source-maps.js.map");
    expect(fs.existsSync(sourceMapFile)).toBe(true);

    // Check that JavaScript file references the source map
    const jsFile = path.join(distDir, "test-source-maps.js");
    expect(fs.existsSync(jsFile)).toBe(true);

    const jsContent = fs.readFileSync(jsFile, "utf8");
    expect(jsContent).toContain("//# sourceMappingURL=test-source-maps.js.map");
  });

  it("should create valid source map with correct structure", () => {
    // This test should fail until tsconfig.json is created
    const tsconfigPath = path.join(__dirname, "../../tsconfig.json");
    expect(fs.existsSync(tsconfigPath)).toBe(true);

    // Compile with source maps enabled
    execSync("npx tsc", { cwd: path.join(__dirname, "../..") });

    const sourceMapFile = path.join(distDir, "test-source-maps.js.map");
    expect(fs.existsSync(sourceMapFile)).toBe(true);

    const sourceMap = JSON.parse(fs.readFileSync(sourceMapFile, "utf8"));

    // Validate source map structure
    expect(sourceMap.version).toBe(3);
    expect(sourceMap.file).toBe("test-source-maps.js");
    expect(Array.isArray(sourceMap.sources)).toBe(true);
    expect(sourceMap.sources).toContain("src/test-source-maps.ts");
    expect(typeof sourceMap.mappings).toBe("string");
    expect(sourceMap.mappings.length).toBeGreaterThan(0);
  });

  it("should map original TypeScript source locations correctly", () => {
    // This test should fail until tsconfig.json is created
    const tsconfigPath = path.join(__dirname, "../../tsconfig.json");
    expect(fs.existsSync(tsconfigPath)).toBe(true);

    // Compile with source maps enabled
    execSync("npx tsc", { cwd: path.join(__dirname, "../..") });

    const sourceMapFile = path.join(distDir, "test-source-maps.js.map");
    expect(fs.existsSync(sourceMapFile)).toBe(true);

    const sourceMap = JSON.parse(fs.readFileSync(sourceMapFile, "utf8"));

    // Check that source map contains original file reference
    expect(sourceMap.sources).toContain("src/test-source-maps.ts");

    // Check that mappings exist (basic validation)
    expect(sourceMap.mappings).toBeDefined();
    expect(sourceMap.mappings.length).toBeGreaterThan(10); // Should have substantial mappings

    // Check sourceRoot is not set (relative paths)
    expect(sourceMap.sourceRoot).toBeUndefined();
  });

  it("should enable debugging of original TypeScript in VS Code", () => {
    // This test should fail until tsconfig.json is created
    const tsconfigPath = path.join(__dirname, "../../tsconfig.json");
    expect(fs.existsSync(tsconfigPath)).toBe(true);

    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));

    // Verify sourceMap is enabled in tsconfig
    expect(tsconfig.compilerOptions.sourceMap).toBe(true);

    // Compile and verify source maps are generated
    execSync("npx tsc", { cwd: path.join(__dirname, "../..") });

    const sourceMapFile = path.join(distDir, "test-source-maps.js.map");
    const jsFile = path.join(distDir, "test-source-maps.js");

    expect(fs.existsSync(sourceMapFile)).toBe(true);
    expect(fs.existsSync(jsFile)).toBe(true);

    // Verify the source map can be parsed and has debug information
    const sourceMap = JSON.parse(fs.readFileSync(sourceMapFile, "utf8"));
    expect(sourceMap.sourcesContent).toBeDefined();
    expect(Array.isArray(sourceMap.sourcesContent)).toBe(true);
    expect(sourceMap.sourcesContent.length).toBeGreaterThan(0);
  });
});
