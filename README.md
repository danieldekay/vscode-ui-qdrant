# VSCode UI Qdrant

A comprehensive VS Code extension for Qdrant vector database management, exploration, and integration. Built with TypeScript 5.x, this extension provides a seamless interface for working with vector databases in your development workflow.

## Features

### 🔍 **Vector Database Management**
- **Connection Management**: Connect to local Qdrant instances or remote servers
- **Collection Operations**: Create, list, delete, and manage vector collections
- **Vector Search**: Perform similarity searches with configurable parameters
- **Data Import/Export**: Upsert and delete vectors with payload support

### ⚙️ **VS Code Integration**
- **Configuration UI**: Comprehensive settings panel for connection and search parameters
- **Command Palette**: Quick access to all Qdrant operations
- **Tree View**: Visual exploration of collections and vectors
- **Status Bar**: Real-time connection status and health indicators

### 🛡️ **Enterprise-Ready**
- **Error Handling**: Context-aware error messages with recovery actions
- **Validation**: Comprehensive input validation for all operations
- **Performance**: Optimized for concurrent operations (<10 simultaneous searches)
- **Security**: API key authentication and secure connection management

### 🧪 **Developer Experience**
- **TypeScript First**: Full type safety with strict mode enabled
- **TDD Approach**: Comprehensive test coverage with 27+ test files
- **Fast Tooling**: Biome for <500ms linting and formatting
- **Auto-Validation**: Pre-commit hooks ensure code quality

## Installation

### Prerequisites

- **VS Code**: 1.74.0 or higher
- **Node.js**: LTS 20.x or higher
- **Qdrant**: Local instance (file mode) or remote server

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/danieldekay/vscode-ui-qdrant.git
   cd vscode-ui-qdrant
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the extension**:
   ```bash
   npm run build
   ```

4. **Install in VS Code**:
   - Open VS Code
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Run `Extensions: Install from VSIX`
   - Select the generated `.vsix` file from the `dist` directory

## Configuration

The extension provides comprehensive configuration options accessible through VS Code settings (`Ctrl+,`).

### Connection Settings

| Setting | Description | Default | Required |
|---------|-------------|---------|----------|
| `qdrant.connection.url` | Qdrant server URL or local file path | `file:///tmp/qdrant.db` | Yes |
| `qdrant.connection.apiKey` | API key for authentication | `""` | No |
| `qdrant.connection.timeout` | Connection timeout in milliseconds | `30000` | No |

### Collection Defaults

| Setting | Description | Default | Required |
|---------|-------------|---------|----------|
| `qdrant.collection.vectors.size` | Default vector dimension | `1536` | Yes |
| `qdrant.collection.vectors.distance` | Distance metric | `"Cosine"` | Yes |
| `qdrant.collection.onDisk` | Store vectors on disk | `false` | No |

### Search Parameters

| Setting | Description | Default | Required |
|---------|-------------|---------|----------|
| `qdrant.search.limit` | Maximum search results | `10` | No |
| `qdrant.search.scoreThreshold` | Minimum similarity score | `0.0` | No |

### UI Preferences

| Setting | Description | Default | Required |
|---------|-------------|---------|----------|
| `qdrant.ui.autoConnect` | Auto-connect on startup | `false` | No |
| `qdrant.ui.notifications` | Show operation notifications | `true` | No |

## Usage

### Getting Started

1. **Configure Connection**:
   - Open VS Code settings
   - Search for "Qdrant"
   - Set your connection URL and API key

2. **Connect to Qdrant**:
   - Press `Ctrl+Shift+P`
   - Run `Qdrant: Connect`
   - Check status bar for connection status

3. **Explore Collections**:
   - Open Qdrant view in sidebar
   - Browse existing collections
   - View collection information and statistics

### Basic Operations

#### Creating a Collection

```typescript
// Via VS Code commands
// 1. Ctrl+Shift+P → "Qdrant: Create Collection"
// 2. Enter collection name
// 3. Collection created with default settings
```

#### Searching Vectors

