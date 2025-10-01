# Research Findings: Package Scripts Required

**Feature**: 003-package-scripts-required
**Date**: October 1, 2025
**Researcher**: GitHub Copilot

## Research Questions

From Technical Context analysis, the following unknowns were identified:

1. **Script Command Standardization**: What are the exact commands for each required script (typecheck, lint, format, dev, build, check)?
2. **Tool Flexibility**: How to handle different linting/formatting tools while maintaining consistency?
3. **Development Server Options**: What development server to use for VS Code extensions?
4. **TypeScript Configuration**: How to ensure typecheck works across different project setups?

## Findings

### Script Command Standardization

**Decision**: Use standard npm script patterns with specific tool commands
**Rationale**: Ensures consistency across projects while allowing tool flexibility
**Alternatives considered**: Generic script names vs tool-specific names

**Recommended Commands**:
- `typecheck`: `tsc --noEmit` (standard TypeScript checking)
- `lint`: `biome check src tests` (Biome as default, with ESLint fallback)
- `format`: `biome format --write src tests` (Biome formatting)
- `dev`: `tsx watch src/extension.ts` (tsx for TypeScript execution with watch)
- `build`: `tsc` (standard TypeScript compilation)
- `check`: `npm run typecheck && npm run lint` (combined validation)

### Tool Flexibility

**Decision**: Biome as default with clear alternatives documented
**Rationale**: Biome provides fast, modern linting/formatting in one tool
**Alternatives considered**: ESLint + Prettier (slower, more configuration), TSLint (deprecated)

**Fallback Options**:
- ESLint: `eslint src tests --ext .ts,.tsx`
- Prettier: `prettier --write "src/**/*.{ts,tsx}" "tests/**/*.{ts,tsx}"`

### Development Server Options

**Decision**: tsx watch for development with hot reloading
**Rationale**: tsx provides fast TypeScript execution without compilation step
**Alternatives considered**: ts-node (slower), nodemon + tsc (more complex)

**VS Code Extension Context**: Development server runs the extension in watch mode for iterative development.

### TypeScript Configuration

**Decision**: Require tsconfig.json with strict mode enabled
**Rationale**: Ensures type safety and consistent compilation
**Alternatives considered**: Loose TypeScript config (less safe), no TypeScript (not applicable)

**Required tsconfig.json settings**:
```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

## Implementation Approach

**Primary Approach**: Update package.json scripts section with standardized commands
**Secondary Approach**: Create documentation for tool setup and alternatives
**Risk Mitigation**: Include clear instructions for projects without TypeScript

## Dependencies Identified

- **Runtime**: Node.js 20.x+ (already satisfied)
- **Build Tools**: TypeScript 5.x (already installed)
- **Linting/Formatting**: Biome 2.x (already installed)
- **Development**: tsx for watch mode (may need installation)

## Validation Strategy

- **Script Testing**: Each script must be executable and produce expected output
- **CI Integration**: Scripts must work in automated environments
- **Cross-Platform**: Commands must work on Windows, macOS, and Linux

## Open Questions Resolved

All technical unknowns from Technical Context have been resolved through this research phase.</content>
<parameter name="filePath">/Users/dekay/Dokumente/projects/programmieren/vscode-ui-qdrant/specs/003-package-scripts-required/research.md