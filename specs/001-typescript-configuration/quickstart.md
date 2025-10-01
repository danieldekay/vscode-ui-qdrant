# Quickstart: TypeScript Configuration

## Prerequisites

- Node.js LTS 20.x or higher installed
- npm or pnpm package manager available
- VS Code installed with TypeScript support

## Setup Steps

### 1. Create tsconfig.json

Create a `tsconfig.json` file in the project root with required configuration:

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "CommonJS",
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### 2. Install TypeScript

```bash
npm install --save-dev typescript@^5.0.0
```

### 3. Create Source Structure

```bash
mkdir -p src
mkdir -p dist
echo "dist/" >> .gitignore
```

### 4. Test Configuration

Create a test TypeScript file to validate configuration:

**src/test.ts**:

```typescript
export function greet(name: string): string {
  return `Hello, ${name}!`;
}

// This should trigger unused parameter error if configuration is working
function unusedParameterTest(param: string): void {
  console.log("Testing configuration");
}
```

### 5. Compile and Validate

```bash
npx tsc --noEmit  # Type check only
npx tsc           # Full compilation with output
```

## Expected Results

**Type Checking**:

- Should report unused parameter error in test file
- Should pass type checking for valid code

**Compilation Output**:

- JavaScript files generated in `dist/` directory
- Source map files (.map) generated alongside JavaScript files
- Target ES2022 syntax in output files

**VS Code Integration**:

- TypeScript errors appear inline in editor
- IntelliSense provides full type information
- Debugging steps through original TypeScript source

## Validation Checklist

- [ ] tsconfig.json created with all required options
- [ ] TypeScript 5.x installed as dev dependency
- [ ] Source directory structure established (src/, dist/)
- [ ] Type checking reports unused variables/parameters
- [ ] Compilation generates ES2022+ output
- [ ] Source maps enable debugging of original TypeScript
- [ ] VS Code language service uses project configuration
- [ ] Build output excluded from version control

## Troubleshooting

**TypeScript not found**: Ensure TypeScript is installed locally in project
**Configuration ignored**: Check tsconfig.json syntax and file location
**No source maps**: Verify `sourceMap: true` in compiler options
**Wrong target output**: Check `target` setting in compiler options
**VS Code issues**: Restart TypeScript language service (Cmd+Shift+P → "TypeScript: Restart TS Server")