```typescript
// Via VS Code commands
// 1. Ctrl+Shift+P → "Qdrant: Search"
// 2. Select collection
// 3. Enter search vector (JSON format)
// 4. View results in output panel
```

#### Managing Data

```typescript
// Via VS Code commands
// 1. Ctrl+Shift+P → "Qdrant: Upsert Vectors"
// 2. Select collection
// 3. Provide vector data (JSON format)
// 4. Confirm operation
```

### Advanced Usage

#### Custom Search Parameters

```json
{
  "collectionName": "my_collection",
  "vector": [0.1, 0.2, 0.3, ...],
  "limit": 20,
  "score_threshold": 0.8
}
```

#### Batch Operations

```json
[
  {
    "id": "vec_1",
    "vector": [0.1, 0.2, 0.3, ...],
    "payload": { "text": "Sample text", "metadata": {} }
  },
  {
    "id": "vec_2",
    "vector": [0.4, 0.5, 0.6, ...],
    "payload": { "text": "Another text", "metadata": {} }
  }
]
```

## API Reference

### QdrantService Interface

```typescript
interface IQdrantService {
  // Connection Management
  connect(config: QdrantConfig): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  getConnectionStatus(): ConnectionStatus;

  // Collection Operations
  createCollection(config: CollectionConfig): Promise<void>;
  deleteCollection(name: string): Promise<void>;
  listCollections(): Promise<string[]>;
  collectionExists(name: string): Promise<boolean>;
  getCollectionInfo(name: string): Promise<CollectionInfo>;

  // Vector Operations
  upsert(collectionName: string, points: VectorData[]): Promise<void>;
  search(request: SearchRequest): Promise<SearchResult[]>;
  delete(collectionName: string, ids: string[]): Promise<void>;

  // Health Check
  healthCheck(): Promise<boolean>;
}
```

### Error Types

The extension provides comprehensive error handling with specific error types:

- `QdrantConnectionError`: Connection failures (retryable)
- `QdrantAuthenticationError`: Authentication issues
- `QdrantCollectionError`: Collection operation failures
- `QdrantValidationError`: Input validation errors
- `QdrantVectorError`: Vector operation failures
- `QdrantSearchError`: Search operation failures (retryable)

### VS Code Commands

| Command | Description | Keybinding |
|---------|-------------|------------|
| `qdrant.connect` | Connect to Qdrant server | - |
| `qdrant.disconnect` | Disconnect from server | - |
| `qdrant.openSearch` | Open search interface | - |
| `qdrant.openCollections` | Open collections view | - |
| `qdrant.createCollection` | Create new collection | - |
| `qdrant.refresh` | Refresh all views | - |

## Examples

### Local Development Setup

```bash
# Start local Qdrant instance
docker run -p 6333:6333 qdrant/qdrant

# Configure VS Code extension
# Settings → Qdrant → Connection URL: http://localhost:6333
```

### Production Configuration

```json
{
  "qdrant.connection.url": "https://your-qdrant-instance.com",
  "qdrant.connection.apiKey": "your-api-key-here",
  "qdrant.connection.timeout": 10000,
  "qdrant.collection.vectors.size": 1536,
  "qdrant.collection.vectors.distance": "Cosine",
  "qdrant.search.limit": 20,
  "qdrant.search.scoreThreshold": 0.7
}
```

### Semantic Search Example

```typescript
// Search for similar documents
const searchRequest = {
  collectionName: "documents",
  vector: [0.1, 0.2, 0.3, /* ... 1533 more dimensions ... */],
  limit: 10,
  score_threshold: 0.8
};

// Results include similarity scores and metadata
const results = await qdrantService.search(searchRequest);
```

## Troubleshooting

### Connection Issues

**Problem**: Cannot connect to Qdrant server
**Solutions**:
- Verify server URL and port
- Check API key configuration
- Ensure server is running and accessible
- Try increasing timeout value

**Problem**: Authentication failed
**Solutions**:
- Verify API key is correct
- Check API key permissions
- Use VS Code command "Update API Key" for easy configuration

