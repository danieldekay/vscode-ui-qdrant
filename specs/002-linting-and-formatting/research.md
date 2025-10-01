# Research: Linting and Formatting

## Decision: Tool Selection - Biome vs ESLint + Prettier

**Rationale**: After evaluating both options against constitutional requirements (modern tools, single-purpose, performance), **Biome** is selected as the primary recommendation with fallback to ESLint + Prettier.

**Biome Advantages**:
- Modern tool (2023+, actively maintained by the Astro/Rome team)
- Single tool for both linting and formatting (simplicity)
- Significantly faster: ~75x faster than ESLint, ~35x faster than Prettier
- Built-in TypeScript support without additional plugins
- Zero configuration required for standard TypeScript projects
- Native VS Code integration available
- Aligns with constitutional "single-purpose tools" and "modern tools" requirements
- Lower dependency footprint (one tool instead of ~10+ ESLint plugins)

**ESLint + Prettier Advantages**:
- Wider ecosystem and plugin availability
- More granular rule customization
- Industry standard (more familiar to developers)
- Better documentation and community resources

**Decision**: Use Biome for this project because:
1. Constitutional requirement for "modern, actively-maintained tools (2025-current)"
2. Better performance for <100ms formatting and <500ms linting targets
3. Simpler configuration and maintenance
4. Single-purpose tool philosophy (one tool, two capabilities)
5. Excellent TypeScript support out of the box

**Alternatives considered**:
- ESLint + Prettier: Rejected due to complexity (multiple tools, plugin ecosystem), slower performance, and goes against constitutional preference for modern tools
- dprint: Rejected as it's primarily a formatter without linting capabilities
- TypeScript ESLint only: Rejected as it lacks auto-formatting capabilities

## Decision: Auto-Save Integration Strategy

**Rationale**: VS Code's built-in file watcher and editor.codeActionsOnSave setting provides the most reliable and performant way to trigger automatic linting and formatting.

**Implementation Approach**:
- Use VS Code's `editor.formatOnSave` for automatic formatting
- Use `editor.codeActionsOnSave` for automatic linting fixes
- Configure Biome VS Code extension to be the default formatter for TypeScript
- Set up workspace settings to apply automatically for all developers

**Alternatives considered**:
- File system watchers (nodemon, chokidar): Rejected as they run outside VS Code and add unnecessary complexity
- Git hooks (husky): Only for validation, not auto-fixing on save
- VS Code tasks: Not suitable for on-save automation

## Decision: Biome Configuration Strategy

**Rationale**: Minimal configuration leveraging Biome's sensible defaults while enforcing strict alignment with TypeScript strict mode.

**Configuration Requirements**:
- Enable all recommended rules for TypeScript
- Enforce consistent quote style (single quotes)
- Enforce semicolons (align with TypeScript conventions)
- Tab width: 2 spaces (standard for TypeScript projects)
- Line width: 100 characters (balance between readability and compactness)
- Organize imports automatically
- Remove unused imports and variables

**File Structure**:
- `biome.json` at project root
- `.vscode/settings.json` updated with Biome configuration
- `.vscode/extensions.json` recommends Biome extension

## Decision: VS Code Workspace Integration

**Rationale**: Leverage VS Code's native settings system to ensure zero-configuration experience for developers.

**Workspace Settings Required**:
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

**Extensions Recommendation**:
- Biome VS Code extension (biomejs.biome)

**Alternatives considered**:
- User-level settings: Rejected as it doesn't guarantee consistency across team
- Manual configuration: Rejected as it violates FR-014 (zero setup requirement)

## Decision: Build Process Integration

**Rationale**: Enforce linting and formatting validation in build pipeline to catch issues before commits/CI.

**Integration Points**:
1. **Pre-build validation**: Add `biome check` to pretest script
2. **Manual commands**: Add npm scripts for `lint`, `format`, `lint:fix`
3. **CI validation**: Run `biome ci` in CI pipeline (fails on violations)
4. **Optional pre-commit hook**: Validate (not auto-fix) before commits

**Package.json Scripts**:
```json
{
  "lint": "biome check .",
  "lint:fix": "biome check --apply .",
  "format": "biome format .",
  "format:fix": "biome format --write .",
  "pretest": "npm run validate-config && npm run lint && npm run compile"
}
```

**Alternatives considered**:
- Husky for forced auto-fixing: Rejected as developers should see what's being fixed
- Only CI validation: Rejected as it delays feedback too much

## Decision: Performance Optimization

**Rationale**: Ensure <100ms formatting and <500ms linting targets are met.

**Optimization Strategies**:
1. **Incremental linting**: Biome only checks changed files by default
2. **Cache utilization**: Biome uses internal caching for faster subsequent runs
3. **Parallel execution**: Biome runs checks in parallel across CPU cores
4. **Exclude patterns**: Exclude dist/, node_modules/, .vscode/ from checks
5. **VS Code extension**: Uses language server protocol for efficient communication

**Performance Validation**:
- Create performance validation script similar to validate-performance.js from feature 001
- Target: <100ms for format operations, <500ms for lint operations
- Test with files of varying sizes (100, 1000, 5000 lines)

## Decision: Error Reporting and Developer Experience

**Rationale**: Provide clear, actionable error messages with inline feedback in VS Code.

**Error Reporting Strategy**:
1. **Inline errors**: Biome VS Code extension shows errors in Problems panel
2. **Terminal output**: Formatted error messages with file:line:column format
3. **Auto-fix availability**: Quick fixes available for auto-fixable rules
4. **Severity levels**: Use Biome's error/warning distinction
5. **Rule documentation**: Link to Biome documentation for each rule violation

**Developer Workflow**:
1. Developer saves file → Auto-format runs → Auto-fixes applied
2. Remaining issues shown inline in editor
3. Developer hovers over error → Sees explanation + fix suggestion
4. Developer triggers quick fix → Issue resolved automatically

## Implementation Notes

- Biome configuration will be committed to version control for reproducibility
- Biome will be locked to specific version in package.json
- Configuration aligns with TypeScript strict mode from feature 001
- Build process will validate all quality checks automatically
- VS Code extension provides real-time feedback without manual intervention
- Performance targets validated through automated testing

## Compatibility Considerations

- **TypeScript 5.x**: Biome fully supports TypeScript 5.x syntax and features
- **Node.js 20.x**: Biome requires Node.js 14+ (compatible with project's Node.js 20.x)
- **VS Code**: Biome extension requires VS Code 1.67+ (well below current versions)
- **Existing tooling**: Biome can coexist with TypeScript compiler and other tools
- **Migration**: No existing ESLint/Prettier configuration to migrate from (new project)
