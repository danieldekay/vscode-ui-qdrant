# Data Model: Package Scripts Required

**Feature**: 003-package-scripts-required
**Date**: October 1, 2025

## Overview

This feature standardizes npm scripts configuration across projects. The data model focuses on script definitions and validation rather than runtime data entities.

## Key Entities

### NPMScript
Represents a standardized npm script definition in package.json

**Fields**:
- `name`: string (required) - Script name (typecheck, lint, format, dev, build, check)
- `command`: string (required) - Shell command to execute
- `description`: string (optional) - Human-readable description
- `required`: boolean (default: true) - Whether script is mandatory

**Validation Rules**:
- Name must be one of the 6 required scripts
- Command must be non-empty string
- Command must be executable in project context

**State Transitions**:
- Draft → Validated (when command tested successfully)
- Validated → Active (when added to package.json)

### ProjectConfiguration
Represents the package.json scripts section

**Fields**:
- `scripts`: Map<string, string> - Script name to command mapping
- `hasAllRequired`: boolean - Whether all 6 required scripts are present
- `validationStatus`: enum - Draft, Validating, Valid, Invalid

**Relationships**:
- Contains multiple NPMScript entities
- Referenced by CI/CD pipelines for automated validation

## API Contracts

### Script Validation Contract
```
POST /validate-scripts
Body: { scripts: Map<string, string> }
Response: { valid: boolean, missing: string[], invalid: string[] }
```

### Script Execution Contract
```
POST /execute-script
Body: { scriptName: string, workingDirectory: string }
Response: { success: boolean, output: string, error?: string }
```

## Contract Tests

### validate-scripts contract
- Should return valid=true when all required scripts present
- Should return missing array with absent script names
- Should reject invalid script names
- Should validate command syntax

### execute-script contract
- Should execute script in specified directory
- Should return stdout/stderr output
- Should handle execution timeouts
- Should validate script exists before execution

## Quickstart Validation

The quickstart test validates that:
1. All required scripts are present in package.json
2. Each script executes without error
3. Scripts produce expected output formats
4. CI/CD can successfully run validation checks</content>
<parameter name="filePath">/Users/dekay/Dokumente/projects/programmieren/vscode-ui-qdrant/specs/003-package-scripts-required/data-model.md