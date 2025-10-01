# VSCode UI Qdrant

A VS Code extension for intuitive Qdrant vector database management and exploration.

## TypeScript Configuration

This project uses TypeScript 5.x with strict type checking and modern JavaScript features.

### Prerequisites

- Node.js LTS 20.x or higher
- npm or pnpm package manager
- VS Code with TypeScript support

### TypeScript Setup

The project is configured with the following TypeScript settings:

- **Target**: ES2022 (modern JavaScript features)
- **Strict Mode**: Enabled (all strict flags)
- **Source Maps**: Enabled for debugging
- **Output**: CommonJS modules in `dist/` directory

### Key Configuration Files

- `tsconfig.json`: TypeScript compiler configuration
- `package.json`: Build scripts and dependencies
- `.vscode/settings.json`: VS Code workspace settings
- `.vscode/launch.json`: Debug configurations
- `.vscode/tasks.json`: Build tasks

### Development Workflow

1. **Type Checking**: Run `npm run pretest` to validate TypeScript configuration
2. **Compilation**: Run `npm run compile` to build the extension
3. **Watch Mode**: Run `npm run watch` for continuous compilation during development
4. **Validation**: Run `npm run validate-config` to check configuration compliance

### Build Scripts

```bash
# Validate TypeScript configuration
npm run validate-config

# Compile TypeScript to JavaScript
npm run compile

# Watch for changes and recompile
npm run watch

# Run validation and compilation (pretest)
npm run pretest
```

### VS Code Integration

The extension includes VS Code settings for optimal TypeScript development:

- Automatic type checking and error reporting
- IntelliSense with full type information
- Source map debugging support
- Code formatting and import organization

### Debugging

Use the provided VS Code launch configurations:

- **Run Extension**: Launches the extension in a new VS Code window
- **Extension Tests**: Runs the test suite

### Performance

The TypeScript configuration is optimized for:

- Fast incremental type checking (<500ms for changes)
- Efficient compilation with source maps
- Minimal bundle size with tree shaking

### File Structure

```
src/
  └── TypeScript source files
dist/
  └── Compiled JavaScript and source maps
tests/
  ├── config/     # Configuration validation tests
  ├── integration/# Integration tests
  └── unit/       # Unit tests
scripts/
  └── Validation and build scripts
```

### Constitutional Compliance

This TypeScript configuration follows the project constitution:

- ✅ Extension-First Architecture
- ✅ TypeScript 5.x with strict mode
- ✅ Node.js LTS 20.x+ runtime
- ✅ Source map generation for debugging
- ✅ Automated quality checks

## Contributing

1. Ensure all TypeScript files pass type checking
2. Run validation scripts before committing
3. Follow the established coding standards
4. Update tests for any configuration changes
