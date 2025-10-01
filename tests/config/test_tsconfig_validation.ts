import * as assert from 'node:assert';
import * as fs from 'node:fs';
import * as path from 'node:path';

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

describe('TypeScript Configuration Validation', () => {
  const tsconfigPath = path.join(__dirname, '../../tsconfig.json');

  it('should have valid tsconfig.json with required compiler options', () => {
    // This test should fail until tsconfig.json is created
    assert.strictEqual(fs.existsSync(tsconfigPath), true);

    const tsconfig: TsConfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

    assert.ok(tsconfig.compilerOptions);
    assert.strictEqual(tsconfig.compilerOptions?.strict, true);
    assert.ok(['ES2022', 'ES2023', 'ESNext'].includes(tsconfig.compilerOptions?.target || ''));
    assert.strictEqual(tsconfig.compilerOptions?.sourceMap, true);
    assert.strictEqual(tsconfig.compilerOptions?.noUnusedLocals, true);
    assert.strictEqual(tsconfig.compilerOptions?.noUnusedParameters, true);
    assert.strictEqual(tsconfig.compilerOptions?.noImplicitReturns, true);
    assert.strictEqual(tsconfig.compilerOptions?.skipLibCheck, true);

    assert.ok(tsconfig.include?.includes('src/**/*'));
    assert.ok(tsconfig.exclude?.includes('node_modules'));
    assert.ok(tsconfig.exclude?.includes('dist'));
  });

  it('should validate compiler options schema', () => {
    // This test should fail until tsconfig.json is created
    assert.strictEqual(fs.existsSync(tsconfigPath), true);

    const tsconfig: TsConfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));

    const requiredOptions = [
      'strict',
      'target',
      'sourceMap',
      'noUnusedLocals',
      'noUnusedParameters',
      'noImplicitReturns',
      'skipLibCheck',
    ];

    for (const option of requiredOptions) {
      assert.ok(option in (tsconfig.compilerOptions || {}));
    }
  });
});