### Performance Issues

**Problem**: Slow search operations
**Solutions**:
- Reduce search limit
- Increase score threshold to filter results
- Check network latency to server
- Consider using local file mode for development

### Validation Errors

**Problem**: Invalid collection name
**Solutions**:
- Use only alphanumeric characters, hyphens, and underscores
- Ensure name is not empty and ≤ 255 characters
- Check for leading/trailing whitespace

**Problem**: Invalid vector dimensions
**Solutions**:
- Ensure vectors are exactly 1536 dimensions (OpenAI embedding size)
- Verify all vector elements are finite numbers
- Check for NaN or Infinity values

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| `Connection Failed` | Server unreachable | Check URL and network |
| `Authentication Failed` | Invalid API key | Update API key in settings |
| `Collection not found` | Collection doesn't exist | Create collection first |
| `Invalid vector dimensions` | Wrong vector size | Ensure 1536 dimensions |
| `Validation Error` | Invalid input | Check input format |

## Development

### Project Structure

```
src/
├── services/           # Qdrant service implementation
├── types/             # TypeScript type definitions
├── validation/        # Input validation functions
└── index.ts           # VS Code extension entry point

tests/
├── unit/              # Unit tests
├── integration/       # Integration tests
├── contract/          # Contract tests
└── performance/       # Performance tests
```

### Testing

The project uses comprehensive testing with 27+ test files:

```bash
# Run all tests
npm test

# Run specific test categories
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests
npm run test:performance # Performance validation
```

### Code Quality

- **TypeScript 5.x**: Strict mode with full type checking
- **Biome**: Fast linting and formatting (<500ms)
- **TDD Approach**: Tests written before implementation
- **Pre-commit Hooks**: Automatic validation on commit

### Performance Targets

- **Concurrent Operations**: <10 simultaneous searches supported
- **Type Checking**: <500ms incremental checks
- **Linting**: <500ms with Biome
- **Compilation**: <800ms full build
- **Test Execution**: Variable based on test scope

## Contributing

We welcome contributions! Please follow these guidelines:

1. **TDD Approach**: Write tests before implementing features
2. **Code Quality**: Ensure all checks pass (`npm run pretest`)
3. **Documentation**: Update README for new features
4. **Type Safety**: Maintain strict TypeScript compliance
5. **Performance**: Consider performance impact of changes

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Write tests for your feature
4. Implement the feature
5. Ensure all tests pass
6. Update documentation
7. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Qdrant](https://qdrant.tech/) for the excellent vector database
- [VS Code](https://code.visualstudio.com/) for the extensible development environment
- [Biome](https://biomejs.dev/) for fast code quality tools
- [TypeScript](https://www.typescriptlang.org/) for type safety

---

**Built with ❤️ for the vector database community**

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

## Alternative Tool Configurations

This project uses Biome for linting and formatting, but alternative configurations are supported:

### ESLint + Prettier (Alternative)

If you prefer ESLint and Prettier instead of Biome:

```bash
# Install alternative tools
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-prettier

# Update package.json scripts
{
  "scripts": {
    "lint": "eslint src tests --ext .ts",
    "format": "prettier --check src tests",
    "format:fix": "prettier --write src tests"
  }
}
```

### TSLint (Legacy)

For projects still using TSLint (deprecated, consider migrating to ESLint):

```bash
npm install --save-dev tslint typescript

{
  "scripts": {
    "lint": "tslint -p ."
  }
}
```

### StandardJS (Opinionated)

For projects preferring StandardJS style:

```bash
npm install --save-dev standard

{
  "scripts": {
    "lint": "standard src tests",
    "format": "standard --fix src tests"
  }
}
```

### Custom Toolchains

The npm script structure supports any linting/formatting tools. Simply update the commands in package.json scripts section while maintaining the same script names for consistency.

## Contributing

1. Ensure all TypeScript files pass type checking
2. Run validation scripts before committing
3. Follow the established coding standards
4. Update tests for any configuration changes
