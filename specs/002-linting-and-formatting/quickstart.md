# Quickstart: Linting and Formatting

## Prerequisites

- Node.js LTS 20.x or higher installed
- npm package manager available
- VS Code installed
- Existing TypeScript configuration (from feature 001-typescript-configuration)

## Setup Steps

### 1. Install Biome

```bash
npm install --save-dev --save-exact @biomejs/biome
```

### 2. Create Biome Configuration

Create a `biome.json` file in the project root:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.5.0/schema.json",
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      "correctness": {
        "noUnusedVariables": "error",
        "noUnusedImports": "error"
      },
      "style": {
        "useConst": "error",
        "noNegationElse": "warn"
      }
    }
  },
  "organizeImports": {
    "enabled": true
  },
  "files": {
    "include": ["src/**/*.ts", "tests/**/*.ts"],
    "ignore": ["dist/", "node_modules/", ".vscode/"]
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "semicolons": "always",
      "trailingComma": "all"
    }
  }
}
```

### 3. Update VS Code Workspace Settings

Update `.vscode/settings.json` with Biome integration:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "biomejs.biome",
  "editor.codeActionsOnSave": {
    "quickfix.biome": "explicit",
    "source.organizeImports.biome": "explicit"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[json]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

### 4. Add VS Code Extension Recommendation

Update or create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "biomejs.biome"
  ]
}
```

### 5. Add npm Scripts

Update `package.json` scripts section:

```json
{
  "scripts": {
    "lint": "biome check .",
    "lint:fix": "biome check --apply .",
    "format": "biome format .",
    "format:fix": "biome format --write .",
    "pretest": "npm run validate-config && npm run lint && npm run compile"
  }
}
```

### 6. Install VS Code Extension

In VS Code:
1. Open Command Palette (Cmd+Shift+P / Ctrl+Shift+P)
2. Type "Extensions: Show Recommended Extensions"
3. Install "Biome" extension by biomejs

Alternatively, install from terminal:

```bash
code --install-extension biomejs.biome
```

### 7. Test the Configuration

Create a test TypeScript file with intentional issues:

**src/test-linting.ts**:

```typescript
import * as vscode from 'vscode';
import * as fs from 'fs'; // Unused import - should be flagged

export function testFunction(param: string): string {
  let unused = 'test'; // Unused variable - should be flagged
  const result = `Hello, ${param}`;
  return result;
}

// Missing semicolon, should auto-fix
function poorlyFormatted( param:string ){return param}
```

### 8. Validate Auto-Formatting

1. Open `src/test-linting.ts` in VS Code
2. Save the file (Cmd+S / Ctrl+S)
3. Observe:
   - File automatically formatted with proper spacing
   - Unused import removed
   - Unused variable highlighted as error
   - Semicolons added where missing

### 9. Validate Manual Commands

```bash
# Check all files for linting issues
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Check formatting
npm run format

# Auto-format all files
npm run format:fix
```

## Expected Results

**Auto-Format on Save**:

- File formatted within 100ms
- Imports organized automatically
- Consistent quote style applied
- Proper indentation enforced

**Linting Validation**:

- Unused variables highlighted inline
- Unused imports removed automatically
- Type errors caught and reported
- Errors shown in VS Code Problems panel

**Manual Commands**:

- `npm run lint` reports all issues without fixing
- `npm run lint:fix` auto-fixes all fixable issues
- `npm run format` checks formatting without changes
- `npm run format:fix` reformats all files

**Build Integration**:

- `npm run pretest` validates linting before tests
- Build fails if linting errors exist
- Clear error messages with file locations

## Validation Checklist

- [ ] Biome installed and version-locked in package.json
- [ ] biome.json created with required configuration
- [ ] VS Code settings updated for auto-format on save
- [ ] Biome extension installed and active
- [ ] npm scripts added for manual linting/formatting
- [ ] Auto-format works on file save (<100ms)
- [ ] Linting errors shown inline in editor
- [ ] Problems panel shows all violations
- [ ] Build process validates linting
- [ ] Quick fixes available for fixable issues

## Troubleshooting

**Biome not found**: Ensure Biome is installed locally with `npm install`

**Auto-format not working**:
- Check VS Code settings.json has `editor.formatOnSave: true`
- Verify Biome extension is installed and enabled
- Ensure `editor.defaultFormatter` is set to "biomejs.biome"

**Linting not running**:
- Check biome.json has `linter.enabled: true`
- Verify files are included in biome.json `files.include` patterns
- Check file is not in `files.ignore` patterns

**Performance issues**:
- Ensure files are excluded: `dist/`, `node_modules/`, `.vscode/`
- Check Biome version (should be latest stable)
- Monitor file sizes (very large files may be slower)

**Conflicts with other formatters**:
- Disable other formatter extensions (Prettier, ESLint)
- Ensure only Biome is set as defaultFormatter
- Remove conflicting VS Code settings

**Extension not recommended**:
- Check `.vscode/extensions.json` exists and includes "biomejs.biome"
- Restart VS Code to trigger extension recommendations
