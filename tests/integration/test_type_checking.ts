import * as assert from 'node:assert';
import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

describe('Type Checking Validation', () => {
  const srcDir = path.join(__dirname, '../../src');
  const testFile = path.join(srcDir, 'test-type-checking.ts');

  beforeEach(() => {
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

  afterEach(() => {
    // Clean up test file
    if (fs.existsSync(testFile)) {
      fs.unlinkSync(testFile);
    }
  });

  it('should enforce strict mode type checking', () => {
    // This test should fail until tsconfig.json is created
    const tsconfigPath = path.join(__dirname, '../../tsconfig.json');
    assert.ok(fs.existsSync(tsconfigPath), 'tsconfig.json should exist');

    try {
      // Run type checking only (noEmit)
      execSync('npx tsc --noEmit', { cwd: path.join(__dirname, '../..') });
      assert.fail('Expected TypeScript type checking to fail due to strict mode violations');
    } catch (error) {
      // Should fail with multiple errors
      const execError = error as { status: number; stdout: Buffer };
      assert.notStrictEqual(execError.status, 0, 'Should exit with error code');
      const output = execError.stdout.toString();

      // Check for expected strict mode errors
      assert.ok(/error|Error/.test(output), 'Should report errors');

      // Should catch unused parameters
      assert.ok(/unused|Unused/.test(output), 'Should catch unused parameters');

      // Should catch implicit returns
      assert.ok(/return|Return/.test(output), 'Should catch implicit returns');
    }
  });

  it('should validate strict compiler options are enabled', () => {
    // This test should fail until tsconfig.json is created
    const tsconfigPath = path.join(__dirname, '../../tsconfig.json');
    assert.ok(fs.existsSync(tsconfigPath), 'tsconfig.json should exist');

    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

    assert.strictEqual(tsconfig.compilerOptions.strict, true, 'strict should be enabled');
    assert.strictEqual(
      tsconfig.compilerOptions.noUnusedLocals,
      true,
      'noUnusedLocals should be enabled',
    );
    assert.strictEqual(
      tsconfig.compilerOptions.noUnusedParameters,
      true,
      'noUnusedParameters should be enabled',
    );
    assert.strictEqual(
      tsconfig.compilerOptions.noImplicitReturns,
      true,
      'noImplicitReturns should be enabled',
    );
  });

  it('should pass type checking for valid code', () => {
    // This test should fail until tsconfig.json is created
    const tsconfigPath = path.join(__dirname, '../../tsconfig.json');
    assert.ok(fs.existsSync(tsconfigPath), 'tsconfig.json should exist');

    // Create a valid TypeScript file
    const validFile = path.join(srcDir, 'valid-test.ts');
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
      execSync('npx tsc --noEmit', { cwd: path.join(__dirname, '../..') });
      // If we get here, type checking passed (good)
    } catch (error) {
      // If it fails, it should not be due to our valid file
      const execError = error as { stdout: Buffer };
      const output = execError.stdout.toString();
      assert.ok(!/valid-test\.ts/.test(output), 'Should not fail on valid test file');
    } finally {
      // Clean up
      if (fs.existsSync(validFile)) {
        fs.unlinkSync(validFile);
      }
    }
  });
});
