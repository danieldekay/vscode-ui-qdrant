import * as fs from "fs";
import * as path from "path";

interface TsConfig {
  compilerOptions?: {
    strict?: boolean;
    target?: string;
    sourceMap?: boolean;
    noUnusedLocals?: boolean;
    noUnusedParameters?: boolean;
    noImplicitReturns?: boolean;
    skipLibCheck?: boolean;
  };
  include?: string[];
  exclude?: string[];
}

describe("TypeScript Configuration Validation", () => {
  const tsconfigPath = path.join(__dirname, "../../tsconfig.json");

  it("should have valid tsconfig.json with required compiler options", () => {
    // This test should fail until tsconfig.json is created
    expect(fs.existsSync(tsconfigPath)).toBe(true);

    const tsconfig: TsConfig = JSON.parse(
      fs.readFileSync(tsconfigPath, "utf8")
    );

    expect(tsconfig.compilerOptions).toBeDefined();
    expect(tsconfig.compilerOptions!.strict).toBe(true);
    expect(["ES2022", "ES2023", "ESNext"]).toContain(
      tsconfig.compilerOptions!.target
    );
    expect(tsconfig.compilerOptions!.sourceMap).toBe(true);
    expect(tsconfig.compilerOptions!.noUnusedLocals).toBe(true);
    expect(tsconfig.compilerOptions!.noUnusedParameters).toBe(true);
    expect(tsconfig.compilerOptions!.noImplicitReturns).toBe(true);
    expect(tsconfig.compilerOptions!.skipLibCheck).toBe(true);

    expect(tsconfig.include).toContain("src/**/*");
    expect(tsconfig.exclude).toContain("node_modules");
    expect(tsconfig.exclude).toContain("dist");
  });

  it("should validate compiler options schema", () => {
    // This test should fail until tsconfig.json is created
    expect(fs.existsSync(tsconfigPath)).toBe(true);

    const tsconfig: TsConfig = JSON.parse(
      fs.readFileSync(tsconfigPath, "utf8")
    );

    const requiredOptions = [
      "strict",
      "target",
      "sourceMap",
      "noUnusedLocals",
      "noUnusedParameters",
      "noImplicitReturns",
      "skipLibCheck",
    ];

    for (const option of requiredOptions) {
      expect(tsconfig.compilerOptions).toHaveProperty(option);
    }
  });
});
