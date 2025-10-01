# Biome Configuration Validation Contract

## Contract: biome.json Structure Validation

**Purpose**: Validates that the biome.json file contains required configuration sections and follows constitutional requirements for linting and formatting.

**Input Schema**:

```json
{
  "type": "object",
  "required": ["formatter", "linter", "files"],
  "properties": {
    "$schema": { "type": "string" },
    "formatter": {
      "type": "object",
      "required": ["enabled", "indentStyle", "indentWidth"],
      "properties": {
        "enabled": { "const": true },
        "indentStyle": { "enum": ["space"] },
        "indentWidth": { "const": 2 },
        "lineWidth": { "type": "number", "maximum": 120 }
      }
    },
    "linter": {
      "type": "object",
      "required": ["enabled", "rules"],
      "properties": {
        "enabled": { "const": true },
        "rules": { "type": "object" }
      }
    },
    "organizeImports": {
      "type": "object",
      "properties": {
        "enabled": { "const": true }
      }
    },
    "files": {
      "type": "object",
      "required": ["ignore"],
      "properties": {
        "include": { "type": "array", "items": { "type": "string" } },
        "ignore": {
          "type": "array",
          "items": { "type": "string" },
          "contains": {
            "enum": ["dist/", "node_modules/"]
          }
        }
      }
    }
  }
}
```

**Expected Output**:

- Valid configuration: Returns success with parsed configuration
- Invalid configuration: Returns error with specific violations
- Missing file: Returns error with clear guidance

**Test Scenarios**:

1. Valid complete configuration → Success
2. Missing required sections → Failure with specific missing items
3. Invalid formatter settings → Failure with value constraints
4. Missing exclude patterns → Warning about recommended exclusions
5. Malformed JSON → Failure with syntax error details

## Contract: Auto-Format on Save Validation

**Purpose**: Validates that VS Code workspace settings correctly configure auto-formatting on save.

**Input**: .vscode/settings.json content

**Expected Output**:

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
  }
}
```

**Test Scenarios**:

1. Correct settings configured → Auto-format works on save
2. Missing formatOnSave → Auto-format disabled
3. Wrong defaultFormatter → Wrong formatter used
4. Missing code actions → No auto-fixing on save
5. Multiple formatters → Conflict resolution validation

## Contract: Linting Validation

**Purpose**: Validates that Biome linting correctly identifies and reports code quality issues.

**Input**: TypeScript source file with intentional linting violations

**Expected Output**:

```json
{
  "diagnostics": [
    {
      "file": "src/test.ts",
      "line": 10,
      "column": 5,
      "message": "Variable 'unused' is never used",
      "rule": "noUnusedVariables",
      "severity": "error",
      "fixable": true
    }
  ],
  "errorCount": 1,
  "warningCount": 0
}
```

**Test Scenarios**:

1. File with unused variables → Error reported
2. File with type errors → Caught by linting
3. File with style violations → Formatting suggested
4. File with imports to organize → Auto-fix available
5. Clean file → No errors reported

## Contract: Performance Validation

**Purpose**: Validates that linting and formatting operations meet performance targets.

**Input**: TypeScript files of varying sizes (100, 1000, 5000 lines)

**Expected Output**:

- Formatting: <100ms for files <1,000 lines
- Linting: <500ms for incremental checks
- No UI blocking during operations

**Test Scenarios**:

1. Format 100-line file → Complete <100ms
2. Format 1,000-line file → Complete <100ms
3. Lint 1,000-line file → Complete <500ms
4. Multiple files saved simultaneously → No blocking
5. Large file (10,000 lines) → Progress feedback shown

## Contract: Build Integration Validation

**Purpose**: Validates that build process correctly enforces linting and formatting standards.

**Input**: Build command execution with linting violations present

**Expected Output**:

- Build fails with exit code 1
- Clear error messages indicating violations
- File paths and line numbers for each issue
- Suggestion to run lint:fix command

**Test Scenarios**:

1. Build with linting errors → Build fails
2. Build with formatting issues → Build fails
3. Build with clean code → Build succeeds
4. CI pipeline execution → Validation runs automatically
5. Pre-commit hook → Violations prevented

## Contract: VS Code Integration Validation

**Purpose**: Validates seamless integration with VS Code editor features.

**Input**: Developer workflow actions in VS Code

**Expected Output**:

- Errors shown in Problems panel
- Quick fixes available on hover
- Format on save executes automatically
- Extension recommendations shown
- No configuration required after npm install

**Test Scenarios**:

1. Open project first time → Extension recommended
2. Save file with issues → Auto-format applied
3. Hover over error → Quick fix available
4. View Problems panel → All issues listed
5. Organize imports command → Imports reorganized
