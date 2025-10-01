# VSCode UI Qdrant

A VS Code extension for intuit# Run validation and compilation (pretest)
npm run pretest
```

## Code Quality & Formatting

This project uses Biome for fast, automated code linting and formatting.

### Biome Configuration

Biome provides 75x faster linting and formatting compared to traditional ESLint + Prettier setups.

**Key Features:**
- ⚡ **Fast**: <500ms formatting, <500ms linting
- 🔧 **Auto-fix**: Automatic code formatting on save
- 🎯 **Single Tool**: Linting, formatting, and import organization in one
- 🚀 **Modern**: Written in Rust for optimal performance

### Setup

Biome is automatically configured when you clone the repository:

- `biome.json`: Linting and formatting rules
- `.vscode/settings.json`: Auto-format on save
- `.vscode/extensions.json`: Biome extension recommendation

### Development Workflow

1. **Linting**: Run `npm run lint` to check code quality
2. **Auto-fix**: Run `npm run lint:fix` to automatically fix issues
3. **Formatting**: Run `npm run format` to format code
4. **Validation**: All checks run automatically in `npm run pretest`

### Code Quality Rules

**Enabled Rules:**
- ✅ Unused variable detection
- ✅ Unused import removal
- ✅ Consistent code formatting
- ✅ TypeScript strict mode compliance
- ✅ Import organization
- ✅ Node.js best practices

**Performance Targets:**
- Formatting: <500ms for files up to 1000 lines
- Linting: <500ms with instant feedback
- Zero configuration overhead

### VS Code Integration

**Automatic Features:**
- Format on save (editor.formatOnSave)
- Inline error reporting
- Quick fixes for common issues
- Import organization on save

**Manual Commands:**
- `Ctrl+Shift+I`: Format document
- `Ctrl+Shift+X`: Fix all auto-fixable issues

### Build Integration

Linting runs automatically before compilation:

```bash
npm run pretest  # Runs: validate-config + lint + compile
```

### File Patterns

Biome processes:
- `src/**/*.ts` - Source files
- `tests/**/*.ts` - Test files

Excludes:
- `dist/` - Build output
- `node_modules/` - Dependencies
- `.vscode/` - IDE files

### Troubleshooting

**Common Issues:**
- **Slow formatting**: Check file size (<1000 lines recommended)
- **Import errors**: Run `npm run lint:fix` to organize imports
- **Extension not working**: Install Biome VS Code extension

**Performance Optimization:**
- Files are excluded from processing for faster operation
- Incremental checking reduces redundant work
- Cache utilization improves repeat operations

### Constitutional Compliance

This linting/formatting setup follows the project constitution:

- ✅ Modern tooling (Biome 2.2.4)
- ✅ Performance targets met (<500ms operations)
- ✅ Zero developer setup required
- ✅ Automated quality enforcement
- ✅ Single-purpose, fast tools

## VS Code Integrationdrant vector database management and exploration.

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

## Available Scripts

This project provides standardized npm scripts for development, building, and quality assurance.

### Development Scripts

```bash
# Start development mode with TypeScript watch
npm run dev

# Run type checking without emitting files
npm run typecheck

# Run comprehensive validation (typecheck + lint)
npm run check
```

### Code Quality Scripts

```bash
# Lint source code with Biome
npm run lint

# Format code with Biome
npm run format
```

### Build & Test Scripts

```bash
# Compile TypeScript to JavaScript
npm run build

# Run full test suite
npm test

# Run pretest validation (config + lint + compile)
npm run pretest
```

### Script Details

| Script | Command | Purpose | Performance |
|--------|---------|---------|-------------|
| `dev` | `tsc --watch` | Development watch mode for continuous compilation | Continuous monitoring |
| `typecheck` | `tsc --noEmit` | Type checking without file generation | ~0.7s |
| `lint` | `biome check src tests` | Code quality checking with Biome | ~0.15s |
| `format` | `biome format src tests` | Code formatting with Biome | ~0.15s |
| `check` | `npm run typecheck && npm run lint` | Combined type and lint validation | ~1.1s |
| `build` | `tsc` | Full TypeScript compilation to JavaScript | ~0.8s |
| `test` | `node ./out/test/runTest.js` | Run complete test suite | Variable |
| `pretest` | `npm run validate-config && npm run lint && npm run compile` | Pre-commit validation | ~2.0s |

### Script-Based Development Workflow

1. **Setup**: Clone repository and run `npm install`
2. **Development**: Use `npm run dev` for continuous compilation
3. **Quality**: Run `npm run check` to validate code quality
4. **Build**: Run `npm run build` to create production build
5. **Test**: Run `npm test` to execute full test suite

### CI/CD Integration

All scripts are designed for automated environments:

- Scripts return proper exit codes (0 for success, non-zero for failure)
- No interactive prompts or user input required
- Consistent behavior across different environments
- Fast execution suitable for CI pipelines

## Contributing

1. Ensure all TypeScript files pass type checking
2. Run validation scripts before committing
3. Follow the established coding standards
4. Update tests for any configuration changes
