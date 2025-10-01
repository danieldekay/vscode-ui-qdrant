# vscode-ui-qdrant Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-10-01

## Active Technologies
- TypeScript 5.x (latest stable) with Node.js LTS 20.x+ runtime + @types/vscode, TypeScript compiler, VS Code Extension API (001-typescript-configuration)
- TypeScript 5.x (latest stable) with Node.js LTS 20.x+ runtime + Linting/formatting tool (Biome OR ESLint + Prettier), VS Code extension API, existing TypeScript compiler integration (002-linting-and-formatting)
- Configuration files (committed to version control), VS Code workspace settings (002-linting-and-formatting)
- TypeScript 5.x + VS Code Extension API, Biome linting/formatting tool (003-package-scripts-required)
- TypeScript 5.x with strict mode enabled + @types/vscode, VS Code Extension API, Qdrant REST API (local mode only) (005-vscode-extension-scaffold)
- Local Qdrant instance (vector database) (005-vscode-extension-scaffold)
- TypeScript 5.x with strict mode enabled + @types/vscode, @qdrant/js-client-rest, VS Code Extension API (007-configuration-ux-the)
- VS Code workspace settings, Qdrant database files (007-configuration-ux-the)
- TypeScript 5.x with strict mode enabled + @types/vscode (VS Code Extension API), @qdrant/js-client-rest (Qdrant client) (008-local-db-file)
- Local file system (Qdrant database files) (008-local-db-file)

## Project Structure
```
src/
tests/
```

## Commands
npm run dev, npm run typecheck, npm run lint, npm run format, npm run check, npm run build, npm test

## NPM Scripts

The project provides standardized npm scripts for development and quality assurance:

- `npm run dev`: Start TypeScript watch mode for development
- `npm run typecheck`: Run TypeScript type checking without emitting files
- `npm run lint`: Lint code with Biome (fast, automated code quality)
- `npm run format`: Format code with Biome (consistent styling)
- `npm run check`: Combined type checking and linting validation
- `npm run build`: Compile TypeScript to JavaScript for production
- `npm test`: Run complete test suite (unit, integration, contract tests)

## Code Style
TypeScript 5.x (latest stable) with Node.js LTS 20.x+ runtime: Follow standard conventions

## Recent Changes
- 008-local-db-file: Added TypeScript 5.x with strict mode enabled + @types/vscode (VS Code Extension API), @qdrant/js-client-rest (Qdrant client)
- 007-configuration-ux-the: Added TypeScript 5.x with strict mode enabled + @types/vscode, @qdrant/js-client-rest, VS Code Extension API
- 005-vscode-extension-scaffold: Added TypeScript 5.x with strict mode enabled + @types/vscode, VS Code Extension API, Qdrant REST API (local mode only)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
