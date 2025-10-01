# Quickstart Guide

Get up and running with VSCode UI Qdrant development in minutes.

## 🚀 Quick Setup

### 1. Prerequisites

- **Node.js LTS 20.x+**: Download from [nodejs.org](https://nodejs.org/)
- **VS Code**: Latest version with TypeScript support
- **Git**: For version control

### 2. Clone & Install

```bash
# Clone the repository
git clone <repository-url>
cd vscode-ui-qdrant

# Install dependencies
npm install
```

### 3. Verify Setup

```bash
# Run full validation (this should pass)
npm run pretest
```

**Expected Output:**
```
🔍 Validating tsconfig.json compliance...
✅ tsconfig.json is compliant with constitutional requirements
🎉 TypeScript configuration validation passed!

Checked 13 files in 6ms. No fixes applied.

✅ Compilation successful
```

## 🛠️ Development Workflow

### Daily Development

1. **Open in VS Code**
   ```bash
   code .
   ```

2. **Install Recommended Extensions**
   - VS Code will prompt you to install Biome extension
   - Click "Install" for optimal development experience

3. **Start Developing**
   - Code formatting happens automatically on save
   - Linting errors appear inline
   - TypeScript provides full IntelliSense

### Key Commands

```bash
# Validate everything (run this often)
npm run pretest

# Just check linting
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format

# Compile TypeScript
npm run compile
```

## 🔧 VS Code Configuration

The project includes optimal VS Code settings:

- **Auto-format on save**: Code is formatted automatically
- **Inline linting**: Errors appear as you type
- **Quick fixes**: `Ctrl+.` for suggested fixes
- **Import organization**: Imports sorted automatically

## 🧪 Testing

```bash
# Run tests (when test runner is fully set up)
npm test

# Run performance validation
node scripts/validate-biome-performance.js
```

## 📁 Project Structure

```
vscode-ui-qdrant/
├── src/                    # TypeScript source files
├── tests/                  # Test files
│   ├── config/            # Configuration tests
│   ├── integration/       # Integration tests
│   └── unit/              # Unit tests
├── scripts/               # Build and validation scripts
├── .vscode/               # VS Code configuration
│   ├── settings.json      # Workspace settings
│   ├── extensions.json    # Recommended extensions
│   └── launch.json        # Debug configurations
├── biome.json             # Linting & formatting config
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies & scripts
```

## 🚨 Troubleshooting

### Common Issues

**"biome command not found"**
```bash
# Biome is included in node_modules
npx biome --version
```

**"TypeScript errors in VS Code"**
- Ensure Biome extension is installed
- Check `tsconfig.json` is valid: `npm run validate-config`

**"Tests failing"**
- Ensure all dependencies installed: `npm install`
- Check Node.js version: `node --version` (should be 20.x+)

**"Slow performance"**
- Large files (>1000 lines) may be slower
- Check performance: `node scripts/validate-biome-performance.js`

### Getting Help

1. Check the main [README.md](./README.md) for detailed documentation
2. Run validation scripts to identify issues
3. Ensure all prerequisites are met

## ✅ Success Checklist

- [ ] Node.js 20.x+ installed
- [ ] VS Code open with project
- [ ] Biome extension installed
- [ ] `npm run pretest` passes
- [ ] Auto-formatting works on save
- [ ] No linting errors in source files

## 🎯 Next Steps

- Read the main [README.md](./README.md) for architecture details
- Explore the `src/` directory to understand the codebase
- Run tests and ensure they pass
- Start contributing to the codebase!