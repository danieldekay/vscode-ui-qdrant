import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

describe("Type Checking Validation", () => {
  const srcDir = path.join(__dirname, "../../src");
  const testFile = path.join(srcDir, "test-type-checking.ts");

  beforeAll(() => {
    // Create a test file with various type checking scenarios
    const testContent = `
export interface User {
  name: string;
  age: number;
}

export function createUser(name: string, age: number): User {
  return { name, age };
}

// This should pass type checking
export function validFunction(user: User): string {
  return \`User \${user.name} is \${user.age} years old\`;
}

// This should fail strict type checking
export function invalidFunction(param: any): string {
  // @ts-expect-error - This should cause type errors in strict mode
  return param + 123; // any + number
}

// Unused parameter - should be caught by noUnusedParameters
export function unusedParameterFunction(name: string, unused: number): string {
  return \`Hello \${name}\`;
}

// Implicit return - should be caught by noImplicitReturns
export function implicitReturnFunction(flag: boolean): string {
  if (flag) {
    return 'true';
  }
  // Missing return - should error
}

// Unused local variable - should be caught by noUnusedLocals
export function unusedLocalFunction(): void {
  const unused = 'this should be flagged';
  console.log('test');
}
`;
    fs.writeFileSync(testFile, testContent);
  });

  afterAll(() => {
    // Clean up test file
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  it("should enforce strict mode type checking", () => {
    // This test should fail until tsconfig.json is created
    const tsconfigPath = path.join(__dirname, "../../tsconfig.json");
    expect(fs.existsSync(tsconfigPath)).toBe(true);

    try {
      // Run type checking only (noEmit)
      execSync("npx tsc --noEmit", { cwd: path.join(__dirname, "../..") });
      fail(
        "Expected TypeScript type checking to fail due to strict mode violations"
      );
    } catch (error: any) {
      // Should fail with multiple errors
      expect(error.status).not.toBe(0);
      const output = error.stdout.toString();

      // Check for expected strict mode errors
      expect(output).toMatch(/error|Error/);

      // Should catch unused parameters
      expect(output).toMatch(/unused|Unused/);

      // Should catch implicit returns
      expect(output).toMatch(/return|Return/);
    }
  });

  it("should validate strict compiler options are enabled", () => {
    // This test should fail until tsconfig.json is created
    const tsconfigPath = path.join(__dirname, "../../tsconfig.json");
    expect(fs.existsSync(tsconfigPath)).toBe(true);

    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));

    expect(tsconfig.compilerOptions.strict).toBe(true);
    expect(tsconfig.compilerOptions.noUnusedLocals).toBe(true);
    expect(tsconfig.compilerOptions.noUnusedParameters).toBe(true);
    expect(tsconfig.compilerOptions.noImplicitReturns).toBe(true);
  });

  it("should pass type checking for valid code", () => {
    // This test should fail until tsconfig.json is created
    const tsconfigPath = path.join(__dirname, "../../tsconfig.json");
    expect(fs.existsSync(tsconfigPath)).toBe(true);

    // Create a valid TypeScript file
    const validFile = path.join(srcDir, "valid-test.ts");
    const validContent = `
export function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

export interface Person {
  name: string;
  age: number;
}

export function createPerson(name: string, age: number): Person {
  return { name, age };
}
`;
    fs.writeFileSync(validFile, validContent);

    try {
      // This should pass
      execSync("npx tsc --noEmit", { cwd: path.join(__dirname, "../..") });
      // If we get here, type checking passed (good)
    } catch (error: any) {
      // If it fails, it should not be due to our valid file
      const output = error.stdout.toString();
      expect(output).not.toMatch(/valid-test\.ts/);
    } finally {
      // Clean up
      if (fs.existsSync(validFile)) {
        fs.unlinkSync(validFile);
      }
    }
  });
});
