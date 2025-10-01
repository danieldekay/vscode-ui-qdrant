# Quickstart: Package Scripts Required

**Feature**: 003-package-scripts-required
**Date**: October 1, 2025

## Overview

This quickstart validates that all required npm scripts are properly configured and functional in the VS Code extension project.

## Prerequisites

- Node.js 20.x or higher installed
- VS Code extension project with package.json
- TypeScript 5.x configured
- Biome linting/formatting tool installed

## Quick Validation Steps

### 1. Check Script Presence
```bash
# Verify all required scripts exist in package.json
npm run
```

**Expected Output**: Should list all 6 required scripts:
- typecheck
- lint
- format
- dev
- build
- check

### 2. Test Type Checking
```bash
# Run TypeScript type checking
npm run typecheck
```

**Expected Output**: No TypeScript errors, clean exit code 0

### 3. Test Linting
```bash
# Run linting checks
npm run lint
```

**Expected Output**: No linting errors or warnings

### 4. Test Formatting
```bash
# Run code formatting
npm run format
```

**Expected Output**: Files formatted without errors

### 5. Test Combined Validation
```bash
# Run all validation checks
npm run check
```

**Expected Output**: Both typecheck and lint pass successfully

### 6. Test Build Process
```bash
# Compile TypeScript to JavaScript
npm run build
```

**Expected Output**: Clean compilation, output in dist/ directory

## Success Criteria

✅ All 6 required scripts present in package.json
✅ All scripts execute without errors
✅ TypeScript compilation succeeds
✅ Linting passes with no issues
✅ Code formatting completes successfully
✅ Combined check script validates both typecheck and lint

## Troubleshooting

### Missing Scripts
If scripts are missing, add them to package.json:
```json
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "lint": "biome check src tests",
    "format": "biome format --write src tests",
    "dev": "tsx watch src/extension.ts",
    "build": "tsc",
    "check": "npm run typecheck && npm run lint"
  }
}
```

### TypeScript Errors
- Ensure tsconfig.json exists with strict mode enabled
- Check that all source files are in src/ directory
- Verify TypeScript 5.x is installed

### Linting Errors
- Ensure biome.json configuration exists
- Check that Biome is installed as dev dependency
- Verify source files are in src/ and tests/ directories

### Build Failures
- Check tsconfig.json outDir points to correct location
- Ensure dist/ directory is gitignored
- Verify all TypeScript files compile without errors

## CI/CD Integration

This quickstart validates the same checks that should run in CI/CD pipelines to ensure code quality standards are maintained.</content>
<parameter name="filePath">/Users/dekay/Dokumente/projects/programmieren/vscode-ui-qdrant/specs/003-package-scripts-required/quickstart.md